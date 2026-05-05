import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppContext } from '../context/ContextProvider'

// mock api
vi.mock('../api/axios', () => ({
    default: {
        defaults: { headers: { common: {} } }
    },
    setIsLoggingOut: vi.fn()
}))

// mock toast
vi.mock('react-hot-toast', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}))

// mock auth api
vi.mock('../api/auth', () => ({
    loginUser: vi.fn(),
    logoutUser: vi.fn(),
    registerUser: vi.fn(),
    verifySession: vi.fn(),
    verifyUser: vi.fn(),
    forgetPassword: vi.fn(),
    resetPassword: vi.fn()
}))

import api, { setIsLoggingOut } from '../api/axios'
import { toast } from 'react-hot-toast'
import { loginUser, logoutUser, registerUser, verifySession, verifyUser, forgetPassword, resetPassword } from '../api/auth'
import { useLoginUser, useLogoutUser, useRegisterUser, useVerifySession, useVerifyUser, useForgetPassword, useResetPassword } from '../hooks/useAuth'

const mockNavigate = vi.fn()

const createWrapper = (contextValues = {}) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false }
        }
    })
    const defaultContext = {
        setUser: vi.fn(),
        setToken: vi.fn(),
        navigate: mockNavigate,
        ...contextValues
    }
    return ({ children }) => (
        <AppContext.Provider value={defaultContext}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </AppContext.Provider>
    )
}

describe('useLoginUser', () => {

    beforeEach(() => {
        vi.clearAllMocks()
        api.defaults.headers.common = {}
    })

    it('sets user, token and auth header on success', async () => {
        const setUser = vi.fn()
        const setToken = vi.fn()
        const mockData = {
            user: { role: 'student', email: 'test@test.com' },
            accessToken: 'access-token-123',
            message: 'Logged In Successfully!'
        }
        loginUser.mockResolvedValue(mockData)

        const { result } = renderHook(() => useLoginUser(), {
            wrapper: createWrapper({ setUser, setToken })
        })

        await act(async () => {
            result.current.mutate({ email: 'test@test.com', password: '123456' })
        })

        expect(setUser).toHaveBeenCalledWith(mockData.user)
        expect(setToken).toHaveBeenCalledWith(mockData.accessToken)
        expect(api.defaults.headers.common['Authorization']).toBe('Bearer access-token-123')
        expect(toast.success).toHaveBeenCalledWith(mockData.message)
    })

    it('shows error toast on login failure', async () => {
        loginUser.mockRejectedValue({
            response: { data: { message: 'Invalid Credentials!' } }
        })

        const { result } = renderHook(() => useLoginUser(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ email: 'test@test.com', password: 'wrong' })
        })

        expect(toast.error).toHaveBeenCalledWith('Invalid Credentials!')
    })

    it('shows fallback error message when no response message', async () => {
        loginUser.mockRejectedValue({})

        const { result } = renderHook(() => useLoginUser(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ email: 'test@test.com', password: 'wrong' })
        })

        expect(toast.error).toHaveBeenCalledWith('Login Failed')
    })
})

describe('useLogoutUser', () => {

    beforeEach(() => {
        vi.clearAllMocks()
        api.defaults.headers.common = { Authorization: 'Bearer old-token' }
    })

    it('clears user, token and auth header on logout', async () => {
        const setUser = vi.fn()
        const setToken = vi.fn()
        logoutUser.mockResolvedValue({ message: 'Logged out Successfully!' })

        const { result } = renderHook(() => useLogoutUser(), {
            wrapper: createWrapper({ setUser, setToken })
        })

        await act(async () => {
            result.current.mutate()
        })

        expect(setUser).toHaveBeenCalledWith(null)
        expect(setToken).toHaveBeenCalledWith(null)
        expect(api.defaults.headers.common['Authorization']).toBeUndefined()
    })

    it('navigates to /login after logout', async () => {
        logoutUser.mockResolvedValue({ message: 'Logged out Successfully!' })

        const { result } = renderHook(() => useLogoutUser(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate()
        })

        expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
    })

    it('resets isLoggingOut flag after logout', async () => {
        logoutUser.mockResolvedValue({ message: 'Logged out Successfully!' })

        const { result } = renderHook(() => useLogoutUser(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate()
        })

        expect(setIsLoggingOut).toHaveBeenCalledWith(true)
        expect(setIsLoggingOut).toHaveBeenCalledWith(false)
    })

    it('still clears session even when logout API fails', async () => {
        const setUser = vi.fn()
        const setToken = vi.fn()
        logoutUser.mockRejectedValue(new Error('Network error'))

        const { result } = renderHook(() => useLogoutUser(), {
            wrapper: createWrapper({ setUser, setToken })
        })

        await act(async () => {
            result.current.mutate()
        })

        expect(setUser).toHaveBeenCalledWith(null)
        expect(setToken).toHaveBeenCalledWith(null)
        expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
    })
})

