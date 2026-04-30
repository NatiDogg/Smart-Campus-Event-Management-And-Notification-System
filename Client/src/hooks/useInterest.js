import { useMutation,useQueryClient } from "@tanstack/react-query";
import {toast} from 'react-hot-toast'
import { markInterest,unMarkInterest } from "../api/interest";


export const useMarkInterest = ()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: markInterest,
        onMutate:async(eventId)=>{
             await queryClient.cancelQueries({queryKey: ['eventDetail', eventId]})
             const previousEventDetail = queryClient.setQueryData(['eventDetail', eventId]);
             queryClient.setQueryData(['eventDetail', eventId], (old)=>{
                if(!old) return old;
                return {
                    ...old,
                    isInterested: true
                }
             })

             return {previousEventDetail}

        },
        onSuccess:(data)=>{
           toast.success(data?.message || 'Marked Interest Successfully')
        },
        onError:(error,eventId, context)=>{
             if(context?.previousEventDetail){
                queryClient.setQueryData(['eventDetail', eventId], context.previousEventDetail)
             }
             toast.error(error?.reponse?.data?.message || 'Failed to mark interest')
        },
        onSettled:(data,error,eventId,context)=>{
           queryClient.invalidateQueries({queryKey: ['eventDetail', eventId] })
           queryClient.invalidateQueries({queryKey: ['studentEvents'] })
           queryClient.invalidateQueries({queryKey: ['studentCalendar']})
        }
    })
}

export const useUnMarkInterest = ()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: unMarkInterest,

        onMutate:async(eventId)=>{
             await queryClient.cancelQueries({queryKey: ['eventDetail', eventId]})
             const previousEventDetail = queryClient.setQueryData(['eventDetail', eventId]);
             queryClient.setQueryData(['eventDetail', eventId], (old)=>{
                if(!old) return old;
                return {
                    ...old,
                    isInterested: false
                }
             })

             return {previousEventDetail}

        },
        onSuccess:(data)=>{
           toast.success(data?.message || 'Unmarked Interest Successfully')
        },
        onError:(error,eventId, context)=>{
             if(context?.previousEventDetail){
                queryClient.setQueryData(['eventDetail', eventId], context.previousEventDetail)
             }
             toast.error(error?.reponse?.data?.message || 'Failed to unmark interest')
        },
        onSettled:(data,error,eventId,context)=>{
           queryClient.invalidateQueries({queryKey: ['eventDetail', eventId] })
            queryClient.invalidateQueries({queryKey: ['studentEvents'] })
            queryClient.invalidateQueries({queryKey: ['studentCalendar']})
        }
         
    })
}