import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
import { registerStudent,unregisterStudent } from "../api/registration";
import {toast} from 'react-hot-toast'

export const useRegisterStudent = ()=>{
     const queryClient = useQueryClient()
    return useMutation({
        mutationFn: registerStudent,
        onMutate:async(eventId)=>{
            await queryClient.cancelQueries({queryKey: ['eventDetail', eventId]})
            const previousEventDetail = queryClient.getQueryData(['eventDetail', eventId]);
            queryClient.setQueryData(['eventDetail', eventId], (old)=>{
                if (!old) return old;
                return {
                   ...old,
                   isRegistered: true,
                   registeredStudents: [...old.registeredStudents, { _id: 'temp-id' }]
                   
                }
            })

            return {previousEventDetail}
        },
        onSuccess:(data)=>{
           toast.success(data?.message || 'Registered Successfully!')
        },
        onError:(error,eventId, context)=>{
            if(context?.previousEventDetail){
                queryClient.setQueryData(['eventDetail', eventId], context.previousEventDetail)
            }
           toast.error(error?.response?.data?.message || 'Registration Failed')
        },
        onSettled:(data,error,eventId,context)=>{
            queryClient.invalidateQueries({queryKey: ['eventDetail', eventId]})
            queryClient.invalidateQueries({queryKey:['studentEvents']})
        }
    })
}

export const useUnregisterStudent = ()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: unregisterStudent,
        onMutate:async(eventId)=>{
           await queryClient.cancelQueries({queryKey: ['eventDetail', eventId] })
           const previousEventDetails = queryClient.getQueryData(['eventDetail', eventId])
           queryClient.setQueryData(['eventDetail', eventId], (old)=>{
             if(!old) return old;
             return {
                ...old,
                 isRegistered: false,
                 registeredStudents: old.registeredStudents.slice(0, -1)

             }
           })
           return {previousEventDetails}
        },
        onSuccess:(data)=>{
          toast.success(data?.message || 'Unregistered Successfully')
        },
        onError:(error,eventId,context)=>{

            if(context?.previousEventDetails){
                queryClient.setQueryData(['eventDetail', eventId], context.previousEventDetails)
            }
            toast.error(error?.response?.data?.message || 'Unregistration Failed')
          
        },
        onSettled:(data,error,eventId,context)=>{
          queryClient.invalidateQueries({queryKey: ['eventDetail', eventId]})
           queryClient.invalidateQueries({queryKey:['studentEvents']})
        }
    })
}



