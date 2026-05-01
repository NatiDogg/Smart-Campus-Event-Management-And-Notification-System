import {useQuery, useMutation,useQueryClient} from '@tanstack/react-query'
import { getAllUsers,deleteUser,getAdminDashboard,createAnnouncement,getAdminAnalytics } from '../api/admin'
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
            queryClient.invalidateQueries({queryKey: ['adminDashboard']})
        }
    })
}

export const useGetAdminDashboard = ()=>{
    return useQuery({
        queryKey:['adminDashboard'],
        queryFn: getAdminDashboard,
        staleTime: 60000,
        refetchOnWindowFocus: false
    })
}

export const useCreateAnnouncement = ()=>{
    return useMutation({
        mutationFn: createAnnouncement,
        onSuccess:(data)=>{
          toast.success(data.message)
        },
        onError:(error)=>{
          const errorMessage = error.response?.data?.message || 'Failed to Create Announcement'
          toast.error(errorMessage)
        }
    })
}

export const useGetAdminAnalytics = ()=>{
    return useQuery({
        queryKey: ['adminAnalytics'],
        queryFn: getAdminAnalytics,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
    })
}

{
    /*
    analytics: 
engagementTrend: "Engagement metrics are currently sparse. Consistent tracking and promotion of events will be key to observing trends."
summary: "Welcome to May! Our initial event data for 'tech event 1' shows no registrations yet. As we build engagement, let's focus on promoting upcoming events and encouraging early sign-ups to foster a vibrant campus community."
tableMetrics: [{…}]
topEvents: []
turnoutPrediction: "No upcoming events scheduled. Prediction will resume once events are approved."
[[Prototype]]: Object
message: "analytics retrieved successfully!"
success: true
    */
}



{
    /* 
{title: 'tech event 1', registrations: 0, score: 'Neutral', impact: '+0.0%'}*/
}