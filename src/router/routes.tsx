import { createBrowserRouter } from 'react-router'
import Login from '../components/Login'
import NotFound from '../components/NotFound'
import HrLayout from '../components/HR/HrLayout'
import HrDashboard from '../components/HR/HrDashboard'
import HrTravel from '../components/HR/HrTravel'
import TravelDetail from '../components/HR/Travel/TravelDetail'
import TravelForm from '../components/HR/Travel/TravelForm'
import EmployeeLayout from '../components/EMPLOYEE/EmployeeLayout'
import EmployeeDashboard from '../components/EMPLOYEE/EmployeeDashboard'
import Department from '../components/HR/Department/Department'
import DepartmentForm from '../components/HR/Department/DepartmentForm'
import Expenses from '../components/HR/Expense/Expenses'
import ExpenseCategory from '../components/HR/Expense/ExpenseCategory'
import ExpenseCategoryForm from '../components/HR/Expense/ExpenseCategoryForm'
import TravelTravelerExpense from '../components/HR/Travel/TravelTravelerExpense'
import EmployeeTravels from '../components/EMPLOYEE/Travel/EmployeeTravels'
import EmployeeTravelExpense from '../components/EMPLOYEE/Expense/EmployeeTravelExpense'
import ExpenseCreateForm from '../components/EMPLOYEE/Expense/ExpenseCreateForm'
import Notifications from '../components/EMPLOYEE/utility/Notifications'
import HrJobs from '../components/HR/Job/HrJobs'
import HrJobDetail from '../components/HR/Job/HrJobDetail'
import HrJobCreateForm from '../components/HR/Job/HrJobCreateForm'
import EmployeeJob from '../components/EMPLOYEE/Job/EmployeeJob'
import HrTravelDocuments from '../components/HR/Travel/HrTravelDocuments'
import HrJobReferrals from '@/components/HR/Job/HrJobReferrals'
import EmployeeOrganizationChart from '@/components/utility/EmployeeOrganizationChart'
import EmployeeChart from '@/components/utility/EmployeeChart'
import HrGames from '@/components/HR/Game/HrGames'
import HrGameDetail from '@/components/HR/Game/HrGameDetail'
import EmployeeGames from '@/components/EMPLOYEE/game/EmployeeGames'
import GameSlotOfferes from '@/components/EMPLOYEE/game/GameSlotOfferes'
import ManagerLayout from '@/components/Manager/ManagerLayout'
import ManagerDashboard from '@/components/Manager/ManagerDashboard'
import ManagerJob from '@/components/Manager/Job/ManagerJob'
import ManagerGames from '@/components/Manager/Game/ManagerGames'
import HrJobShared from '@/components/HR/Job/HrJobShared'
import Posts from '@/components/POST/Posts'
import PostDetails from '@/components/POST/PostDetails'
import MyPosts from '@/components/POST/MyPosts'
import PostCreateForm from '@/components/POST/PostCreateForm'
import HrPosts from '@/components/HR/Post/HrPosts'
import InappropriatePosts from '@/components/HR/Post/InappropriatePosts'
import GameSlotDetail from '@/components/Game/GameSlotDetail'
import GameWaitlist from '@/components/Game/GameWaitlist'
import GameDetail from '@/components/Game/GameDetail'
import HrUsers from '@/components/HR/User/HrUsers'
import HrUserAddForm from '@/components/HR/User/HrUserAddForm'
import MyTeams from '@/components/Manager/Team/MyTeams'
import MemberTravels from '@/components/Manager/Team/MemberTravels'
import EmployeeTravelDetails from '@/components/EMPLOYEE/Travel/EmployeeTravelDetails'
import Dashboard from '@/components/utility/Dashboard'
import Welcome from '@/components/Welcome'
import TravelExpense from '@/components/Manager/Team/TravelExpense'
import TravelDocument from '@/components/Manager/Team/TravelDocument'
import EmployeeTravelDocuments from '@/components/EMPLOYEE/Travel/EmployeeTravelDocuments'

