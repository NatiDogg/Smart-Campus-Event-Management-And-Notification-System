import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// mock event api
vi.mock('../api/event', () => ({
    createEvent: vi.fn(),
    editEvent: vi.fn(),
    cancelEvent: vi.fn(),
    getPendingEvents: vi.fn(),
    approveEvent: vi.fn(),
    rejectEvent: vi.fn(),
    getAdminAllEvents: vi.fn(),
    getOrganizerAllEvents: vi.fn(),
    getAllEvents: vi.fn(),
    getEventDetails: vi.fn()
}))

// mock toast
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn()
    }
}))

import { createEvent, editEvent, cancelEvent, getPendingEvents, approveEvent, rejectEvent, getAdminAllEvents, getOrganizerAllEvents, getAllEvents, getEventDetails } from '../api/event'
import toast from 'react-hot-toast'
import { useCreateEvent, useEditEvent, useCancelEvent, useGetPendingEvents, useApproveEvent, useRejectEvent, useGetAdminAllEvents, useGetOrganizerAllEvents, useGetAllEvents, useGetEventDetails } from '../hooks/useEvent'

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

describe('useCreateEvent', () => {

    beforeEach(() => vi.clearAllMocks())

    it('shows success toast and invalidates cache on success', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
        createEvent.mockResolvedValue({ message: 'Event created successfully' })

        const { result } = renderHook(() => useCreateEvent(), { wrapper })

        await act(async () => {
            result.current.mutate({ title: 'Test Event' })
        })

        expect(toast.success).toHaveBeenCalledWith('Event created successfully')
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['organizerDashboard'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['organizerAllEvents'] })
    })

    it('shows error toast on failure', async () => {
        createEvent.mockRejectedValue({
            response: { data: { message: 'Failed to create Event' } }
        })

        const { result } = renderHook(() => useCreateEvent(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ title: 'Test Event' })
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to create Event')
    })

    it('shows fallback error message when no response message', async () => {
        createEvent.mockRejectedValue({})

        const { result } = renderHook(() => useCreateEvent(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ title: 'Test Event' })
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to create Event')
    })
})

describe('useEditEvent', () => {

    beforeEach(() => vi.clearAllMocks())

    it('shows success toast and invalidates cache on success', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
        editEvent.mockResolvedValue({ message: 'Event updated successfully' })

        const { result } = renderHook(() => useEditEvent(), { wrapper })

        await act(async () => {
            result.current.mutate({ id: 'event-1', title: 'Updated Event' })
        })

        expect(toast.success).toHaveBeenCalledWith('Event updated successfully')
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['organizerDashboard'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['organizerAllEvents'] })
    })

    it('shows error toast on failure', async () => {
        editEvent.mockRejectedValue({
            response: { data: { message: 'Failed to edit Event' } }
        })

        const { result } = renderHook(() => useEditEvent(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ id: 'event-1', title: 'Updated Event' })
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to edit Event')
    })

    it('shows fallback error message when no response message', async () => {
        editEvent.mockRejectedValue({})

        const { result } = renderHook(() => useEditEvent(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ id: 'event-1' })
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to edit Event')
    })
})

