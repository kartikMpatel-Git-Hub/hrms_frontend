import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useEffect } from "react"
import { SidebarProvider, SidebarTrigger, SidebarRail } from "../ui/sidebar"
import { AppSidebarEmployee } from "../ui/app-sidebar-employee"
import { Toaster } from "sonner"

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
      <SidebarRail />
      <main className="w-full">
        <SidebarTrigger />
        <Toaster position="top-center" />
        <div>
          <div className="flex justify-center p-2 text-2xl font-bold mb-1">HR Management System</div>
          <hr className="mb-1" />
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}
export default EmployeeLayout
