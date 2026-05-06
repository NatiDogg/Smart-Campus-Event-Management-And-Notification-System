import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// mock student api
vi.mock('../api/student', () => ({
    subscribeCategory: vi.fn(),
    getSubscribedCategories: vi.fn(),
    getRecommendations: vi.fn(),
    getStudentEvents: vi.fn(),
    getAnnouncements: vi.fn(),
    getCalendarData: vi.fn()
}))

// mock toast
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn()
    }
}))

import { subscribeCategory, getSubscribedCategories, getRecommendations, getStudentEvents, getAnnouncements, getCalendarData } from '../api/student'
import toast from 'react-hot-toast'
import { useGetSubscribedCategories, useSubscribeCategory, useGetRecommendations, useGetStudentEvents, useGetAnnouncements, useGetCalendarData } from '../hooks/useStudent'

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

describe('useGetSubscribedCategories', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns subscribed categories on success', async () => {
        const mockData = {
            categories: [
                { _id: '1', name: 'Music' },
                { _id: '2', name: 'Sports' }
            ]
        }
        getSubscribedCategories.mockResolvedValue(mockData)

        const { result } = renderHook(() => useGetSubscribedCategories(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockData)
    })

    it('returns error when fetch fails', async () => {
        getSubscribedCategories.mockRejectedValue(new Error('Failed to fetch'))

        const { result } = renderHook(() => useGetSubscribedCategories(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
    })
})

describe('useSubscribeCategory', () => {

    beforeEach(() => vi.clearAllMocks())

    it('shows success toast and invalidates caches on success', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

        subscribeCategory.mockResolvedValue({ message: 'Subscribed successfully' })

        const { result } = renderHook(() => useSubscribeCategory(), { wrapper })

        await act(async () => {
            result.current.mutate({ categoryId: 'cat-1' })
        })

        expect(toast.success).toHaveBeenCalledWith('Subscribed successfully')
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['subscribedCategories'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['studentEvents'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['studentCalendar'] })
    })

    it('shows error toast on failure', async () => {
        subscribeCategory.mockRejectedValue({
            response: { data: { message: 'Failed to save changes' } }
        })

        const { result } = renderHook(() => useSubscribeCategory(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ categoryId: 'cat-1' })
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to save changes')
    })

    it('shows fallback error message when no response message', async () => {
        subscribeCategory.mockRejectedValue({})

        const { result } = renderHook(() => useSubscribeCategory(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ categoryId: 'cat-1' })
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to save changes')
    })
})

describe('useGetRecommendations', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns recommendations on success', async () => {
        const mockData = {
            recommendations: [
                { _id: '1', title: 'Music Event' },
                { _id: '2', title: 'Sports Event' }
            ]
        }
        getRecommendations.mockResolvedValue(mockData)

        const { result } = renderHook(() => useGetRecommendations(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockData)
    })

    it('returns error when fetch fails', async () => {
        getRecommendations.mockRejectedValue(new Error('Failed to fetch recommendations'))

        const { result } = renderHook(() => useGetRecommendations(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
    })
})

describe('useGetStudentEvents', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns student events on success', async () => {
        const mockData = {
            events: [
                { _id: '1', title: 'Event 1' },
                { _id: '2', title: 'Event 2' }
            ]
        }
        getStudentEvents.mockResolvedValue(mockData)

        const { result } = renderHook(() => useGetStudentEvents(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockData)
    })

    it('returns error when fetch fails', async () => {
        getStudentEvents.mockRejectedValue(new Error('Failed to fetch events'))

        const { result } = renderHook(() => useGetStudentEvents(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
    })
})

describe('useGetAnnouncements', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns announcements on success', async () => {
        const mockData = {
            announcements: [
                { _id: '1', title: 'Announcement 1' },
                { _id: '2', title: 'Announcement 2' }
            ]
        }
        getAnnouncements.mockResolvedValue(mockData)

        const { result } = renderHook(() => useGetAnnouncements(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockData)
    })

    it('returns error when fetch fails', async () => {
        getAnnouncements.mockRejectedValue(new Error('Failed to fetch announcements'))

        const { result } = renderHook(() => useGetAnnouncements(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
    })
})

describe('useGetCalendarData', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns calendar data on success', async () => {
        const mockData = {
            events: [
                { _id: '1', title: 'Event 1', startDate: '2026-05-01' },
                { _id: '2', title: 'Event 2', startDate: '2026-05-15' }
            ]
        }
        getCalendarData.mockResolvedValue(mockData)

        const { result } = renderHook(() => useGetCalendarData(5, 2026), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockData)
    })

    it('calls getCalendarData with correct month and year', async () => {
        getCalendarData.mockResolvedValue({ events: [] })

        const { result } = renderHook(() => useGetCalendarData(5, 2026), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(getCalendarData).toHaveBeenCalledWith(5, 2026)
    })

    it('returns error when fetch fails', async () => {
        getCalendarData.mockRejectedValue(new Error('Failed to fetch calendar data'))

        const { result } = renderHook(() => useGetCalendarData(5, 2026), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
    })

    it('uses different query keys for different month and year', async () => {
        getCalendarData.mockResolvedValue({ events: [] })

        const { wrapper, queryClient } = createWrapperWithClient()

        const { result: result1 } = renderHook(() => useGetCalendarData(5, 2026), { wrapper })
        const { result: result2 } = renderHook(() => useGetCalendarData(6, 2026), { wrapper })

        await waitFor(() => expect(result1.current.isSuccess).toBe(true))
        await waitFor(() => expect(result2.current.isSuccess).toBe(true))

        // both should have been called with different params
        expect(getCalendarData).toHaveBeenCalledWith(5, 2026)
        expect(getCalendarData).toHaveBeenCalledWith(6, 2026)
    })
})