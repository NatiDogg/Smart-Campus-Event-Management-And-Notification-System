import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// mock user api
vi.mock('../api/user.js', () => ({
    updateProfile: vi.fn()
}))

// mock toast
vi.mock('react-hot-toast', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}))

import { updateProfile } from '../api/user.js'
import { toast } from 'react-hot-toast'
import { useUpdateProfile } from '../hooks/useProfile'

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false }
        }
    })
    return ({ children }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

describe('useUpdateProfile', () => {

    beforeEach(() => vi.clearAllMocks())

    it('shows success toast on successful profile update', async () => {
        updateProfile.mockResolvedValue({ message: 'Profile updated successfully' })

        const { result } = renderHook(() => useUpdateProfile(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ fullName: 'John Doe', profile: 'image-url' })
        })

        expect(toast.success).toHaveBeenCalledWith('Profile updated successfully')
    })

    it('shows error toast on failure', async () => {
        updateProfile.mockRejectedValue({
            response: { data: { message: 'Failed to update Profile' } }
        })

        const { result } = renderHook(() => useUpdateProfile(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ fullName: 'John Doe' })
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to update Profile')
    })

    it('shows fallback error message when no response message', async () => {
        updateProfile.mockRejectedValue({})

        const { result } = renderHook(() => useUpdateProfile(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ fullName: 'John Doe' })
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to update Profile')
    })

    
})