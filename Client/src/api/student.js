import api from "./axios";

export const subscribeCategory = async(data)=>{
    const response = await api.put('/api/subscription/category', data);
    return response.data
}

export const getSubscribedCategories = async()=>{
    const response = await api.get('/api/subscription/all-subscription');
    return response.data.subscriptions
}



