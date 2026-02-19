import { useQuery } from "@tanstack/react-query"
import { GetEmployeeTravel } from "../../../api/TravelService"
import { useEffect, useState } from "react"
import { type TravelResponse, type PagedRequestDto } from "../../../type/Types"
import TravelCard from "../../HR/Travel/TravelCard"
import { CircleAlert, Loader, PlaneTakeoff, Search } from "lucide-react"
import EmployeeTravelCard from "./EmployeeTravelCard"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Skeleton } from "@/components/ui/skeleton"

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
        <div >
            <Card className="m-2 p-5">
                <div className="flex justify-center font-bold text-2xl gap-1 mx-10"><PlaneTakeoff className="h-8 mr-1" /><span>My Travels</span></div>
                <InputGroup className="">
                    <InputGroupInput placeholder="Search Game..." onChange={(e) => setSearch(e.target.value)} value={search} />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">{travels?.length || 0} Results</InputGroupAddon>
                </InputGroup>
                <Table>
                    <TableHeader>
                        <TableRow className="font-bold">
                            <TableCell>Sr. No</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            !loading
                                ? (
                                    filteredTravels && filteredTravels.length > 0
                                        ? (
                                            filteredTravels.map((t, idx) => (
                                                <EmployeeTravelCard travel={t} idx={idx} key={t.id} />
                                            ))
                                        )
                                        : (
                                            <TableRow>
                                                <TableCell colSpan={5}>
                                                    <div className="flex justify-center font-bold">
                                                        No Travel Found !
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                ) :
                                (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell className="flex gap-2">
                                                <Skeleton className="h-8 w-8" />
                                            </TableCell>
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

export default EmployeeTravels
