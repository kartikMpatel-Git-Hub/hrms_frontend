import type { ExpenseCategoryCreateDto, ExpenseCategoryResponseDto, PagedRequestDto, PagedResponse, TravelerExpenseDto } from "../type/Types";
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

export const GetTravelTravelerExpense = async (travelId : number,travelerId : number,paged:PagedRequestDto): Promise<PagedResponse<TravelerExpenseDto>> => {
    const response = await api.get<PagedResponse<TravelerExpenseDto>>(`/travel/${travelId}/traveler/${travelerId}/expenses?pageNumber=${paged.pageNumber}&pageSize=${paged.pageSize}`)
    return response.data
}
export const GetEmployeeExpense = async (travelId : number ,paged : PagedRequestDto): Promise<PagedResponse<TravelerExpenseDto>> => {
    const response = await api.get<PagedResponse<TravelerExpenseDto>>(`/travel/${travelId}/expense?pageNumber=${paged.pageNumber}&pageSize=${paged.pageSize}`)
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

export const GetAllExpenseForHr = async ({pageNumber,pageSize} : any): Promise<PagedResponse<TravelerExpenseDto>> => {
    const response = await api.get<PagedResponse<TravelerExpenseDto>>(`/travel/all-expense?pageNumber=${pageNumber}&pageSize=${pageSize}`)
    return response.data
}