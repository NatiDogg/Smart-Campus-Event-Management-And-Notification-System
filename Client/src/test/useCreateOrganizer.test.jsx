import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// mock createOrganizer api
vi.mock('../api/createOrganizer', () => ({
    createOrganizer: vi.fn()
}))

// mock toast
vi.mock('react-hot-toast', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}))

import { createOrganizer } from '../api/createOrganizer'
import { toast } from 'react-hot-toast'
import { useCreateOrganizer } from '../hooks/useCreateOrganizer'

const createWrapperWithClient = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false }
        }
    })
    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
    return { wrapper, queryClient }
}

describe('useCreateOrganizer', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('shows success toast on successful organizer creation', async () => {
        const { wrapper } = createWrapperWithClient()
        createOrganizer.mockResolvedValue({ message: 'Organizer invited successfully' })

        const { result } = renderHook(() => useCreateOrganizer(), { wrapper })

        await act(async () => {
            result.current.mutate({ email: 'organizer@test.com', fullName: 'John Doe' })
        })

        expect(toast.success).toHaveBeenCalledWith('Organizer invited successfully')
    })

    it('invalidates users and adminDashboard cache on success', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

        createOrganizer.mockResolvedValue({ message: 'Organizer invited successfully' })

        const { result } = renderHook(() => useCreateOrganizer(), { wrapper })

        await act(async () => {
            result.current.mutate({ email: 'organizer@test.com', fullName: 'John Doe' })
        })

        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['users'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['adminDashboard'] })
    })

    it('shows error toast on failure', async () => {
        const { wrapper } = createWrapperWithClient()
        createOrganizer.mockRejectedValue({
            response: { data: { message: 'Email already exists' } }
        })

        const { result } = renderHook(() => useCreateOrganizer(), { wrapper })

        await act(async () => {
            result.current.mutate({ email: 'existing@test.com', fullName: 'John Doe' })
        })

        expect(toast.error).toHaveBeenCalledWith('Email already exists')
    })

    it('shows fallback error message when no response message', async () => {
        const { wrapper } = createWrapperWithClient()
        createOrganizer.mockRejectedValue({})

        const { result } = renderHook(() => useCreateOrganizer(), { wrapper })

        await act(async () => {
            result.current.mutate({ email: 'test@test.com', fullName: 'John Doe' })
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to Invite organizer')
    })
})