import { Outlet, useNavigate } from "react-router-dom"
import HrNavigation from "./HrNavigation"
import HrFooter from "./HrFooter"
import { useAuth } from "../../context/AuthContext"
import { useEffect } from "react"

function HrLayout() {

  const {user} = useAuth()
  const navigator = useNavigate()
  useEffect(()=>{
    if(!user)
      navigator("/")
  },[])

  return (
    <div>
      <HrNavigation />
      <div className="pt-10">
        <Outlet />
      </div>
      <HrFooter />
    </div>
  )
}
export default HrLayout
