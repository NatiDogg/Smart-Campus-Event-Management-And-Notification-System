import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// mock interest api
vi.mock('../api/interest', () => ({
    markInterest: vi.fn(),
    unMarkInterest: vi.fn()
}))

// mock toast
vi.mock('react-hot-toast', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}))

import { markInterest, unMarkInterest } from '../api/interest'
import { toast } from 'react-hot-toast'
import { useMarkInterest, useUnMarkInterest } from '../hooks/useInterest'

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

describe('useMarkInterest', () => {

    beforeEach(() => vi.clearAllMocks())

    it('shows success toast on success', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            title: 'Test Event',
            isInterested: false
        })

        markInterest.mockResolvedValue({ message: 'Marked Interest Successfully' })

        const { result } = renderHook(() => useMarkInterest(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        expect(toast.success).toHaveBeenCalledWith('Marked Interest Successfully')
    })

    it('applies optimistic update setting isInterested to true', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            title: 'Test Event',
            isInterested: false
        })

        markInterest.mockResolvedValue({ message: 'Marked Interest Successfully' })

        const { result } = renderHook(() => useMarkInterest(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        const updatedEvent = queryClient.getQueryData(['eventDetail', 'event-1'])
        expect(updatedEvent?.isInterested).toBe(true)
    })

    it('shows fallback success toast when no message', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            isInterested: false
        })

        markInterest.mockResolvedValue({})

        const { result } = renderHook(() => useMarkInterest(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        expect(toast.success).toHaveBeenCalledWith('Marked Interest Successfully')
    })

    it('shows error toast on failure', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            isInterested: false
        })

        markInterest.mockRejectedValue({})

        const { result } = renderHook(() => useMarkInterest(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to mark interest')
    })

    it('invalidates relevant caches on settled', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            isInterested: false
        })

        markInterest.mockResolvedValue({ message: 'Marked Interest Successfully' })

        const { result } = renderHook(() => useMarkInterest(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['eventDetail', 'event-1'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['studentEvents'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['studentCalendar'] })
    })
})

describe('useUnMarkInterest', () => {

    beforeEach(() => vi.clearAllMocks())

    it('shows success toast on success', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            title: 'Test Event',
            isInterested: true
        })

        unMarkInterest.mockResolvedValue({ message: 'Unmarked Interest Successfully' })

        const { result } = renderHook(() => useUnMarkInterest(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        expect(toast.success).toHaveBeenCalledWith('Unmarked Interest Successfully')
    })

    it('applies optimistic update setting isInterested to false', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            title: 'Test Event',
            isInterested: true
        })

        unMarkInterest.mockResolvedValue({ message: 'Unmarked Interest Successfully' })

        const { result } = renderHook(() => useUnMarkInterest(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        const updatedEvent = queryClient.getQueryData(['eventDetail', 'event-1'])
        expect(updatedEvent?.isInterested).toBe(false)
    })

    it('shows fallback success toast when no message', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            isInterested: true
        })

        unMarkInterest.mockResolvedValue({})

        const { result } = renderHook(() => useUnMarkInterest(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        expect(toast.success).toHaveBeenCalledWith('Unmarked Interest Successfully')
    })

    it('shows error toast on failure', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            isInterested: true
        })

        unMarkInterest.mockRejectedValue({})

        const { result } = renderHook(() => useUnMarkInterest(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to unmark interest')
    })

    it('invalidates relevant caches on settled', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            isInterested: true
        })

        unMarkInterest.mockResolvedValue({ message: 'Unmarked Interest Successfully' })

        const { result } = renderHook(() => useUnMarkInterest(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['eventDetail', 'event-1'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['studentEvents'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['studentCalendar'] })
    })
})