import { useState } from "react"
import type { ExpenseStatusCreateDto, TravelerExpenseDto } from "../../../type/Types"
import ExpenseProofCard from "./ExpenseProofCard"
import { ChangeExpenseStatus } from "../../../api/ExpenseService"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CircleAlert, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast, ToastContainer } from "react-toastify"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

function ExpenseCard({ expense, travelId, travelerId }: {
    expense: TravelerExpenseDto,
    travelId: number,
    travelerId: number,
    onStatusChange?: () => void
}) {

    const [expenseStatus, setExpenseStatus] = useState<ExpenseStatusCreateDto>({
        status: expense.status.toUpperCase() || "REJECTED",
        remarks: expense.remarks || ""
    })

    const queryClient = useQueryClient()

    const { isPending, mutate, error: err } = useMutation({
        mutationKey: ["travel-traveler-expense"],
        mutationFn: ChangeExpenseStatus,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["travel-traveler-expense"] })
            console.log(res);
        },
        onError: (err) => {
            console.log(err);
            toast.error("Failed to update expense status. Please try again.")
        }
    })

    const [error, setError] = useState<string>("")

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setExpenseStatus((prev) => ({ ...prev, [name]: value }))
        setError("")
    }

    const handleApplyChanges = async () => {
        if (expenseStatus.status === "REJECTED" && !expenseStatus?.remarks.trim()) {
            toast.error("Remarks is required when rejecting an expense.")
            return
        }
        if (expenseStatus.status === "PENDING") {
            toast.error("Status cannot be set to Pending.")
            return
        }
        setError("")
        const expenseId = expense.id
        mutate({ travelId, travelerId, expenseId, dto: expenseStatus })
    }

    return (
        <>
            <Card>
                <ToastContainer />
                <CardHeader>
                    <CardTitle>{expense.details}</CardTitle>
                    {
                        expense.remarks && (
                            <CardDescription className="flex"><CircleAlert className="text-red-600 w-3 h-3 m-1" /> <span className="text-red-600">{expense.remarks}</span></CardDescription>
                        )
                    }
                </CardHeader>
                <CardContent>
                    <div className="flex items-center font-semibold">Expense: <span className="flex font-bold"> <IndianRupee className="w-3 h-3 my-1.5" />{expense.amount}</span></div>
                    <div><span className="font-semibold">Category:</span> {expense.category.category}</div>
                    <div><span className="font-semibold">Date :</span> {expense.expenseDate.toString().substring(0, 10)}</div>
                    <div><span className="font-semibold">Status:</span> <span className={`${expense.status === "Approved" ? "text-green-500" : expense.status === "Rejected" ? "text-red-500" : "text-yellow-500"}`}>{expense.status}</span></div>
                    {
                        expense.status === "Pending" && (
                            <div className="mt-2">
                                <label className="font-bold italic">Change Status:</label>
                                <select
                                    className="border-2 w-full p-2 rounded"
                                    name="status"
                                    value={expenseStatus.status}
                                    onChange={handleInputChange}
                                    disabled={isPending}
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="APPROVED">Approved</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                                {expenseStatus.status === "REJECTED" && (
                                    <div className="mt-2">
                                        <label className="font-bold italic">Remarks: <span className="text-red-600">*</span></label>
                                        <textarea
                                            className="border-2 w-full p-2 rounded"
                                            name="remarks"
                                            value={expenseStatus.remarks || ""}
                                            onChange={handleInputChange}
                                            placeholder="Enter reason for rejection..."
                                            rows={3}
                                            disabled={isPending}
                                        />
                                    </div>
                                )}
                                <Button className="mt-2" onClick={handleApplyChanges} disabled={isPending}>
                                    Apply Changes
                                </Button>
                            </div>
                        )
                    }
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="mt-4 w-full">
                                View Proof
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm">
                            <DialogHeader>
                                <DialogTitle>Expense Proof</DialogTitle>
                                <DialogDescription>{expense.remarks && (
                                    <div className="flex text-red-600 ">
                                        <CircleAlert className="w-3 h-3 m-1" /> <span className="text-red-600">{expense.remarks}</span>
                                    </div>
                                )}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-3 gap-3">
                                {
                                    expense?.proofs && expense.proofs.length > 0 ? (
                                        expense.proofs.map((p, idx) => (
                                            <ExpenseProofCard proof={p} key={p.id} />
                                        ))
                                    ) : (
                                        <div className="text-center py-10 text-2xl font-bold">
                                            No Proofs Found
                                        </div>
                                    )
                                }
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </>
        // <div className="border-2 p-3 m-3 flex justify-center">
        //     <div className="">
        //         <div className="bg-slate-800 text-white w-fit px-2 rounded-2xl">{expense.id}</div>
        //         <div className="flex justify-center  border-t-2 border-b-2 m-3 text-2xl font-bold">Details</div>
        //         <div className="flex justify-center">
        //             <div>
        //                 <div className="p-1"><span className="font-bold italic">Amount : </span>{expense.amount}</div>
        //                 <div className="p-1"><span className="font-bold italic">Category : </span>{expense.category.category}</div>
        //                 <div className="p-1"><span className="font-bold italic">Status : </span><span className="bg-slate-800 text-white p-1 rounded-sm">{expense.status}</span></div>
        //                 <div className="p-1"><span className="font-bold italic">Details : </span>{expense.details || "N/A"}</div>
        //             </div>
        //         </div>
        //         {
        //             expense.status === "Pending" && (
        //                 <div className="flex justify-center">
        //                     <div className="w-full">
        //                         <div>
        //                             <label className="font-bold italic">Change Status:</label>
        //                             <select
        //                                 className="border-2 w-full p-2 rounded"
        //                                 name="status"
        //                                 value={expenseStatus.status}
        //                                 onChange={handleInputChange}
        //                                 disabled={isPending}
        //                             >
        //                                 <option value="PENDING">Pending</option>
        //                                 <option value="APPROVED">Approved</option>
        //                                 <option value="REJECTED">Rejected</option>
        //                             </select>
        //                         </div>

        //                         {expenseStatus.status === "REJECTED" && (
        //                             <div className="mt-2">
        //                                 <label className="font-bold italic">Remarks: <span className="text-red-600">*</span></label>
        //                                 <textarea
        //                                     className="border-2 w-full p-2 rounded"
        //                                     name="remarks"
        //                                     value={expenseStatus.remarks || ""}
        //                                     onChange={handleInputChange}
        //                                     placeholder="Enter reason for rejection..."
        //                                     rows={3}
        //                                     disabled={isPending}
        //                                 />
        //                             </div>
        //                         )}

        //                         {error && (
        //                             <div className="text-red-600 text-sm mt-2">
        //                                 {error}
        //                             </div>
        //                         )}

        //                         <div>
        //                             <button
        //                                 className="bg-slate-800 m-2 text-white rounded-sm p-2 disabled:bg-slate-400 disabled:cursor-not-allowed hover:bg-slate-700"
        //                                 onClick={handleApplyChanges}
        //                                 disabled={isPending}
        //                             >
        //                                 {isPending ? "Applying..." : "Apply Changes"}
        //                             </button>
        //                         </div>
        //                     </div>
        //                 </div>
        //             )
        //         }
        //         <div className="flex justify-center border-t-2 border-b-2 m-3 text-2xl font-bold">
        //             Proofs
        //         </div>
        //         <div className="flex gap-3">
        //             {
        //                 expense?.proofs?.map((p,idx) => (
        //                     <div className="border-2 p-3">
        //                         <div className="font-bold rounded-2xl bg-slate-800 w-fit text-white px-2">{idx+1}</div>
        //                         <ExpenseProofCard proof={p} key={p.id} />
        //                     </div>
        //                 ))
        //             }
        //         </div>
        //         {expense.remarks && (
        //             <div className="text-red-700 mt-2 p-2 bg-red-50 rounded">
        //                 <span className="font-bold">Remarks:</span> {expense.remarks}
        //             </div>
        //         )}
        //     </div>
        // </div>
    )
}

export default ExpenseCard