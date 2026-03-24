import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers:{
        "Content-Type": "application/json"
    }
})
// The  Request Interceptor
api.interceptors.request.use(
    (config) => {
        // We will manually attach the token here
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default api;
