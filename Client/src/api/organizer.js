import api from './axios';

export const getOrganizerDashboard = async()=>{
    const response = await api.get("/api/organizer/dashboard")
    return response.data
}