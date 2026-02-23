import type { DailyCelebrationResponseDto, UpcomingBookingResponseDto } from "@/type/Types";
import api from "./Api";

export const GetTodayCelebrations = async () : Promise<DailyCelebrationResponseDto[]> => {
    const response = await api.get<DailyCelebrationResponseDto[]>(`/dashboard/daily-celebrations`)
    return response.data
}

export const GetUpcomingBookings = async () : Promise<UpcomingBookingResponseDto[]> => {
    const response = await api.get<UpcomingBookingResponseDto[]>(`/dashboard/upcoming-bookings`)
    return response.data
}