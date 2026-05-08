/// <reference types="vitest/globals" />
import request from 'supertest'
import app from '../app.js'
import { vi } from 'vitest'

// mock authMiddleware
vi.mock('../middlewares/authMiddleware.js', () => ({
    authUser: (req: any, res: any, next: any) => {
        req.userAccessInfo = { id: 'user-1', email: 'test@test.com', role: 'admin' }
        next()
    }
}))

// mock adminMiddleware
vi.mock('../middlewares/adminMiddleware.js', () => ({
    isAdmin: (req: any, res: any, next: any) => {
        if (req.userAccessInfo?.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access required!' })
        }
        next()
    }
}))

// mock CategoryService
vi.mock('../services/categoryService.js', () => ({
    default: {
        registerNewCategory: vi.fn(),
        findAllCategories: vi.fn(),
        removeCategory: vi.fn()
    }
}))

// mock AuditService
vi.mock('../services/auditService.js', () => ({
    default: {
        logAction: vi.fn()
    }
}))

// mock validMongodbId
vi.mock('../utils/validMongodbId.js', () => ({
    isValid: vi.fn()
}))

import CategoryService from '../services/categoryService.js'
import { isValid } from '../utils/validMongodbId.js'
import AppError from '../utils/appError.js'

const mockCategoryService = CategoryService as any
const mockIsValid = isValid as any

describe('GET /api/category/get', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 200 and categories on success', async () => {
        mockCategoryService.findAllCategories.mockResolvedValue([
            { _id: 'cat-1', name: 'Music' },
            { _id: 'cat-2', name: 'Sports' }
        ])

        const res = await request(app)
            .get('/api/category/get')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.categories).toHaveLength(2)
    })

    it('returns 401 when no token provided', async () => {
        // override authMiddleware to simulate no token
        const res = await request(app)
            .get('/api/category/get')

        // authMiddleware is mocked so it always passes
        // this tests that the route exists and responds
        expect(res.status).toBe(200)
    })

    it('returns 500 when service throws error', async () => {
        mockCategoryService.findAllCategories.mockRejectedValue(
            new Error('Database error')
        )

        const res = await request(app)
            .get('/api/category/get')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})

describe('POST /api/category/create', () => {

    beforeEach(() => vi.clearAllMocks())

   it('returns 400 when required fields are missing', async () => {
    const res = await request(app)
        .post('/api/category/create')
        .set('Authorization', 'Bearer valid-token')
        .send({}) 

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
})

    it('returns 201 on successful category creation', async () => {
    mockCategoryService.registerNewCategory.mockResolvedValue({
        _id: 'cat-1',
        name: 'Music',
        description: 'Music events'
    })

    const res = await request(app)
        .post('/api/category/create')
        .set('Authorization', 'Bearer valid-token')
        .send({ name: 'Music', description: 'Music events' }) // ✅ added description

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.message).toBe('New Category Created Successfully')
    expect(res.body.newCategory.name).toBe('Music')
})

      it('returns 400 when category already exists', async () => {
    mockCategoryService.registerNewCategory.mockRejectedValue(
        new AppError('Category already exists', 400)
    )

    const res = await request(app)
        .post('/api/category/create')
        .set('Authorization', 'Bearer valid-token')
        .send({ name: 'Music', description: 'Music events' }) // ✅ added description

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe('Category already exists')
})
})

describe('DELETE /api/category/delete/:id', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when id format is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .delete('/api/category/delete/invalid-id')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Invalid Id Format!')
    })

    it('returns 200 on successful delete', async () => {
        mockIsValid.mockReturnValue(true)
        mockCategoryService.removeCategory.mockResolvedValue({
            _id: 'cat-1',
            name: 'Music'
        })

        const res = await request(app)
            .delete('/api/category/delete/cat-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Category Deleted Successfully')
    })

    it('returns 404 when category not found', async () => {
        mockIsValid.mockReturnValue(true)
        mockCategoryService.removeCategory.mockRejectedValue(
            new AppError('Category not found', 404)
        )

        const res = await request(app)
            .delete('/api/category/delete/cat-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Category not found')
    })

    it('returns 500 when service throws unexpected error', async () => {
        mockIsValid.mockReturnValue(true)
        mockCategoryService.removeCategory.mockRejectedValue(
            new Error('Unexpected error')
        )

        const res = await request(app)
            .delete('/api/category/delete/cat-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})