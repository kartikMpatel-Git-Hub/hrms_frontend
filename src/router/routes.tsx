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
import DepartmentDetail from '../components/HR/Department/DepartmentDetail'
import Expenses from '../components/HR/Expense/Expenses'
import ExpenseCategory from '../components/HR/Expense/ExpenseCategory'
import ExpenseCategoryForm from '../components/HR/Expense/ExpenseCategoryForm'
import TravelTravelerExpense from '../components/HR/Travel/TravelTravelerExpense'
import EmployeeTravels from '../components/EMPLOYEE/Travel/EmployeeTravels'
import EmployeeTravelExpense from '../components/EMPLOYEE/Expense/EmployeeTravelExpense'
import ExpenseCreateForm from '../components/EMPLOYEE/Expense/ExpenseCreateForm'
import EmployeeNotification from '../components/EMPLOYEE/EmployeeNotification'
import Notifications from '../components/EMPLOYEE/utility/Notifications'

const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Login /> },
            { path: "*", element: <NotFound /> },
            {
                path : 'hr',
                element : <HrLayout />,
                errorElement : <NotFound />,
                children : [
                    {index: true, path : "dashboard" ,element: <HrDashboard />},
                    {
                        path : "travel" ,
                        children : [
                            {index : true,element : <HrTravel/>},
                            {
                                path : ":id",
                                children : [
                                    {index : true,element : <TravelDetail />},
                                    {path : "traveler/:travelerId/expense",element:<TravelTravelerExpense />}
                                ]
                            },
                            {path : "add",element : <TravelForm />},
                        ]
                    },
                    {
                        path : "department" ,
                        children : [
                            {index : true,element : <Department/>},
                            {path : ":id",element : <DepartmentDetail />},// -> with department employees
                            {path : "add",element : <DepartmentForm />},
                        ]
                    },
                    {
                        path : "expense" ,
                        children : [
                            {index : true,element : <Expenses/>},
                           // {path : ":id",element : <DepartmentDetail />},// -> with department employees
                            {
                                path : "category",
                                children : [
                                    {index : true,element : <ExpenseCategory />},
                                    {path : "add",element : <ExpenseCategoryForm />}
                                ]
                            },
                        ]
                    },
                    {path : "*", element : <NotFound />}
                ]
            },
            {
                path : 'employee',
                element : <EmployeeLayout />,
                errorElement : <NotFound />,
                children : [
                    {index: true, path : "dashboard" ,element: <EmployeeDashboard />},
                    {path : "notification" ,element: <Notifications />},
                    {
                        path : "travel",
                        errorElement : <NotFound />,
                        children : [
                            {index : true,element : <EmployeeTravels />},
                            {path : ":id",element : <TravelDetail />},
                            {path : ":id/expense",element : <EmployeeTravelExpense />},
                            {path : ":id/expense/add",element : <ExpenseCreateForm />},
                        ]
                    },
                    {path : "*", element : <NotFound />}
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