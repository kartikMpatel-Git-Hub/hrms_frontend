import { useQuery } from "@tanstack/react-query"
import { GetEmployeeTravel } from "../../../api/TravelService"
import { useEffect, useState } from "react"
import { type TravelResponse, type PagedRequestDto } from "../../../type/Types"
import { PlaneTakeoff, Search, IndianRupee, Files } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import EmployeeTravelCard from "./EmployeeTravelCard"

function EmployeeTravels() {
    const navigate = useNavigate()

    const [paged, setPaged] = useState<PagedRequestDto>({
        pageNumber: 1,
        pageSize: 5
    })
    const [travels, setTravels] = useState<TravelResponse[]>([])
    const [search, setSearch] = useState<string>("")
    const [filteredTravels, setFilteredTravels] = useState<TravelResponse[]>([])

    const { isLoading, data } = useQuery({
        queryKey: ["travels", paged],
        queryFn: () => GetEmployeeTravel(paged)
    })

    useEffect(() => {
        if (data) {
            setTravels(data.data)
            if (search.trim() === "") {
                setFilteredTravels(data.data)
            } else {
                const filtered = data.data?.filter(
                    t =>
                        t.title.toLowerCase().includes(search.toLowerCase()) ||
                        t.location.toLowerCase().includes(search.toLowerCase())
                )
                setFilteredTravels(filtered)
            }
        }
    }, [data, search])

    const formatDate = (date: string | Date) => {
        if (!date) return 'N/A'
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    const handleViewExpenses = (travel: TravelResponse) => {
        navigate(`./${travel.id}/expense`)
    }

    const handleViewDocuments = (travel: TravelResponse) => {
        navigate(`./${travel.id}/documents`)
    }

    return (
        <div className="w-full p-4">
            <div className="mb-6">
                <div className="flex justify-center gap-2 mb-4">
                    <PlaneTakeoff className="h-8 w-8" />
                    <h1 className="text-3xl font-bold">My Travels</h1>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search travels by title or location..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Max Amount</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index} className="hover:bg-transparent">
                                    <TableCell>
                                        <Skeleton className="h-6 w-6" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-40" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-32" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-28" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-28" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-20" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : filteredTravels && filteredTravels.length > 0 ? (
                            filteredTravels.map((travel, index) => (
                                <EmployeeTravelCard travel={travel} idx={index} />
                            ))
                        ) : (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    No Travels Found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {data && data.totalPages >= 1 && (
                <div className="mt-8 flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setPaged(prev => ({ ...prev, pageNumber: Math.max(1, prev.pageNumber - 1) }))}
                                    disabled={paged.pageNumber === 1}
                                />
                            </PaginationItem>
                            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        onClick={() => setPaged(prev => ({ ...prev, pageNumber: page }))}
                                        isActive={paged.pageNumber === page}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setPaged(prev => ({ ...prev, pageNumber: Math.min(data.totalPages, prev.pageNumber + 1) }))}
                                    disabled={paged.pageNumber === data.totalPages}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    )
}

export default EmployeeTravels
