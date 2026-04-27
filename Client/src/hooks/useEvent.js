import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import { createEvent,getPendingEvents,approveEvent,rejectEvent,getAdminAllEvents, cancelEvent, editEvent, getOrganizerAllEvents, getAllEvents,getEventDetails } from '../api/event'

import toast from 'react-hot-toast'


export const useCreateEvent = ()=>{
      const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createEvent,
        onSuccess:(data)=>{
          toast.success(data.message)
          queryClient.invalidateQueries({queryKey: ['organizerDashboard']})
          queryClient.invalidateQueries({queryKey:['organizerAllEvents']})
        },
        onError: (error)=>{
            const errorMessage = error.response?.data.message || 'Failed to create Event'
            toast.error( errorMessage)
        }
    })


}
export const useEditEvent = ()=>{
   const queryClient = useQueryClient()
   return useMutation({
     mutationFn: editEvent,
     onSuccess:(data)=>{
       toast.success(data.message)
       queryClient.invalidateQueries({queryKey: ['organizerDashboard']})
        queryClient.invalidateQueries({queryKey:['organizerAllEvents']})
     },
     onError:(error)=>{
      const errorMessage = error.response?.data?.message || 'Failed to edit Event'
      toast.error(errorMessage)
     }
   })
}

export const useCancelEvent = ()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: cancelEvent,
        onSuccess:(data)=>{
          toast.success(data.message)
          queryClient.invalidateQueries({queryKey: ['organizerDashboard']})
          queryClient.invalidateQueries({queryKey:['organizerAllEvents']})
        },
        onError:(error)=>{
          const errorMessage = error.response?.data.message || 'Failed to Delete Event'
          toast.error(errorMessage)
        }
    })
}



export const useGetPendingEvents = ()=>{
    return useQuery({
        queryKey: ['pendingEvents'],
        queryFn: getPendingEvents,
        staleTime: 60000,
        refetchOnWindowFocus: false
    })
}

export const useApproveEvent = ()=>{
     const queryClient = useQueryClient()
    return useMutation({
        mutationFn: approveEvent,
        onMutate:async(eventId)=>{
            await queryClient.cancelQueries({queryKey: ['pendingEvents']})
            const previousPendingEvents = queryClient.getQueryData(['pendingEvents'])
            queryClient.setQueryData(['pendingEvents'],(old)=>{
                 return {
                    ...old,
                    events: old.events.filter((event)=> event._id !== eventId)
                 }
            })
            return {previousPendingEvents}
        },
        onSuccess:(data)=>{
           toast.success(data?.message || 'Event Approved Successfully')
        },
        onError:(error,eventId,context)=>{
            if(context?.previousPendingEvents){
              queryClient.setQueryData(['pendingEvents'], context.previousPendingEvents)
            }
         toast.error(error.response?.data?.message || 'Failed to approve Event') 
        },
        onSettled:()=>{
          queryClient.invalidateQueries({ queryKey: ['pendingEvents'] });
          queryClient.invalidateQueries({ queryKey: ['adminAllEvents'] });
           queryClient.invalidateQueries({queryKey: ['adminDashboard']});
        }
    })
}

export const useRejectEvent = ()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: rejectEvent,
        onMutate:async(eventId)=>{
           await queryClient.cancelQueries({queryKey: ['pendingEvents']})
           const previousPendingEvents = queryClient.getQueryData(['pendingEvents'])
           queryClient.setQueryData(['pendingEvents'],(old)=>{
              return {
                ...old,
                events: old.events.filter((event)=> event._id !== eventId)
              }
           })
           return {previousPendingEvents}
        },
        onSuccess:(data)=>{
          toast.success(data?.message || 'Event Rejected Successfully')
        },
        onError:(error,eventId,context)=>{
          if(context?.previousPendingEvents){
            queryClient.setQueryData(['pendingEvents'], context.previousPendingEvents)
          }
         toast.error(error.response?.data?.message || 'Failed to reject Event') 
        },
        onSettled:()=>{
         queryClient.invalidateQueries({ queryKey: ['pendingEvents'] });
         queryClient.invalidateQueries({ queryKey: ['adminAllEvents'] });
          queryClient.invalidateQueries({queryKey: ['adminDashboard']});
        }
    })
}

export const useGetAdminAllEvents = ()=>{
     return useQuery({
        queryKey: ['adminAllEvents'],
        queryFn: getAdminAllEvents,
        staleTime: 60000,
        refetchOnWindowFocus: false
     })
}

export const useGetOrganizerAllEvents = ()=>{
  return useQuery({
    queryKey: ['organizerAllEvents'],
    queryFn: getOrganizerAllEvents,
    staleTime: 60000,
    refetchOnWindowFocus: false
  })
}

export const useGetAllEvents = ()=>{
  return useQuery({
    queryKey: ['all-events'],
    queryFn: getAllEvents,
    staleTime:60000,
    refetchOnWindowFocus: false
  })
}

export const useGetEventDetails = (id, options = {})=>{
  return useQuery({
     queryKey: ['eventDetail', id],
     queryFn: ()=> getEventDetails(id),
     staleTime: 60000,
     refetchOnWindowFocus: false,
     ...options
  })
}

{/*

  {success: true, message: 'Event Retrieved Successfully!', event: {…}, isRegistered: false, isInterested: false, …}
event: {_id: '69e625acb4487c88a1a30061', title: 'Annual Tech Event', description: 'this is an annual Tech Event description ', imageUrl: 'https://res.cloudinary.com/dnzn1uao7/image/upload/v1776690604/events/eite01y7hoglvvfszvjd.jpg', imagePublicId: 'events/eite01y7hoglvvfszvjd', …}
isInterested: false
isRegistered: false
isfeedBackSubmitted: false
message: "Event Retrieved Successfully!"
registeredStudents: [{…}]
isAttended: false
success: true
  */}


