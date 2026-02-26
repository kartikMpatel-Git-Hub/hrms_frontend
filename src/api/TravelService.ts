import type { PagedRequestDto, PagedResponse, TravelCreateRequest, TravelDocumentDto, Traveler, TravelerExpenseDto, TravelerResponse, TravelResponse, TravelResponseWithTraveler } from "../type/Types";
import api from "./Api";

export const GetHrTravel = async ({ pageNumber = 1, pageSize = 10 }): Promise<PagedResponse<TravelResponse>> => {
    const response = await api.get<PagedResponse<TravelResponse>>(`/travel/hr?PageSize=${pageSize}&PageNumber=${pageNumber}`)
    return response.data

}
export const GetEmployeeTravel = async ({ pageNumber = 1, pageSize = 10 }): Promise<PagedResponse<TravelResponse>> => {
    const response = await api.get<PagedResponse<TravelResponse>>(`/travel/employee?PageSize=${pageSize}&PageNumber=${pageNumber}`)
    return response.data
}
export const GetTravelWithTravelers = async (travelId: number): Promise<TravelResponseWithTraveler> => {
    if (!travelId)
        throw new Error("Travel id Not found !");
    const response = await api.get<TravelResponseWithTraveler>(`/travel/${travelId}/travelers`)
    return response.data

}

export const CreateTravel = async (travel: TravelCreateRequest): Promise<TravelResponse> => {
    const response = await api.post<TravelResponse>(`/travel`, travel)
    return response.data

}

export const GetTravelersByName = async (key: string): Promise<Traveler[]> => {
    const response = await api.get<Traveler[]>(`/user/search/employee?key=${key}`)
    return response.data
}

export const AddTraveler = async ({ travelId, travelerId }: any): Promise<TravelerResponse[]> => {
    const response = await api.post<TravelerResponse[]>(`/travel/${travelId}/travelers/${travelerId}`, {})
    return response.data
}

export const GetTravelTravelerDocuments = async (travelId : number, travelerId : number,paged : PagedRequestDto): Promise<PagedResponse<TravelDocumentDto>> => {
    const response = await api.get<PagedResponse<TravelDocumentDto>>(`/travel/${travelId}/traveler/${travelerId}/documents?pageNumber=${paged.pageNumber}&pageSize=${paged.pageSize}`)
    return response.data
}//

export const GetTravelerTravel = async (travelerId: number,paged : PagedRequestDto): Promise<PagedResponse<TravelResponse>> => {
    const response = await api.get<PagedResponse<TravelResponse>>(`/travel/traveler/${travelerId}?PageSize=${paged.pageSize}&PageNumber=${paged.pageNumber}`)
    return response.data
}

export const GetTravelerTravelExpenses = async ({travelId, travelerId,paged} : {travelId: number, travelerId: number, paged: PagedRequestDto}): Promise<PagedResponse<TravelerExpenseDto>> => {
    const response = await api.get<PagedResponse<TravelerExpenseDto>>(`/travel/${travelId}/traveler/${travelerId}/expense?pageNumber=${paged.pageNumber}&pageSize=${paged.pageSize}`)
    return response.data
}

export const GetTravelerTravelDocuments = async ({travelId, travelerId,paged} : {travelId: number, travelerId: number, paged: PagedRequestDto}): Promise<PagedResponse<TravelDocumentDto>> => {
    console.log(travelId, travelerId, paged);
    const response = await api.get<PagedResponse<TravelDocumentDto>>(`/travel/${travelId}/traveler/${travelerId}/document?pageNumber=${paged.pageNumber}&pageSize=${paged.pageSize}`)
    return response.data
} 

export const GetTravelById = async (travelId: number): Promise<TravelResponse> => {
    const response = await api.get<TravelResponse>(`/travel/${travelId}`)
    return response.data
}

export const AddTravelDocument = async ({ travelId, travelerId, formData }: { travelId: number, travelerId: number, formData: FormData }): Promise<TravelDocumentDto> => {
    const response = await api.post<TravelDocumentDto>(`/travel/${travelId}/traveler/${travelerId}/document`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
}