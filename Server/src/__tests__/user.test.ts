/// <reference types="vitest/globals" />
import request from 'supertest'
import app from '../app.js'
import { vi } from 'vitest'

// mock authMiddleware
vi.mock('../middlewares/authMiddleware.js', () => ({
    authUser: (req: any, res: any, next: any) => {
        req.userAccessInfo = { id: 'user-1', email: 'user@test.com', role: 'student' }
        next()
    }
}))

// mock UserService
vi.mock('../services/userService.js', () => ({
    default: {
        addFcmToken: vi.fn(),
        removeFcmToken: vi.fn(),
        updateProfile: vi.fn(),
        getAllOrganizers: vi.fn(),
        getUsers: vi.fn(),
        deactivateUser: vi.fn(),
        findUserByEmail: vi.fn(),
        findUserById: vi.fn(),
        verifyUser: vi.fn(),
        getUserByResetToken: vi.fn(),
        getAllStudents: vi.fn(),
        
    }
}))

// mock AuditService
vi.mock('../services/auditService.js', () => ({
    default: { logAction: vi.fn() }
}))

// mock validMongodbId
vi.mock('../utils/validMongodbId.js', () => ({
    isValid: vi.fn()
}))

import UserService from '../services/userService.js'
import { isValid } from '../utils/validMongodbId.js'
import AppError from '../utils/appError.js'

const mockUserService = UserService as any
const mockIsValid = isValid as any

describe('POST /api/user/register-fcm', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when token is missing', async () => {
        const res = await request(app)
            .post('/api/user/register-fcm')
            .set('Authorization', 'Bearer valid-token')
            .send({})

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Token is required')
    })

    it('returns 200 on successful token registration', async () => {
        mockUserService.addFcmToken.mockResolvedValue({
            success: true,
            message: 'FCM token registered successfully'
        })

        const res = await request(app)
            .post('/api/user/register-fcm')
            .set('Authorization', 'Bearer valid-token')
            .send({ token: 'fcm-token-123' })

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })

    it('returns 500 when service fails', async () => {
        mockUserService.addFcmToken.mockRejectedValue(
            new Error('Database error')
        )

        const res = await request(app)
            .post('/api/user/register-fcm')
            .set('Authorization', 'Bearer valid-token')
            .send({ token: 'fcm-token-123' })

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})

describe('POST /api/user/remove-fcm', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when token is missing', async () => {
        const res = await request(app)
            .post('/api/user/remove-fcm')
            .set('Authorization', 'Bearer valid-token')
            .send({})

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Token is required')
    })

    it('returns 200 on successful token removal', async () => {
        mockUserService.removeFcmToken.mockResolvedValue({
            success: true,
            message: 'FCM token removed successfully'
        })

        const res = await request(app)
            .post('/api/user/remove-fcm')
            .set('Authorization', 'Bearer valid-token')
            .send({ token: 'fcm-token-123' })

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })
})

describe('PATCH /api/user/profile', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when user id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .patch('/api/user/profile')
            .set('Authorization', 'Bearer valid-token')
            .send({ fullName: 'John Doe' })

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Invalid ID Format!!')
    })

    it('returns 200 on successful profile update', async () => {
        mockIsValid.mockReturnValue(true)
        mockUserService.updateProfile.mockResolvedValue({
            success: true,
            message: 'Profile updated successfully',
            updatedUser: { _id: 'user-1', fullName: 'John Doe' }
        })

        const res = await request(app)
            .patch('/api/user/profile')
            .set('Authorization', 'Bearer valid-token')
            .send({ fullName: 'John Doe' })

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })

    it('returns 500 when service fails', async () => {
        mockIsValid.mockReturnValue(true)
        mockUserService.updateProfile.mockRejectedValue(
            new Error('Database error')
        )

        const res = await request(app)
            .patch('/api/user/profile')
            .set('Authorization', 'Bearer valid-token')
            .send({ fullName: 'John Doe' })

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})

describe('GET /api/user/organizer', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 200 and organizers on success', async () => {
        mockUserService.getAllOrganizers.mockResolvedValue([
            { _id: 'org-1', fullName: 'John Organizer' },
            { _id: 'org-2', fullName: 'Jane Organizer' }
        ])

        const res = await request(app)
            .get('/api/user/organizer')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.result).toHaveLength(2)
    })

    it('returns 200 with empty list when no organizers', async () => {
        mockUserService.getAllOrganizers.mockResolvedValue([])

        const res = await request(app)
            .get('/api/user/organizer')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.result).toHaveLength(0)
    })

    it('returns 500 when service fails', async () => {
        mockUserService.getAllOrganizers.mockRejectedValue(
            new Error('Database error')
        )

        const res = await request(app)
            .get('/api/user/organizer')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})