import api from './axios'


export const createEvent = async(eventData)=>{
    
     const response = await api.post('/api/organizer/create',eventData)
    
     return response.data
      
        
       
}