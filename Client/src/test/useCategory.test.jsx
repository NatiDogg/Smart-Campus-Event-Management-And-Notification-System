import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// mock category api
vi.mock('../api/category', () => ({
    createCategory: vi.fn(),
    deleteCategory: vi.fn(),
    getCategories: vi.fn()
}))

// mock toast
vi.mock('react-hot-toast', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn()
    }
}))

import { createCategory, deleteCategory, getCategories } from '../api/category'
import { toast } from 'react-hot-toast'
import { useCreateCategory, useGetCategories, useDeleteCategory } from '../hooks/useCategory'

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

describe('useGetCategories', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns categories on success', async () => {
        const mockData = [
            { _id: '1', name: 'Music' },
            { _id: '2', name: 'Sports' }
        ]
        getCategories.mockResolvedValue(mockData)

        const { result } = renderHook(() => useGetCategories(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockData)
    })

    it('returns error when fetch fails', async () => {
        getCategories.mockRejectedValue(new Error('Failed to fetch categories'))

        const { result } = renderHook(() => useGetCategories(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
    })
})

describe('useCreateCategory', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('shows success toast and invalidates cache on success', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

        createCategory.mockResolvedValue({ message: 'Category created successfully' })

        const { result } = renderHook(() => useCreateCategory(), { wrapper })

        await act(async () => {
            result.current.mutate({ name: 'Music' })
        })

        expect(toast.success).toHaveBeenCalledWith('Category created successfully')
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['category'] })
    })

    it('shows error toast on failure', async () => {
        createCategory.mockRejectedValue({
            response: { data: { message: 'Category already exists' } }
        })

        const { result } = renderHook(() => useCreateCategory(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ name: 'Music' })
        })

        expect(toast.error).toHaveBeenCalledWith('Category already exists')
    })

    it('shows fallback error message when no response message', async () => {
        createCategory.mockRejectedValue({})

        const { result } = renderHook(() => useCreateCategory(), {
            wrapper: createWrapper()
        })

        await act(async () => {
            result.current.mutate({ name: 'Music' })
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to Create Category')
    })
})

describe('useDeleteCategory', () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('shows success toast on successful delete', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['category'], [
            { _id: 'cat-1', name: 'Music' },
            { _id: 'cat-2', name: 'Sports' }
        ])

        deleteCategory.mockResolvedValue({ message: 'Category deleted successfully' })

        const { result } = renderHook(() => useDeleteCategory(), { wrapper })

        await act(async () => {
            result.current.mutate('cat-1')
        })

        expect(toast.success).toHaveBeenCalledWith('Category deleted successfully')
    })

    it('applies optimistic update before server response', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['category'], [
            { _id: 'cat-1', name: 'Music' },
            { _id: 'cat-2', name: 'Sports' }
        ])

        deleteCategory.mockResolvedValue({ message: 'Category deleted successfully' })

        const { result } = renderHook(() => useDeleteCategory(), { wrapper })

        await act(async () => {
            result.current.mutate('cat-1')
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        const updatedCategories = queryClient.getQueryData(['category'])
        expect(updatedCategories?.find(c => c._id === 'cat-1')).toBeUndefined()
        expect(updatedCategories?.find(c => c._id === 'cat-2')).toBeDefined()
    })

    it('rolls back optimistic update on error', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        const originalCategories = [
            { _id: 'cat-1', name: 'Music' },
            { _id: 'cat-2', name: 'Sports' }
        ]
        queryClient.setQueryData(['category'], originalCategories)

        deleteCategory.mockRejectedValue({
            response: { data: { message: 'Failed to delete category' } }
        })

        const { result } = renderHook(() => useDeleteCategory(), { wrapper })

        await act(async () => {
            result.current.mutate('cat-1')
        })

        await waitFor(() => expect(result.current.isError).toBe(true))

        const restoredCategories = queryClient.getQueryData(['category'])
        expect(restoredCategories).toEqual(originalCategories)
    })

    it('shows error toast on delete failure', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['category'], [
            { _id: 'cat-1', name: 'Music' }
        ])

        deleteCategory.mockRejectedValue({
            response: { data: { message: 'Failed to delete category' } }
        })

        const { result } = renderHook(() => useDeleteCategory(), { wrapper })

        await act(async () => {
            result.current.mutate('cat-1')
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to delete category')
    })

    it('shows fallback error message when no response message', async () => {
        const { wrapper, queryClient } = createWrapperWithClient()

        queryClient.setQueryData(['category'], [
            { _id: 'cat-1', name: 'Music' }
        ])

        deleteCategory.mockRejectedValue({
            response: { data: {} }
        })

        const { result } = renderHook(() => useDeleteCategory(), { wrapper })

        await act(async () => {
            result.current.mutate('cat-1')
        })

        expect(toast.error).toHaveBeenCalledWith('Failed to delete category')
    })
})