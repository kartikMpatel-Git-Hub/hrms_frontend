import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Bell, Briefcase, ChartNetwork, Gamepad2, HomeIcon, Images, LogOut, UserCircle2Icon, Users } from "lucide-react"
import { NavLink, useNavigate } from "react-router"
import { useAuth } from "@/context/AuthContext"

export function AppSidebarManager() {
    const navigate = useNavigate()
    const { logout,user } = useAuth()

    const handleLogout = async () => {
        await logout()
        navigate('/', { replace: true })
    }

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
                                to={"./my-team"}
                            >
                                <Users className="w-4 h-4" /> My Team
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
                                to={"./post"}
                            >
                                <Images className="w-4 h-4" /> Post
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
                                <ChartNetwork className="w-4 h-4" /> Organization Chart
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <NavLink
                                className={`flex gap-2 w-full rounded-md`}
                                to={`./${user?.id}`}
                            >
                                <UserCircle2Icon className="w-4 h-4" /> Profile
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="text-red-400" onClick={handleLogout}>
                            <LogOut className="w-4 h-4" /> Logout
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}