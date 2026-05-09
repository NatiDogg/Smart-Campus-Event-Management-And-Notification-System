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

// mock FeedbackService
vi.mock('../services/feedbackService.js', () => ({
    default: {
        submitFeedback: vi.fn(),
        getOrganizerFeedbacks: vi.fn(),
        getAverageRating: vi.fn()
    }
}))

// mock validMongodbId
vi.mock('../utils/validMongodbId.js', () => ({
    isValid: vi.fn()
}))

import feedbackService from '../services/feedbackService.js'
import { isValid } from '../utils/validMongodbId.js'
import AppError from '../utils/appError.js'

const mockFeedbackService = feedbackService as any
const mockIsValid = isValid as any

describe('POST /api/feedback/submit/:id', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when event id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .post('/api/feedback/submit/invalid-id')
            .set('Authorization', 'Bearer valid-token')
            .send({ rating: 5, comment: 'Great event!' })

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Invalid ID Format!')
    })

    it('returns 400 when rating is missing', async () => {
        mockIsValid.mockReturnValue(true)

        const res = await request(app)
            .post('/api/feedback/submit/event-1')
            .set('Authorization', 'Bearer valid-token')
            .send({ comment: 'Great event!' })

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })

    it('returns 400 when comment is missing', async () => {
        mockIsValid.mockReturnValue(true)

        const res = await request(app)
            .post('/api/feedback/submit/event-1')
            .set('Authorization', 'Bearer valid-token')
            .send({ rating: 5 })

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })

    it('returns 400 when rating is out of range', async () => {
        mockIsValid.mockReturnValue(true)

        const res = await request(app)
            .post('/api/feedback/submit/event-1')
            .set('Authorization', 'Bearer valid-token')
            .send({ rating: 6, comment: 'Great event!' })

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })

    it('returns 400 when comment is too short', async () => {
        mockIsValid.mockReturnValue(true)

        const res = await request(app)
            .post('/api/feedback/submit/event-1')
            .set('Authorization', 'Bearer valid-token')
            .send({ rating: 5, comment: 'Hi' })

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })

    it('returns 201 on successful feedback submission', async () => {
        mockIsValid.mockReturnValue(true)
        mockFeedbackService.submitFeedback.mockResolvedValue({
            success: true,
            message: 'Feedback Submitted Successfully',
            feedback: { _id: 'fb-1', rating: 5, comment: 'Great event!' }
        })

        const res = await request(app)
            .post('/api/feedback/submit/event-1')
            .set('Authorization', 'Bearer valid-token')
            .send({ rating: 5, comment: 'Great event indeed!' })

        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Feedback Submitted Successfully')
    })

    it('returns 400 when feedback already submitted', async () => {
        mockIsValid.mockReturnValue(true)
        mockFeedbackService.submitFeedback.mockRejectedValue(
            new AppError('Feedback already submitted', 400)
        )

        const res = await request(app)
            .post('/api/feedback/submit/event-1')
            .set('Authorization', 'Bearer valid-token')
            .send({ rating: 5, comment: 'Great event indeed!' })

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Feedback already submitted')
    })

    it('returns 500 when service fails unexpectedly', async () => {
        mockIsValid.mockReturnValue(true)
        mockFeedbackService.submitFeedback.mockRejectedValue(
            new Error('Unexpected error')
        )

        const res = await request(app)
            .post('/api/feedback/submit/event-1')
            .set('Authorization', 'Bearer valid-token')
            .send({ rating: 5, comment: 'Great event indeed!' })

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})