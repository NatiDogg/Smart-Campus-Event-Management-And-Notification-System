/// <reference types="vitest/globals" />
import request from 'supertest'
import app from '../app.js'
import { vi } from 'vitest'

// mock NotificationService
vi.mock('../services/notificationService.js', () => ({
    default: {
        processDailyReminders: vi.fn()
    }
}))

import NotificationService from '../services/notificationService.js'

const mockNotificationService = NotificationService as any

describe('POST /api/cron/daily-reminders', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns 401 when secret header is missing', async () => {
        const res = await request(app)
            .post('/api/cron/daily-reminders')

        expect(res.status).toBe(401)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Unauthorized')
    })

    it('returns 401 when secret header is wrong', async () => {
        const res = await request(app)
            .post('/api/cron/daily-reminders')
            .set('x-cron-secret', 'wrong-secret')

        expect(res.status).toBe(401)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Unauthorized')
    })

    it('returns 200 when secret is correct and reminders sent', async () => {
        mockNotificationService.processDailyReminders.mockResolvedValue(undefined)

        const res = await request(app)
            .post('/api/cron/daily-reminders')
            .set('x-cron-secret', 'test-cron-secret')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Daily reminders sent!')
    })

    it('calls processDailyReminders when secret is correct', async () => {
        mockNotificationService.processDailyReminders.mockResolvedValue(undefined)

        await request(app)
            .post('/api/cron/daily-reminders')
            .set('x-cron-secret', 'test-cron-secret')

        expect(mockNotificationService.processDailyReminders).toHaveBeenCalledTimes(1)
    })

    it('returns 500 when processDailyReminders throws an error', async () => {
        mockNotificationService.processDailyReminders.mockRejectedValue(
            new Error('Something went wrong')
        )

        const res = await request(app)
            .post('/api/cron/daily-reminders')
            .set('x-cron-secret', 'test-cron-secret')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('Cron job failed')
    })
})