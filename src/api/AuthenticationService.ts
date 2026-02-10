import type { LoginRequest } from "../type/Types";
import api from "./Api";

// export const getProducts = async ():
//     Promise<ProductDto[]> => {
//     // Promise<GetProducts> => {
//     try {
//         const response = await api.get<GetProducts>('/products')
//         return response.data.products
//     } catch (error) {
//         console.error("Error White fetching Products : ", error)
//         throw new Error('failed to fetch products')
//     }
// }
// export const getProductByid = async (id:number):
//     Promise<ProductDto> => {
//     try {
//         const response = await api.get<ProductDto>(`/products/${id}`)
//         return response.data
//     } catch (error) {
//         console.error("Error White fetching Product : ", error)
//         throw new Error('failed to fetch product')
//     }
// }

export const LoginService = async (credentials : LoginRequest)=>{
    try {
        const response = await api.post(`Authentication/login`,credentials)
        return response.data
    } catch (error : any) {
        throw new Error(error.response.data.error.details)
    }
}