/// <reference types="vitest/globals" />
import request from 'supertest'
import app from '../app.js'
import { vi } from 'vitest'

// mock authMiddleware
vi.mock('../middlewares/authMiddleware.js', () => ({
    authUser: (req: any, res: any, next: any) => {
        req.userAccessInfo = { id: 'organizer-1', email: 'org@test.com', role: 'organizer' }
        next()
    }
}))

// mock organizerMiddleware
vi.mock('../middlewares/organizerMiddleware.js', () => ({
    isOrganizer: (req: any, res: any, next: any) => {
        if (req.userAccessInfo?.role !== 'organizer') {
            return res.status(403).json({ success: false, message: 'Organizer access required!' })
        }
        next()
    }
}))

// mock multer middleware
vi.mock('../middlewares/multerMiddleware.js', () => ({
    default: {
        single: () => (req: any, res: any, next: any) => {
            req.file = { buffer: Buffer.from('fake-image'), originalname: 'test.jpg' }
            next()
        }
    }
}))

// mock all services
vi.mock('../services/eventService.js', () => ({
    default: {
        createEvent: vi.fn(),
        getEventsByOrganizer: vi.fn(),
        updateEventByOrganizer: vi.fn(),
        cancelEvent: vi.fn(),
        getActiveOrganizerEvents: vi.fn(),
        getOrganizerPendingEventsCount: vi.fn(),
        getOrgnanizerApprovalAnalytics: vi.fn(),
        getEventById: vi.fn(),
        getAllAdminEvents: vi.fn(),
        getPendingEvents: vi.fn(),
        getAdminActiveEvents: vi.fn(),
        approveEvent: vi.fn(),
        rejectEvent: vi.fn(),
        getAllEvents: vi.fn(),
        getSingleEvent: vi.fn()
    }
}))
vi.mock('../services/feedbackService.js', () => ({
    default: {
        getOrganizerFeedbacks: vi.fn(),
        getAverageRating: vi.fn()
    }
}))
vi.mock('../services/registrationService.js', () => ({
    default: {
        getAllEventRegistrationForOrganizer: vi.fn(),
        getAllCategoryDemographicsForOrganizer: vi.fn(),
        getStudentsRegistrationStatus: vi.fn(),
        getAllRegistrationStatsByCategoryForAdmin: vi.fn(),
        getRegistrationDetailForReminder: vi.fn()
    }
}))
vi.mock('../services/attendanceService.js', () => ({
    default: {
        getAllAttendedStudents: vi.fn(),
        getOverallOrganizerAttendanceTrends: vi.fn(),
        getAttendanceSheetForEvent: vi.fn(),
        takeAttendance: vi.fn(),
        getOverallAttendanceTrends: vi.fn()
    }
}))
vi.mock('../services/auditService.js', () => ({
    default: { logAction: vi.fn() }
}))
vi.mock('../utils/validMongodbId.js', () => ({
    isValid: vi.fn()
}))

import EventService from '../services/eventService.js'
import FeedbackService from '../services/feedbackService.js'
import RegistrationService from '../services/registrationService.js'
import AttendanceService from '../services/attendanceService.js'
import { isValid } from '../utils/validMongodbId.js'
import AppError from '../utils/appError.js'

const mockEventService = EventService as any
const mockFeedbackService = FeedbackService as any
const mockRegistrationService = RegistrationService as any
const mockAttendanceService = AttendanceService as any
const mockIsValid = isValid as any

