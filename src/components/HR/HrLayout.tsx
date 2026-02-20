import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar"
import {  AppSidebarHr } from "../ui/app-sidebar-hr"
function HrLayout() {
  return (
    <SidebarProvider>
      <AppSidebarHr />
      <main className="w-full">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
export default HrLayout
