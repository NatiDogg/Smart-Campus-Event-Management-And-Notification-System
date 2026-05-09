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

// mock all services
vi.mock('../services/registrationService.js', () => ({
    default: {
        getAllStudentRegisteredEvents: vi.fn(),
        getAllRegistrationStatsByCategoryForAdmin: vi.fn(),
        getStudentsRegistrationStatus: vi.fn(),
        getRegistrationDetailForReminder: vi.fn()
    }
}))
vi.mock('../services/interestService.js', () => ({
    default: {
        getAllStudentInterestedEvents: vi.fn(),
        addInterest: vi.fn(),
        removeInterest: vi.fn()
    }
}))
vi.mock('../services/attendanceService.js', () => ({
    default: {
        getStudentAttendedEvents: vi.fn(),
        getAllAttendedStudents: vi.fn(),
        getOverallAttendanceTrends: vi.fn(),
        getOverallOrganizerAttendanceTrends: vi.fn(),
        getAttendanceSheetForEvent: vi.fn(),
        takeAttendance: vi.fn()
    }
}))
vi.mock('../services/eventService.js', () => ({
    default: {
        getPopularEvents: vi.fn(),
        getAllEvents: vi.fn(),
        getSingleEvent: vi.fn(),
        getAllAdminEvents: vi.fn(),
        getPendingEvents: vi.fn(),
        getAdminActiveEvents: vi.fn(),
        approveEvent: vi.fn(),
        rejectEvent: vi.fn(),
        getEventsByOrganizer: vi.fn(),
        createEvent: vi.fn(),
        updateEventByOrganizer: vi.fn(),
        cancelEvent: vi.fn(),
        getActiveOrganizerEvents: vi.fn(),
        getOrganizerPendingEventsCount: vi.fn(),
        getOrgnanizerApprovalAnalytics: vi.fn(),
        getEventById: vi.fn()
    }
}))
vi.mock('../services/studentService.js', () => ({
    default: {
        getStudentCalendarData: vi.fn()
    }
}))
vi.mock('../services/aiService.js', () => ({
    default: {
        getRecommendations: vi.fn(),
        refreshStudentRecommendations: vi.fn()
    }
}))
vi.mock('../services/announcementService.js', () => ({
    default: {
        getAnnouncements: vi.fn(),
        createAnnouncement: vi.fn()
    }
}))
vi.mock('../utils/validMongodbId.js', () => ({
    isValid: vi.fn()
}))

import RegistrationService from '../services/registrationService.js'
import InterestService from '../services/interestService.js'
import AttendanceService from '../services/attendanceService.js'
import EventService from '../services/eventService.js'
import StudentService from '../services/studentService.js'
import AIService from '../services/aiService.js'
import AnnouncementService from '../services/announcementService.js'
import { isValid } from '../utils/validMongodbId.js'
import AppError from '../utils/appError.js'

const mockRegistrationService = RegistrationService as any
const mockInterestService = InterestService as any
const mockAttendanceService = AttendanceService as any
const mockEventService = EventService as any
const mockStudentService = StudentService as any
const mockAIService = AIService as any
const mockAnnouncementService = AnnouncementService as any
const mockIsValid = isValid as any

describe('GET /api/student/my-events', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when student id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .get('/api/student/my-events')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Invalid ID Format!!')
    })

    it('returns 200 and all student events on success', async () => {
        mockIsValid.mockReturnValue(true)
        mockRegistrationService.getAllStudentRegisteredEvents.mockResolvedValue([
            { _id: 'event-1', title: 'Registered Event' }
        ])
        mockInterestService.getAllStudentInterestedEvents.mockResolvedValue([
            { _id: 'event-2', title: 'Interested Event' }
        ])
        mockAttendanceService.getStudentAttendedEvents.mockResolvedValue([
            { _id: 'event-3', title: 'Attended Event' }
        ])
        mockEventService.getPopularEvents.mockResolvedValue([
            { _id: 'event-4', title: 'Popular Event' }
        ])

        const res = await request(app)
            .get('/api/student/my-events')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Your Events Retrieved Successfully!')
        expect(res.body.registeredEvents).toHaveLength(1)
        expect(res.body.interestedEvents).toHaveLength(1)
        expect(res.body.previouslyAttendedEvents).toHaveLength(1)
        expect(res.body.popularEvents).toHaveLength(1)
    })

    it('returns 500 when service fails', async () => {
        mockIsValid.mockReturnValue(true)
        mockRegistrationService.getAllStudentRegisteredEvents.mockRejectedValue(
            new Error('Database error')
        )

        const res = await request(app)
            .get('/api/student/my-events')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})

