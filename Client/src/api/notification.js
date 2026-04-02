import api from "./axios";


export const getNotification = async()=>{
    const response = await api.get(`/api/notification/get`)
    return response.data
}

export const deleteNotification = async(id)=>{
     const response = await api.delete(`/api/notification/delete/${id}`)
     return response.data
}