describe('POST /api/organizer/create', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when required fields are missing', async () => {
        const res = await request(app)
            .post('/api/organizer/create')
            .set('Authorization', 'Bearer valid-token')
            .send({})

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })

    it('returns 201 on successful event creation', async () => {
        mockEventService.createEvent.mockResolvedValue({
            success: true,
            message: 'Event Created Successfully!',
            newlyCreatedEvent: { _id: 'event-1', title: 'Test Event' }
        })

        const res = await request(app)
            .post('/api/organizer/create')
            .set('Authorization', 'Bearer valid-token')
            .send({
                title: 'Test Event',
                description: 'Test description here',
                location: 'Test Location',
                category: 'Music',
                capacity: 100,
                startDate: '2026-06-01',
                endDate: '2026-06-02'
            })

        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
    })

    it('returns 500 when service fails', async () => {
        mockEventService.createEvent.mockRejectedValue(
            new Error('Upload failed')
        )

        const res = await request(app)
            .post('/api/organizer/create')
            .set('Authorization', 'Bearer valid-token')
            .send({
                title: 'Test Event',
                description: 'Test description here',
                location: 'Test Location',
                category: 'Music',
                capacity: 100,
                startDate: '2026-06-01',
                endDate: '2026-06-02'
            })

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})

describe('GET /api/organizer/events', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 200 and organizer events on success', async () => {
        mockEventService.getEventsByOrganizer.mockResolvedValue({
            success: true,
            message: 'Events Retrieved Successfully',
            events: [{ _id: 'event-1', title: 'Test Event' }]
        })

        const res = await request(app)
            .get('/api/organizer/events')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })

    it('returns 500 when service fails', async () => {
        mockEventService.getEventsByOrganizer.mockRejectedValue(
            new Error('Database error')
        )

        const res = await request(app)
            .get('/api/organizer/events')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})

describe('PUT /api/organizer/update/:id', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when event id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .put('/api/organizer/update/invalid-id')
            .set('Authorization', 'Bearer valid-token')
            .send({ title: 'Updated Event' })

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Invalid ID Format!')
    })

    it('returns 200 on successful event update', async () => {
        mockIsValid.mockReturnValue(true)
        mockEventService.updateEventByOrganizer.mockResolvedValue({
            success: true,
            message: 'Event Updated Successfully',
            updatedEvent: { _id: 'event-1', title: 'Updated Event' }
        })

        const res = await request(app)
            .put('/api/organizer/update/event-1')
            .set('Authorization', 'Bearer valid-token')
            .send({ title: 'Updated Event' })

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })

    it('returns 403 when organizer does not own event', async () => {
        mockIsValid.mockReturnValue(true)
        mockEventService.updateEventByOrganizer.mockRejectedValue(
            new AppError('Unauthorized', 403)
        )

        const res = await request(app)
            .put('/api/organizer/update/event-1')
            .set('Authorization', 'Bearer valid-token')
            .send({ title: 'Updated Event' })

        expect(res.status).toBe(403)
        expect(res.body.success).toBe(false)
    })
})

describe('PUT /api/organizer/cancelEvent/:id', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when event id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .put('/api/organizer/cancelEvent/invalid-id')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Invalid ID Format!')
    })

    it('returns 200 on successful event cancellation', async () => {
        mockIsValid.mockReturnValue(true)
        mockEventService.cancelEvent.mockResolvedValue({
            success: true,
            message: 'Event Cancelled Successfully'
        })

        const res = await request(app)
            .put('/api/organizer/cancelEvent/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })
})

describe('GET /api/organizer/feedbacks', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when organizer id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .get('/api/organizer/feedbacks')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })

    it('returns 200 and feedbacks on success', async () => {
        mockIsValid.mockReturnValue(true)
        mockFeedbackService.getOrganizerFeedbacks.mockResolvedValue([
            { _id: 'fb-1', rating: 5, comment: 'Great event!' }
        ])

        const res = await request(app)
            .get('/api/organizer/feedbacks')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.feedbacks).toHaveLength(1)
    })
})

