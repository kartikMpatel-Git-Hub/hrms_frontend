import { useQuery } from "@tanstack/react-query"
import { GetMyNotification } from "../../api/NotificationService"
import { useEffect, useState } from "react"
import type { NotificationResponseDto, PagedRequestDto } from "../../type/Types"

function EmployeeNotification() {

    const [paged,setPaged] = useState<PagedRequestDto>({
        pageNumber : 1,
        pageSize : 10
    })
    const [Notifications,setNotifications] = useState<NotificationResponseDto[]>()

    const {data,isLoading,error} = useQuery({
        queryKey : ["my-notification"],
        queryFn : () => GetMyNotification(paged)
    })

    useEffect(()=>{
        if(data){
            setNotifications(data.data)
        }
    },[data])


    return (
        <div>
            
        </div>
    )
}

export default EmployeeNotification
