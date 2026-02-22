import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { GetEmployeeExpense } from "../../../api/ExpenseService"
import { CircleAlert, IndianRupee, Loader, Plus, Search } from "lucide-react"
import type { TravelerExpenseDto } from "../../../type/Types"
import EmployeeExpenseCard from "./EmployeeExpenseCard"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Skeleton } from "@/components/ui/skeleton"

function EmployeeTravelExpense() {
    const { id, travelerId } = useParams<Number | any>()
    const [expenses, setExpenses] = useState<TravelerExpenseDto[]>()
    const navigator = useNavigate()
    const [search, setSearch] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    const handleAddExpense = () => {
        navigator(`./add`)
    }

    const { isLoading, data } = useQuery({
        queryKey: ["employee-travel-expense"],
        queryFn: () => GetEmployeeExpense({ travelId: id })
    })

    useEffect(() => {
        if (data) {
            // console.log(data);
            setExpenses(data)
        }
    }, [data])

    useEffect(() => {
        setLoading(true)
        if (data) {
            if (search.trim() === "") {
                setExpenses(data)
            } else {
                const filtered = data?.filter(
                    t => t.details.toLowerCase().includes(search.toLowerCase()))
                setExpenses(filtered)
            }
        }
        setTimeout(() => {
            setLoading(false)
        }, 500);
    }, [data, search])

    return (
        <div>
            <div className="flex justify-end mr-5">
                <Button onClick={handleAddExpense}><Plus />Add Expense</Button>
            </div>
            <Card className="m-10 p-5">
                <div className="flex justify-center font-bold text-2xl gap-1 mx-10"><IndianRupee className="h-8" /><span>Travel Expenses</span></div>
                <InputGroup className="">
                    <InputGroupInput placeholder="Search Game..." onChange={(e) => setSearch(e.target.value)} value={search} />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">{expenses?.length || 0} Results</InputGroupAddon>
                </InputGroup>
                <Table>
                    <TableHeader>
                        <TableRow className="font-bold">
                            <TableCell>Sr. No</TableCell>
                            <TableCell>Detail</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Expense Date</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            !loading ?
                                (
                                    expenses && expenses.length > 0 ?
                                        (
                                            expenses.map((e, idx) => (

                                                <EmployeeExpenseCard expense={e} idx={idx} />
                                            ))
                                        ) :
                                        (
                                            <TableRow>
                                                <TableCell colSpan={6}>
                                                    <div className="flex justify-center font-bold p-2">
                                                        No Expense Found !
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                ) :
                                (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-8 w-10" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-15" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-15" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-15" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-15" /></TableCell>
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

export default EmployeeTravelExpense