describe('useCancelEvent', () => {

    beforeEach(() => vi.clearAllMocks())

    it('shows success toast and invalidates cache on success', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
        cancelEvent.mockResolvedValue({ message: 'Event cancelled successfully' })

        const { result } = renderHook(() => useCancelEvent(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        expect(toast.success).toHaveBeenCalledWith('Event cancelled successfully')
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['organizerDashboard'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['organizerAllEvents'] })
    })

    it('shows error toast on failure', async () => {
        cancelEvent.mockRejectedValue({
            response: { data: { message: 'Failed to Delete Event' } }
        })

        const { result } = renderHook(() => useCancelEvent(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate('event-1')
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to Delete Event')
    })

    it('shows fallback error when no response message', async () => {
        cancelEvent.mockRejectedValue({})

        const { result } = renderHook(() => useCancelEvent(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate('event-1')
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to Delete Event')
    })
})

describe('useGetPendingEvents', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns pending events on success', async () => {
        const mockData = {
            events: [
                { _id: '1', title: 'Event 1', status: 'pending' },
                { _id: '2', title: 'Event 2', status: 'pending' }
            ]
        }
        getPendingEvents.mockResolvedValue(mockData)

        const { result } = renderHook(() => useGetPendingEvents(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockData)
    })

    it('returns error when fetch fails', async () => {
        getPendingEvents.mockRejectedValue(new Error('Failed to fetch'))

        const { result } = renderHook(() => useGetPendingEvents(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
    })
})

describe('useApproveEvent', () => {

    beforeEach(() => vi.clearAllMocks())

    it('shows success toast on approval', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['pendingEvents'], {
            events: [
                { _id: 'event-1', title: 'Event 1' },
                { _id: 'event-2', title: 'Event 2' }
            ]
        })

        approveEvent.mockResolvedValue({ message: 'Event Approved Successfully' })

        const { result } = renderHook(() => useApproveEvent(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        expect(toast.success).toHaveBeenCalledWith('Event Approved Successfully')
    })

    it('applies optimistic update on approve', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['pendingEvents'], {
            events: [
                { _id: 'event-1', title: 'Event 1' },
                { _id: 'event-2', title: 'Event 2' }
            ]
        })

        approveEvent.mockResolvedValue({ message: 'Event Approved Successfully' })

        const { result } = renderHook(() => useApproveEvent(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        const updatedEvents = queryClient.getQueryData(['pendingEvents'])
        expect(updatedEvents?.events?.find(e => e._id === 'event-1')).toBeUndefined()
    })

    it('rolls back optimistic update on error', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        const originalData = {
            events: [
                { _id: 'event-1', title: 'Event 1' },
                { _id: 'event-2', title: 'Event 2' }
            ]
        }
        queryClient.setQueryData(['pendingEvents'], originalData)

        approveEvent.mockRejectedValue({
            response: { data: { message: 'Failed to approve Event' } }
        })

        const { result } = renderHook(() => useApproveEvent(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        await waitFor(() => expect(result.current.isError).toBe(true))

        const restoredData = queryClient.getQueryData(['pendingEvents'])
        expect(restoredData).toEqual(originalData)
    })

    it('shows error toast on failure', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['pendingEvents'], {
            events: [{ _id: 'event-1', title: 'Event 1' }]
        })

        approveEvent.mockRejectedValue({
            response: { data: { message: 'Failed to approve Event' } }
        })

        const { result } = renderHook(() => useApproveEvent(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to approve Event')
    })
})

describe('useRejectEvent', () => {

    beforeEach(() => vi.clearAllMocks())

    it('shows success toast on rejection', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['pendingEvents'], {
            events: [{ _id: 'event-1', title: 'Event 1' }]
        })

        rejectEvent.mockResolvedValue({ message: 'Event Rejected Successfully' })

        const { result } = renderHook(() => useRejectEvent(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        expect(toast.success).toHaveBeenCalledWith('Event Rejected Successfully')
    })

    it('rolls back optimistic update on error', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        const originalData = {
            events: [
                { _id: 'event-1', title: 'Event 1' },
                { _id: 'event-2', title: 'Event 2' }
            ]
        }
        queryClient.setQueryData(['pendingEvents'], originalData)

        rejectEvent.mockRejectedValue({
            response: { data: { message: 'Failed to reject Event' } }
        })

        const { result } = renderHook(() => useRejectEvent(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        await waitFor(() => expect(result.current.isError).toBe(true))

        const restoredData = queryClient.getQueryData(['pendingEvents'])
        expect(restoredData).toEqual(originalData)
    })

    it('shows error toast on failure', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['pendingEvents'], {
            events: [{ _id: 'event-1', title: 'Event 1' }]
        })

        rejectEvent.mockRejectedValue({
            response: { data: { message: 'Failed to reject Event' } }
        })

        const { result } = renderHook(() => useRejectEvent(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to reject Event')
    })
})

describe('useGetAdminAllEvents', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns all events on success', async () => {
        const mockData = { events: [{ _id: '1', title: 'Event 1' }] }
        getAdminAllEvents.mockResolvedValue(mockData)

        const { result } = renderHook(() => useGetAdminAllEvents(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockData)
    })

    it('returns error when fetch fails', async () => {
        getAdminAllEvents.mockRejectedValue(new Error('Failed to fetch'))

        const { result } = renderHook(() => useGetAdminAllEvents(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
    })
})

describe('useGetOrganizerAllEvents', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns organizer events on success', async () => {
        const mockData = { events: [{ _id: '1', title: 'My Event' }] }
        getOrganizerAllEvents.mockResolvedValue(mockData)

        const { result } = renderHook(() => useGetOrganizerAllEvents(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockData)
    })

    it('returns error when fetch fails', async () => {
        getOrganizerAllEvents.mockRejectedValue(new Error('Failed to fetch'))

        const { result } = renderHook(() => useGetOrganizerAllEvents(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
    })
})

describe('useGetAllEvents', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns all events on success', async () => {
        const mockData = { events: [{ _id: '1', title: 'Event 1' }] }
        getAllEvents.mockResolvedValue(mockData)

        const { result } = renderHook(() => useGetAllEvents(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockData)
    })

    it('returns error when fetch fails', async () => {
        getAllEvents.mockRejectedValue(new Error('Failed to fetch'))

        const { result } = renderHook(() => useGetAllEvents(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
    })
})

describe('useGetEventDetails', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns event details on success', async () => {
        const mockData = { _id: 'event-1', title: 'Event 1', location: 'Hall A' }
        getEventDetails.mockResolvedValue(mockData)

        const { result } = renderHook(() => useGetEventDetails('event-1'), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockData)
    })

    it('does not fetch when disabled', async () => {
        const { result } = renderHook(
            () => useGetEventDetails(null, { enabled: false }),
            { wrapper: createWrapper() }
        )

        expect(result.current.fetchStatus).toBe('idle')
        expect(getEventDetails).not.toHaveBeenCalled()
    })

    it('returns error when fetch fails', async () => {
        getEventDetails.mockRejectedValue(new Error('Event not found'))

        const { result } = renderHook(() => useGetEventDetails('bad-id'), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
    })
})