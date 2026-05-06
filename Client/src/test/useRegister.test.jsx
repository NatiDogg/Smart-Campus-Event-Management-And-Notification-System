import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// mock registration api
vi.mock('../api/registration', () => ({
    registerStudent: vi.fn(),
    unregisterStudent: vi.fn()
}))

// mock toast
vi.mock('react-hot-toast', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}))

import { registerStudent, unregisterStudent } from '../api/registration'
import { toast } from 'react-hot-toast'
import { useRegisterStudent, useUnregisterStudent } from '../hooks/useRegister'

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

describe('useRegisterStudent', () => {

    beforeEach(() => vi.clearAllMocks())

    it('shows success toast on successful registration', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            title: 'Test Event',
            isRegistered: false,
            registeredStudents: []
        })

        registerStudent.mockResolvedValue({ message: 'Registered Successfully!' })

        const { result } = renderHook(() => useRegisterStudent(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        expect(toast.success).toHaveBeenCalledWith('Registered Successfully!')
    })

    it('applies optimistic update setting isRegistered to true', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            title: 'Test Event',
            isRegistered: false,
            registeredStudents: []
        })

        registerStudent.mockResolvedValue({ message: 'Registered Successfully!' })

        const { result } = renderHook(() => useRegisterStudent(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        const updatedEvent = queryClient.getQueryData(['eventDetail', 'event-1'])
        expect(updatedEvent?.isRegistered).toBe(true)
        expect(updatedEvent?.registeredStudents).toHaveLength(1)
    })

    it('rolls back optimistic update on error', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        const originalData = {
            _id: 'event-1',
            title: 'Test Event',
            isRegistered: false,
            registeredStudents: []
        }
        queryClient.setQueryData(['eventDetail', 'event-1'], originalData)

        registerStudent.mockRejectedValue({
            response: { data: { message: 'Registration Failed' } }
        })

        const { result } = renderHook(() => useRegisterStudent(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        await waitFor(() => expect(result.current.isError).toBe(true))

        const restoredData = queryClient.getQueryData(['eventDetail', 'event-1'])
        expect(restoredData).toEqual(originalData)
    })

    it('shows error toast on failure', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            isRegistered: false,
            registeredStudents: []
        })

        registerStudent.mockRejectedValue({
            response: { data: { message: 'Registration Failed' } }
        })

        const { result } = renderHook(() => useRegisterStudent(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        expect(toast.error).toHaveBeenCalledWith('Registration Failed')
    })

    it('shows fallback error message when no response message', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            isRegistered: false,
            registeredStudents: []
        })

        registerStudent.mockRejectedValue({})

        const { result } = renderHook(() => useRegisterStudent(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        expect(toast.error).toHaveBeenCalledWith('Registration Failed')
    })

    it('invalidates relevant caches on settled', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            isRegistered: false,
            registeredStudents: []
        })

        registerStudent.mockResolvedValue({ message: 'Registered Successfully!' })

        const { result } = renderHook(() => useRegisterStudent(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['eventDetail', 'event-1'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['studentEvents'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['studentCalendar'] })
    })
})

describe('useUnregisterStudent', () => {

    beforeEach(() => vi.clearAllMocks())

    it('shows success toast on successful unregistration', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            title: 'Test Event',
            isRegistered: true,
            registeredStudents: [{ _id: 'student-1' }]
        })

        unregisterStudent.mockResolvedValue({ message: 'Unregistered Successfully' })

        const { result } = renderHook(() => useUnregisterStudent(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        expect(toast.success).toHaveBeenCalledWith('Unregistered Successfully')
    })

    it('applies optimistic update setting isRegistered to false', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            title: 'Test Event',
            isRegistered: true,
            registeredStudents: [{ _id: 'student-1' }]
        })

        unregisterStudent.mockResolvedValue({ message: 'Unregistered Successfully' })

        const { result } = renderHook(() => useUnregisterStudent(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        const updatedEvent = queryClient.getQueryData(['eventDetail', 'event-1'])
        expect(updatedEvent?.isRegistered).toBe(false)
        expect(updatedEvent?.registeredStudents).toHaveLength(0)
    })

    it('rolls back optimistic update on error', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        const originalData = {
            _id: 'event-1',
            title: 'Test Event',
            isRegistered: true,
            registeredStudents: [{ _id: 'student-1' }]
        }
        queryClient.setQueryData(['eventDetail', 'event-1'], originalData)

        unregisterStudent.mockRejectedValue({
            response: { data: { message: 'Unregistration Failed' } }
        })

        const { result } = renderHook(() => useUnregisterStudent(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        await waitFor(() => expect(result.current.isError).toBe(true))

        const restoredData = queryClient.getQueryData(['eventDetail', 'event-1'])
        expect(restoredData).toEqual(originalData)
    })

    it('shows error toast on failure', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            isRegistered: true,
            registeredStudents: [{ _id: 'student-1' }]
        })

        unregisterStudent.mockRejectedValue({
            response: { data: { message: 'Unregistration Failed' } }
        })

        const { result } = renderHook(() => useUnregisterStudent(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        expect(toast.error).toHaveBeenCalledWith('Unregistration Failed')
    })

    it('shows fallback error message when no response message', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            isRegistered: true,
            registeredStudents: [{ _id: 'student-1' }]
        })

        unregisterStudent.mockRejectedValue({})

        const { result } = renderHook(() => useUnregisterStudent(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        expect(toast.error).toHaveBeenCalledWith('Unregistration Failed')
    })

    it('invalidates relevant caches on settled', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

        queryClient.setQueryData(['eventDetail', 'event-1'], {
            _id: 'event-1',
            isRegistered: true,
            registeredStudents: [{ _id: 'student-1' }]
        })

        unregisterStudent.mockResolvedValue({ message: 'Unregistered Successfully' })

        const { result } = renderHook(() => useUnregisterStudent(), { wrapper })

        await act(async () => {
            result.current.mutate('event-1')
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['eventDetail', 'event-1'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['studentEvents'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['studentCalendar'] })
    })
})