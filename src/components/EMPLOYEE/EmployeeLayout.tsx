import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useEffect } from "react"
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar"
import { AppSidebarEmployee } from "../ui/app-sidebar-employee"

function EmployeeLayout() {

  const { user } = useAuth()
  const navigator = useNavigate()
  useEffect(() => {
    if (!user)
      navigator("/")
  }, [])



  return (
    <SidebarProvider>
      <AppSidebarEmployee />
      <main className="w-full">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
export default EmployeeLayout
