import {useMutation} from '@tanstack/react-query'
import { createOrganizer } from '../api/createOrganizer'
import {toast} from 'react-hot-toast'
export const useCreateOrganizer = ()=>{
    return useMutation({
        mutationFn: createOrganizer,
        onSuccess:(data)=>{
            toast.success(data.message)
        },
        onError:(error)=>{
             const errorMessage = error.response?.data.message || 'Failed to Invite organizer'
             toast.error(errorMessage)

        }
    })
}

