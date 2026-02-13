import { useEffect, useState } from "react";
import { type ExpenseCategoryResponseDto, type ExpenseCreateDto } from "../../../type/Types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AddExpense, GetExpensesCategories } from "../../../api/ExpenseService";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function ExpenseCreateForm() {

    const { id } = useParams()

    const [newExpense, setNewExpense] = useState<ExpenseCreateDto>({
        Amount: 1,
        CategoryId: 1,
        Details: "",
        ExpenseDate: null
    })
    const [proofs, setProofs] = useState<FileList | null>(null)
    const [ExpenseCategories, setExpenseCategories] = useState<ExpenseCategoryResponseDto[]>([])

    const { isLoading, data } = useQuery({
        queryKey: ["expense-categories"],
        queryFn: GetExpensesCategories
    })

    const { isPending, mutate, error: err } = useMutation({
        mutationKey: ["new-employee-travel-expense"],
        mutationFn: AddExpense,
        onSuccess: (res) => {
            toast.success("Expense Added !")
            setNewExpense({
                Amount: 1,
                CategoryId: 1,
                Details: "",
                ExpenseDate: null
            })
            setProofs(null)
        },
        onError: (err : any) => {
            console.log(err);
            toast.error(err.error.details || "something went wrong while adding expense")
        }
    })

    useEffect(() => {
        if (data)
            setExpenseCategories(data)
    }, [data])


    const [error, setError] = useState<string[]>([])

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target
        setNewExpense((prev) => ({ ...prev, [name]: value }))
        setError([])
    }

    const isValidForm = (): boolean => {
        let flag = true;
        if (newExpense.Amount <= 0) {
            setError((prev) => [...prev, "Amount can not be zero or negative"])
            flag = false
        }
        if (newExpense.CategoryId <= 0) {
            setError((prev) => [...prev, "Invalid Category !"])
            flag = false
        }
        if (!proofs || proofs.length == 0) {
            setError((prev) => [...prev, "Proof Is Mendatory !"])
            flag = false
        }
        if (newExpense.Details.length <= 0 || newExpense.Details.length >= 200) {
            setError((prev) => [...prev, "Details can not be empty or more than 200 Latters !"])
            flag = false
        }
        if (newExpense.ExpenseDate == null) {
            setError((prev) => [...prev, "Expense Date Is Required !"])
            flag = false
        }
        return flag
    }

    const handleSubmit = async () => {
        setError([])
        if (!isValidForm()) {
            return;
        }

        const formData = new FormData();
        formData.append("Amount", String(newExpense.Amount));
        formData.append("CategoryId", String(newExpense.CategoryId));
        formData.append("Details", newExpense.Details);
        formData.append("ExpenseDate", String(newExpense.ExpenseDate))
        if (proofs) {
            Array.from(proofs).forEach((f) => formData.append("Proofs", f, f.name));
        }

        mutate({ travelId: id, dto: formData })


        // navigator("../")
    }
    return (
        <div className="flex justify-center">
            <ToastContainer position="top-right" />
            <div>
                <div className="p-2 text-2xl font-bold">
                    Add New Expense
                </div>
                <div>
                    <div className="p-2">
                        Details : <input
                            type="text"
                            name="Details"
                            placeholder="Enter Expense Detail"
                            value={newExpense.Details}
                            onChange={handleInputChange}
                            className="border-2"
                            disabled={isPending}
                        />
                    </div>
                    <div className="p-2">
                        Amount : <input
                            disabled={isPending}
                            type="number"
                            name="Amount"
                            placeholder="Enter Expense Amount"
                            value={newExpense.Amount}
                            min={1}
                            onChange={handleInputChange}
                            className="border-2"
                        />
                    </div>
                    <div className="p-2">
                        Expense Date : <input
                            disabled={isPending}
                            type="date"
                            name="ExpenseDate"
                            placeholder="Enter Expense Date"
                            value={newExpense.ExpenseDate ? newExpense.ExpenseDate.toString().substring(0, 10) : ""}
                            onChange={handleInputChange}
                            className="border-2"
                        />
                    </div>
                    <div className="p-2">
                        Category :
                        <select disabled={isPending} className="border-2" value={newExpense.CategoryId} onChange={handleInputChange} name="CategoryId">
                            {ExpenseCategories.map(c => (
                                <option value={c.id} key={c.id}>{c.category}</option>
                            ))}
                        </select>
                    </div>
                    <div className="p-2">
                        Proof :
                        <input disabled={isPending} type="file" multiple onChange={e => setProofs(e.target.files)} />
                    </div>
                    <div>
                        <button
                            onClick={handleSubmit}
                            disabled={isPending}
                            className="bg-slate-800 p-2 text-white m-3 rounded-2xl disabled:opacity-50">
                            Submit
                        </button>
                    </div>
                </div>
                {
                    error && error.map((e) => (<div className="text-red-600">{e}</div>))
                }
            </div>
        </div>
    )
}

export default ExpenseCreateForm
