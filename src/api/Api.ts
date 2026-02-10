import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axios from "axios";

const api: AxiosInstance = axios.create({
    baseURL: "https://localhost:7041/",
    // timeout: 2000,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // const token = localStorage.getItem("jwtToken")
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`
    // }
    console.log('Request sent to: ', config.url)
    return config
},
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use((response: AxiosResponse): AxiosResponse => {
    console.log('Response received from:', response.config.url);
    return response
},
    (error: AxiosError) => {
        if(error.response && error.response.status === 401){
            console.log("Unauthorized request. Redirecting to login...");
        }
        return Promise.reject(error)
    }
)

export default api