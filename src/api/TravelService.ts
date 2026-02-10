import type { PagedResponse, TravelResponse, TravelResponseWithTraveler } from "../type/Types";
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

export const GetHrTravel = async ({pageNumber = 1,pageSize = 10}) : Promise<PagedResponse<TravelResponse>> =>{
    try {
        const token = localStorage.getItem("token")
        console.log(pageNumber);
        console.log(pageSize);
        
        const response = await api.get<PagedResponse<TravelResponse>>(`/travel/hr?PageSize=${pageSize}&PageNumber=${pageNumber}`,{
            headers : {
                'Authorization' : `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        console.error("Error White fetching Hr's Travel : ", error)
        throw new Error('failed to fetch Travel')
    }
}
export const GetTravelWithTravelers = async (travelId:number) : Promise<TravelResponseWithTraveler> =>{
    try {
        if(!travelId)
            throw new Error("Travel id Not found !");
        const token = localStorage.getItem("token")
        const response = await api.get<TravelResponseWithTraveler>(`/travel/${travelId}/travelers`,{
            headers : {
                'Authorization' : `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        console.error("Error White fetching Travel : "+travelId, error)
        throw new Error('failed to fetch Travel ' + travelId)
    }
}