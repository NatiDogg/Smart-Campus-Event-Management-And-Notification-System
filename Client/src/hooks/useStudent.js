import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { subscribeCategory,getSubscribedCategories,getRecommendations,getStudentEvents } from "../api/student";
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
       staleTime: 60000,
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





