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

// mock AuditService
vi.mock('../services/auditService.js', () => ({
    default: {
        getAuditLogs: vi.fn(),
        logAction: vi.fn()
    }
}))

import AuditService from '../services/auditService.js'
import AppError from '../utils/appError.js'

const mockAuditService = AuditService as any

describe('GET /api/audit/get', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns 200 and audit logs on success', async () => {
        mockAuditService.getAuditLogs.mockResolvedValue({
            logs: [
                { _id: 'log-1', action: 'LOGIN', userId: 'user-1' },
                { _id: 'log-2', action: 'CREATED_EVENT', userId: 'user-2' }
            ],
            totalPages: 1,
            currentPage: 1
        })

        const res = await request(app)
            .get('/api/audit/get')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Audit Logs Retrieved Successfully!')
    })

    it('calls getAuditLogs with default page and limit', async () => {
        mockAuditService.getAuditLogs.mockResolvedValue({ logs: [], totalPages: 0 })

        await request(app)
            .get('/api/audit/get')
            .set('Authorization', 'Bearer valid-token')

        expect(mockAuditService.getAuditLogs).toHaveBeenCalledWith(1, 5)
    })

    it('calls getAuditLogs with custom page and limit', async () => {
        mockAuditService.getAuditLogs.mockResolvedValue({ logs: [], totalPages: 0 })

        await request(app)
            .get('/api/audit/get?_page=2&_limit=10')
            .set('Authorization', 'Bearer valid-token')

        expect(mockAuditService.getAuditLogs).toHaveBeenCalledWith(2, 10)
    })

    it('returns 200 with empty logs array', async () => {
        mockAuditService.getAuditLogs.mockResolvedValue({
            logs: [],
            totalPages: 0,
            currentPage: 1
        })

        const res = await request(app)
            .get('/api/audit/get')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })

    it('returns 500 when service fails', async () => {
        mockAuditService.getAuditLogs.mockRejectedValue(
            new Error('Database error')
        )

        const res = await request(app)
            .get('/api/audit/get')
            .set('Authorization', 'Bearer valid-token')

        expect(res.status).toBe(500)
        expect(res.body.success).toBe(false)
    })
})