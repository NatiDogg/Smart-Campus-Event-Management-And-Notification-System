import api from "./axios"

export const registerUser = async(userData)=>{
     const response = await api.post('/api/auth/signin',userData)
     return response.data
}

export const loginUser = async(userData)=>{
     const response = await api.post('/api/auth/login',userData)
     return response.data
}
export const googleSignInUrl = async()=>{
   const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    window.location.href = `${backendUrl}/api/auth/google`;
}

export const logoutUser = async()=>{
     const response = await api.post('/api/auth/logout');
     return response.data
}
export const verifySession = async()=>{
     const response = await api.post('/api/auth/refresh')
     return response.data
}

export const verifyUser = async(token)=>{
     const response = await api.get(`/api/auth/me/${token}`);
     return response.data
}