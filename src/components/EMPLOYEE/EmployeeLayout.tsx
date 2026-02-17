import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useEffect } from "react"
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar"
import { AppSidebar } from "../ui/app-sidebar"

function EmployeeLayout() {

  const { user } = useAuth()
  const navigator = useNavigate()
  useEffect(() => {
    if (!user)
      navigator("/")
  }, [])



  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
export default EmployeeLayout
