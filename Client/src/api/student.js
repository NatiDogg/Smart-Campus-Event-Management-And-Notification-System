import api from "./axios";

export const subscribeCategory = async(data)=>{
    const response = await api.put('/api/subscription/category', data);
    return response.data
}

export const getSubscribedCategories = async()=>{
    const response = await api.get('/api/subscription/all-subscription');
    return response.data.subscriptions
}

export const getRecommendations = async()=>{
    const response = await api.get('/api/student/recommendations');
    return response.data.recommendations
}
export const getStudentEvents = async()=>{
    const response = await api.get('/api/student/my-events');
    return response.data;
}

export const getAnnouncements = async()=>{
    const response = await api.get('/api/student/announcement');
    return response.data.announcements;
}



