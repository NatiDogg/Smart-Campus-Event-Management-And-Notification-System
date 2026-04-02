import {useMutation,useQueryClient} from '@tanstack/react-query'
import { createOrganizer } from '../api/createOrganizer'
import {toast} from 'react-hot-toast'
export const useCreateOrganizer = ()=>{
     const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createOrganizer,
        onSuccess:(data)=>{
            toast.success(data.message)
            queryClient.invalidateQueries({queryKey: ['users']})
        },
        onError:(error)=>{
             const errorMessage = error.response?.data.message || 'Failed to Invite organizer'
             toast.error(errorMessage)

        }
    })
}

