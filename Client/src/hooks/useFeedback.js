import { useQuery,useMutation } from "@tanstack/react-query";
import { submitFeedback,getFeedbacks } from "../api/feedback";
import {toast} from 'react-hot-toast'

export const useSubmitFeedback = ()=>{
    return useMutation({
        mutationFn: submitFeedback,
        onSuccess:(data)=>{
           toast.success(data?.message || 'Feedback Submitted Successfully')
        },
        onError:(error)=>{
            const errorMessage = error.response?.data.message || 'Failed to submit feedback'
            toast.error(errorMessage)
        }
    })
}

export const useGetFeedbacks = ()=>{
    return useQuery({
        queryKey:['feedbacks'],
        queryFn: getFeedbacks,
        staleTime: 60000,
        refetchOnWindowFocus: false
    })
}