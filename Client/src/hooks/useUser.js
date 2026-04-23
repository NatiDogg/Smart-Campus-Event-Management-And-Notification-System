import {useQuery} from '@tanstack/react-query'
import {getAllOrganizers} from '../api/user'

export const useGetAllOrganizers = ()=>{
    return useQuery({
        queryKey: ['organizers'],
        queryFn: getAllOrganizers,
        staleTime: 60000,
        refetchOnWindowFocus: false
    })
}