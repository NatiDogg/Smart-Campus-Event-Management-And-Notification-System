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

// mock InterestService
vi.mock('../services/interestService.js', () => ({
    default: {
        addInterest: vi.fn(),
        removeInterest: vi.fn()
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

import InterestService from '../services/interestService.js'
import { isValid } from '../utils/validMongodbId.js'
import AppError from '../utils/appError.js'

const mockInterestService = InterestService as any
const mockIsValid = isValid as any

describe('POST /api/interest/mark/:id', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when event id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .post('/api/interest/mark/invalid-id')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Invalid ID Format!!')
    })

    it('returns 201 on successful interest mark', async () => {
        mockIsValid.mockReturnValue(true)
        mockInterestService.addInterest.mockResolvedValue({
            success: true,
            message: 'Interest marked successfully',
            interest: { _id: 'int-1', studentId: 'student-1', eventId: 'event-1' }
        })

        const res = await request(app)
            .post('/api/interest/mark/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Interest marked successfully')
    })

    it('returns 400 when already marked interest', async () => {
        mockIsValid.mockReturnValue(true)
        mockInterestService.addInterest.mockRejectedValue(
            new AppError('Already marked interest', 400)
        )

        const res = await request(app)
            .post('/api/interest/mark/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Already marked interest')
    })

    it('returns 404 when event not found', async () => {
        mockIsValid.mockReturnValue(true)
        mockInterestService.addInterest.mockRejectedValue(
            new AppError('Event not found', 404)
        )

        const res = await request(app)
            .post('/api/interest/mark/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Event not found')
    })

    it('returns 500 when service fails unexpectedly', async () => {
        mockIsValid.mockReturnValue(true)
        mockInterestService.addInterest.mockRejectedValue(
            new Error('Unexpected error')
        )

        const res = await request(app)
            .post('/api/interest/mark/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})

describe('DELETE /api/interest/unmark/:id', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when event id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .delete('/api/interest/unmark/invalid-id')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Invalid ID Format!!')
    })

    it('returns 200 on successful interest unmark', async () => {
        mockIsValid.mockReturnValue(true)
        mockInterestService.removeInterest.mockResolvedValue({
            success: true,
            message: 'Interest unmarked successfully'
        })

        const res = await request(app)
            .delete('/api/interest/unmark/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Interest unmarked successfully')
    })

    it('returns 400 when interest not found', async () => {
        mockIsValid.mockReturnValue(true)
        mockInterestService.removeInterest.mockRejectedValue(
            new AppError('Interest not found', 400)
        )

        const res = await request(app)
            .delete('/api/interest/unmark/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Interest not found')
    })

    it('returns 500 when service fails unexpectedly', async () => {
        mockIsValid.mockReturnValue(true)
        mockInterestService.removeInterest.mockRejectedValue(
            new Error('Unexpected error')
        )

        const res = await request(app)
            .delete('/api/interest/unmark/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})