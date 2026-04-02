import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import { createCategory, deleteCategory, getCategories } from '../api/category'
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

export const useDeleteCategory = ()=>{
     const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteCategory,
        onMutate: async(categoryId)=>{
           await queryClient.cancelQueries({queryKey: ['category']})
           const previousCategories = queryClient.getQueryData(['category'])
           queryClient.setQueryData(['category'],(old)=> old?.filter((category)=> category._id !== categoryId))
           return {previousCategories}
        },
        onSuccess: (data) => {
         toast.success(data.message);
        },
        onError: (err, categoryId, context) => {
             
             queryClient.setQueryData(['category'], context.previousCategories);
             toast.error(err?.response?.data.message || 'Failed to delete category');
         },
        onSettled:(data,error)=>{
             queryClient.invalidateQueries({queryKey: ['category']})
        }
    })
}