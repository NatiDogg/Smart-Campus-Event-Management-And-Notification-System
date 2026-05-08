/// <reference types="vitest/globals" />

import request from 'supertest'
import app from '../app.js'
import { vi } from 'vitest'

// mock AuthService
vi.mock('../services/authService.js', () => ({
    default: {
        signIn: vi.fn(),
        login: vi.fn(),
        handleRefreshToken: vi.fn(),
        SignUserWithGoogleUrl: vi.fn(),
        signUserWithGoogle: vi.fn(),
    }
}))

// mock UserService
vi.mock('../services/userService.js', () => ({
    default: {
        verifyUser: vi.fn(),
        findUserByEmail: vi.fn(),
        getUserByResetToken: vi.fn(),
    }
}))

// mock NotificationService
vi.mock('../services/notificationService.js', () => ({
    default: {
        notifyUserPasswordReset: vi.fn(),
    }
}))

// mock bcryptjs
vi.mock('../utils/bcryptjs.js', () => ({
    hashPassword: vi.fn().mockResolvedValue('hashed-password'),
    matchPassword: vi.fn(),
}))

import AuthService from '../services/authService.js'
import UserService from '../services/userService.js'
import AppError from '../utils/appError.js'

const mockAuthService = AuthService as any
const mockUserService = UserService as any

describe('GET /', () => {
    it('returns api connected message', async () => {
        const res = await request(app).get('/')
        expect(res.status).toBe(200)
        expect(res.text).toBe('api is connected successfully!')
    })
})

describe('POST /api/auth/signin', () => {

    it('returns 400 when required fields are missing', async () => {
        const res = await request(app)
            .post('/api/auth/signin')
            .send({})

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })

    it('returns 400 when email is invalid', async () => {
        const res = await request(app)
            .post('/api/auth/signin')
            .send({
                email: 'invalid-email',
                password: '123456',
                fullName: 'John Doe',
                studentId: 'UGR/1234/26'
            })

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })

    it('returns 201 and sets cookie on successful registration', async () => {
        mockAuthService.signIn.mockResolvedValue({
            success: true,
            message: 'Registered Successfully!',
            user: { _id: 'user-1', email: 'test@test.com', role: 'student' },
            accessToken: 'access-token-123',
            refreshToken: 'refresh-token-123'
        })

        const res = await request(app)
            .post('/api/auth/signin')
            .send({
                email: 'test@test.com',
                password: 'password123',
                fullName: 'John Doe',
                studentId: 'UGR/1234/26'
            })

        expect(res.status).toBe(201)
        expect(res.body.success).toBe(true)
        expect(res.body.accessToken).toBe('access-token-123')
        expect(res.headers['set-cookie']).toBeDefined()
    })

    it('returns 400 when user already registered', async () => {
    mockAuthService.signIn.mockRejectedValue(
        new AppError('User Already Registered!', 400)
    )

    const res = await request(app)
        .post('/api/auth/signin')
        .send({
            email: 'existing@test.com',
            password: 'password123',
            fullName: 'John Doe',
            studentId: 'UGR/1234/26'
        })

    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe('User Already Registered!')
})
})

describe('POST /api/auth/login', () => {

    it('returns 400 when required fields are missing', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({})

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })

    it('returns 200 and sets cookie on successful login', async () => {
        mockAuthService.login.mockResolvedValue({
            success: true,
            message: 'Logged In Successfully!',
            user: { _id: 'user-1', email: 'test@test.com', role: 'student' },
            accessToken: 'access-token-123',
            refreshToken: 'refresh-token-123'
        })

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@test.com',
                password: 'password123'
            })

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.accessToken).toBe('access-token-123')
        expect(res.headers['set-cookie']).toBeDefined()
    })

    it('returns 401 on invalid credentials', async () => {
    mockAuthService.login.mockRejectedValue(
        new AppError('Invalid Credentials!', 401)
    )

    const res = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'test@test.com',
            password: 'wrongpassword'
        })

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe('Invalid Credentials!')
})
})

describe('POST /api/auth/logout', () => {

    it('returns 200 and clears cookie on logout', async () => {
        const res = await request(app)
            .post('/api/auth/logout')

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Logged out Successfully!')
    })
})

describe('POST /api/auth/refresh', () => {

    it('returns 400 when refresh token is missing', async () => {
        const res = await request(app)
            .post('/api/auth/refresh')

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('refresh token is missing!')
    })

    it('returns 200 and new tokens when refresh token is valid', async () => {
        mockAuthService.handleRefreshToken.mockResolvedValue({
            success: true,
            message: 'Refresh Token Issued Successfully!',
            user: { _id: 'user-1', email: 'test@test.com', role: 'student' },
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token'
        })

        const res = await request(app)
            .post('/api/auth/refresh')
            .set('Cookie', ['refreshToken=valid-refresh-token'])

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.accessToken).toBe('new-access-token')
    })

    it('returns 401 when refresh token is invalid', async () => {
    mockAuthService.handleRefreshToken.mockRejectedValue(
        new AppError('Token Verification Failed!', 401)
    )

    const res = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', ['refreshToken=invalid-token'])

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe('Token Verification Failed!')
})
})

describe('POST /api/auth/forget-password', () => {

    it('returns 400 when email is missing', async () => {
        const res = await request(app)
            .post('/api/auth/forget-password')
            .send({})

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })

    it('returns 200 with generic message when user not found', async () => {
        mockUserService.findUserByEmail.mockResolvedValue(null)

        const res = await request(app)
            .post('/api/auth/forget-password')
            .send({ email: 'notfound@test.com' })

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe(
            'If an account with this email exists, we will send you a reset link'
        )
    })

    it('returns 200 with generic message for google users', async () => {
        mockUserService.findUserByEmail.mockResolvedValue({
            _id: 'user-1',
            email: 'test@test.com',
            provider: 'google',
            save: vi.fn()
        })

        const res = await request(app)
            .post('/api/auth/forget-password')
            .send({ email: 'test@test.com' })

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
    })
})

describe('POST /api/auth/reset-password', () => {

    it('returns 400 when fields are missing', async () => {
        const res = await request(app)
            .post('/api/auth/reset-password')
            .send({})

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
    })

    it('returns 400 when token is invalid or expired', async () => {
        mockUserService.getUserByResetToken.mockResolvedValue(null)

        const res = await request(app)
            .post('/api/auth/reset-password')
            .send({ token: 'invalid-token', password: 'newpassword123' })

        expect(res.status).toBe(400)
        expect(res.body.success).toBe(false)
        expect(res.body.message).toBe('invalid or expired token')
    })

    it('returns 200 on successful password reset', async () => {
        mockUserService.getUserByResetToken.mockResolvedValue({
            _id: 'user-1',
            email: 'test@test.com',
            password: 'old-hashed-password',
            resetPasswordToken: 'token-hash',
            resetPasswordExpire: new Date(Date.now() + 15 * 60 * 1000),
            save: vi.fn()
        })

        const res = await request(app)
            .post('/api/auth/reset-password')
            .send({ token: 'valid-token', password: 'newpassword123' })

        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.message).toBe('Password reset successfully!')
    })
})

describe('GET /api/auth/google', () => {

    it('redirects to google auth url', async () => {
        mockAuthService.SignUserWithGoogleUrl.mockResolvedValue(
            'https://accounts.google.com/oauth/authorize?...'
        )

        const res = await request(app)
            .get('/api/auth/google')

        expect(res.status).toBe(302)
        expect(res.headers.location).toContain('accounts.google.com')
    })
})