import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// mock notification api
vi.mock('../api/notification', () => ({
    getNotification: vi.fn(),
    deleteNotification: vi.fn()
}))

// mock toast
vi.mock('react-hot-toast', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}))

import { getNotification, deleteNotification } from '../api/notification'
import { toast } from 'react-hot-toast'
import { useGetNotification, useDeleteNotification } from '../hooks/useNotification'

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

describe('useGetNotification', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns notifications on success', async () => {
        const mockData = {
            notifications: [
                { _id: '1', subject: 'Event approved' },
                { _id: '2', subject: 'New announcement' }
            ]
        }
        getNotification.mockResolvedValue(mockData)

        const { result } = renderHook(() => useGetNotification(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        // select transforms the data to just notifications array
        expect(result.current.data).toEqual(mockData.notifications)
    })

    it('returns only the notifications array via select', async () => {
        const mockData = {
            notifications: [
                { _id: '1', subject: 'Event approved' }
            ]
        }
        getNotification.mockResolvedValue(mockData)

        const { result } = renderHook(() => useGetNotification(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        // should return array directly not the whole object
        expect(Array.isArray(result.current.data)).toBe(true)
        expect(result.current.data).toHaveLength(1)
    })

    it('returns error when fetch fails', async () => {
        getNotification.mockRejectedValue(new Error('Failed to fetch notifications'))

        const { result } = renderHook(() => useGetNotification(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
    })
})

describe('useDeleteNotification', () => {

    beforeEach(() => vi.clearAllMocks())

    it('shows success toast on successful delete', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['notifications'], {
            notifications: [
                { _id: 'notif-1', subject: 'Event approved' },
                { _id: 'notif-2', subject: 'New announcement' }
            ]
        })

        deleteNotification.mockResolvedValue({ message: 'Notification deleted successfully' })

        const { result } = renderHook(() => useDeleteNotification(), { wrapper })

        await act(async () => {
            result.current.mutate('notif-1')
        })

        expect(toast.success).toHaveBeenCalledWith('Notification deleted successfully')
    })

    it('applies optimistic update removing the notification', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['notifications'], {
            notifications: [
                { _id: 'notif-1', subject: 'Event approved' },
                { _id: 'notif-2', subject: 'New announcement' }
            ]
        })

        deleteNotification.mockResolvedValue({ message: 'Notification deleted successfully' })

        const { result } = renderHook(() => useDeleteNotification(), { wrapper })

        await act(async () => {
            result.current.mutate('notif-1')
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        const updatedData = queryClient.getQueryData(['notifications'])
        expect(updatedData?.notifications?.find(n => n._id === 'notif-1')).toBeUndefined()
        expect(updatedData?.notifications?.find(n => n._id === 'notif-2')).toBeDefined()
    })

    it('rolls back optimistic update on error', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        const originalData = {
            notifications: [
                { _id: 'notif-1', subject: 'Event approved' },
                { _id: 'notif-2', subject: 'New announcement' }
            ]
        }
        queryClient.setQueryData(['notifications'], originalData)

        deleteNotification.mockRejectedValue({
            response: { data: { message: 'Failed to Delete Notification' } }
        })

        const { result } = renderHook(() => useDeleteNotification(), { wrapper })

        await act(async () => {
            result.current.mutate('notif-1')
        })

        await waitFor(() => expect(result.current.isError).toBe(true))

        const restoredData = queryClient.getQueryData(['notifications'])
        expect(restoredData).toEqual(originalData)
    })

    it('shows error toast on failure', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['notifications'], {
            notifications: [{ _id: 'notif-1', subject: 'Event approved' }]
        })

        deleteNotification.mockRejectedValue({
            response: { data: { message: 'Failed to Delete Notification' } }
        })

        const { result } = renderHook(() => useDeleteNotification(), { wrapper })

        await act(async () => {
            result.current.mutate('notif-1')
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to Delete Notification')
    })

    it('shows fallback error message when no response message', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['notifications'], {
            notifications: [{ _id: 'notif-1', subject: 'Event approved' }]
        })

        deleteNotification.mockRejectedValue({})

        const { result } = renderHook(() => useDeleteNotification(), { wrapper })

        await act(async () => {
            result.current.mutate('notif-1')
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to Delete Notification')
    })

    it('invalidates notifications cache on settled', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

        queryClient.setQueryData(['notifications'], {
            notifications: [{ _id: 'notif-1', subject: 'Event approved' }]
        })

        deleteNotification.mockResolvedValue({ message: 'Notification deleted successfully' })

        const { result } = renderHook(() => useDeleteNotification(), { wrapper })

        await act(async () => {
            result.current.mutate('notif-1')
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['notifications'] })
    })
})