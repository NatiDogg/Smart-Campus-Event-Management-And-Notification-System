import api from "./axios";

export const subscribeCategory = async(data)=>{
    const response = await api.put('/api/subscription/category', data);
    return response.data
}