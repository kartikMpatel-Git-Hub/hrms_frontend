import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axios from "axios";

const api: AxiosInstance = axios.create({
    baseURL: "https://localhost:7041/",
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
},
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use((response: AxiosResponse): AxiosResponse => {
    return response
},
    (error: AxiosError) => {
        if(error.response && error.response.status === 401){
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            console.log("Unauthorized request. Redirecting to login...");
            window.location.href = "/"
        }
        return Promise.reject(error.response?.data)
    }
)

export default api