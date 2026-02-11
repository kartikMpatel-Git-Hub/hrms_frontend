import { useQuery } from "@tanstack/react-query"
import { GetExpensesCategories } from "../../../api/ExpenseService"
import { useEffect, useState } from "react"
import type { ExpenseCategoryResponseDto } from "../../../type/Types"
import ExpenseCategoryCard from "./ExpenseCategoryCard"

function ExpenseCategory() {

    const [categories, setCategories] = useState<ExpenseCategoryResponseDto[]>([])

    const { isLoading, data, error } = useQuery({
        queryKey: ["expense-categories"],
        queryFn: GetExpensesCategories
    })

    useEffect(() => {
        if (data) {
            setCategories(data)
            console.log(data);
        }
    }, [data])

    return (
        <div className="flex justify-center m-3">
            <div>
                <table className="border-2">
                    <td className='border-2 p-3 font-bold'>ID</td>
                    <td className='border-2 p-3 font-bold'>Category</td>
                    <tbody>
                        {
                            categories && categories?.map(c => (
                                <ExpenseCategoryCard category={c} key={c.id} />
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ExpenseCategory
