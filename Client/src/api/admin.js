import api from './axios'

export const getAllUsers = async()=>{
    
    const response = await api.get('/api/admin/users')
    return response.data
}











