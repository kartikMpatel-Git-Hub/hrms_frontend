import { data } from "react-router-dom";
import type { ExpenseCategoryCreateDto, ExpenseCategoryResponseDto, TravelerExpenseDto } from "../type/Types";
import api from "./Api";

// export const GetExpenses = async (): Promise<[]> => {
//     const response = await api.get<DepartmentResponseDto[]>(`/department`)
//     return response.data
// }
export const GetExpensesCategories = async (): Promise<ExpenseCategoryResponseDto[]> => {
    const response = await api.get<ExpenseCategoryResponseDto[]>(`/travel/expense/category`)
    return response.data
}
export const CreateExpenseCategory = async (newExpenseCategory : ExpenseCategoryCreateDto): Promise<ExpenseCategoryResponseDto> => {
    const response = await api.post<ExpenseCategoryResponseDto>(`/travel/expense/category`,newExpenseCategory)
    return response.data
}

export const GetTravelTravelerExpense = async ({travelId,travelerId} : any): Promise<TravelerExpenseDto[]> => {
    const response = await api.get<TravelerExpenseDto[]>(`/travel/${travelId}/traveler/${travelerId}/expense`)
    return response.data
}
export const GetEmployeeExpense = async ({travelId} : any): Promise<TravelerExpenseDto[]> => {
    const response = await api.get<TravelerExpenseDto[]>(`/travel/${travelId}/expense`)
    return response.data
}

export const ChangeExpenseStatus = async ({travelId,travelerId,expenseId,dto}:any) : Promise<TravelerExpenseDto> => {
    const response = await api.patch<TravelerExpenseDto>(`/travel/${travelId}/traveler/${travelerId}/expense/${expenseId}`,dto)
    return response.data
}

export const AddExpense = async ({travelId,dto}:any) : Promise<TravelerExpenseDto> =>{
    const response = await api.post<TravelerExpenseDto>(`/travel/${travelId}/expense`,dto,{
        headers : {
            "Content-Type" : "multipart/form-data"
        }
    })
    return response.data
}