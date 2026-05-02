import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { subscribeCategory,getSubscribedCategories,getRecommendations,getStudentEvents,getAnnouncements, getCalendarData } from "../api/student";
import toast from "react-hot-toast";



export const useGetSubscribedCategories = ()=>{
    return useQuery({
        queryKey: ['subscribedCategories'],
        queryFn: getSubscribedCategories,
        staleTime: 60000,
        refetchOnWindowFocus: false
    })
}



export const useSubscribeCategory = ()=>{
    const queryClient = useQueryClient()
     return useMutation({
        mutationFn: subscribeCategory,
        onSuccess:(data)=>{
            toast.success(data.message)
            queryClient.invalidateQueries({queryKey: ["subscribedCategories"]})
            queryClient.invalidateQueries({queryKey: ['studentEvents']})
            queryClient.invalidateQueries({queryKey: ['studentCalendar']})
        },
        onError:(error)=>{
            const errorMessage = error.response?.data?.message || "Failed to save changes";
          toast.error(errorMessage)
        }
     })
}

export const useGetRecommendations = ()=>{
    return useQuery({
       queryKey: ['aiRecommendations'],
       queryFn: getRecommendations,
       staleTime: 5 * 60 * 1000,
       refetchOnWindowFocus: false
    })
}

export const useGetStudentEvents = ()=>{
    return useQuery({
        queryKey: ['studentEvents'],
        queryFn: getStudentEvents,
        staleTime: 60000,
        refetchOnWindowFocus: false
    })
}

export const useGetAnnouncements = ()=>{
    return useQuery({
        queryKey: ['studentAnnouncements'],
        queryFn: getAnnouncements,
        staleTime: 60000,
        refetchOnWindowFocus: false
    })
}

export const useGetCalendarData = (month,year)=>{
   return useQuery({
    queryKey: ['studentCalendar', { month, year }],
    queryFn: ()=> getCalendarData(month, year),
    staleTime: 3 * 60 * 1000, 
    refetchOnWindowFocus: false,
    // Optional: Keep previous data while loading the new month to prevent "flickering"
    placeholderData: (previousData) => previousData,
   })
}



{/*

    {success: true, message: 'Your Events Retrieved Successfully!', popularEvents: Array(2), registeredEvents: Array(0), interestedEvents: Array(0), …}
interestedEvents: []
message: "Your Events Retrieved Successfully!"
popularEvents: (2) [{…}, {…}]
previouslyAttendedEvents: []
registeredEvents: []
success: true
[[Prototype]]
: 
Object

*/}





