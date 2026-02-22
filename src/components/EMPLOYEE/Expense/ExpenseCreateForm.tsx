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
    }
    return (
        <div className="flex justify-center px-4 py-6">
            <ToastContainer position="top-right" />
            <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 text-2xl font-bold text-slate-900">
                    Add New Expense
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Details <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="Details"
                            placeholder="Enter expense detail"
                            value={newExpense.Details}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                            disabled={isPending}
                        />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Amount <span className="text-red-500">*</span>
                            </label>
                            <input
                                disabled={isPending}
                                type="number"
                                name="Amount"
                                placeholder="Enter amount"
                                value={newExpense.Amount}
                                min={1}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Expense Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                disabled={isPending}
                                type="date"
                                name="ExpenseDate"
                                placeholder="Enter expense date"
                                value={newExpense.ExpenseDate ? newExpense.ExpenseDate.toString().substring(0, 10) : ""}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            disabled={isPending || isLoading}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                            value={newExpense.CategoryId}
                            onChange={handleInputChange}
                            name="CategoryId"
                        >
                            {isLoading && <option>Loading...</option>}
                            {!isLoading && ExpenseCategories.map(c => (
                                <option value={c.id} key={c.id}>{c.category}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Proof <span className="text-red-500">*</span>
                        </label>
                        <input
                            disabled={isPending}
                            type="file"
                            multiple
                            onChange={e => setProofs(e.target.files)}
                            className="w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-sm file:text-white"
                        />
                        <p className="mt-1 text-xs text-slate-500">Upload one or more receipts.</p>
                    </div>
                    <div className="pt-2">
                        <button
                            onClick={handleSubmit}
                            disabled={isPending}
                            className="w-full rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Submit
                        </button>
                    </div>
                </div>
                {error && error.length > 0 && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        <ul className="list-disc space-y-1 pl-5">
                            {error.map((e, index) => (
                                <li key={`${e}-${index}`}>{e}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ExpenseCreateForm
