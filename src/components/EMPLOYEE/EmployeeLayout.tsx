import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useEffect } from "react"
import EmployeeNavigation from "./EmployeeNavigation"
import EmployeeFooter from "./EmployeeFooter"

function EmployeeLayout() {

  const { user } = useAuth()
  const navigator = useNavigate()
  useEffect(() => {
    if (!user)
      navigator("/")
  }, [])

  

  return (
    <div>
      <EmployeeNavigation />
      <div className="pt-15">
        <Outlet />
      </div>
      <EmployeeFooter />
    </div>
  )
}
export default EmployeeLayout
