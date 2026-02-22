import { useQuery } from "@tanstack/react-query"
import { GetExpensesCategories } from "../../../api/ExpenseService"
import { useEffect, useState } from "react"
import type { ExpenseCategoryResponseDto } from "../../../type/Types"
import ExpenseCategoryCard from "./ExpenseCategoryCard"

function ExpenseCategory() {

    const [categories, setCategories] = useState<ExpenseCategoryResponseDto[]>([])

    const { isLoading, data } = useQuery({
        queryKey: ["expense-categories"],
        queryFn: GetExpensesCategories
    })

    useEffect(() => {
        if (data) {
            setCategories(data)
            // console.log(data);
        }
    }, [data])

    return (
        <div className="m-5">
            <div className="grid grid-cols-6 gap-3">
                {
                    categories && categories?.map(c => (
                        <ExpenseCategoryCard category={c} key={c.id} />
                    ))
                }
            </div>
        </div>
    )
}

export default ExpenseCategory
