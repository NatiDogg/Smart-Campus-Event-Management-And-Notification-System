import api from './axios';

export const getOrganizerDashboard = async()=>{
    const response = await api.get("/api/organizer/dashboard")
    return response.data
}
export const getRegisteredStudents = async(eventId)=>{
    const response = await api.get(`api/organizer/registeredStudents/${eventId}`)
    return response.data;
}

export const markStudentAttendance = async({eventId, data})=>{
   const response = await api.patch(`api/organizer/attendance/mark/${eventId}`, data)
   return response.data
}
export const organizerAnalytics = async()=>{
   const response = await api.get('/api/organizer/analytics');
   return response.data;
}


