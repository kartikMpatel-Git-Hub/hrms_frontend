import type { DepartmentCreateDto, DepartmentResponseDto } from "../type/Types";
import api from "./Api";

export const GetDepartments = async (): Promise<DepartmentResponseDto[]> => {
    const response = await api.get<DepartmentResponseDto[]>(`/department`)
    return response.data
}
export const CreateDepartment = async (newDepartment : DepartmentCreateDto): Promise<DepartmentResponseDto[]> => {
    const response = await api.post<DepartmentResponseDto[]>(`/department`,newDepartment)
    return response.data
}