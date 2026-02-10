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

export interface Traveler{
  id : number,
  fullName : string,
  email : string,
  image : string,
  role : string,
  dateOfBirth : Date,
  dateOfJoin : Date,
  managerId : number
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
