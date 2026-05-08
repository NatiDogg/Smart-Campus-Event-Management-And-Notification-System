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

// mock NotificationService
vi.mock('../services/notificationService.js', () => ({
    default: {
        getUserNotifications: vi.fn(),
        deleteUserNotification: vi.fn(),
        processDailyReminders: vi.fn(),
        notifyUserPasswordReset: vi.fn()
    }
}))

// mock validMongodbId
vi.mock('../utils/validMongodbId.js', () => ({
    isValid: vi.fn()
}))

import NotificationService from '../services/notificationService.js'
import { isValid } from '../utils/validMongodbId.js'
import AppError from '../utils/appError.js'

const mockNotificationService = NotificationService as any
const mockIsValid = isValid as any

describe('GET /api/notification/get', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when user id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .get('/api/notification/get')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Invalid ID Format!!')
    })

    it('returns 200 and notifications on success', async () => {
        mockIsValid.mockReturnValue(true)
        mockNotificationService.getUserNotifications.mockResolvedValue({
            success: true,
            message: 'Notifications Retrieved Successfully!',
            notifications: [
                { _id: 'notif-1', subject: 'Event approved' },
                { _id: 'notif-2', subject: 'New announcement' }
            ]
        })

        const res = await request(app)
            .get('/api/notification/get')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.notifications).toHaveLength(2)
    })

    it('returns 200 with empty notifications array', async () => {
        mockIsValid.mockReturnValue(true)
        mockNotificationService.getUserNotifications.mockResolvedValue({
            success: true,
            message: 'Notifications Retrieved Successfully!',
            notifications: []
        })

        const res = await request(app)
            .get('/api/notification/get')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.notifications).toHaveLength(0)
    })

    it('returns 500 when service fails', async () => {
        mockIsValid.mockReturnValue(true)
        mockNotificationService.getUserNotifications.mockRejectedValue(
            new Error('Database error')
        )

        const res = await request(app)
            .get('/api/notification/get')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})

describe('DELETE /api/notification/delete/:id', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 400 when notification id is invalid', async () => {
        mockIsValid.mockReturnValue(false)

        const res = await request(app)
            .delete('/api/notification/delete/invalid-id')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Invalid ID Format!')
    })

    it('returns 200 on successful notification deletion', async () => {
        mockIsValid.mockReturnValue(true)
        mockNotificationService.deleteUserNotification.mockResolvedValue({
            success: true,
            message: 'Notification Deleted Successfully',
            deletedNotification: { _id: 'notif-1', subject: 'Event approved' }
        })

        const res = await request(app)
            .delete('/api/notification/delete/notif-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Notification Deleted Successfully')
    })

    it('returns 404 when notification not found', async () => {
        mockIsValid.mockReturnValue(true)
        mockNotificationService.deleteUserNotification.mockRejectedValue(
            new AppError('Notification not found', 404)
        )

        const res = await request(app)
            .delete('/api/notification/delete/notif-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(404)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Notification not found')
    })

    it('returns 500 when service fails unexpectedly', async () => {
        mockIsValid.mockReturnValue(true)
        mockNotificationService.deleteUserNotification.mockRejectedValue(
            new Error('Unexpected error')
        )

        const res = await request(app)
            .delete('/api/notification/delete/notif-1')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})

