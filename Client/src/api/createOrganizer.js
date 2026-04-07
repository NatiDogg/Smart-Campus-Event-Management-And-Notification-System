import api from './axios' 
export const createOrganizer = async(organizerData)=>{
       
     const response = await api.post('/api/admin/createOrganizer', organizerData)

     return response.data


}