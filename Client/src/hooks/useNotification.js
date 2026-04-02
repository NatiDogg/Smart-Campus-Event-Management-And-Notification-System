import {useQuery,useQueryClient,useMutation} from '@tanstack/react-query'
import { getNotification,deleteNotification } from '../api/notification'
import {toast} from 'react-hot-toast'

export const useGetNotification = ()=>{
     return useQuery({
        queryKey: ["notifications"],
        queryFn: getNotification,
        select: (data)=> data.notifications,
        staleTime: 60000,
        refetchOnWindowFocus: false
     })
}

export const useDeleteNotification = ()=>{
     const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteNotification,
        onMutate:async(notificationId)=>{
             await queryClient.cancelQueries({queryKey: ['notifications']})
             const previousNotification = queryClient.getQueryData(['notifications'])
             queryClient.setQueryData(['notifications'],(old)=>{return {...old,
                 notifications: old.notifications.filter(notification=> notification._id !== notificationId)
             }})
             return {previousNotification}
        },
        onSuccess:(data)=>{
          toast.success(data.message)
        },
        onError:(error,notificationId,context)=>{
            if (context?.previousNotification) {
           queryClient.setQueryData(['notifications'], context.previousNotification)
            }
          toast.error(error.response?.data.message || 'Failed to Delete Notification')
        },
        onSettled:()=>{
            queryClient.invalidateQueries({queryKey: ['notifications']})
        }
    })
}


{/*
id 69ca45aae2a8336eafa6ab6c
userId 69af1ebcc4f2a6ddafe3b5d0
title "New Event Submission"
message "New Event Submission"
status "sent"
eventId 69ca45a8e2a8336eafa6ab65
createdAt 2026-03-30T09:43:06.633+00:00
updatedAt 2026-03-30T09:43:06.633+00:00

 */}