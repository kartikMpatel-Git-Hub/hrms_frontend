export interface LoginRequest {
    email : string,
    password : string
}

export interface User {
  role: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => void; 
//   logout: () => void;
}

export interface PagedResponse<T> {
  pageNumber : number,
  pageSize : number,
  totalRecords : number,
  totalPage : number,
  data : T[]
}

export interface TravelResponse{
   id : number,
   title : string,
   description : string,
   startDate : Date,
   endDate : Date,
   location : string,
   createdBy : number,
   maxAmountLimit : number
}
export interface TravelCreateRequest{
   Title : string,
   Description : string,
   StartDate : Date | null,
   EndDate : Date | null,
   Location : string,
   MaxAmountLimit : number
}

export interface Traveler{
  id : number,
  fullName : string,
  email : string,
  image : string,
  role : string,
  dateOfBirth : Date,
  dateOfJoin : Date,
  managerId : number,
  designation : string
}

export interface TravelerResponse{
  id : number,
  travelerr : Traveler
}

export interface TravelResponseWithTraveler{
   id : number,
   title : string,
   description : string,
   startDate : Date,
   endDate : Date,
   location : string,
   createdBy : number,
   maxAmountLimit : number,
   travelers : TravelerResponse[]
}

export interface DepartmentResponseDto{
  id : number,
  departmentName : string
}
export interface DepartmentCreateDto{
  departmentName : string
}

export interface ExpenseCategoryResponseDto{
  id : number,
  category : string
}

export interface ExpenseCategoryCreateDto{
  category : string
}

export interface ExpenseProofDto{
  id : number,
  proofDocumentUrl : string,
  documentType : string,
  remakrs : string
}

export interface TravelerExpenseDto{
  id : number,
  amount : number,
  category : ExpenseCategoryResponseDto,
  status : string,
  remarks : string,
  details : string,
  expenseDate : Date,
  proofs : ExpenseProofDto[]
}

export interface ExpenseStatusCreateDto{
  status : string,
  remarks : string | null
}

export interface PagedRequestDto{
  pageNumber: number,
  pageSize : number
}

export interface ExpenseCreateDto{
  Amount : number,
  CategoryId : number,
  Details : string,
  ExpenseDate : Date | null
}

export interface NotificationResponseDto{
  id : number,
  title : string,
  description : string,
  notificationDate : Date
}

export interface NotificationCountDto {
  count : number
}