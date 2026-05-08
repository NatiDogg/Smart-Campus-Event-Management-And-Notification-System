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

// mock RegistrationService
vi.mock('../services/registrationService.js', () => ({
    default: {
        RegisterStudentToEvent: vi.fn(),
        unRegisterStudentToEvent: vi.fn(),
        getAllRegistrationStatsByCategoryForAdmin: vi.fn(),
        getStudentsRegistrationStatus: vi.fn(),
        getRegistrationDetailForReminder: vi.fn()
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

import RegistrationService from '../services/registrationService.js'
import { isValid } from '../utils/validMongodbId.js'
import AppError from '../utils/appError.js'

const mockRegistrationService = RegistrationService as any
const mockIsValid = isValid as any

describe('POST /api/registration/register/:id', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when event id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .post('/api/registration/register/invalid-id')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Invalid ID Format!!')
    })

    it('returns 201 on successful registration', async () => {
        mockIsValid.mockReturnValue(true)
        mockRegistrationService.RegisterStudentToEvent.mockResolvedValue({
            success: true,
            message: 'Registered Successfully!',
            registration: { _id: 'reg-1', studentId: 'student-1', eventId: 'event-1' }
        })

        const res = await request(app)
            .post('/api/registration/register/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Registered Successfully!')
    })

    it('returns 400 when student already registered', async () => {
        mockIsValid.mockReturnValue(true)
        mockRegistrationService.RegisterStudentToEvent.mockRejectedValue(
            new AppError('Already registered for this event', 400)
        )

        const res = await request(app)
            .post('/api/registration/register/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Already registered for this event')
    })

    it('returns 404 when event not found', async () => {
        mockIsValid.mockReturnValue(true)
        mockRegistrationService.RegisterStudentToEvent.mockRejectedValue(
            new AppError('Event not found', 404)
        )

        const res = await request(app)
            .post('/api/registration/register/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Event not found')
    })

    it('returns 500 when service fails unexpectedly', async () => {
        mockIsValid.mockReturnValue(true)
        mockRegistrationService.RegisterStudentToEvent.mockRejectedValue(
            new Error('Unexpected error')
        )

        const res = await request(app)
            .post('/api/registration/register/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})

describe('DELETE /api/registration/unregister/:id', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when event id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .delete('/api/registration/unregister/invalid-id')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Invalid ID Format!!')
    })

    it('returns 200 on successful unregistration', async () => {
        mockIsValid.mockReturnValue(true)
        mockRegistrationService.unRegisterStudentToEvent.mockResolvedValue({
            success: true,
            message: 'Unregistered Successfully!'
        })

        const res = await request(app)
            .delete('/api/registration/unregister/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Unregistered Successfully!')
    })

    it('returns 400 when student not registered for event', async () => {
        mockIsValid.mockReturnValue(true)
        mockRegistrationService.unRegisterStudentToEvent.mockRejectedValue(
            new AppError('Not registered for this event', 400)
        )

        const res = await request(app)
            .delete('/api/registration/unregister/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Not registered for this event')
    })

    it('returns 404 when event not found', async () => {
        mockIsValid.mockReturnValue(true)
        mockRegistrationService.unRegisterStudentToEvent.mockRejectedValue(
            new AppError('Event not found', 404)
        )

        const res = await request(app)
            .delete('/api/registration/unregister/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Event not found')
    })

    it('returns 500 when service fails unexpectedly', async () => {
        mockIsValid.mockReturnValue(true)
        mockRegistrationService.unRegisterStudentToEvent.mockRejectedValue(
            new Error('Unexpected error')
        )

        const res = await request(app)
            .delete('/api/registration/unregister/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})