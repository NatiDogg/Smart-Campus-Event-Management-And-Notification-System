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
             queryClient.setQueryData(['notifications'],(old)=>old?.filter((notification)=>notification._id !== notificationId))
             return {previousNotification}
        },
        onSuccess:(data)=>{
          toast.success(data.message)
        },
        onError:(error,notificationId,context)=>{
            queryClient.setQueryData(['notifications'], context.previousNotification)
            toast.error(error.response?.data.message || 'Failed to Delete Notification')
        },
        onSettled:()=>{
            queryClient.invalidateQueries({queryKey: ['notifications']})
        }
    })
}