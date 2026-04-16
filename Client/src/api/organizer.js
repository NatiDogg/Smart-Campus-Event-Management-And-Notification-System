import api from './axios';

export const getOrganizerDashboard = async()=>{
    const response = await api.get("/api/organizer/dashboard")
    return response.data
}
export const getRegisteredStudents = async(eventId)=>{
    const response = await api.get(`api/organizer/registeredStudents/${eventId}`)
    return response.data;
}
