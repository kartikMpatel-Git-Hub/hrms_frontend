import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuBadge,
} from "@/components/ui/sidebar"
import { Bell, BellRing, Briefcase, ChartNetwork, Gamepad2, HomeIcon, Images, LogOut, UserCircle2Icon, Users } from "lucide-react"
import { NavLink, useNavigate } from "react-router"
import { useAuth } from "@/context/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { GetMyNotificationCount } from "@/api/NotificationService"
import { useEffect, useState } from "react"

export function AppSidebarManager() {
    const navigate = useNavigate()
    const { logout,user } = useAuth()
    const [count, setCount] = useState<number>()

    const handleLogout = async () => {
        await logout()
        navigate('/', { replace: true })
    }

    const { data } = useQuery({
        queryFn: GetMyNotificationCount,
        queryKey: ["notification-count", user],
    })

    useEffect(() => {
        if (data) setCount(data.count)
    }, [data])

    return (
        <Sidebar className="transition-all duration-300">
            <img src="/Logo.png" alt="Roima" className="w-25 ml-20 mt-4" />
            <SidebarHeader>
                <hr />
            </SidebarHeader>
            <SidebarContent className="ml-2">
                <SidebarMenu>
                    <SidebarMenuItem>
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
                                to={"./my-team"}
                            >
                                <Users className="w-4 h-4" /> <span>My Team</span>
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

                        <SidebarMenuItem className="my-2">
                            <SidebarMenuButton className="my-2" asChild>
                                <NavLink to={"./notification"} className="relative">
                                <div className="flex">
                                    <BellRing className="w-4 h-4"/>
                                    <div className="font-bold">{count}</div>
                                </div>
                                    <span>Notification</span>
                                </NavLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
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
                                <img src={user?.image} className="h-5 w-5 rounded-2xl"/> <span className="font-bold">{user?.email}</span>
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