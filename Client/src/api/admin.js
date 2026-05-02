import api from './axios'

export const getAllUsers = async()=>{
    
    const response = await api.get('/api/admin/users')
    return response.data
}
export const deleteUser = async(userId)=>{
   const response = await api.delete(`/api/admin/deactivate/${userId}`)
   return response.data
}
export const getAdminDashboard = async()=>{
    const response = await api.get('/api/admin/dashboard');
    return response.data
}
export const createAnnouncement = async(announcementData)=>{
    const response = await api.post("/api/admin/createAnnouncement", announcementData);
    return response.data;
}

export const getAdminAnalytics = async()=>{
    const response = await api.get("/api/admin/analytics");
    return response.data;
}

export const getExportedPdf = async(analyticsData)=>{
    const response = await api.post('/api/admin/export-pdf', 
    { analyticsData },
    { responseType: 'blob' } 
  );
  return response.data
}













