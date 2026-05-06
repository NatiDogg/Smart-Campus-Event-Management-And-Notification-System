import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// mock user api
vi.mock('../api/user', () => ({
    getAllOrganizers: vi.fn()
}))

import { getAllOrganizers } from '../api/user'
import { useGetAllOrganizers } from '../hooks/useUser'

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

describe('useGetAllOrganizers', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns organizers on success', async () => {
        const mockData = {
            organizers: [
                { _id: '1', fullName: 'John Doe', email: 'john@test.com' },
                { _id: '2', fullName: 'Jane Doe', email: 'jane@test.com' }
            ]
        }
        getAllOrganizers.mockResolvedValue(mockData)

        const { result } = renderHook(() => useGetAllOrganizers(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockData)
    })

    it('returns empty organizers list when no organizers exist', async () => {
        getAllOrganizers.mockResolvedValue({ organizers: [] })

        const { result } = renderHook(() => useGetAllOrganizers(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data.organizers).toHaveLength(0)
    })

    it('returns error when fetch fails', async () => {
        getAllOrganizers.mockRejectedValue(new Error('Failed to fetch organizers'))

        const { result } = renderHook(() => useGetAllOrganizers(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
    })

    it('does not refetch on window focus', async () => {
        getAllOrganizers.mockResolvedValue({ organizers: [] })

        const { result } = renderHook(() => useGetAllOrganizers(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        // simulate window focus
        window.dispatchEvent(new Event('focus'))

        // should still only be called once
        expect(getAllOrganizers).toHaveBeenCalledTimes(1)
    })
})