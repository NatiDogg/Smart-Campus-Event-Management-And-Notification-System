import {useQuery, useMutation} from '@tanstack/react-query'
import { getAllUsers } from '../api/admin'


export const useGetAllUsers = ()=>{
    return useQuery({
        queryKey: ["users"],
        queryFn: getAllUsers,
        staleTime: 60000,
        refetchOnWindowFocus: false
    })
}