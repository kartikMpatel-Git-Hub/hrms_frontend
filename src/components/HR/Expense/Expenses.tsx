import { GetAllExpenseForHr } from "@/api/ExpenseService"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import type { PagedRequestDto, TravelerExpenseDto } from "@/type/Types"
import { useQuery } from "@tanstack/react-query"
import { CircleAlert, Eye, IndianRupee, Plus, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton"
import ExpenseCard from "./ExpenseCard"

function Expenses() {

    const navigator = useNavigate()
    const [pageNumber, setPageNumber] = useState<PagedRequestDto>({
        pageNumber: 1,
        pageSize: 10
    })
    const [expense, setExpense] = useState<TravelerExpenseDto[]>()
    const [loading, setLoading] = useState(false)
    const [filteredExpense, setFilteredExpense] = useState<TravelerExpenseDto[]>()
    const [filtere, setFiltere] = useState({
        travel:  [] as number[],
        traveler: [] as number[],
        category: [] as string[],
        status: ["Pending", "Approved", "Rejected"]
    })
    const [search, setSearch] = useState("")

    const { data } = useQuery({
        queryKey: ["hr-all-expense"],
        queryFn: () => GetAllExpenseForHr(pageNumber)
    })

    useEffect(() => {
        setLoading(true)
        if (data) {
            if (search.trim() === "") {
                setExpense(data.data)
                // console.log(data);

                setFilteredExpense(data.data)
            } else {
                const filtered = data?.data.filter(
                    t =>
                        t.details.toLowerCase().includes(search.toLowerCase()) ||
                        t.category.category.toLowerCase().includes(search.toLowerCase())
                )
                setFilteredExpense(filtered)
            }
            setFiltere({
                travel: Array.from(new Set(data.data.map(e => e.travelId))),
                traveler: Array.from(new Set(data.data.map(e => e.travelerId))),
                category: Array.from(new Set(data.data.map(e => e.category.category))),
                status: ["Pending", "Approved", "Rejected"]
            })
        }
        setTimeout(() => {
            setLoading(false)
        }, 500);
    }, [data, search])



    const handleOpenAddForm = () => {
        navigator("./category/add")
    }

    const handleOpenCategory = () => {
        navigator("./category")
    }

    const handleFilterChange = (type: string, value: string|number) => {
        let filtered = data?.data
        // if (type === "travel") {
        //     filtered = filtered?.filter(e => e.travelId === value)
        // } else if (type === "traveler") {
        //     filtered = filtered?.filter(e => e.travelerId === value)
        // }
        // else if (type === "category") {
        //     filtered = filtered?.filter(e => e.category.category === value)
        // } else if (type === "status") {
        //     filtered = filtered?.filter(e => e.status == value)
        // }
        setFilteredExpense(filtered)
    }

    return (
        <div>
            <div className="flex justify-end mr-10 gap-3">
                <Button
                    onClick={handleOpenCategory}
                    title="View Expense Category">
                    <Eye /> View Category
                </Button>
                <Button
                    onClick={handleOpenAddForm}
                    title="Add New Expense Category">
                    <Plus className="font-bold" /> Create Category
                </Button>
            </div>
            <Card className="m-2 p-5">
                <div className="flex justify-center font-bold text-2xl gap-1 mx-10"><IndianRupee className="h-8 mr-1" /><span>All Expenses</span></div>
                <InputGroup className="">
                    <InputGroupInput placeholder="Search Expense..." onChange={(e) => setSearch(e.target.value)} value={search} />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">{filteredExpense?.length || 0} Results</InputGroupAddon>
                </InputGroup>
                {/* <Card className="grid grid-cols-4 gap-5 p-2">
                    <div>
                        <Combobox onValueChange={(value) => handleFilterChange("status", String(value))}>
                            <ComboboxInput placeholder="Select a Status" />
                            <ComboboxContent>
                                <ComboboxList>
                                    {filtere.status.map((item) => (
                                        <ComboboxItem key={item} value={item}>
                                            {item}
                                        </ComboboxItem>
                                    ))}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>
                    <div>
                        <Combobox onValueChange={(value) => handleFilterChange("travel", Number(value))}>
                            <ComboboxInput placeholder="Select a Travel" />
                            <ComboboxContent>
                                <ComboboxList>
                                    {filtere.travel.map((item) => (
                                        <ComboboxItem key={item} value={item}>
                                            {item}
                                        </ComboboxItem>
                                    ))}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>
                    <div>
                        <Combobox onValueChange={(value) => handleFilterChange("traveler", Number(value))}>
                            <ComboboxInput placeholder="Select a Traveler" />
                            <ComboboxContent>
                                <ComboboxList>
                                    {filtere.traveler.map((item) => (
                                        <ComboboxItem key={item} value={item}>
                                            {item}
                                        </ComboboxItem>
                                    ))}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>
                    <div>
                        <Combobox onValueChange={(value) => handleFilterChange("category", String(value))}>
                            <ComboboxInput placeholder="Select a Category" onChange={() => console.log("Category Changed")} />
                            <ComboboxContent>
                                <ComboboxList >
                                    {filtere.category.map((item) => (
                                        <ComboboxItem key={item} value={item}>
                                            {item}
                                        </ComboboxItem>
                                    ))}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>
                </Card> */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell className="font-bold">Sr. No</TableCell>
                            <TableCell className="font-bold">Title</TableCell>
                            <TableCell className="font-bold">Amount</TableCell>
                            <TableCell className="font-bold">Category</TableCell>
                            <TableCell className="font-bold">Status</TableCell>
                            <TableCell className="font-bold">Travel</TableCell>
                            <TableCell className="font-bold">Traveler</TableCell>
                            <TableCell className="font-bold">Expense Date</TableCell>
                            <TableCell className="font-bold">Action</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            !loading ? (
                                filteredExpense && filteredExpense?.length > 0
                                    ? (
                                        filteredExpense.map((e, idx) => (
                                            <ExpenseCard expense={e} idx={idx} key={e.id} />
                                        ))
                                    )
                                    : (
                                        <TableRow>
                                            <TableCell colSpan={10} >
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
                            ) : (
                                Array.from({ length: 5 }).map((_) => (
                                    <TableRow>
                                        <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-6" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-6" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
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
        </div>
    )
}

export default Expenses
