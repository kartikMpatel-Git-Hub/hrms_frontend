import { useQuery } from "@tanstack/react-query"
import { GetEmployeeTravel } from "../../../api/TravelService"
import { useEffect, useState } from "react"
import { type TravelResponse, type PagedRequestDto } from "../../../type/Types"
import TravelCard from "../../HR/Travel/TravelCard"
import { CircleAlert, Loader } from "lucide-react"
import EmployeeTravelCard from "./EmployeeTravelCard"

function EmployeeTravels() {

    const [pagedRequest, setPagedRequest] = useState<PagedRequestDto>({
        pageNumber: 1,
        pageSize: 10
    })
    const [travels, setTravels] = useState<TravelResponse[]>()

    const { isLoading, data, error } = useQuery({
        queryKey: ["employee-travels"],
        queryFn: () => GetEmployeeTravel(pagedRequest)
    })

    useEffect(() => {
        if (data) {
            console.log(data);
            setTravels(data.data)
        }
    }, [data])

    if (error)
        return <div className="flex justify-center"><CircleAlert />Something went wrong</div>
    if (isLoading)
        return <div className="flex justify-center"><Loader />Loading..</div>

    return (
        <div>
            {
                travels
                    ? (
                        travels.length > 0
                            ? (
                                travels.map((t) => (
                                    <EmployeeTravelCard travel={t} key={t.id} />
                                ))
                            )
                            : (<div>You Have no Travel Yet</div>)
                    )
                    : (<div>Not Travel Found</div>)
            }
        </div>
    )
}

export default EmployeeTravels
