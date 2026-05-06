import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// mock organizer api
vi.mock('../api/organizer', () => ({
    getOrganizerDashboard: vi.fn(),
    getRegisteredStudents: vi.fn(),
    markStudentAttendance: vi.fn(),
    organizerAnalytics: vi.fn()
}))

// mock toast
vi.mock('react-hot-toast', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}))

import { getOrganizerDashboard, getRegisteredStudents, markStudentAttendance, organizerAnalytics } from '../api/organizer'
import { toast } from 'react-hot-toast'
import { useGetOrganizerDashboard, useGetRegisteredStudents, useMarkStudentAttendance, useGetOrganizerAnalytics } from '../hooks/useOrganizer'

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

describe('useGetOrganizerDashboard', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns dashboard data on success', async () => {
        const mockData = {
            totalEvents: 10,
            totalRegistrations: 100,
            upcomingEvents: 3
        }
        getOrganizerDashboard.mockResolvedValue(mockData)

        const { result } = renderHook(() => useGetOrganizerDashboard(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockData)
    })

    it('returns error when fetch fails', async () => {
        getOrganizerDashboard.mockRejectedValue(new Error('Failed to fetch'))

        const { result } = renderHook(() => useGetOrganizerDashboard(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
    })
})

describe('useGetRegisteredStudents', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns registered students on success', async () => {
        const mockData = {
            registeredStudent: [
                { student: { _id: 'student-1', fullName: 'John Doe' }, isPresent: false },
                { student: { _id: 'student-2', fullName: 'Jane Doe' }, isPresent: true }
            ]
        }
        getRegisteredStudents.mockResolvedValue(mockData)

        const { result } = renderHook(() => useGetRegisteredStudents('event-1'), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockData)
    })

    it('does not fetch when disabled', async () => {
        const { result } = renderHook(
            () => useGetRegisteredStudents('event-1', { enabled: false }),
            { wrapper: createWrapper() }
        )

        expect(result.current.fetchStatus).toBe('idle')
        expect(getRegisteredStudents).not.toHaveBeenCalled()
    })

    it('returns error when fetch fails', async () => {
        getRegisteredStudents.mockRejectedValue(new Error('Failed to fetch'))

        const { result } = renderHook(() => useGetRegisteredStudents('event-1'), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
    })
})

describe('useMarkStudentAttendance', () => {

    beforeEach(() => vi.clearAllMocks())

    it('shows success toast on successful attendance mark', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['registeredStudents', 'event-1'], {
            registeredStudent: [
                { student: { _id: 'student-1', fullName: 'John Doe' }, isPresent: false },
                { student: { _id: 'student-2', fullName: 'Jane Doe' }, isPresent: false }
            ]
        })

        markStudentAttendance.mockResolvedValue({ message: 'Attendance marked successfully' })

        const { result } = renderHook(() => useMarkStudentAttendance(), { wrapper })

        await act(async () => {
            result.current.mutate({
                eventId: 'event-1',
                data: { studentId: 'student-1', isPresent: true }
            })
        })

        expect(toast.success).toHaveBeenCalledWith('Attendance marked successfully')
    })

    it('applies optimistic update for attendance', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['registeredStudents', 'event-1'], {
            registeredStudent: [
                { student: { _id: 'student-1', fullName: 'John Doe' }, isPresent: false },
                { student: { _id: 'student-2', fullName: 'Jane Doe' }, isPresent: false }
            ]
        })

        markStudentAttendance.mockResolvedValue({ message: 'Attendance marked successfully' })

        const { result } = renderHook(() => useMarkStudentAttendance(), { wrapper })

        await act(async () => {
            result.current.mutate({
                eventId: 'event-1',
                data: { studentId: 'student-1', isPresent: true }
            })
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        const updatedData = queryClient.getQueryData(['registeredStudents', 'event-1'])
        const updatedStudent = updatedData?.registeredStudent?.find(
            r => r.student._id === 'student-1'
        )
        expect(updatedStudent?.isPresent).toBe(true)
    })

    it('rolls back optimistic update on error', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        const originalData = {
            registeredStudent: [
                { student: { _id: 'student-1', fullName: 'John Doe' }, isPresent: false },
                { student: { _id: 'student-2', fullName: 'Jane Doe' }, isPresent: false }
            ]
        }
        queryClient.setQueryData(['registeredStudents', 'event-1'], originalData)

        markStudentAttendance.mockRejectedValue({
            response: { data: { message: 'Failed to mark Attendance' } }
        })

        const { result } = renderHook(() => useMarkStudentAttendance(), { wrapper })

        await act(async () => {
            result.current.mutate({
                eventId: 'event-1',
                data: { studentId: 'student-1', isPresent: true }
            })
        })

        await waitFor(() => expect(result.current.isError).toBe(true))

        const restoredData = queryClient.getQueryData(['registeredStudents', 'event-1'])
        expect(restoredData).toEqual(originalData)
    })

    it('shows error toast on failure', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['registeredStudents', 'event-1'], {
            registeredStudent: [
                { student: { _id: 'student-1', fullName: 'John Doe' }, isPresent: false }
            ]
        })

        markStudentAttendance.mockRejectedValue({
            response: { data: { message: 'Failed to mark Attendance' } }
        })

        const { result } = renderHook(() => useMarkStudentAttendance(), { wrapper })

        await act(async () => {
            result.current.mutate({
                eventId: 'event-1',
                data: { studentId: 'student-1', isPresent: true }
            })
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to mark Attendance')
    })

    it('shows fallback error message when no response message', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['registeredStudents', 'event-1'], {
            registeredStudent: [
                { student: { _id: 'student-1', fullName: 'John Doe' }, isPresent: false }
            ]
        })

        markStudentAttendance.mockRejectedValue({})

        const { result } = renderHook(() => useMarkStudentAttendance(), { wrapper })

        await act(async () => {
            result.current.mutate({
                eventId: 'event-1',
                data: { studentId: 'student-1', isPresent: true }
            })
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to mark Attendance')
    })

    it('invalidates registered students cache on settled', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

        queryClient.setQueryData(['registeredStudents', 'event-1'], {
            registeredStudent: [
                { student: { _id: 'student-1', fullName: 'John Doe' }, isPresent: false }
            ]
        })

        markStudentAttendance.mockResolvedValue({ message: 'Attendance marked successfully' })

        const { result } = renderHook(() => useMarkStudentAttendance(), { wrapper })

        await act(async () => {
            result.current.mutate({
                eventId: 'event-1',
                data: { studentId: 'student-1', isPresent: true }
            })
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(invalidateSpy).toHaveBeenCalledWith({
            queryKey: ['registeredStudents', 'event-1']
        })
    })
})

describe('useGetOrganizerAnalytics', () => {

    beforeEach(() => vi.clearAllMocks())

    it('returns analytics data on success', async () => {
        const mockData = {
            totalEvents: 10,
            totalRegistrations: 200,
            attendanceRate: 85
        }
        organizerAnalytics.mockResolvedValue(mockData)

        const { result } = renderHook(() => useGetOrganizerAnalytics(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockData)
    })

    it('returns error when fetch fails', async () => {
        organizerAnalytics.mockRejectedValue(new Error('Failed to fetch analytics'))

        const { result } = renderHook(() => useGetOrganizerAnalytics(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
    })
})