import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
    withCredentials: true
});

// attach the access token to every outgoing request
api.interceptors.request.use(
    (config) => {
        // Pull the token directly from the defaults we set on Login/Refresh
        const token = api.defaults.headers.common['Authorization'];
        if (token) {
            config.headers['Authorization'] = token;
           
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // FIX #2: Use a clearer check for the refresh status
        if (error.response?.status === 401 && !originalRequest._retry) {
         
        
            const isAuthRoute = originalRequest.url.includes('/login') || originalRequest.url.includes('/refresh');
            if (isAuthRoute) return Promise.reject(error);

            originalRequest._retry = true; 

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh`,
                    {},
                    { withCredentials: true }
                ); 

                const { accessToken } = response.data;
              
                const bearerToken = `Bearer ${accessToken}`;
                api.defaults.headers.common['Authorization'] = bearerToken;
                originalRequest.headers['Authorization'] = bearerToken;
            
                return api(originalRequest); 
            } catch (refreshError) {
            
                delete api.defaults.headers.common['Authorization'];
                window.location.href = '/login'; 
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
