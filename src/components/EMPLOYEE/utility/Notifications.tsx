import { useEffect, useState } from "react"
import type { NotificationResponseDto, PagedRequestDto } from "../../../type/Types"
import { useQuery } from "@tanstack/react-query"
import { GetMyNotification } from "../../../api/NotificationService"
import NotificationCard from "./NotificationCard"
import { Bell, BellRing, Loader } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

function Notifications() {

    const [paged, setPaged] = useState<PagedRequestDto>({
        pageNumber: 1,
        pageSize: 10
    })
    const [notifications, setNotifications] = useState<NotificationResponseDto[]>()

    const { data, isLoading } = useQuery({
        queryKey: ["my-notification"],
        queryFn: () => GetMyNotification(paged)
    })

    useEffect(() => {
        if (data) {
            // console.log(data);
            setNotifications(data.data)
        }
    }, [data])

    return (
        <div>
            <Card className="p-5 m-10">
                <div className="flex justify-center font-bold text-2xl gap-1 mx-10"><BellRing className="h-8 mr-2" /><span>My Notifications</span></div>
                <Table>
                    <TableHeader>
                        <TableRow className="font-bold">
                            <TableCell>Sr.No</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Message</TableCell>
                            <TableCell>Date</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            !isLoading ?
                                (
                                    notifications && notifications.length > 0 ?
                                        (
                                            notifications.map((n, idx) =>
                                                <NotificationCard notification={n} key={n.id} idx={idx} />)
                                        ) :
                                        (
                                            <TableRow>
                                                <TableCell colSpan={4}>
                                                    <div className="flex justify-center font-bold">
                                                        No Notifications
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                ) :
                                (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-30" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-60" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        </TableRow>
                                    ))
                                )
                        }
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}

export default Notifications