const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Login /> },
            { path: "Welcome", element: <Welcome /> },
            { path: "*", element: <NotFound /> },
            {
                path: 'hr',
                element: <HrLayout />,
                errorElement: <NotFound />,
                children: [
                    { index: true, path: "dashboard", element: <Dashboard /> },
                    {
                        path: "travel",
                        children: [
                            { index: true, element: <HrTravel /> },
                            {
                                path: ":id",
                                children: [
                                    { index: true, element: <TravelDetail /> },
                                    { path: "traveler/:travelerId/expense", element: <TravelTravelerExpense /> },
                                    { path: "traveler/:travelerId/document", element: <HrTravelDocuments /> }
                                ]
                            },
                            { path: "add", element: <TravelForm /> },
                        ]
                    },
                    {
                        path: "department",
                        children: [
                            { index: true, element: <Department /> },
                            { path: "add", element: <DepartmentForm /> },
                        ]
                    },
                    {
                        path: "post",
                        children: [
                            { index: true, element: <HrPosts /> },
                            { path: "feed/create", element: <PostCreateForm /> },
                            { path: "inappropriate", element: <InappropriatePosts /> },
                            { path: "feed/:id", element: <PostDetails /> },
                            { path: "feed/mypost", element: <MyPosts /> },
                            { path: "feed", element: <Posts /> },
                            { path: "mypost/:id", element: <PostDetails /> },
                        ]
                    },
                    {
                        path: "job",
                        children: [
                            { index: true, element: <HrJobs /> },
                            { path: ":id", element: <HrJobDetail /> },
                            { path: "add", element: <HrJobCreateForm /> },
                            { path: ":id/referrals", element: <HrJobReferrals /> },
                            { path: ":id/shared", element: <HrJobShared /> },
                        ]
                    },
                    {
                        path: "game",
                        children: [
                            { index: true, element: <HrGames /> },
                            { path: ":id", element: <HrGameDetail /> },
                            { path: ":id/slots", element: <GameDetail /> },
                            { path: ":id/slots/:slotId/waitlist", element: <GameWaitlist /> },
                            { path: ":id/slots/:slotId/details", element: <GameSlotDetail /> },
                            { path: "add", element: <HrJobCreateForm /> },
                            { path: ":id/referrals", element: <HrJobReferrals /> },
                        ]
                    },
                    {
                        path: "expense",
                        children: [
                            { index: true, element: <Expenses /> },
                            {
                                path: "category",
                                children: [
                                    { index: true, element: <ExpenseCategory /> },
                                    { path: "add", element: <ExpenseCategoryForm /> }
                                ]
                            },
                        ]
                    },
                    {
                        path: "user",
                        children: [
                            { index: true, element: <HrUsers /> },
                            { path: "add", element: <HrUserAddForm /> }
                        ]
                    },
                    {
                        path: "organization-chart",
                        errorElement: <NotFound />,
                        children: [
                            { index: true, element: <EmployeeOrganizationChart /> },
                            { path: ":id", element: <EmployeeChart /> }
                        ]
                    },
                    { path: "notification", element: <Notifications /> },
                    { path: "*", element: <NotFound /> }
                ]
            },
            {
                path: 'employee',
                element: <EmployeeLayout />,
                errorElement: <NotFound />,
                children: [
                    { index: true, path: "dashboard", element: <Dashboard /> },
                    { path: "notification", element: <Notifications /> },
                    {
                        path: "travel",
                        errorElement: <NotFound />,
                        children: [
                            { index: true, element: <EmployeeTravels /> },
                            { path: ":id", element: <EmployeeTravelDetails /> },
                            { path: ":id/expense", element: <EmployeeTravelExpense /> },
                            { path: ":id/documents", element: <EmployeeTravelDocuments /> },
                            { path: ":id/expense/add", element: <ExpenseCreateForm /> },
                        ]
                    },
                    {
                        path: "job",
                        errorElement: <NotFound />,
                        children: [
                            { index: true, element: <EmployeeJob /> },
                        ]
                    },
                    {
                        path: "game",
                        errorElement: <NotFound />,
                        children: [
                            { index: true, element: <EmployeeGames /> },
                            { path: ":id/slots", element: <GameDetail /> },
                            { path: ":id/slots/:slotId/waitlist", element: <GameWaitlist /> },
                            { path: ":id/slots/:slotId/details", element: <GameSlotDetail /> },
                            { path: ":id/offers", element: <GameSlotOfferes /> },
                        ]
                    },
                    {
                        path: "post",
                        errorElement: <NotFound />,
                        children: [
                            { index: true, element: <Posts /> },
                            { path: "mypost", element: <MyPosts /> },
                            { path: "mypost/:id", element: <PostDetails /> },
                            { path: "create", element: <PostCreateForm /> },
                            { path: ":id", element: <PostDetails /> },
                        ]
                    },
                    {
                        path: "organization-chart",
                        errorElement: <NotFound />,
                        children: [
                            { index: true, element: <EmployeeOrganizationChart /> },
                            { path: ":id", element: <EmployeeChart /> }
                        ]
                    },
                    { path: "*", element: <NotFound /> }
                ]
            },
            {
                path: 'manager',
                element: <ManagerLayout />,
                errorElement: <NotFound />,
                children: [
                    { index: true, path: "dashboard", element: <Dashboard /> },
                    { path: "notification", element: <Notifications /> },
                    { path: "job", element: <ManagerJob /> },
                    {
                        path: "game",
                        errorElement: <NotFound />,
                        children: [
                            { index: true, element: <ManagerGames /> },
                            { path: ":id/slots", element: <GameDetail /> },
                            { path: ":id/slots/:slotId/waitlist", element: <GameWaitlist /> },
                            { path: ":id/slots/:slotId/details", element: <GameSlotDetail /> },
                        ]
                    },
                    {
                        path: "my-team",
                        errorElement: <NotFound />,
                        children: [
                            { index: true, element: <MyTeams /> },
                            { path: ":id/travels", element: <MemberTravels /> },
                            { path: ":id/travels/:travelId/expense", element: <TravelExpense /> },
                            { path: ":id/travels/:travelId/document", element: <TravelDocument /> }
                        ]
                    },
                    {
                        path: "post",
                        errorElement: <NotFound />,
                        children: [
                            { index: true, element: <Posts /> },
                            { path: "mypost", element: <MyPosts /> },
                            { path: "mypost/:id", element: <PostDetails /> },
                            { path: "create", element: <PostCreateForm /> },
                            { path: ":id", element: <PostDetails /> },
                        ]
                    },
                    {
                        path: "organization-chart",
                        errorElement: <NotFound />,
                        children: [
                            { index: true, element: <EmployeeOrganizationChart /> },
                            { path: ":id", element: <EmployeeChart /> }
                        ]
                    },
                    { path: "*", element: <NotFound /> }
                ]
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
])

export default router