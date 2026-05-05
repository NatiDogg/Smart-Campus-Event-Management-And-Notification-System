import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProtectedRoute from '../route/ProtectedRoute'
import { AppContext } from '../context/ContextProvider'

// helper to render with context and router
const renderWithProviders = (ui, { user = null } = {}) => {
    return render(
        <AppContext.Provider value={{ user }}>
            <MemoryRouter>
                {ui}
            </MemoryRouter>
        </AppContext.Provider>
    )
}

describe('ProtectedRoute', () => {

    it('redirects to /login when user is not logged in', () => {
        renderWithProviders(
            <ProtectedRoute role="student">
                <div>Student Dashboard</div>
            </ProtectedRoute>,
            { user: null }
        )
        // children should not be visible
        expect(screen.queryByText('Student Dashboard')).not.toBeInTheDocument()
    })

    it('redirects to /login when user has no role', () => {
        renderWithProviders(
            <ProtectedRoute role="student">
                <div>Student Dashboard</div>
            </ProtectedRoute>,
            { user: { email: 'test@test.com' } } // no role
        )
        expect(screen.queryByText('Student Dashboard')).not.toBeInTheDocument()
    })

    it('renders children when user role matches', () => {
        renderWithProviders(
            <ProtectedRoute role="student">
                <div>Student Dashboard</div>
            </ProtectedRoute>,
            { user: { role: 'student', email: 'test@test.com' } }
        )
        expect(screen.getByText('Student Dashboard')).toBeInTheDocument()
    })

    it('redirects to own dashboard when role does not match', () => {
        renderWithProviders(
            <ProtectedRoute role="admin">
                <div>Admin Dashboard</div>
            </ProtectedRoute>,
            { user: { role: 'student', email: 'test@test.com' } }
        )
        // admin content should not be visible to a student
        expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument()
    })

    it('is case insensitive for role matching', () => {
        renderWithProviders(
            <ProtectedRoute role="Student">
                <div>Student Dashboard</div>
            </ProtectedRoute>,
            { user: { role: 'STUDENT', email: 'test@test.com' } }
        )
        expect(screen.getByText('Student Dashboard')).toBeInTheDocument()
    })

})