import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { Bell, Briefcase, Building2, ChartArea, ChartNetwork, ChessPawn, ChessQueen, Gamepad, Gamepad2, GamepadDirectional, HomeIcon, Image, IndianRupeeIcon, LogOut, LucideGamepad, TicketsPlane, User2 } from "lucide-react"
import { NavLink } from "react-router"

export function AppSidebarHr() {

    const { open } = useSidebar()

    return (
        <Sidebar className="data-[collapsed=true]:w-16 transition-all duration-300">
            <SidebarHeader>
                {open && <h1 className="text-2xl font-bold text-center">HRMS</h1>}
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
                                <HomeIcon className="w-4 h-4" /> {open && <span>Dashboard</span>}
                            </NavLink>
                        </SidebarMenuButton>
                        <SidebarMenuButton className="my-2">
                            <NavLink
                                className={({ isActive }) => (isActive ? "flex p-2 gap-3 bg-gray-500/10 w-full rounded-md font-bold" : "flex p-2 gap-3 w-full rounded-md")}
                                to={"./travel"}
                            >
                                <TicketsPlane className="w-4 h-4" /> {open && <span>Travel</span>}
                            </NavLink>
                        </SidebarMenuButton>
                        <SidebarMenuButton className="my-2">
                            <NavLink
                                className={({ isActive }) => (isActive ? "flex p-2 gap-3 bg-gray-500/10 w-full rounded-md font-bold" : "flex p-2 gap-3 w-full rounded-md")}
                                to={"./department"}
                            >
                                <Building2 className="w-4 h-4" /> {open && <span>Department</span>}
                            </NavLink>
                        </SidebarMenuButton>
                        <SidebarMenuButton className="my-2">
                            <NavLink
                                className={({ isActive }) => (isActive ? "flex p-2 gap-3 bg-gray-500/10 w-full rounded-md font-bold" : "flex p-2 gap-3 w-full rounded-md")}
                                to={"./expense"}
                            >
                                <IndianRupeeIcon className="w-4 h-4" /> {open && <span>Expense</span>}
                            </NavLink>
                        </SidebarMenuButton>
                        <SidebarMenuButton className="my-2">
                            <NavLink
                                className={({ isActive }) => (isActive ? "flex p-2 gap-3 bg-gray-500/10 w-full rounded-md font-bold" : "flex p-2 gap-3 w-full rounded-md")}
                                to={"./job"}
                            >
                                <Briefcase className="w-4 h-4" /> {open && <span>Job</span>}
                            </NavLink>
                        </SidebarMenuButton>
                        <SidebarMenuButton className="my-2">
                            <NavLink
                                className={({ isActive }) => (isActive ? "flex p-2 gap-3 bg-gray-500/10 w-full rounded-md font-bold" : "flex p-2 gap-3 w-full rounded-md")}
                                to={"./game"}
                            >
                                <Gamepad2 className="w-4 h-4" /> {open && <span>Game</span>}
                            </NavLink>
                        </SidebarMenuButton>
                        <SidebarMenuButton className="my-2">
                            <NavLink
                                className={({ isActive }) => (isActive ? "flex p-2 gap-3 bg-gray-500/10 w-full rounded-md font-bold" : "flex p-2 gap-3 w-full rounded-md")}
                                to={"./post"}
                            >
                                <Image className="w-4 h-4" /> {open && <span>Post</span>}
                            </NavLink>
                        </SidebarMenuButton>

                        <SidebarMenuButton className="my-2">
                            <NavLink
                                className={({ isActive }) => (isActive ? "flex p-2 gap-3 bg-gray-500/10 w-full rounded-md font-bold" : "flex p-2 gap-3 w-full rounded-md")}
                                to={"./notification"}
                            >
                                <Bell className="w-4 h-4" /> {open && <span>Notification</span>}
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