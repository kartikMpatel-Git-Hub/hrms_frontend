import type { JobCreateDto, JobResponseDto, JobResponseWithReviewerDto, PagedRequestDto, PagedResponse, UserReponseDto } from "../type/Types"
import api from "./Api"

export const AddJob = async ({ dto }: any): Promise<JobResponseDto> => {
    const response = await api.post<JobResponseDto>(`/job`, dto, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return response.data
}

export const GetJobById = async (jobId: number): Promise<JobResponseWithReviewerDto> => {
    const response = await api.get<JobResponseWithReviewerDto>(`/job/${jobId}/reviewers`)
    return response.data
}

export const GetHrJobs = async ({ pageNumber = 1, pageSize = 10 }: PagedRequestDto): Promise<PagedResponse<JobResponseDto>> => {
    const response = await api.get<PagedResponse<JobResponseDto>>(`/job/hr/created?pageNumber${pageNumber}&pageSize=${pageSize}`)
    return response.data
}

export const GetAllJob = async ({ pageNumber = 1, pageSize = 10 }: PagedRequestDto): Promise<PagedResponse<JobResponseDto>> => {
    const response = await api.get<PagedResponse<JobResponseDto>>(`/job?pageNumber${pageNumber}&pageSize=${pageSize}`)
    return response.data
}

export const GetUserByKey = async (key: string): Promise<UserReponseDto[]> => {
    const response = await api.get<UserReponseDto[]>(`/user/search/all?key=${key}`,)
    return response.data
}

export const GetHrByKey = async (key: string): Promise<UserReponseDto[]> => {
    const response = await api.get<UserReponseDto[]>(`/user/search/hr?key=${key}`,)
    return response.data
}