import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { GetTravelTravelerExpense } from "../../../api/ExpenseService"
import { useEffect, useState } from "react"
import type { PagedRequestDto, TravelerExpenseDto } from "../../../type/Types"
import { CircleAlert, IndianRupee, Loader, Search } from "lucide-react"
import ExpenseCard from "./ExpenseCard"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"


function TravelTravelerExpense() {

    const { id, travelerId } = useParams<Number | any>()
    const [expenses, setExpenses] = useState<TravelerExpenseDto[]>()
    const [search, setSearch] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [filteredExpenses, setFilteredExpenses] = useState<TravelerExpenseDto[]>()
    const [paged, setPaged] = useState<PagedRequestDto>({
        pageNumber: 1,
        pageSize: 5
    })


    const { isLoading, data } = useQuery({
        queryKey: ["travel-traveler-expense", id, travelerId, paged],
        queryFn: () => GetTravelTravelerExpense(Number(id), Number(travelerId), paged)
    })

    useEffect(() => {
        if (data)
            setExpenses(data.data)
    }, [data])

    useEffect(() => {
        setLoading(true)
        if (data) {
            if (search.trim() === "") {
                setExpenses(data.data)
                setFilteredExpenses(data.data)
            } else {
                const filtered = data?.data?.filter(
                    t =>
                        t.details.toLowerCase().includes(search.toLowerCase())
                )
                setFilteredExpenses(filtered)
            }
        }
        setTimeout(() => {
            setLoading(false)
        }, 500);
    }, [data, search])

    return (
        <div>
            <Card className="p-5 m-10">
                <div className="flex justify-center font-bold text-2xl gap-1 mx-10"><IndianRupee className="h-8 mr-1" /><span>Traveler Expenses</span></div>
                <InputGroup className="">
                    <InputGroupInput placeholder="Search Expense..." onChange={(e) => setSearch(e.target.value)} value={search} />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">{expenses?.length || 0} Results</InputGroupAddon>
                </InputGroup>
                <Table>
                    <TableHeader>
                        <TableRow className="font-bold">
                            <TableCell>Sr. No</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            !loading
                                ? (
                                    filteredExpenses && filteredExpenses?.length > 0
                                        ? (
                                            filteredExpenses.map((e, idx) => (
                                                <ExpenseCard idx={idx} expense={e} travelId={Number(id)} travelerId={Number(travelerId)} key={e.id} />
                                            ))
                                        )
                                        : (
                                            <TableRow>
                                                <TableCell colSpan={6} >
                                                    <div className="flex justify-center m-10">
                                                        <div>
                                                            <CircleAlert className="h-8" />
                                                        </div>
                                                        <div className="font-bold m-1">
                                                            No Expense Found
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                ) :
                                (
                                    Array.from({ length: 5 }).map((_, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell className="flex gap-2">
                                                <Skeleton className="h-8 w-8" />
                                                <Skeleton className="h-8 w-8" />

                                            </TableCell>
                                        </TableRow>
                                    ))
                                )
                        }
                    </TableBody>
                </Table>
            </Card>
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

export default TravelTravelerExpense
