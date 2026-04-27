import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
import { submitFeedback,getFeedbacks } from "../api/feedback";
import {toast} from 'react-hot-toast'

export const useSubmitFeedback = ()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: submitFeedback,
        onMutate:async(feedbackData)=>{
             await queryClient.cancelQueries({queryKey: ['eventDetail', feedbackData.id]})
             const previousEventDetail = queryClient.getQueryData(['eventDetail', feedbackData.id]);
             queryClient.setQueryData(['eventDetail', feedbackData.id], (old)=>{
                if(!old) return old;
                return {
                    ...old,
                    isfeedBackSubmitted: true
                }
             })
             return {previousEventDetail}

        },
        onSuccess:(data)=>{
           toast.success(data?.message || 'Feedback Submitted Successfully')
        },
        onError:(error,feedbackData, context)=>{
            if(context?.previousEventDetail){
                queryClient.setQueryData(['eventDetail', feedbackData.id], context.previousEventDetail)

            }
            toast.error(error?.response?.data?.message || "Failed to submit Feedback")
        },
        onSettled:(data,error,feedbackData,context)=>{
           queryClient.invalidateQueries({queryKey: ['eventDetail', feedbackData.id]})
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