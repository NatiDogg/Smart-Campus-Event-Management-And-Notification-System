import api from "./axios";


export const markInterest = async(eventId)=>{
   const response = await api.post(`/api/interest/mark/${eventId}`)
   return response.data;
}

export const unMarkInterest = async(eventId)=>{
   const response = await api.delete(`/api/interest/unmark/${eventId}`)
   return response.data;
}