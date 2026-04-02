import {useInfiniteQuery} from '@tanstack/react-query'
import { getAuditLog } from '../api/auditLog'
//[[{},{}],[{},{}]]=>allPage
export const useAuditLog = ()=>{
     return useInfiniteQuery({
        queryKey: ['auditlog','infinite log'],
        queryFn: getAuditLog,
        initialPageParam: 1,
        
        getNextPageParam:(lastPage, allPages)=>{
            const currentLogs = lastPage.logs || [];
            if (currentLogs.length === 0) {
                return undefined;
            }
            return allPages.length + 1
        }
     })
}

