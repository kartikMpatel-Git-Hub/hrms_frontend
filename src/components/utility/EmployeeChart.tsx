import { GetUserChart } from "@/api/UserService"
import type { UserReponseDto } from "@/type/Types"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import UserCardForChart from "./UserCardForChart"
import { ArrowUp, LineChart } from "lucide-react"

function EmployeeChart() {


    const { id } = useParams<number | any>()
    const [chartData, setChartData] = useState<UserReponseDto[]>()

    const { data } = useQuery({
        queryKey: ["org-chart"],
        queryFn: () => GetUserChart(Number(id))
    })

    useEffect(() => {
        if (data) {
            setChartData(data)
        }
    }, [data])

    return (
        <div className="flex justify-center">

            <div className="grid grid-cols-1 m-10 gap-4">
                {
                    data && data.map((u, idx) => (
                        <div>
                            <UserCardForChart user={u} />
                            <div className="flex justify-center">
                                {
                                    idx != data.length - 1 && <ArrowUp className="h-10 w-10" />
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default EmployeeChart
