import { Bell, Briefcase, LogOut, User } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { GetMyNotificationCount } from "../../api/NotificationService"

function HrNavigation() {

    const navigator = useNavigate()

    const {logout} = useAuth()

    const handleLogout = ()=>{
        logout()
        navigator("/")
    }
    const { data } = useQuery({
        queryKey: ["my-notification"],
        queryFn: GetMyNotificationCount
    })

    const handleOpenNotification = () => {
        navigator("./notification")
    }
    return (
        <div className="flex gap-3 bg-slate-800 justify-between w-full p-2 text-white fixed">
            <div className="flex gap-2">
                <Briefcase />
                HRMS
            </div>
            <div className="flex gap-3">
                <NavLink
                    className={({ isActive }) => (isActive ? "underline" : "")}
                    to={"./dashboard"}
                >
                    Dashboard
                </NavLink>
                <NavLink
                    className={({ isActive }) => (isActive ? "underline" : "")}
                    to={"./travel"}
                >
                    Travel
                </NavLink>
                <NavLink
                    className={({ isActive }) => (isActive ? "underline" : "")}
                    to={"./department"}
                >
                    Department
                </NavLink>
                <NavLink
                    className={({ isActive }) => (isActive ? "underline" : "")}
                    to={"./expense"}
                >
                    Expense
                </NavLink>
                <NavLink
                    className={({ isActive }) => (isActive ? "underline" : "")}
                    to={"./job"}
                >
                    Job
                </NavLink>
            </div>
            <div className="flex gap-5">
                <div
                    onClick={handleOpenNotification}
                    title="Notifications"
                    className="flex font-bold"
                >
                    <Bell /> {data?.count || 0}
                </div>
                <div
                    onClick={handleLogout}
                    title="logout"
                >
                    <LogOut />
                </div>
            </div>
        </div>
    )
}

export default HrNavigation
