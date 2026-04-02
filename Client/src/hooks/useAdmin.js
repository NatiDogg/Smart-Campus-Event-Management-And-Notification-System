import {useQuery, useMutation,useQueryClient} from '@tanstack/react-query'
import { getAllUsers,deleteUser } from '../api/admin'
import {toast} from 'react-hot-toast'

export const useGetAllUsers = ()=>{
    return useQuery({
        queryKey: ["users"],
        queryFn: getAllUsers,
        staleTime: 60000,
        refetchOnWindowFocus: false
    })
}

export const useDeleteUser = ()=>{
     const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteUser,
        onMutate:async(userId)=>{
            await queryClient.cancelQueries({queryKey: ['users']})
            const previousUsers = queryClient.getQueryData(['users'])
            queryClient.setQueryData(['users'],(old)=>{
                return {
                    ...old,
                    users: old.users.filter(user=> user._id !== userId)
                }
            })
            return {previousUsers}
        },
        onSuccess:(data)=>{
           toast.success(data.message)
        },
        onError:(error,userId,context)=>{
            queryClient.setQueryData(['users'],context.previousUsers)
           const errorMessage = error.response?.data.message || 'Failed to delete user'
           toast.error(errorMessage)
          
        },
        onSettled:()=>{
           queryClient.invalidateQueries({queryKey: ['users']})
        }
    })
}