import api from './axios'


export const createEvent = async(eventData)=>{
    
     const response = await api.post('/api/organizer/create',eventData)
    
     return response.data
        
}

export const editEvent = async(updateData)=>{
   const response = await api.put('/api/organizer/update', updateData);
   return response.data;
}


export const cancelEvent = async(eventId)=>{
  const response = await api.put(`/api/organizer/cancelEvent/${eventId}`)
  return response.data
}
export const getPendingEvents = async()=>{
    const response = await api.get("/api/admin/pendingEvents");
    return response.data;
}
export const approveEvent = async(eventId)=>{
   const response = await api.patch(`/api/admin/approve/${eventId}`)
   return response.data;
}
export const rejectEvent = async(eventId)=>{
  const response = await api.patch(`/api/admin/reject/${eventId}`)
  return response.data;
}

export const getAdminAllEvents = async()=>{
  const response = await api.get("/api/admin/events")
  return response.data;
}
