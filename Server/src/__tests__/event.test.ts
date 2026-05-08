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

// mock EventService
vi.mock('../services/eventService.js', () => ({
    default: {
        getAllEvents: vi.fn(),
        getSingleEvent: vi.fn(),
        approveEvent: vi.fn(),
        rejectEvent: vi.fn(),
        getAllAdminEvents: vi.fn(),
        getPendingEvents: vi.fn(),
        getAdminActiveEvents: vi.fn()
    }
}))

// mock validMongodbId
vi.mock('../utils/validMongodbId.js', () => ({
    isValid: vi.fn()
}))

import EventService from '../services/eventService.js'
import { isValid } from '../utils/validMongodbId.js'
import AppError from '../utils/appError.js'

const mockEventService = EventService as any
const mockIsValid = isValid as any

describe('GET /api/event/all-events', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 200 and events on success', async () => {
        mockEventService.getAllEvents.mockResolvedValue([
            { _id: 'event-1', title: 'Event 1' },
            { _id: 'event-2', title: 'Event 2' }
        ])

        const res = await request(app)
            .get('/api/event/all-events')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.result).toHaveLength(2)
        expect(res.body.message).toBe('Events Retrieved Successfully!')
    })

    it('returns 200 with empty message when no events', async () => {
        mockEventService.getAllEvents.mockResolvedValue([])

        const res = await request(app)
            .get('/api/event/all-events')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.result).toHaveLength(0)
        expect(res.body.message).toBe('No events have been created yet!')
    })

    it('returns 500 when service fails', async () => {
        mockEventService.getAllEvents.mockRejectedValue(
            new Error('Database error')
        )

        const res = await request(app)
            .get('/api/event/all-events')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})

describe('GET /api/event/single-event/:id', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when event id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .get('/api/event/single-event/invalid-id')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Invalid ID Format!')
    })

    it('returns 200 and event details on success', async () => {
        mockIsValid.mockReturnValue(true)
        mockEventService.getSingleEvent.mockResolvedValue({
            success: true,
            message: 'Event Retrieved Successfully',
            event: { _id: 'event-1', title: 'Test Event' },
            isRegistered: false,
            isInterested: false
        })

        const res = await request(app)
            .get('/api/event/single-event/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })

    it('returns 404 when event not found', async () => {
        mockIsValid.mockReturnValue(true)
        mockEventService.getSingleEvent.mockRejectedValue(
            new AppError('Event not found', 404)
        )

        const res = await request(app)
            .get('/api/event/single-event/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Event not found')
    })

    it('returns 500 when service fails unexpectedly', async () => {
        mockIsValid.mockReturnValue(true)
        mockEventService.getSingleEvent.mockRejectedValue(
            new Error('Unexpected error')
        )

        const res = await request(app)
            .get('/api/event/single-event/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})