export interface LoginRequest {
  email: string,
  password: string
}

export interface User {
  role: string;
  email: string;
}

export interface UserReponseDto {
  id: number,
  fullName: string,
  email: string,
  image: string,
  role: string,
  dateOfBirth: Date,
  dateOfJoin: Date,
  managerId: number,
  department: {
    id: number,
    departmentName: string
  },
  designation: string
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => void;
  //   logout: () => void;
}

export interface PagedResponse<T> {
  pageNumber: number,
  pageSize: number,
  totalRecords: number,
  totalPages: number,
  data: T[]
}

export interface TravelResponse {
  id: number,
  title: string,
  description: string,
  startDate: Date,
  endDate: Date,
  location: string,
  createdBy: number,
  maxAmountLimit: number
}
export interface TravelCreateRequest {
  Title: string,
  Description: string,
  StartDate: Date | null,
  EndDate: Date | null,
  Location: string,
  MaxAmountLimit: number
}

export interface Traveler {
  id: number,
  fullName: string,
  email: string,
  image: string,
  role: string,
  dateOfBirth: Date,
  dateOfJoin: Date,
  managerId: number,
  designation: string
}

export interface TravelerResponse {
  id: number,
  travelerr: Traveler
}

export interface TravelResponseWithTraveler {
  id: number,
  title: string,
  description: string,
  startDate: Date,
  endDate: Date,
  location: string,
  createdBy: number,
  maxAmountLimit: number,
  travelers: TravelerResponse[]
}

export interface DepartmentResponseDto {
  id: number,
  departmentName: string
}
export interface DepartmentCreateDto {
  departmentName: string
}

export interface ExpenseCategoryResponseDto {
  id: number,
  category: string
}

export interface ExpenseCategoryCreateDto {
  category: string
}

export interface ExpenseProofDto {
  id: number,
  proofDocumentUrl: string,
  documentType: string,
  remakrs: string
}

export interface TravelerExpenseDto {
  id: number,
  amount: number,
  travelId: number,
  travelerId: number,
  category: ExpenseCategoryResponseDto,
  status: string,
  remarks: string,
  details: string,
  expenseDate: Date,
  proofs: ExpenseProofDto[]
}

export interface ExpenseStatusCreateDto {
  status: string,
  remarks: string | null
}

export interface PagedRequestDto {
  pageNumber: number,
  pageSize: number
}

export interface ExpenseCreateDto {
  Amount: number,
  CategoryId: number,
  Details: string,
  ExpenseDate: Date | null
}

export interface NotificationResponseDto {
  id: number,
  title: string,
  description: string,
  notificationDate: Date
}

export interface NotificationCountDto {
  count: number
}

export interface JobResponseDto {
  id: number,
  title: string,
  jobRole: string,
  place: string,
  requirements: string,
  jdUrl: string,
  createdBy: number,
  contactTo: number,
  isActive: boolean
}

export interface JobCreateDto {
  Title: string,
  JobRole: string,
  Place: string,
  Requirements: string,
}

export interface JobUpdateDto {
  Title: string,
  JobRole: string,
  Place: string,
  Requirements: string,
  IsActive: boolean
}

export interface JobResponseWithReviewerDto {
  id: number,
  title: string,
  jobRole: string,
  place: string,
  requirements: string,
  jdUrl: string,
  contact: UserReponseDto,
  isActive: boolean,
  reviewers: ReviewerReponseDto[]
}

export interface ReviewerReponseDto {
  id: number,
  reviewer: UserReponseDto
}

export interface TravelDocumentDto {
  id: number,
  documentUrl: string,
  documentName: string,
  documentType: string,
  uploader: UserReponseDto,
  uploadedAt: Date
}

export interface ShareJobRequestDto {
  id: number,
  dto: {
    SharedTo: string
  }
}

export interface ShareResponseDto {
  id: number,
  sharedTo: string,
  sharedBy: number,
  shared: string,
  jobId: number,
  sharedAt: Date
}


export interface ReferredJobRequestDto {
  id: number,
  dto: FormData
}
export interface ReferredResponseDto {
  id: number,
  referedPersonName: string,
  referedPersonEmail: string,
  cvUrl: string,
  note: string,
  referedBy: number,
  referer: string,
  jobId: number,
  status: string,
  referedAt: Date
}

