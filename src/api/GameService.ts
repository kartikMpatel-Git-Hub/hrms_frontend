import type { BookingSlotResponseDto, GameCreateDto, GameResponseDto, GameResponseWithSlotDto, GameSlotCreateDto, GameSlotResponseDto, PagedResponse, UserReponseDto } from "@/type/Types";
import api from "./Api";

export const GetAllGames = async (): Promise<PagedResponse<GameResponseDto>> => {
    const response = await api.get<PagedResponse<GameResponseDto>>(`/game`)
    return response.data
}
export const GetGameById = async (id: number): Promise<GameResponseWithSlotDto> => {
    const response = await api.get<GameResponseWithSlotDto>(`/game/${id}`)
    return response.data
}
export const CreateGame = async (dto: GameCreateDto): Promise<GameResponseDto> => {
    const response = await api.post<GameResponseDto>(`/game`, dto)
    return response.data
}
export const CreateGameSlot = async ({ id, dto }: GameSlotCreateDto): Promise<GameSlotResponseDto> => {
    const response = await api.post<GameSlotResponseDto>(`/game/${id}/slot`, dto)
    return response.data
}

export const DeleteGameSlot = async (gameId: number, slotId: number): Promise<any> => {
    const response = await api.delete(`/game/${gameId}/slot/${slotId}`)
    return response.data
}

export const DeleteGame = async (id: number): Promise<any> => {
    const response = await api.delete(`/game/${id}`)
    return response.data
}

export const GetGameSlots = async (id: number): Promise<BookingSlotResponseDto[]> => {
    const response = await api.get<BookingSlotResponseDto[]>(`/game/${id}/booking`)
    return response.data
}

export const GetAvailablePlayers = async (gameId: number, pageSize: number, pageNumber: number, key: string): Promise<UserReponseDto[]> => {
    const response = await api.get<PagedResponse<UserReponseDto>>(`/game/${gameId}/booking/available-players?pageNumber=${pageNumber}&pageSize=${pageSize}&key=${key}`)
    return response.data.data
}