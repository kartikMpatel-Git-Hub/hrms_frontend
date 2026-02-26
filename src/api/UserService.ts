import type { PagedRequestDto, PagedResponse, UserReponseDto, UserProfileResponseDto } from "@/type/Types";
import api from "./Api";

export const GetUserChart = async (id: number): Promise<UserReponseDto[]> => {
    const response = await api.get<UserReponseDto[]>(`/user/${id}/organization-chart`)
    return response.data
}

export const GetAllUsers = async (): Promise<UserReponseDto[]> => {
    const response = await api.get<UserReponseDto[]>(`/user`)
    return response.data
}

export const GetUserForHr = async (paged: PagedRequestDto): Promise<PagedResponse<UserReponseDto>> => {
    const response = await api.get<PagedResponse<UserReponseDto>>(`/user/user-hr?PageNumber=${paged.pageNumber}&PageSize=${paged.pageSize}`)
    return response.data
}

export const CreateUser = async (userData: FormData): Promise<void> => {
    await api.post("/authentication/register", userData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

export const GetManagers = async (): Promise<PagedResponse<UserReponseDto>> => {
    const response = await api.get<PagedResponse<UserReponseDto>>(`/user/managers`)
    return response.data
}

export const GetMyTeamMembers = async ({ pageNumber = 1, pageSize = 10 }: PagedRequestDto): Promise<PagedResponse<UserReponseDto>> => {
    const response = await api.get<PagedResponse<UserReponseDto>>(`/user/my-team?PageSize=${pageSize}&PageNumber=${pageNumber}`)
    return response.data
}

export const UpdateUser = async ({ id, data }: { id: number; data: FormData }): Promise<void> => {
    await api.put(`/user/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

export const UserService = {
    getUserProfile: async (userId: number): Promise<UserProfileResponseDto> => {
        const response = await api.get<UserProfileResponseDto>(`/user/${userId}`)
        return response.data
    }
}