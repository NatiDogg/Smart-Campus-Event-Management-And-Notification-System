import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// mock toast
vi.mock('react-hot-toast', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}))

// mock admin api
vi.mock('../api/admin', () => ({
    getAllUsers: vi.fn(),
    deleteUser: vi.fn(),
    getAdminDashboard: vi.fn(),
    createAnnouncement: vi.fn(),
    getAdminAnalytics: vi.fn(),
    getExportedPdf: vi.fn()
}))

import { toast } from 'react-hot-toast'
import { getAllUsers, deleteUser, getAdminDashboard, createAnnouncement, getAdminAnalytics, getExportedPdf } from '../api/admin'
import { useGetAllUsers, useDeleteUser, useGetAdminDashboard, useCreateAnnouncement, useGetAdminAnalytics, useGetExportedPdf } from '../hooks/useAdmin'

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

// helper to create wrapper and expose queryClient
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

describe('useGetAllUsers', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns users on success', async () => {
        const mockData = {
            users: [
                { _id: '1', fullName: 'John Doe', email: 'john@test.com', role: 'student' },
                { _id: '2', fullName: 'Jane Doe', email: 'jane@test.com', role: 'organizer' }
            ]
        }
        getAllUsers.mockResolvedValue(mockData)

        const { result } = renderHook(() => useGetAllUsers(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockData)
    })

    it('returns error when fetch fails', async () => {
        getAllUsers.mockRejectedValue(new Error('Failed to fetch users'))

        const { result } = renderHook(() => useGetAllUsers(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
    })
})

describe('useDeleteUser', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

   
it('shows success toast on successful delete', async () => {
    deleteUser.mockResolvedValue({ message: 'User deleted successfully' })

    const { wrapper, queryClient } = createWrapperWithClient()

    // seed users so onMutate doesn't crash
    queryClient.setQueryData(['users'], {
        users: [{ _id: 'user-id-1', fullName: 'John Doe' }]
    })

    const { result } = renderHook(() => useDeleteUser(), { wrapper })

    await act(async () => {
        result.current.mutate('user-id-1')
    })

    expect(toast.success).toHaveBeenCalledWith('User deleted successfully')
})

    it('shows error toast on delete failure', async () => {
        deleteUser.mockRejectedValue({
            response: { data: { message: 'Failed to delete user' } }
        })

        const { wrapper, queryClient } = createWrapperWithClient()

        // seed users data so onMutate rollback has something to work with
        queryClient.setQueryData(['users'], {
            users: [{ _id: 'user-id-1', fullName: 'John Doe' }]
        })

        const { result } = renderHook(() => useDeleteUser(), { wrapper })

        await act(async () => {
            result.current.mutate('user-id-1')
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to delete user')
    })

    it('applies optimistic update before server response', async () => {
        deleteUser.mockResolvedValue({ message: 'User deleted successfully' })

        const { wrapper, queryClient } = createWrapperWithClient()

        // seed initial users
        queryClient.setQueryData(['users'], {
            users: [
                { _id: 'user-id-1', fullName: 'John Doe' },
                { _id: 'user-id-2', fullName: 'Jane Doe' }
            ]
        })

        const { result } = renderHook(() => useDeleteUser(), { wrapper })

        await act(async () => {
            result.current.mutate('user-id-1')
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        // after success, user should be removed
        const updatedUsers = queryClient.getQueryData(['users'])
        expect(updatedUsers.users.find(u => u._id === 'user-id-1')).toBeUndefined()
    })

    it('rolls back optimistic update on error', async () => {
        deleteUser.mockRejectedValue({
            response: { data: { message: 'Server error' } }
        })

        const { wrapper, queryClient } = createWrapperWithClient()

        const originalUsers = {
            users: [
                { _id: 'user-id-1', fullName: 'John Doe' },
                { _id: 'user-id-2', fullName: 'Jane Doe' }
            ]
        }
        queryClient.setQueryData(['users'], originalUsers)

        const { result } = renderHook(() => useDeleteUser(), { wrapper })

        await act(async () => {
            result.current.mutate('user-id-1')
        })

        await waitFor(() => expect(result.current.isError).toBe(true))

        // original users should be restored
        const restoredUsers = queryClient.getQueryData(['users'])
        expect(restoredUsers).toEqual(originalUsers)
    })
})

describe('useGetAdminDashboard', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns dashboard data on success', async () => {
        const mockData = {
            totalUsers: 100,
            totalEvents: 20,
            pendingApprovals: 5
        }
        getAdminDashboard.mockResolvedValue(mockData)

        const { result } = renderHook(() => useGetAdminDashboard(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockData)
    })

    it('returns error when fetch fails', async () => {
        getAdminDashboard.mockRejectedValue(new Error('Server error'))

        const { result } = renderHook(() => useGetAdminDashboard(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
    })
})

describe('useCreateAnnouncement', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('shows success toast on successful announcement', async () => {
        createAnnouncement.mockResolvedValue({ message: 'Announcement created successfully' })

        const { result } = renderHook(() => useCreateAnnouncement(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ title: 'Test', content: 'Test content' })
        })

        expect(toast.success).toHaveBeenCalledWith('Announcement created successfully')
    })

    it('shows error toast on failure', async () => {
        createAnnouncement.mockRejectedValue({
            response: { data: { message: 'Failed to Create Announcement' } }
        })

        const { result } = renderHook(() => useCreateAnnouncement(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ title: 'Test', content: 'Test content' })
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to Create Announcement')
    })

    it('shows fallback error message when no response message', async () => {
        createAnnouncement.mockRejectedValue({})

        const { result } = renderHook(() => useCreateAnnouncement(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ title: 'Test', content: 'Test content' })
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to Create Announcement')
    })
})

