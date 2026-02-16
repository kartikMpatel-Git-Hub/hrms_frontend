import type { UserReponseDto } from "@/type/Types";
import api from "./Api";

export const GetUserChart = async (id:number): Promise<UserReponseDto[]> => {
    const response = await api.get<UserReponseDto[]>(`/user/${id}/organization-chart`)
    return response.data
}