export interface JobSharedResponseDto {

}

export interface GameResponseDto {
  id: number,
  name: string,
  maxPlayer: number,
  minPlayer: number,
  duration: number,
  SlotAssignedBeforeMinutes: number,
  SlotCreateForNextXDays: number
}

export interface GameCreateDto {
  Name: string,
  MaxPlayer: number,
  MinPlayer: number,
  Duration: number,
  SlotAssignedBeforeMinutes: number,
  SlotCreateForNextXDays: number
}

export interface GameOperatingHourCreateDto {
  OperationalStartTime: string,
  OperationalEndTime: string,
}

export interface GameOperatingHourCreateRequestDto {
  id: number,
  dto: GameOperatingHourCreateDto
}
export interface GameOperatingHourResponseDto {
  id: number,
  GameId: number,
  operationalStartTime: string,
  operationalEndTime: string,
}

export interface GameResponseWithSlotDto {
  id: number,
  name: string,
  maxPlayer: number,
  minPlayer: number,
  duration: number,
  slotAssignedBeforeMinutes  : number,
  slotCreateForNextXDays : number,
  gameOperationWindows: GameOperatingHourResponseDto[]
}

export interface GameSlotResponseDto {
  id: number,
  gameId: number,
  startTime: string,
  endTime: string,
  date: Date,
  bookedAt: Date | null,
  status: string,
}

export interface GameSlotPlayerResponseDto {
  id: number,
  slotId: number,
  playerId: number,
  player: UserMinimalDto
}

export interface GameSlotDetaildResponseDto {
  id: number,
  gameId: number,
  startTime: string,
  endTime: string,
  date: Date,
  bookedById: number | null,
  bookedBy: UserReponseDto | null,
  status: string,
  bookedAt: Date | null,
  players: GameSlotPlayerResponseDto[]
}

export interface BookingSlotResponseDto {
  id: number,
  gameId: number,
  bookedBy: number,
  startTime: string,
  endTime: string,
  date: Date,
  status: string
}

export interface GameSlotOffereResponseDto {
  id: number,
  slot: BookingSlotResponseDto,
  status: string,
  createdAt: Date
}

export interface GameSlotWaitingResponseDto {
  id: number,
  gameSlotId: number,
  requestedById: number,
  requestedBy: UserMinimalDto,
  requestedAt: Date,
  waitingPlayers: GameSlotWaitingPlayerResponseDto[]
}

export interface GameSlotWaitingPlayerResponseDto {
  id: number,
  gameSlotWaitingId: number,
  playerId: number,
  player: UserMinimalDto,
}

export interface SimpleResponseDto {
  message: string
}

export interface PostResponseDto {
  id: number,
  title: string,
  description: string,
  postUrl: string,
  postByUser: UserMinimalDto,
  isPublic: boolean,
  // createdBy : number,
  createdAt: Date,
  isLiked: boolean,
  likeCount: number,
  commentCount: number
}

export interface PostDetailedResponseDto {
  id: number,
  title: string,
  description: string,
  postUrl: string,
  postByUser: UserMinimalDto,
  isPublic: boolean,
  createdAt: Date,
  isLiked: boolean,
  likeCount: number,
  commentCount: number,
  isinappropriate: boolean,
  tags: TagResponseDto[],
}

export interface TagResponseDto {
  id: number,
  tagName: string
}

export interface CommentResponseDto {
  id: number,
  comment: string,
  commentBy: UserMinimalDto,
  createdAt: Date
}

export interface PostUpdateDto {
  Title: string,
  Description: string,
  IsPublic: boolean,
}

export interface UserMinimalDto {
  id: number,
  fullName: string,
  email: string,
  image: string
}

export interface DailyCelebrationResponseDto {
  id: number,
  userId: number,
  user: UserReponseDto,
  eventType: string,
  eventDate: Date,
  type: string,
  description: string,
  celebrationDate: Date
}

export interface UpcomingBookingResponseDto {
  id: number,
  startTime: string,
  endTime: string,
  date: Date,
  game : GameResponseDto,
  bookedBy : UserMinimalDto,
  bookedAt: Date,
  status : string,
  playerCount: number
}