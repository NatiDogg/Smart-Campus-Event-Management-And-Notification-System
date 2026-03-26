import api from "./axios"

export const registerUser = async(userData)=>{
     const response = await api.post('/api/auth/signin',userData)
     return response.data
}

export const loginUser = async(userData)=>{
     const response = await api.post('/api/auth/login',userData)
     return response.data
}
export const logoutUser = async()=>{
     const response = await api.post('/api/auth/logout');
     return response.data
}
export const verifySession = async()=>{
     const response = await api.post('/api/auth/refresh')
     return response.data
}