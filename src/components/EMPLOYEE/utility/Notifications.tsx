import { useEffect, useState } from "react"
import type { NotificationResponseDto, PagedRequestDto } from "../../../type/Types"
import { useQuery } from "@tanstack/react-query"
import { GetMyNotification } from "../../../api/NotificationService"
import NotificationCard from "./NotificationCard"
import { Loader } from "lucide-react"

function Notifications() {

    const [paged, setPaged] = useState<PagedRequestDto>({
        pageNumber: 1,
        pageSize: 10
    })
    const [notifications, setNotifications] = useState<NotificationResponseDto[]>()

    const { data, isLoading, error } = useQuery({
        queryKey: ["my-notification"],
        queryFn: () => GetMyNotification(paged)
    })

    useEffect(() => {
        if (data) {
            setNotifications(data.data)
        }
    }, [data])

    if(isLoading)
        return <div><Loader /> Loading...</div>

    return (
        <div>
            <div className="flex justify-center m-auto">
                {
                    notifications && notifications.map((n) => (
                        <NotificationCard notification={n} key={n.id} />
                    ))
                }
            </div>
        </div>
    )
}

export default Notifications
