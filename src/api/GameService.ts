import type { GameCreateDto, GameOperatingHourCreateDto, GameOperatingHourResponseDto, GameResponseDto, GameResponseWithSlotDto, GameSlotDetaildResponseDto, GameSlotResponseDto, GameSlotWaitingResponseDto, PagedResponse, UserReponseDto } from "@/type/Types";
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

export const DeleteGame = async (id: number): Promise<any> => {
    const response = await api.delete(`/game/${id}`)
    return response.data
}

export const CreateGameOperationSlot = async (gameId: number, dto: GameOperatingHourCreateDto): Promise<GameOperatingHourResponseDto> => {
    const response = await api.post<GameOperatingHourResponseDto>(`/game/${gameId}/operation-window`, dto)
    return response.data
}

export const GetGameOperationSlot = async (id: number): Promise<GameOperatingHourResponseDto[]> => {
    const response = await api.get<GameOperatingHourResponseDto[]>(`/game/${id}/operation-window`)
    return response.data
}

export const DeleteGameOperationSlot = async (gameId: number, slotId: number): Promise<any> => {
    const response = await api.delete(`/game/${gameId}/operation-window/${slotId}`)
    return response.data
}

export const GetGameSlots = async (id: number): Promise<GameSlotResponseDto[]> => {
    const response = await api.get<GameSlotResponseDto[]>(`/game/${id}/slots`)
    return response.data
}

export const GetGameSlot = async (gameId: number, slotId: number): Promise<GameSlotDetaildResponseDto> => {
    const response = await api.get<GameSlotDetaildResponseDto>(`/game/${gameId}/slots/${slotId}/details`)
    return response.data
}

export const GetGameSlotWaitlist = async (gameId: number, slotId: number): Promise<GameSlotWaitingResponseDto[]> => {
    const response = await api.get<GameSlotWaitingResponseDto[]>(`/game/${gameId}/slots/${slotId}/waitlist`)
    return response.data
}
export const GetGameSlotDetail = async (gameId: number, slotId: number): Promise<GameSlotDetaildResponseDto> => {
    const response = await api.get<GameSlotDetaildResponseDto>(`/game/${gameId}/slots/${slotId}/details`)
    return response.data
}

export const GetAvailablePlayers = async (gameId: number, pageSize: number, pageNumber: number, key: string): Promise<UserReponseDto[]> => {
    const response = await api.get<PagedResponse<UserReponseDto>>(`/game/${gameId}/booking/available-players?pageNumber=${pageNumber}&pageSize=${pageSize}&key=${key}`)
    return response.data.data
}

export const BookGameSlot = async (gameId: number, slotId: number, playerIds: number[]): Promise<GameSlotResponseDto> => {
    const response = await api.post<GameSlotResponseDto>(`/game/${gameId}/slots/${slotId}`, { Players : playerIds })
    return response.data
}

export const IsUserInterestedInGame = async (gameId: number): Promise<{isInterested: boolean}> => {
    const response = await api.get(`/game/${gameId}/toggle-interest`)
    return response.data
}

export const ChangeUserInterest = async (gameId: number): Promise<any> => {
    const response = await api.patch(`/game/${gameId}/toggle-interest`, {})
    return response.data
}