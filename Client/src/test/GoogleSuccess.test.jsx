import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AppContext } from '../context/ContextProvider'
import GoogleSuccess from '../route/GoogleSuccess'

// mock useVerifyUser hook
vi.mock('../hooks/useAuth', () => ({
    useVerifyUser: vi.fn()
}))

// mock api
vi.mock('../api/axios', () => ({
    default: {
        defaults: {
            headers: {
                common: {}
            }
        }
    }
}))

import { useVerifyUser } from '../hooks/useAuth'
import api from '../api/axios'

const mockNavigate = vi.fn()

// mock react-router-dom navigate
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate
    }
})

const renderWithProviders = (url, contextValues = {}) => {
    const defaultContext = {
        setToken: vi.fn(),
        setUser: vi.fn(),
        ...contextValues
    }

    return render(
        <AppContext.Provider value={defaultContext}>
            <MemoryRouter initialEntries={[url]}>
                <Routes>
                    <Route path="/auth/success" element={<GoogleSuccess />} />
                </Routes>
            </MemoryRouter>
        </AppContext.Provider>
    )
}

describe('GoogleSuccess', () => {

    beforeEach(() => {
        vi.clearAllMocks()
        api.defaults.headers.common = {}
    })

    it('shows loading spinner while verifying', () => {
        useVerifyUser.mockReturnValue({
            data: null,
            isSuccess: false,
            isError: false,
            error: null
        })

        renderWithProviders('/auth/success?token=fake-token')

        expect(screen.getByText('Setting up your CampusEvents account...')).toBeInTheDocument()
    })

    it('redirects to /login when no token in URL', () => {
        useVerifyUser.mockReturnValue({
            data: null,
            isSuccess: false,
            isError: false,
            error: null
        })

        renderWithProviders('/auth/success') // no token

        expect(mockNavigate).toHaveBeenCalledWith('/login')
    })

    it('redirects to role dashboard on successful verification', async () => {
        const setToken = vi.fn()
        const setUser = vi.fn()

        useVerifyUser.mockReturnValue({
            data: { user: { role: 'student', email: 'test@test.com' } },
            isSuccess: true,
            isError: false,
            error: null
        })

        renderWithProviders('/auth/success?token=valid-token', { setToken, setUser })

        await waitFor(() => {
            expect(setToken).toHaveBeenCalledWith('valid-token')
            expect(setUser).toHaveBeenCalledWith({ role: 'student', email: 'test@test.com' })
            expect(api.defaults.headers.common['Authorization']).toBe('Bearer valid-token')
            expect(mockNavigate).toHaveBeenCalledWith('/student', { replace: true })
        })
    })

    it('redirects to /login when verification fails', async () => {
        useVerifyUser.mockReturnValue({
            data: null,
            isSuccess: false,
            isError: true,
            error: new Error('Token invalid')
        })

        renderWithProviders('/auth/success?token=invalid-token')

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
        })
    })

    it('sets authorization header correctly after success', async () => {
        useVerifyUser.mockReturnValue({
            data: { user: { role: 'organizer', email: 'org@test.com' } },
            isSuccess: true,
            isError: false,
            error: null
        })

        renderWithProviders('/auth/success?token=org-token')

        await waitFor(() => {
            expect(api.defaults.headers.common['Authorization']).toBe('Bearer org-token')
            expect(mockNavigate).toHaveBeenCalledWith('/organizer', { replace: true })
        })
    })
})