import api from './axios'

export const updateProfile = async(userData)=>{
   const response = await api.patch('/api/user/profile', userData)
   return response.data
}
export const getAllOrganizers = async()=>{
   const response = await api.get('/api/user/organizer');
   return response.data
}
