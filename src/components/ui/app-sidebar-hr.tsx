import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Bell, Briefcase, Building2, ChartNetwork,Gamepad2,  HomeIcon, Images, IndianRupeeIcon, LogOut, TicketsPlane, UserCircle2Icon, Users } from "lucide-react"
import { NavLink, useNavigate } from "react-router"
import { useAuth } from "@/context/AuthContext"

export function AppSidebarHr() {
    const navigate = useNavigate()
    const { logout,user } = useAuth()

    const handleLogout = async () => {
        await logout()
        navigate('/', { replace: true })
    }

    return (
        <Sidebar className="transition-all duration-300">
            <SidebarHeader>
                <h1 className="text-2xl font-bold text-center group-data-[collapsible=icon]:hidden">HRMS</h1>
            </SidebarHeader>
            <SidebarContent className="ml-2">
                <SidebarMenu>
                    <SidebarMenuItem className="my-2">
                        <SidebarMenuButton className="my-2" asChild>
                            <NavLink
                                // className={({ isActive }) => (isActive ? "flex p-2 gap-3 bg-gray-500/10 w-full rounded-md font-bold" : "flex p-2 gap-3 w-full rounded-md")}
                                to={"./dashboard"}
                            >
                                <HomeIcon className="w-4 h-4" /> <span>Dashboard</span>
                            </NavLink>
                        </SidebarMenuButton>
                        <SidebarMenuButton className="my-2" asChild>
                            <NavLink
                                // className={({ isActive }) => (isActive ? "flex p-2 gap-3 bg-gray-500/10 w-full rounded-md font-bold" : "flex p-2 gap-3 w-full rounded-md")}
                                to={"./travel"}
                            >
                                <TicketsPlane className="w-4 h-4" /> <span>Travel</span>
                            </NavLink>
                        </SidebarMenuButton>
                        <SidebarMenuButton className="my-2" asChild>
                            <NavLink
                                // className={({ isActive }) => (isActive ? "flex p-2 gap-3 bg-gray-500/10 w-full rounded-md font-bold" : "flex p-2 gap-3 w-full rounded-md")}
                                to={"./department"}
                            >
                                <Building2 className="w-4 h-4" /> <span>Department</span>
                            </NavLink>
                        </SidebarMenuButton>
                        <SidebarMenuButton className="my-2" asChild>
                            <NavLink
                                // className={({ isActive }) => (isActive ? "flex p-2 gap-3 bg-gray-500/10 w-full rounded-md font-bold" : "flex p-2 gap-3 w-full rounded-md")}
                                to={"./expense"}
                            >
                                <IndianRupeeIcon className="w-4 h-4" /> <span>Expense</span>
                            </NavLink>
                        </SidebarMenuButton>
                        <SidebarMenuButton className="my-2" asChild>
                            <NavLink
                                // className={({ isActive }) => (isActive ? "flex p-2 gap-3 bg-gray-500/10 w-full rounded-md font-bold" : "flex p-2 gap-3 w-full rounded-md")}
                                to={"./job"}
                            >
                                <Briefcase className="w-4 h-4" /> <span>Job</span>
                            </NavLink>
                        </SidebarMenuButton>
                        <SidebarMenuButton className="my-2" asChild>
                            <NavLink
                                // className={({ isActive }) => (isActive ? "flex p-2 gap-3 bg-gray-500/10 w-full rounded-md font-bold" : "flex p-2 gap-3 w-full rounded-md")}
                                to={"./game"}
                            >
                                <Gamepad2 className="w-4 h-4" /> <span>Game</span>
                            </NavLink>
                        </SidebarMenuButton>
                        <SidebarMenuButton className="my-2" asChild>
                            <NavLink
                                // className={({ isActive }) => (isActive ? "flex p-2 gap-3 bg-gray-500/10 w-full rounded-md font-bold" : "flex p-2 gap-3 w-full rounded-md")}
                                to={"./post"}
                            >
                                <Images className="w-4 h-4" /> <span>Post</span>
                            </NavLink>
                        </SidebarMenuButton>

                        <SidebarMenuButton className="my-2" asChild>
                            <NavLink
                                // className={({ isActive }) => (isActive ? "flex p-2 gap-3 bg-gray-500/10 w-full rounded-md font-bold" : "flex p-2 gap-3 w-full rounded-md")}
                                to={"./user"}
                            >
                                <Users className="w-4 h-4" /> <span>Users</span>
                            </NavLink>
                        </SidebarMenuButton>

                        <SidebarMenuButton className="my-2" asChild>
                            <NavLink
                            
                                // className={({ isActive }) => (isActive ? "flex p-2 gap-3 bg-gray-500/10 w-full rounded-md font-bold" : "flex p-2 gap-3 w-full rounded-md")}
                                to={"./notification"}
                            >
                                <Bell className="w-4 h-4" /> <span>Notification</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <NavLink
                                className={`flex gap-2 w-full rounded-md`}
                                to={"./organization-chart"}
                            >
                                <ChartNetwork className="w-4 h-4" /> <span>Organization Chart</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <NavLink
                                className={`flex gap-2 w-full rounded-md`}
                                to={`./${user?.id}`}
                            >
                                <UserCircle2Icon className="w-4 h-4" /> <span>Profile</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="text-red-400" onClick={handleLogout}>
                            <LogOut className="w-4 h-4" /> <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}