import api from './axios'

export const updateProfile = async(userData)=>{
   const response = await api.patch('/api/user/profile', userData)
   return response.data
}