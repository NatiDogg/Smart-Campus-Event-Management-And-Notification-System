import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {getOrganizerDashboard,getRegisteredStudents,markStudentAttendance,organizerAnalytics} from '../api/organizer'
import {toast} from 'react-hot-toast'

export const  useGetOrganizerDashboard = ()=>{
    return useQuery({
        queryKey: ['organizerDashboard'],
        queryFn: getOrganizerDashboard,
        staleTime: 60000,
        refetchOnWindowFocus: false
    })
}
export const useGetRegisteredStudents = (eventId,options = {})=>{
    return useQuery({
        queryKey:['registeredStudents',eventId],
        queryFn:()=>getRegisteredStudents(eventId),
        staleTime: 60000,
        refetchOnWindowFocus: false,
        ...options
    })
}

export const useMarkStudentAttendance = ()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:markStudentAttendance,
        onMutate:async(variables)=>{
            await queryClient.cancelQueries({queryKey: ['registeredStudents', variables.eventId]})
            const previousRegistrationList = queryClient.getQueryData(['registeredStudents', variables.eventId])
            queryClient.setQueryData(['registeredStudents', variables.eventId], (old)=>{
                if (!old) return old;
                return {
                    ...old,
                    registeredStudent: old.registeredStudent.map((reg)=> reg.student._id === variables.data.studentId ? {...reg, isPresent: variables.data.isPresent} : reg)
                }
            })
            return {previousRegistrationList}
        },
        onSuccess:(data,variables)=>{
          toast.success(data.message)
           
        },
        onError:(error,variables,context)=>{
            if(context?.previousRegistrationList){
                queryClient.setQueryData(['registeredStudents',variables.eventId], context.previousRegistrationList)
            }
          const errorMessage = error.response?.data?.message || 'Failed to mark Attendance'
          toast.error(errorMessage)
        },
        onSettled:(data,error,variables)=>{
          queryClient.invalidateQueries({queryKey: ['registeredStudents',variables.eventId]})
        }
    })
}
export const useGetOrganizerAnalytics = ()=>{
    return useQuery({
        queryKey: ['organizerAnalytics'],
        queryFn:organizerAnalytics,
        staleTime: 60000,
        refetchOnWindowFocus: false
    })
}






