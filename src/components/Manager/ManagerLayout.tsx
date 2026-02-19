import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar"
import { AppSidebarManager } from "../ui/app-sidebar-manager"
function ManagerLayout() {
  return (
    <SidebarProvider>
      <AppSidebarManager />
      <main className="w-full">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
export default ManagerLayout
