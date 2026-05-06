import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// mock feedback api
vi.mock('../api/feedback', () => ({
    submitFeedback: vi.fn(),
    getFeedbacks: vi.fn()
}))

// mock toast
vi.mock('react-hot-toast', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}))

import { submitFeedback, getFeedbacks } from '../api/feedback'
import { toast } from 'react-hot-toast'
import { useSubmitFeedback, useGetFeedbacks } from '../hooks/useFeedback'

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

describe('useGetFeedbacks', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns feedbacks on success', async () => {
        const mockData = {
            feedbacks: [
                { _id: '1', comment: 'Great event!', rating: 5 },
                { _id: '2', comment: 'Good event', rating: 4 }
            ]
        }
        getFeedbacks.mockResolvedValue(mockData)

        const { result } = renderHook(() => useGetFeedbacks(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockData)
    })

    it('returns error when fetch fails', async () => {
        getFeedbacks.mockRejectedValue(new Error('Failed to fetch feedbacks'))

        const { result } = renderHook(() => useGetFeedbacks(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
    })
})

describe('useSubmitFeedback', () => {

    beforeEach(() => vi.clearAllMocks())

    it('shows success toast on successful submission', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            title: 'Test Event',
            isfeedBackSubmitted: false
        })

        submitFeedback.mockResolvedValue({ message: 'Feedback Submitted Successfully' })

        const { result } = renderHook(() => useSubmitFeedback(), { wrapper })

        await act(async () => {
            result.current.mutate({ id: 'event-1', rating: 5, comment: 'Great!' })
        })

        expect(toast.success).toHaveBeenCalledWith('Feedback Submitted Successfully')
    })

    it('applies optimistic update before server response', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            title: 'Test Event',
            isfeedBackSubmitted: false
        })

        submitFeedback.mockResolvedValue({ message: 'Feedback Submitted Successfully' })

        const { result } = renderHook(() => useSubmitFeedback(), { wrapper })

        await act(async () => {
            result.current.mutate({ id: 'event-1', rating: 5, comment: 'Great!' })
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        // after success isfeedBackSubmitted should be true
        const updatedEvent = queryClient.getQueryData(['eventDetail', 'event-1'])
        expect(updatedEvent?.isfeedBackSubmitted).toBe(true)
    })

    it('rolls back optimistic update on error', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        const originalEventDetail = {
            _id: 'event-1',
            title: 'Test Event',
            isfeedBackSubmitted: false
        }
        queryClient.setQueryData(['eventDetail', 'event-1'], originalEventDetail)

        submitFeedback.mockRejectedValue({
            response: { data: { message: 'Failed to submit Feedback' } }
        })

        const { result } = renderHook(() => useSubmitFeedback(), { wrapper })

        await act(async () => {
            result.current.mutate({ id: 'event-1', rating: 5, comment: 'Great!' })
        })

        await waitFor(() => expect(result.current.isError).toBe(true))

        const restoredEvent = queryClient.getQueryData(['eventDetail', 'event-1'])
        expect(restoredEvent).toEqual(originalEventDetail)
    })

    it('shows error toast on failure', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            title: 'Test Event',
            isfeedBackSubmitted: false
        })

        submitFeedback.mockRejectedValue({
            response: { data: { message: 'Failed to submit Feedback' } }
        })

        const { result } = renderHook(() => useSubmitFeedback(), { wrapper })

        await act(async () => {
            result.current.mutate({ id: 'event-1', rating: 5, comment: 'Great!' })
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to submit Feedback')
    })

    it('shows fallback error message when no response message', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            title: 'Test Event',
            isfeedBackSubmitted: false
        })

        submitFeedback.mockRejectedValue({})

        const { result } = renderHook(() => useSubmitFeedback(), { wrapper })

        await act(async () => {
            result.current.mutate({ id: 'event-1', rating: 5, comment: 'Great!' })
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to submit Feedback')
    })

    it('invalidates event detail cache on settled', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            title: 'Test Event',
            isfeedBackSubmitted: false
        })

        submitFeedback.mockResolvedValue({ message: 'Feedback Submitted Successfully' })

        const { result } = renderHook(() => useSubmitFeedback(), { wrapper })

        await act(async () => {
            result.current.mutate({ id: 'event-1', rating: 5, comment: 'Great!' })
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(invalidateSpy).toHaveBeenCalledWith({
            queryKey: ['eventDetail', 'event-1']
        })
    })
})