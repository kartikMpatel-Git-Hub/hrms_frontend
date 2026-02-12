import type { NotificationCountDto, NotificationResponseDto, PagedResponse } from "../type/Types"
import api from "./Api"

export const GetMyNotification = async ({ pageNumber = 1, pageSize = 10 }): Promise<PagedResponse<NotificationResponseDto>> => {
    const response = await api.get<PagedResponse<NotificationResponseDto>>(`/notification?pageNumber${pageNumber}&pageSize=${pageSize}`)
    return response.data
}
export const GetMyNotificationCount = async (): Promise<NotificationCountDto> => {
    const response = await api.get<NotificationCountDto>(`/notification/count`)
    return response.data
}