import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import { createCategory, getCategories } from '../api/category'
import {toast} from 'react-hot-toast'

export const useCreateCategory = ()=>{
     const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createCategory,
        onSuccess: (data)=>{
          toast.success(data.message)
          queryClient.invalidateQueries({queryKey: ['category']})
        },
        onError: (error)=>{
            
           const errorMessage = error.response?.data?.message || 'Failed to Create Category';
      
      toast.error(errorMessage);
        }
    })
}

export const useGetCategories = ()=>{
    return useQuery({
        queryKey: ['category'],
        queryFn: getCategories,
        staleTime: 60000,
        refetchOnWindowFocus: false
    })
}