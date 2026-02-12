import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { GetEmployeeExpense } from "../../../api/ExpenseService"
import { CircleAlert, Loader, Plus } from "lucide-react"
import type { TravelerExpenseDto } from "../../../type/Types"
import ExpenseCard from "../../HR/Travel/ExpenseCard"
import EmployeeExpenseCard from "./EmployeeExpenseCard"

function EmployeeTravelExpense() {
    const { id, travelerId } = useParams<Number | any>()
    const [expenses, setExpenses] = useState<TravelerExpenseDto[]>()
    const navigator = useNavigate()

    const handleAddExpense = () => {
        navigator(`./add`)
    }

    const { isLoading, data } = useQuery({
        queryKey: ["employee-travel-expense"],
        queryFn: () => GetEmployeeExpense({ travelId: id })
    })

    useEffect(() => {
        if (data){
            console.log(data);
            setExpenses(data)
        }
    }, [data])

    if (isLoading)
        return (<div>
            <Loader />Loading...
        </div>)


    return (
        <div>
            <div className="flex justify-end">
                <div
                    onClick={handleAddExpense}
                    className="p-3 bg-slate-800 text-white m-3 rounded-2xl hover:cursor-pointer flex">
                    <Plus className="font-bold" /> Add New Expense
                </div>
            </div>
            <div className="flex justify-center">
                <div className="grid grid-cols-4">
                    {
                        expenses && (
                            expenses?.length > 0
                                ? (
                                    expenses?.map((e) => (
                                        <EmployeeExpenseCard expense={e} travelId={Number(id)} travelerId={Number(travelerId)} key={e.id} />
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
        </div>
    )
}

export default EmployeeTravelExpense
