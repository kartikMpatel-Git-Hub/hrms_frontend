import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { GetTravelTravelerExpense } from "../../../api/ExpenseService"
import { useEffect, useState } from "react"
import { type TravelerExpenseDto } from "../../../type/Types"
import { CircleAlert, Loader } from "lucide-react"
import ExpenseCard from "./ExpenseCard"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

function TravelTravelerExpense() {

    const { id, travelerId } = useParams<Number | any>()
    const [expenses, setExpenses] = useState<TravelerExpenseDto[]>()

    const { isLoading, data } = useQuery({
        queryKey: ["travel-traveler-expense"],
        queryFn: () => GetTravelTravelerExpense({ travelId: id, travelerId: travelerId })
    })

    useEffect(() => {
        if (data)
            setExpenses(data)
    }, [data])


    return (
        <div className="flex justify-center m-10">
            <Table>
                <TableHeader>
                    <TableRow>
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
                        !isLoading
                            ? (
                                expenses && expenses?.length > 0
                                ?(
                                    expenses.map((e,idx) => (
                                        <ExpenseCard idx={idx} expense={e} travelId={Number(id)} travelerId={Number(travelerId)} key={e.id} />
                                    ))
                                )
                                :(
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
                            ):
                            (
                                Array.from({length : 5}).map((_,idx) => (
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
        </div>
        // <div className="m-10">
        //     <div className="grid grid-cols-4 gap-4">
        //         {
        //             expenses && (
        //                 expenses?.length > 0
        //                     ? (
        //                         expenses?.map((e) => (
        //                             <ExpenseCard expense={e} travelId={Number(id)} travelerId={Number(travelerId)} key={e.id} />
        //                         ))
        //                     )
        //                     : (
        //                         <div className="text-2xl py-10 flex">
        //                             <CircleAlert className="m-1" />
        //                             No Expense Found
        //                         </div>
        //                     )
        //             )
        //         }
        //     </div>
        // </div>
    )
}

export default TravelTravelerExpense
