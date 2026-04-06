import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { subscribeCategory } from "../api/student";


export const useSubscribeCategory = ()=>{
     return useMutation({
        mutationFn: subscribeCategory
     })
}