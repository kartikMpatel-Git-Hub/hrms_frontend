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
import EmployeeGameDetail from '@/components/EMPLOYEE/game/EmployeeGameDetail'

const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Login /> },
            { path: "*", element: <NotFound /> },
            {
                path: 'hr',
                element: <HrLayout />,
                errorElement: <NotFound />,
                children: [
                    { index: true, path: "dashboard", element: <HrDashboard /> },
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
                        path: "job",
                        children: [
                            { index: true, element: <HrJobs /> },
                            { path: ":id", element: <HrJobDetail /> },
                            { path: "add", element: <HrJobCreateForm /> },
                            { path: ":id/referrals", element: <HrJobReferrals /> },
                        ]
                    },
                    {
                        path: "game",
                        children: [
                            { index: true, element: <HrGames /> },
                            { path: ":id", element: <HrGameDetail /> },
                            // { path: "add", element: <HrJobCreateForm /> },
                            // { path: ":id/referrals", element: <HrJobReferrals /> },
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
                path: 'employee',
                element: <EmployeeLayout />,
                errorElement: <NotFound />,
                children: [
                    { index: true, path: "dashboard", element: <EmployeeDashboard /> },
                    { path: "notification", element: <Notifications /> },
                    {
                        path: "travel",
                        errorElement: <NotFound />,
                        children: [
                            { index: true, element: <EmployeeTravels /> },
                            { path: ":id", element: <TravelDetail /> },
                            { path: ":id/expense", element: <EmployeeTravelExpense /> },
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
                            { path : ":id" , element: <EmployeeGameDetail /> },
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