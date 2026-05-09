/// <reference types="vitest/globals" />
import request from 'supertest'
import app from '../app.js'
import { vi } from 'vitest'

// mock authMiddleware
vi.mock('../middlewares/authMiddleware.js', () => ({
    authUser: (req: any, res: any, next: any) => {
        req.userAccessInfo = { id: 'student-1', email: 'student@test.com', role: 'student' }
        next()
    }
}))

// mock SubscriptionService
vi.mock('../services/subscriptionService.js', () => ({
    default: {
        subscribeToCategory: vi.fn(),
        getStudentSubscription: vi.fn()
    }
}))

// mock AIService
vi.mock('../services/aiService.js', () => ({
    default: {
        refreshStudentRecommendations: vi.fn()
    }
}))

// mock validMongodbId
vi.mock('../utils/validMongodbId.js', () => ({
    isValid: vi.fn()
}))

import SubscriptionService from '../services/subscriptionService.js'
import { isValid } from '../utils/validMongodbId.js'
import AppError from '../utils/appError.js'

const mockSubscriptionService = SubscriptionService as any
const mockIsValid = isValid as any

describe('PUT /api/subscription/category', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when student id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .put('/api/subscription/category')
            .set('Authorization', 'Bearer valid-token')
            .send({ categories: ['cat-1', 'cat-2'] })

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Invalid Id Format')
    })

    it('returns 400 when categories is missing', async () => {
        mockIsValid.mockReturnValue(true)

        const res = await request(app)
            .put('/api/subscription/category')
            .set('Authorization', 'Bearer valid-token')
            .send({})

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Invalid input data')
    })

    it('returns 201 on successful subscription', async () => {
        mockIsValid.mockReturnValue(true)
        mockSubscriptionService.subscribeToCategory.mockResolvedValue({
            success: true,
            message: 'Subscribed successfully',
            subscription: { studentId: 'student-1', categories: ['cat-1', 'cat-2'] }
        })

        const res = await request(app)
            .put('/api/subscription/category')
            .set('Authorization', 'Bearer valid-token')
            .send({ categories: ['cat-1', 'cat-2'] })

        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Subscribed successfully')
    })

    it('returns 201 with empty categories array', async () => {
        mockIsValid.mockReturnValue(true)
        mockSubscriptionService.subscribeToCategory.mockResolvedValue({
            success: true,
            message: 'Subscribed successfully',
            subscription: { studentId: 'student-1', categories: [] }
        })

        const res = await request(app)
            .put('/api/subscription/category')
            .set('Authorization', 'Bearer valid-token')
            .send({ categories: [] })

        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
    })

    it('returns 500 when service fails', async () => {
        mockIsValid.mockReturnValue(true)
        mockSubscriptionService.subscribeToCategory.mockRejectedValue(
            new Error('Database error')
        )

        const res = await request(app)
            .put('/api/subscription/category')
            .set('Authorization', 'Bearer valid-token')
            .send({ categories: ['cat-1'] })

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})

describe('GET /api/subscription/all-subscription', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when student id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .get('/api/subscription/all-subscription')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Invalid Id Format')
    })

    it('returns 200 and subscriptions on success', async () => {
        mockIsValid.mockReturnValue(true)
        mockSubscriptionService.getStudentSubscription.mockResolvedValue({
            success: true,
            message: 'Subscriptions retrieved successfully',
            subscription: { studentId: 'student-1', categories: ['cat-1', 'cat-2'] }
        })

        const res = await request(app)
            .get('/api/subscription/all-subscription')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })

    it('returns 500 when service fails', async () => {
        mockIsValid.mockReturnValue(true)
        mockSubscriptionService.getStudentSubscription.mockRejectedValue(
            new Error('Database error')
        )

        const res = await request(app)
            .get('/api/subscription/all-subscription')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})