import { Bell } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useQuery } from "@tanstack/react-query"
import { GetMyNotificationCount } from "../../api/NotificationService"

function managerNavigation() {

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
            <div className="flex gap-5">
                <div
                    onClick={handleOpenNotification}
                    title="Notifications"
                    className="flex font-bold"
                >
                    <Bell /> {data?.count || 0}
                </div>
            </div>
        </div>
    )
}

export default managerNavigation