describe('GET /api/organizer/dashboard', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when organizer id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .get('/api/organizer/dashboard')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })

    it('returns 200 and dashboard data on success', async () => {
        mockIsValid.mockReturnValue(true)
        mockEventService.getActiveOrganizerEvents.mockResolvedValue([
            { _id: 'event-1', title: 'Active Event' }
        ])
        mockAttendanceService.getAllAttendedStudents.mockResolvedValue(50)
        mockEventService.getOrganizerPendingEventsCount.mockResolvedValue(2)
        mockFeedbackService.getAverageRating.mockResolvedValue(4.5)

        const res = await request(app)
            .get('/api/organizer/dashboard')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.dashboardInfo).toHaveLength(4)
    })
})

describe('GET /api/organizer/analytics', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when organizer id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .get('/api/organizer/analytics')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })

    it('returns 200 and analytics data on success', async () => {
        mockIsValid.mockReturnValue(true)
        mockRegistrationService.getAllEventRegistrationForOrganizer.mockResolvedValue([])
        mockEventService.getOrgnanizerApprovalAnalytics.mockResolvedValue({})
        mockAttendanceService.getOverallOrganizerAttendanceTrends.mockResolvedValue([])
        mockRegistrationService.getAllCategoryDemographicsForOrganizer.mockResolvedValue([])

        const res = await request(app)
            .get('/api/organizer/analytics')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Organizer Analytics Fetched Successfully!')
    })
})

describe('GET /api/organizer/registeredStudents/:id', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .get('/api/organizer/registeredStudents/invalid-id')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })

    it('returns 200 and registered students on success', async () => {
        mockIsValid.mockReturnValue(true)
        mockEventService.getEventById.mockResolvedValue({
            _id: 'event-1',
            organizedBy: { _id: 'organizer-1', toString: () => 'organizer-1' }
        })
        mockRegistrationService.getStudentsRegistrationStatus.mockResolvedValue([
            { _id: 'reg-1', studentId: { _id: 'student-1', fullName: 'John Doe' } }
        ])
        mockAttendanceService.getAttendanceSheetForEvent.mockResolvedValue([])

        const res = await request(app)
            .get('/api/organizer/registeredStudents/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.registeredStudent).toHaveLength(1)
    })

    it('returns 403 when organizer does not own event', async () => {
        mockIsValid.mockReturnValue(true)
        mockEventService.getEventById.mockResolvedValue({
            _id: 'event-1',
            organizedBy: { _id: 'other-organizer', toString: () => 'other-organizer' }
        })

        const res = await request(app)
            .get('/api/organizer/registeredStudents/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(403)
        expect(res.body.success).toBe(false)
    })
})

describe('PATCH /api/organizer/attendance/mark/:id', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .patch('/api/organizer/attendance/mark/invalid-id')
            .set('Authorization', 'Bearer valid-token')
            .send({ studentId: 'student-1', isPresent: true })

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })

    it('returns 200 on successful attendance mark', async () => {
        mockIsValid.mockReturnValue(true)
        mockEventService.getEventById.mockResolvedValue({
            _id: 'event-1',
            organizedBy: { _id: 'organizer-1', toString: () => 'organizer-1' }
        })
        mockAttendanceService.takeAttendance.mockResolvedValue({
            _id: 'att-1',
            studentId: 'student-1',
            isPresent: true
        })

        const res = await request(app)
            .patch('/api/organizer/attendance/mark/event-1')
            .set('Authorization', 'Bearer valid-token')
            .send({ studentId: 'student-1', isPresent: true })

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Attendance marked as Present')
    })

    it('returns 403 when organizer does not own event', async () => {
        mockIsValid.mockReturnValue(true)
        mockEventService.getEventById.mockResolvedValue({
            _id: 'event-1',
            organizedBy: { _id: 'other-organizer', toString: () => 'other-organizer' }
        })

        const res = await request(app)
            .patch('/api/organizer/attendance/mark/event-1')
            .set('Authorization', 'Bearer valid-token')
            .send({ studentId: 'student-1', isPresent: true })

        expect(res.status).toBe(403)
        expect(res.body.success).toBe(false)
    })
})

