import type { JobResponseDto, JobResponseWithReviewerDto, JobUpdateDto, PagedRequestDto, PagedResponse, ReferredJobRequestDto, ReferredResponseDto, ShareJobRequestDto, ShareResponseDto, SimpleResponseDto, UserReponseDto } from "../type/Types"
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
    const response = await api.get<PagedResponse<JobResponseDto>>(`/job/hr/created?pageNumber=${pageNumber}&pageSize=${pageSize}`)
    return response.data
}

export const GetAllJob = async ({ pageNumber = 1, pageSize = 10 }: PagedRequestDto): Promise<PagedResponse<JobResponseDto>> => {
    const response = await api.get<PagedResponse<JobResponseDto>>(`/job?pageNumber=${pageNumber}&pageSize=${pageSize}`)
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

export const ShareJob = async ({ id, email }: any): Promise<ShareResponseDto> => {
    const response = await api.post<ShareResponseDto>(`/job/${id}/share`, { SharedTo: email })
    return response.data
}
export const ReferedJob = async ({ id, dto }: ReferredJobRequestDto): Promise<ReferredResponseDto> => {
    const response = await api.post<ReferredResponseDto>(`/job/${id}/referre`, dto, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return response.data
}

export const DeleteJob = async (id: number): Promise<SimpleResponseDto> => {
    const response = await api.delete<SimpleResponseDto>(`/job/${id}`)
    return response.data
}

export const GetSharedJobs = async ({jobid, paged}: {jobid: number, paged: PagedRequestDto}): Promise<PagedResponse<ShareResponseDto>> => {
    const response = await api.get<PagedResponse<ShareResponseDto>>(`/job/${jobid}/share?pageNumber=${paged.pageNumber}&pageSize=${paged.pageSize}`)
    return response.data
}

export const GetJobReferrals = async ({jobid, paged }: {jobid: number , paged : PagedRequestDto}): Promise<PagedResponse<ReferredResponseDto>> => {
    const response = await api.get<PagedResponse<ReferredResponseDto>>(`/job/${jobid}/referred?pageNumber=${paged.pageNumber}&pageSize=${paged.pageSize}`)
    return response.data
}

export const UpdateJob = async ({id, dto} : {id: number, dto: JobUpdateDto}): Promise<JobResponseDto> => {
    const response = await api.put<JobResponseDto>(`/job/${id}`, dto)
    return response.data
}