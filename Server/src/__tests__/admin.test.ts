/// <reference types="vitest/globals" />
import request from 'supertest'
import app from '../app.js'
import { vi } from 'vitest'

// mock authMiddleware - admin user
vi.mock('../middlewares/authMiddleware.js', () => ({
    authUser: (req: any, res: any, next: any) => {
        req.userAccessInfo = { id: 'admin-1', email: 'admin@test.com', role: 'admin' }
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

// mock all services
vi.mock('../services/organizerService.js', () => ({
    default: { registerNewOrganizer: vi.fn() }
}))
vi.mock('../services/eventService.js', () => ({
    default: {
        approveEvent: vi.fn(),
        rejectEvent: vi.fn(),
        getAllAdminEvents: vi.fn(),
        getPendingEvents: vi.fn(),
        getAdminActiveEvents: vi.fn()
    }
}))
vi.mock('../services/userService.js', () => ({
    default: {
        getUsers: vi.fn(),
        deactivateUser: vi.fn()
    }
}))
vi.mock('../services/announcementService.js', () => ({
    default: { createAnnouncement: vi.fn() }
}))
vi.mock('../services/registrationService.js', () => ({
    default: { getAllRegistrationStatsByCategoryForAdmin: vi.fn() }
}))
vi.mock('../services/attendanceService.js', () => ({
    default: { getOverallAttendanceTrends: vi.fn() }
}))
vi.mock('../services/analyticsService.js', () => ({
    default: { getMonthlyDashboardAnalytics: vi.fn() }
}))
vi.mock('../services/auditService.js', () => ({
    default: { logAction: vi.fn() }
}))
vi.mock('../utils/validMongodbId.js', () => ({
    isValid: vi.fn()
}))
vi.mock('../utils/pdfGenerator.js', () => ({
    generateAnalyticsPDF: vi.fn()
}))

import OrganizerService from '../services/organizerService.js'
import EventService from '../services/eventService.js'
import UserService from '../services/userService.js'
import AnnouncementService from '../services/announcementService.js'
import RegistrationService from '../services/registrationService.js'
import AttendanceService from '../services/attendanceService.js'
import AnalyticsService from '../services/analyticsService.js'
import { isValid } from '../utils/validMongodbId.js'
import { generateAnalyticsPDF } from '../utils/pdfGenerator.js'
import AppError from '../utils/appError.js'

const mockOrganizerService = OrganizerService as any
const mockEventService = EventService as any
const mockUserService = UserService as any
const mockAnnouncementService = AnnouncementService as any
const mockRegistrationService = RegistrationService as any
const mockAttendanceService = AttendanceService as any
const mockAnalyticsService = AnalyticsService as any
const mockIsValid = isValid as any
const mockGeneratePDF = generateAnalyticsPDF as any

describe('POST /api/admin/createOrganizer', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when required fields are missing', async () => {
        const res = await request(app)
            .post('/api/admin/createOrganizer')
            .set('Authorization', 'Bearer valid-token')
            .send({})

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })

    it('returns 201 on successful organizer creation', async () => {
    mockOrganizerService.registerNewOrganizer.mockResolvedValue({
        _id: 'org-1',
        fullName: 'John Organizer',
        email: 'org@test.com',
        role: 'organizer'
    })

    const res = await request(app)
        .post('/api/admin/createOrganizer')
        .set('Authorization', 'Bearer valid-token')
        .send({
            fullName: 'John Organizer',
            email: 'org@test.com',
            organizationName: 'Test Org',  // ✅ added
            phoneNumber: '1234567890'       // ✅ added
        })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.message).toBe('Organizer Created Successfully!')
})

    it('returns 400 when organizer already exists', async () => {
    mockOrganizerService.registerNewOrganizer.mockRejectedValue(
        new AppError('Organizer already exists', 400)
    )

    const res = await request(app)
        .post('/api/admin/createOrganizer')
        .set('Authorization', 'Bearer valid-token')
        .send({
            fullName: 'John Organizer',
            email: 'existing@test.com',
            organizationName: 'Test Org',  
            phoneNumber: '1234567890'       
        })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
})
})

describe('PATCH /api/admin/approve/:id', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when event id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .patch('/api/admin/approve/invalid-id')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Invalid ID Format!!')
    })

    it('returns 200 on successful event approval', async () => {
        mockIsValid.mockReturnValue(true)
        mockEventService.approveEvent.mockResolvedValue({
            _id: 'event-1',
            title: 'Test Event',
            status: 'approved'
        })

        const res = await request(app)
            .patch('/api/admin/approve/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Event Approved Successfully')
    })

    it('returns 404 when event not found', async () => {
        mockIsValid.mockReturnValue(true)
        mockEventService.approveEvent.mockRejectedValue(
            new AppError('Event not found', 404)
        )

        const res = await request(app)
            .patch('/api/admin/approve/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
    })
})

