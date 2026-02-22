import { useQuery } from "@tanstack/react-query"
import { GetEmployeeTravel } from "../../../api/TravelService"
import { useEffect, useState } from "react"
import { type TravelResponse, type PagedRequestDto } from "../../../type/Types"
import { CircleAlert, Loader, PlaneTakeoff, Search } from "lucide-react"
import EmployeeTravelCard from "./EmployeeTravelCard"
import { Card } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

function EmployeeTravels() {

    const [pagedRequest, setPagedRequest] = useState<PagedRequestDto>({
        pageNumber: 1,
        pageSize: 10
    })
    const [travels, setTravels] = useState<TravelResponse[]>()
    const [search, setSearch] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [filteredTravels, setFilteredTravels] = useState<TravelResponse[]>()

    const { isLoading, data, error } = useQuery({
        queryKey: ["travels"],
        queryFn: () => GetEmployeeTravel(pagedRequest)
    })

    useEffect(() => {
        if (data) {
            setTravels(data.data)
        }
    }, [data])

    useEffect(() => {
        setLoading(true)
        if (data) {
            if (search.trim() === "") {
                setTravels(data.data)
                setFilteredTravels(data.data)
            } else {
                const filtered = data.data?.filter(
                    t =>
                        t.title.toLowerCase().includes(search.toLowerCase()) ||
                        t.location.toLowerCase().includes(search.toLowerCase()))
                setFilteredTravels(filtered)
            }
        }
        setTimeout(() => {
            setLoading(false)
        }, 500);
    }, [data, search])

    return (
        <div>
            <Card className="m-2 p-5">
                <div className="flex justify-center font-bold text-2xl gap-1 mx-10 mb-4"><PlaneTakeoff className="h-8 mr-1" /><span>My Travels</span></div>
                <InputGroup className="mb-6">
                    <InputGroupInput placeholder="Search Travel..." onChange={(e) => setSearch(e.target.value)} value={search} />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">{travels?.length || 0} Results</InputGroupAddon>
                </InputGroup>
                {
                    !loading
                        ? (
                            filteredTravels && filteredTravels.length > 0
                                ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {filteredTravels.map((t, idx) => (
                                            <EmployeeTravelCard travel={t} idx={idx} key={t.id} />
                                        ))}
                                    </div>
                                )
                                : (
                                    <div className="flex justify-center font-bold text-lg py-12">
                                        No Travel Found !
                                    </div>
                                )
                        ) :
                        (
                            <div className="flex justify-center py-12">
                                <Loader className="animate-spin" />
                            </div>
                        )
                }
            </Card>
        </div>
    )
}

export default EmployeeTravels
