import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// mock auditLog api
vi.mock('../api/auditLog', () => ({
    getAuditLog: vi.fn()
}))

import { getAuditLog } from '../api/auditLog'
import { useAuditLog } from '../hooks/useAuditLog'

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

describe('useAuditLog', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns first page of logs on success', async () => {
        const mockPage1 = {
            logs: [
                { _id: '1', action: 'LOGIN', userId: 'user1' },
                { _id: '2', action: 'LOGOUT', userId: 'user2' }
            ]
        }
        getAuditLog.mockResolvedValue(mockPage1)

        const { result } = renderHook(() => useAuditLog(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data.pages[0]).toEqual(mockPage1)
        expect(result.current.data.pages).toHaveLength(1)
    })

    it('starts with page 1 as initial page param', async () => {
        getAuditLog.mockResolvedValue({ logs: [] })

        const { result } = renderHook(() => useAuditLog(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        // first call should have pageParam 1
        expect(getAuditLog).toHaveBeenCalledWith(
            expect.objectContaining({ pageParam: 1 })
        )
    })

    it('returns error when fetch fails', async () => {
        getAuditLog.mockRejectedValue(new Error('Failed to fetch audit logs'))

        const { result } = renderHook(() => useAuditLog(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
    })

    it('has next page when logs are returned', async () => {
        getAuditLog.mockResolvedValue({
            logs: [
                { _id: '1', action: 'LOGIN', userId: 'user1' },
                { _id: '2', action: 'LOGOUT', userId: 'user2' }
            ]
        })

        const { result } = renderHook(() => useAuditLog(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.hasNextPage).toBe(true)
    })

    it('has no next page when logs array is empty', async () => {
        getAuditLog.mockResolvedValue({ logs: [] })

        const { result } = renderHook(() => useAuditLog(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.hasNextPage).toBe(false)
    })

    it('fetchNextPage is available when there is a next page', async () => {
    getAuditLog.mockResolvedValue({
        logs: [{ _id: '1', action: 'LOGIN', userId: 'user1' }]
    })

    const { result } = renderHook(() => useAuditLog(), {
        wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.hasNextPage).toBe(true)
    expect(typeof result.current.fetchNextPage).toBe('function')
})

it('stops fetching when empty page is returned', async () => {
    const mockPage1 = {
        logs: [{ _id: '1', action: 'LOGIN', userId: 'user1' }]
    }
    const mockPage2 = { logs: [] }

    getAuditLog
        .mockResolvedValueOnce(mockPage1)
        .mockResolvedValueOnce(mockPage2)

    const { result } = renderHook(() => useAuditLog(), {
        wrapper: createWrapper()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    await waitFor(() => expect(result.current.hasNextPage).toBe(true))

    await act(async () => {
        await result.current.fetchNextPage()
    })

    await waitFor(() => expect(result.current.data.pages).toHaveLength(2))

    expect(result.current.hasNextPage).toBe(false)
})
})