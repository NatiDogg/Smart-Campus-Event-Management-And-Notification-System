import {useMutation, useQuery} from '@tanstack/react-query'
import {getOrganizerDashboard} from '../api/organizer'


export const  useGetOrganizerDashboard = ()=>{
    return useQuery({
        queryKey: ['organizerDashboard'],
        queryFn: getOrganizerDashboard,
        staleTime: 60000,
        refetchOnWindowFocus: false
    })
}


{/*

ActiveEventsLength: 4
activeEvents: (4) [{…}, {…}, {…}, {…}]
attendanceCount: 0
averageRating: 0
message:  "Organizer Dashboard Data Fetched Successfully!"
pendingEventsCount : 0
success :  true
*/}

