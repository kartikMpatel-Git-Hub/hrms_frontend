import { createBrowserRouter } from 'react-router'
import Login from '../components/Login'
import NotFound from '../components/NotFound'
import HrLayout from '../components/HR/HrLayout'
import HrDashboard from '../components/HR/HrDashboard'
import HrTravel from '../components/HR/HrTravel'
import TravelDetail from '../components/HR/Travel/TravelDetail'
import TravelForm from '../components/HR/Travel/TravelForm'

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
                            {path : ":id",element : <TravelDetail />},
                            {path : "add",element : <TravelForm />},
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