import { Outlet, useNavigate } from "react-router-dom"
import HrNavigation from "./HrNavigation"
import HrFooter from "./HrFooter"
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar"
import { AppSidebar } from "../ui/app-sidebar"
import { GetMyNotificationCount } from "@/api/NotificationService"
import { Bell } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
function HrLayout() {
  
  const navigator = useNavigate()
  
  const { data } = useQuery({
    queryKey: ["my-notification"],
    queryFn: GetMyNotificationCount
  })

  const handleOpenNotification = () => {
    navigator("./notification")
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        {/* <HrNavigation /> */}
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
export default HrLayout