describe('PATCH /api/admin/reject/:id', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when event id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .patch('/api/admin/reject/invalid-id')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Invalid ID Format!!')
    })

    it('returns 200 on successful event rejection', async () => {
        mockIsValid.mockReturnValue(true)
        mockEventService.rejectEvent.mockResolvedValue({
            _id: 'event-1',
            title: 'Test Event',
            status: 'rejected'
        })

        const res = await request(app)
            .patch('/api/admin/reject/event-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Event Rejected Successfully')
    })
})

describe('GET /api/admin/users', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 200 and all users on success', async () => {
        mockUserService.getUsers.mockResolvedValue([
            { _id: 'user-1', fullName: 'John Doe', role: 'student' },
            { _id: 'user-2', fullName: 'Jane Doe', role: 'organizer' }
        ])

        const res = await request(app)
            .get('/api/admin/users')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.users).toHaveLength(2)
    })

    it('returns 500 when service fails', async () => {
        mockUserService.getUsers.mockRejectedValue(new Error('Database error'))

        const res = await request(app)
            .get('/api/admin/users')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})

describe('DELETE /api/admin/deactivate/:id', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when user id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .delete('/api/admin/deactivate/invalid-id')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Invalid ID Format!!')
    })

    it('returns 400 when admin tries to deactivate themselves', async () => {
        mockIsValid.mockReturnValue(true)

        const res = await request(app)
            .delete('/api/admin/deactivate/admin-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Failed to Deactivate Yourself')
    })

    it('returns 200 on successful user deactivation', async () => {
        mockIsValid.mockReturnValue(true)
        mockUserService.deactivateUser.mockResolvedValue({
            _id: 'user-1',
            fullName: 'John Doe',
            isActive: false
        })

        const res = await request(app)
            .delete('/api/admin/deactivate/user-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('User Deactivated Successfully')
    })
})

describe('GET /api/admin/events', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 200 and all events on success', async () => {
        mockEventService.getAllAdminEvents.mockResolvedValue([
            { _id: 'event-1', title: 'Event 1' },
            { _id: 'event-2', title: 'Event 2' }
        ])

        const res = await request(app)
            .get('/api/admin/events')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.events).toHaveLength(2)
    })
})

describe('GET /api/admin/pendingEvents', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 200 and pending events on success', async () => {
        mockEventService.getPendingEvents.mockResolvedValue([
            { _id: 'event-1', title: 'Pending Event', status: 'pending' }
        ])

        const res = await request(app)
            .get('/api/admin/pendingEvents')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.events).toHaveLength(1)
    })

    it('returns 200 with empty array when no pending events', async () => {
        mockEventService.getPendingEvents.mockResolvedValue([])

        const res = await request(app)
            .get('/api/admin/pendingEvents')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.events).toHaveLength(0)
        expect(res.body.message).toBe('No pending events yet')
    })
})

describe('POST /api/admin/createAnnouncement', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when required fields are missing', async () => {
        const res = await request(app)
            .post('/api/admin/createAnnouncement')
            .set('Authorization', 'Bearer valid-token')
            .send({})

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })

    it('returns 201 on successful announcement creation', async () => {
        mockAnnouncementService.createAnnouncement.mockResolvedValue({
            _id: 'ann-1',
            title: 'Test Announcement',
            content: 'Test content'
        })

        const res = await request(app)
            .post('/api/admin/createAnnouncement')
            .set('Authorization', 'Bearer valid-token')
            .send({ title: 'Test Announcement', content: 'Test content' })

        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Announcement Created Successfully!')
    })
})

describe('GET /api/admin/dashboard', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 200 and dashboard data on success', async () => {
        mockUserService.getUsers.mockResolvedValue([{ _id: 'user-1' }, { _id: 'user-2' }])
        mockEventService.getAdminActiveEvents.mockResolvedValue(5)
        mockEventService.getPendingEvents.mockResolvedValue([{ _id: 'event-1' }])
        mockRegistrationService.getAllRegistrationStatsByCategoryForAdmin.mockResolvedValue([])
        mockAttendanceService.getOverallAttendanceTrends.mockResolvedValue([])

        const res = await request(app)
            .get('/api/admin/dashboard')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Admin Dashboard Retrieved Successfully!')
        expect(res.body.dashboardInfo).toHaveLength(3)
    })
})

describe('GET /api/admin/analytics', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 200 and analytics data on success', async () => {
        mockAnalyticsService.getMonthlyDashboardAnalytics.mockResolvedValue({
            monthly: [],
            totalEvents: 10
        })

        const res = await request(app)
            .get('/api/admin/analytics')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('analytics retrieved successfully!')
    })
})

describe('POST /api/admin/export-pdf', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when no analytics data provided', async () => {
        const res = await request(app)
            .post('/api/admin/export-pdf')
            .set('Authorization', 'Bearer valid-token')
            .send({})

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('No data provided for PDF')
    })

    it('calls generateAnalyticsPDF when data is provided', async () => {
        mockGeneratePDF.mockImplementation((data: any, res: any) => {
            res.end()
        })

        const res = await request(app)
            .post('/api/admin/export-pdf')
            .set('Authorization', 'Bearer valid-token')
            .send({ analyticsData: { totalEvents: 10 } })

        expect(mockGeneratePDF).toHaveBeenCalledTimes(1)
    })
})

