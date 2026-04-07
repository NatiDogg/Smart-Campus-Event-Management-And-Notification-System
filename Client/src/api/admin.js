import api from './axios'

export const getAllUsers = async()=>{
    
    const response = await api.get('/api/admin/users')
    return response.data
}
export const deleteUser = async(userId)=>{
   const response = await api.delete(`/api/admin/deactivate/${userId}`)
   return response.data
}













