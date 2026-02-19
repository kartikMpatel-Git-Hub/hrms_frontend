import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Bell, Briefcase, Building2, ChartArea, ChartNetwork, ChessPawn, ChessQueen, Gamepad, Gamepad2, GamepadDirectional, HomeIcon, IndianRupeeIcon, LogOut, LucideGamepad, TicketsPlane, User2 } from "lucide-react"
import { NavLink } from "react-router"

export function AppSidebarManager() {
    return (
        <Sidebar className="">
            <SidebarHeader>
                <h1 className="text-2xl font-bold flex justify-center">HRMS</h1>
                <hr />
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="my-2">
                            <NavLink
                                className={({ isActive }) => (isActive ? "flex p-2 gap-3 bg-gray-500/10 w-full rounded-md font-bold" : "flex p-2 gap-3 w-full rounded-md")}
                                to={"./dashboard"}
                            >
                                <HomeIcon className="w-4 h-4" /> Dashboard
                            </NavLink>
                        </SidebarMenuButton>
                        <SidebarMenuButton className="my-2">
                            <NavLink
                                className={({ isActive }) => (isActive ? "flex p-2 gap-3 bg-gray-500/10 w-full rounded-md font-bold" : "flex p-2 gap-3 w-full rounded-md")}
                                to={"./travel"}
                            >
                                <TicketsPlane className="w-4 h-4" /> Travel
                            </NavLink>
                        </SidebarMenuButton>
                        <SidebarMenuButton className="my-2">
                            <NavLink
                                className={({ isActive }) => (isActive ? "flex p-2 gap-3 bg-gray-500/10 w-full rounded-md font-bold" : "flex p-2 gap-3 w-full rounded-md")}
                                to={"./department"}
                            >
                                <Building2 className="w-4 h-4" /> Department
                            </NavLink>
                        </SidebarMenuButton>
                        <SidebarMenuButton className="my-2">
                            <NavLink
                                className={({ isActive }) => (isActive ? "flex p-2 gap-3 bg-gray-500/10 w-full rounded-md font-bold" : "flex p-2 gap-3 w-full rounded-md")}
                                to={"./expense"}
                            >
                                <IndianRupeeIcon className="w-4 h-4" /> Expense
                            </NavLink>
                        </SidebarMenuButton>
                        <SidebarMenuButton className="my-2">
                            <NavLink
                                className={({ isActive }) => (isActive ? "flex p-2 gap-3 bg-gray-500/10 w-full rounded-md font-bold" : "flex p-2 gap-3 w-full rounded-md")}
                                to={"./job"}
                            >
                                <Briefcase className="w-4 h-4" /> Job
                            </NavLink>
                        </SidebarMenuButton>
                        <SidebarMenuButton className="my-2">
                            <NavLink
                                className={({ isActive }) => (isActive ? "flex p-2 gap-3 bg-gray-500/10 w-full rounded-md font-bold" : "flex p-2 gap-3 w-full rounded-md")}
                                to={"./game"}
                            >
                                <Gamepad2 className="w-4 h-4" /> Game
                            </NavLink>
                        </SidebarMenuButton>
                        
                        <SidebarMenuButton className="my-2">
                            <NavLink
                                className={({ isActive }) => (isActive ? "flex p-2 gap-3 bg-gray-500/10 w-full rounded-md font-bold" : "flex p-2 gap-3 w-full rounded-md")}
                                to={"./notification"}
                            >
                                <Bell className="w-4 h-4" /> Notification
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <NavLink
                                className={`flex gap-2 w-full rounded-md`}
                                to={"./organization-chart"}
                            >
                                <ChartNetwork className="w-4 h-4"/> Organization Chart
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="text-red-400">
                            <NavLink
                                className={`flex gap-2 w-full rounded-md`}
                                to={"/"}
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}