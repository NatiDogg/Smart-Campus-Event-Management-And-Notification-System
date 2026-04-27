import { useMutation,useQueryClient } from "@tanstack/react-query";
import {toast} from 'react-hot-toast'
import { markInterest,unMarkInterest } from "../api/interest";


export const useMarkInterest = ()=>{
    return useMutation({
        mutationFn: markInterest,
        onMutate:()=>{

        },
        onSuccess:()=>{

        },
        onError:()=>{

        },
        onSettled:()=>{

        }
    })
}

export const useUnMarkInterest = ()=>{
    return useMutation({
        mutationFn: unMarkInterest,
         onMutate:()=>{

        },
        onSuccess:()=>{

        },
        onError:()=>{

        },
        onSettled:()=>{
            
        }
    })
}