import type { DailyCelebrationResponseDto } from "@/type/Types";
import api from "./Api";

export const GetTodayCelebrations = async () : Promise<DailyCelebrationResponseDto[]> => {
    const response = await api.get<DailyCelebrationResponseDto[]>(`/dashboard/daily-celebrations`)
    return response.data
}