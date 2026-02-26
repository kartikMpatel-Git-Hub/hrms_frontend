import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarTrigger, SidebarRail } from "../ui/sidebar"
import { AppSidebarManager } from "../ui/app-sidebar-manager"
function ManagerLayout() {
  return (
    <SidebarProvider>
      <AppSidebarManager />
      <SidebarRail />
      <main className="w-full">
        <SidebarTrigger />
        <div>
          <div className="flex justify-center p-2 text-2xl font-bold mb-1">HR Management System</div>
          <hr className="mb-1" />
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}
export default ManagerLayout
