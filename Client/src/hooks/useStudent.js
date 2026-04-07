import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { subscribeCategory,getSubscribedCategories } from "../api/student";
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