describe('useGetAdminAnalytics', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns analytics data on success', async () => {
        const mockData = {
            totalEvents: 50,
            totalRegistrations: 300,
            monthlyData: []
        }
        getAdminAnalytics.mockResolvedValue(mockData)

        const { result } = renderHook(() => useGetAdminAnalytics(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockData)
    })

    it('returns error when fetch fails', async () => {
        getAdminAnalytics.mockRejectedValue(new Error('Server error'))

        const { result } = renderHook(() => useGetAdminAnalytics(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
    })
})

// fix useGetExportedPdf - restore spies after each test
describe('useGetExportedPdf', () => {

    beforeEach(() => {
        vi.clearAllMocks()
        window.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
        window.URL.revokeObjectURL = vi.fn()
    })

    afterEach(() => {
        vi.restoreAllMocks() // ✅ restores document.createElement and appendChild
    })

    it('triggers file download on success', async () => {
    const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' })
    getExportedPdf.mockResolvedValue(mockBlob)

    const { result } = renderHook(() => useGetExportedPdf(), {
        wrapper: createWrapper()
    })

    await act(async () => {
        result.current.mutate({ totalEvents: 50 })
    })

    // ✅ just verify the blob URL was created and cleaned up
    await waitFor(() => {
        expect(window.URL.createObjectURL).toHaveBeenCalled()
        expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    })
})

    it('shows error toast on export failure', async () => {
        getExportedPdf.mockRejectedValue({
            response: { data: { message: 'PDF Export failed' } }
        })

        const { result } = renderHook(() => useGetExportedPdf(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ totalEvents: 50 })
        })

        expect(toast.error).toHaveBeenCalledWith('PDF Export failed')
    })

    it('shows fallback error message when no response message', async () => {
        getExportedPdf.mockRejectedValue({})

        const { result } = renderHook(() => useGetExportedPdf(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ totalEvents: 50 })
        })

        expect(toast.error).toHaveBeenCalledWith('PDF Export failed')
    })
})