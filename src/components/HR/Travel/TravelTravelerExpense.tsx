import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { GetTravelTravelerExpense } from "../../../api/ExpenseService"
import { useEffect, useState } from "react"
import { type TravelerExpenseDto } from "../../../type/Types"
import { CircleAlert, Loader } from "lucide-react"
import ExpenseCard from "./ExpenseCard"

function TravelTravelerExpense() {

    const { id, travelerId } = useParams<Number | any>()
    const [expenses, setExpenses] = useState<TravelerExpenseDto[]>()

    const { isLoading, data, error } = useQuery({
        queryKey: ["travel-traveler-expense"],
        queryFn: () => GetTravelTravelerExpense({ travelId: id, travelerId: travelerId })
    })

    useEffect(() => {
        if (data) 
            setExpenses(data)
    }, [data])

    if (isLoading)
        return (<div>
            <Loader />Loading...
        </div>)


    return (
        <div className="m-10">
            <div className="grid grid-cols-4 gap-4">
                {
                    expenses && (
                        expenses?.length > 0
                            ? (
                                expenses?.map((e) => (
                                    <ExpenseCard expense={e} travelId={Number(id)} travelerId={Number(travelerId)} key={e.id} />
                                ))
                            )
                            : (
                                <div className="text-2xl py-10 flex">
                                    <CircleAlert className="m-1" />
                                    No Expense Found
                                </div>
                            )
                    )
                }
            </div>
        </div>
    )
}

export default TravelTravelerExpense
