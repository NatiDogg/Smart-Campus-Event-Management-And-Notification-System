import api from './axios'


export const submitFeedback = async(feedbackData)=>{
         const { id, ...rest } = feedbackData;
        const response = await api.post(`/api/feedback/submit/${id}`, rest)
        return response.data
}

export const getFeedbacks = async()=>{
     const response = await api.get('/api/organizer/feedbacks')
     return response.data
}