describe('GET /api/student/announcement', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 200 and announcements on success', async () => {
        mockAnnouncementService.getAnnouncements.mockResolvedValue([
            { _id: 'ann-1', title: 'Announcement 1' },
            { _id: 'ann-2', title: 'Announcement 2' }
        ])

        const res = await request(app)
            .get('/api/student/announcement')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Announcements retrieved Successfully!')
        expect(res.body.announcements).toHaveLength(2)
    })

    it('returns 200 with empty announcements', async () => {
        mockAnnouncementService.getAnnouncements.mockResolvedValue([])

        const res = await request(app)
            .get('/api/student/announcement')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })

    it('returns 500 when service fails', async () => {
        mockAnnouncementService.getAnnouncements.mockRejectedValue(
            new Error('Database error')
        )

        const res = await request(app)
            .get('/api/student/announcement')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})

describe('GET /api/student/calendar', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when student id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .get('/api/student/calendar')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Invalid ID Format!')
    })

    it('returns 200 and calendar events on success', async () => {
        mockIsValid.mockReturnValue(true)
        mockStudentService.getStudentCalendarData.mockResolvedValue([
            { _id: 'event-1', title: 'Calendar Event', startDate: '2026-05-01' }
        ])

        const res = await request(app)
            .get('/api/student/calendar?month=5&year=2026')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Calender events retrieved successfully')
        expect(res.body.calendarEvents).toHaveLength(1)
    })

    it('uses current month and year when not provided', async () => {
        mockIsValid.mockReturnValue(true)
        mockStudentService.getStudentCalendarData.mockResolvedValue([])

        await request(app)
            .get('/api/student/calendar')
            .set('Authorization', 'Bearer valid-token')

        const currentMonth = new Date().getMonth() + 1
        const currentYear = new Date().getFullYear()

        expect(mockStudentService.getStudentCalendarData).toHaveBeenCalledWith(
            'student-1',
            currentMonth,
            currentYear
        )
    })

    it('returns 500 when service fails', async () => {
        mockIsValid.mockReturnValue(true)
        mockStudentService.getStudentCalendarData.mockRejectedValue(
            new Error('Database error')
        )

        const res = await request(app)
            .get('/api/student/calendar')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})

describe('GET /api/student/recommendations', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when student id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .get('/api/student/recommendations')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Invalid ID Format')
    })

    it('returns 200 and recommendations on success', async () => {
        mockIsValid.mockReturnValue(true)
        mockAIService.getRecommendations.mockResolvedValue([
            { _id: 'event-1', title: 'Recommended Event' }
        ])

        const res = await request(app)
            .get('/api/student/recommendations')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('recommedation retrieved successfully')
        expect(res.body.recommendations).toHaveLength(1)
    })

    it('refreshes recommendations when empty and returns new ones', async () => {
        mockIsValid.mockReturnValue(true)
        mockAIService.getRecommendations
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([
                { _id: 'event-1', title: 'Refreshed Recommendation' }
            ])
        mockAIService.refreshStudentRecommendations.mockResolvedValue(undefined)

        const res = await request(app)
            .get('/api/student/recommendations')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(mockAIService.refreshStudentRecommendations).toHaveBeenCalledWith('student-1')
        expect(mockAIService.getRecommendations).toHaveBeenCalledTimes(2)
        expect(res.body.recommendations).toHaveLength(1)
    })

    it('returns 500 when service fails', async () => {
        mockIsValid.mockReturnValue(true)
        mockAIService.getRecommendations.mockRejectedValue(
            new Error('AI service error')
        )

        const res = await request(app)
            .get('/api/student/recommendations')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})