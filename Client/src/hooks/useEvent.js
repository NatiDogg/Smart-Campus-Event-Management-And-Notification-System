import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import { createEvent } from '../api/event'
import toast from 'react-hot-toast'


export const useCreateEvent = ()=>{
    return useMutation({
        mutationFn: createEvent,
        onSuccess:(data)=>{
          toast.success(data.message)
        },
        onError: (error)=>{
            
            const errorMessage = error.response?.data.message || 'Failed to create Event'
            toast.error( errorMessage)
        }
    })

}
