import api from './axios'


export const submitFeedback = async(eventId)=>{
        const response = await api.post(`/api/feedback/${eventId}`)
        return response.data
}

export const getFeedbacks = async()=>{
     const response = await api.get('/api/organizer/feedbacks')
     return response.data
}
