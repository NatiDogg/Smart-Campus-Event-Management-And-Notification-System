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
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// The response Interceptor

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 1. Check if error is 401 AND we haven't tried a retry yet
       if (
            error.response?.status === 401 && 
            !originalRequest._retry &&
            !originalRequest.url.includes('/login') && 
            !originalRequest.url.includes('/refresh')
        ) {
            originalRequest._retry = true; 

            try {
                // 2. Perform the refresh call
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh`,
                    {},
                    { withCredentials: true }
                ); 

                const { accessToken } = response.data;

                // 3. Update headers for future and current request
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                // 4. Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // 5. If refresh fails, the session is dead
                console.error("Refresh token expired. Logging out...");
                window.location.href = '/login'; 
                return Promise.reject(refreshError);
            }
        }

        // 6. For all other errors (404, 500, etc.), just reject normally
        return Promise.reject(error);
    }
);

export default api;
