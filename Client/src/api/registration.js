import api from "./axios";

export const registerStudent = async(eventId)=>{
     const response = await api.post(`/api/registration/register/${eventId}`);
     return response.data;
}
export const unregisterStudent = async(eventId)=>{
     const response = await api.delete(`/api/registration/unregister/${eventId}`);
     return response.data;
}


