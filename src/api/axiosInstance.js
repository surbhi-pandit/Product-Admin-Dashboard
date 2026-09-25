import axios from 'axios'


const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000
})

// REQUEST INTERCEPTOR
// This runs before every single request goes out.
// We attach the token here so we never have to manually add it in each API call.
axiosInstance.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('token')
        if(token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// RESPONSE INTERCEPTOR
// This runs after every response (success or failure) comes back.
// Centralizing error handling here means individual components don't need try-catch boilerplate for common cases like 401.

axiosInstance.interceptors.response.use(
    (response) => response, 
    (error) => {
        if(error.response){
            const status = error.response.status

            // If token is invalid or expired, force logout and redirect to login
            if(status === 401){
                localStorage.removeItem('token')
                window.location.href = '/login'
            }
        }

        // Still reject so the calling component can show specific error UI if needed
        return Promise.reject(error)
    }
)


export default axiosInstance