describe('useRegisterUser', () => {

    beforeEach(() => {
        vi.clearAllMocks()
        api.defaults.headers.common = {}
    })

    it('sets user, token and auth header on successful registration', async () => {
        const setUser = vi.fn()
        const setToken = vi.fn()
        const mockData = {
            user: { role: 'student', email: 'new@test.com' },
            accessToken: 'new-access-token',
            message: 'Registered Successfully!'
        }
        registerUser.mockResolvedValue(mockData)

        const { result } = renderHook(() => useRegisterUser(), {
            wrapper: createWrapper({ setUser, setToken })
        })

        await act(async () => {
            result.current.mutate({ email: 'new@test.com', password: '123456' })
        })

        expect(setUser).toHaveBeenCalledWith(mockData.user)
        expect(setToken).toHaveBeenCalledWith(mockData.accessToken)
        expect(api.defaults.headers.common['Authorization']).toBe('Bearer new-access-token')
        expect(toast.success).toHaveBeenCalledWith(mockData.message)
    })

    it('shows error toast on registration failure', async () => {
        registerUser.mockRejectedValue({
            response: { data: { message: 'User Already Registered!' } }
        })

        const { result } = renderHook(() => useRegisterUser(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ email: 'existing@test.com', password: '123456' })
        })

        expect(toast.error).toHaveBeenCalledWith('User Already Registered!')
    })
})

describe('useVerifySession', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns user data on successful session verification', async () => {
        const mockData = {
            user: { role: 'student', email: 'test@test.com' },
            accessToken: 'access-token-123'
        }
        verifySession.mockResolvedValue(mockData)

        const { result } = renderHook(() => useVerifySession(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockData)
    })

    it('fails gracefully when no session exists', async () => {
        verifySession.mockRejectedValue({
            response: { data: { message: 'refresh token is missing!' } }
        })

        const { result } = renderHook(() => useVerifySession(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(result.current.data).toBeUndefined()
    })

    it('does not retry on failure', async () => {
        verifySession.mockRejectedValue(new Error('Unauthorized'))

        const { result } = renderHook(() => useVerifySession(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))

        expect(verifySession).toHaveBeenCalledTimes(1)
    })
})

describe('useVerifyUser', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns user data when token is valid', async () => {
        const mockData = {
            user: { role: 'student', email: 'test@test.com' }
        }
        verifyUser.mockResolvedValue(mockData)

        const { result } = renderHook(() => useVerifyUser('valid-token'), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockData)
    })

    it('does not fetch when token is missing', async () => {
        const { result } = renderHook(
            () => useVerifyUser(null, { enabled: false }),
            { wrapper: createWrapper() }
        )

        expect(result.current.fetchStatus).toBe('idle')
        expect(verifyUser).not.toHaveBeenCalled()
    })

    it('returns error when token is invalid', async () => {
        verifyUser.mockRejectedValue({
            response: { data: { message: 'Login Failed!' } }
        })

        const { result } = renderHook(() => useVerifyUser('invalid-token'), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
    })
})

describe('useForgetPassword', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('shows success toast on success', async () => {
        forgetPassword.mockResolvedValue({
            message: 'If an account with this email exists, we will send you a reset link'
        })

        const { result } = renderHook(() => useForgetPassword(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate('test@test.com')
        })

        expect(toast.success).toHaveBeenCalledWith(
            'If an account with this email exists, we will send you a reset link'
        )
    })

    it('shows error toast on failure', async () => {
        forgetPassword.mockRejectedValue({
            response: { data: { message: 'Reset Password Failed' } }
        })

        const { result } = renderHook(() => useForgetPassword(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate('test@test.com')
        })

        expect(toast.error).toHaveBeenCalledWith('Reset Password Failed')
    })

    it('shows fallback error message when no response message', async () => {
        forgetPassword.mockRejectedValue({})

        const { result } = renderHook(() => useForgetPassword(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate('test@test.com')
        })

        expect(toast.error).toHaveBeenCalledWith('Reset Password Failed')
    })
})

describe('useResetPassword', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('shows success toast on successful password reset', async () => {
        resetPassword.mockResolvedValue({
            message: 'Password reset successfully!'
        })

        const { result } = renderHook(() => useResetPassword(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ token: 'reset-token', password: 'newpassword123' })
        })

        expect(toast.success).toHaveBeenCalledWith('Password reset successfully!')
    })

    it('shows error toast on failure', async () => {
        resetPassword.mockRejectedValue({
            response: { data: { message: 'invalid or expired token' } }
        })

        const { result } = renderHook(() => useResetPassword(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ token: 'expired-token', password: 'newpassword123' })
        })

        expect(toast.error).toHaveBeenCalledWith('invalid or expired token')
    })

    it('shows fallback error message when no response message', async () => {
        resetPassword.mockRejectedValue({
            response: { data: {} }
        })

        const { result } = renderHook(() => useResetPassword(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ token: 'bad-token', password: 'newpassword123' })
        })

        expect(toast.error).toHaveBeenCalledWith('Reset Password Failed')
    })
})