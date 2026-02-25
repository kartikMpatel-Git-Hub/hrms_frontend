import { useState } from "react"
import type { ExpenseStatusCreateDto, TravelerExpenseDto } from "../../../type/Types"
import { ChangeExpenseStatus } from "../../../api/ExpenseService"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CircleAlert, Edit, Eye, IndianRupee, PlaneTakeoff, UserSearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableCell, TableRow } from "@/components/ui/table"
import { useNavigate } from "react-router-dom"

function ExpenseCard({ expense, idx }: {
    expense: TravelerExpenseDto,
    idx: number
}) {
    const [expenseStatus, setExpenseStatus] = useState<ExpenseStatusCreateDto>({
        status: expense.status.toUpperCase() || "REJECTED",
        remarks: expense.remarks || ""
    })
    const navigator = useNavigate()

    const queryClient = useQueryClient()
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false)

    const { isPending, mutate, error: err } = useMutation({
        mutationKey: ["travel-traveler-expense"],
        mutationFn: ChangeExpenseStatus,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["travel-traveler-expense"] })
            toast.success("Expense status updated successfully")
            // console.log(res);
        },
        onError: (err) => {
            // console.log(err);
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
        setError("")
        if (expenseStatus.status === "REJECTED" && (!expenseStatus?.remarks || !expenseStatus?.remarks.trim())) {
            setError("Remarks is required when rejecting an expense.")
            return
        }
        if (expenseStatus.status === "PENDING") {
            setError("Status cannot be set to Pending.")
            return
        }
        const expenseId = expense.id
        mutate({ travelId: expense.travelId, travelerId: expense.travelerId, expenseId, dto: expenseStatus })
        setIsEditOpen(false)
    }

    return (
        <TableRow>
            <TableCell>{idx + 1}.</TableCell>
            <TableCell>{expense.details}</TableCell>
            <TableCell className="flex"><IndianRupee className="w-4" /><span>{expense.amount}</span></TableCell>
            <TableCell>{expense.category.category}</TableCell>
            <TableCell><span className={`${expense.status === "Approved" ? "text-green-500" : expense.status === "Rejected" ? "text-red-500" : "text-yellow-500"}`}>{expense.status}</span></TableCell>
            <TableCell className="hover:cursor-pointer" title="view Travel Detail" onClick={() => navigator(`../travel/${expense.travelId}`)}><Button variant={"outline"} className="w-fit" size={"sm"}><PlaneTakeoff className="w-4 h-4" /></Button></TableCell>
            <TableCell className="hover:cursor-pointer" title="view Traveler Profile" onClick={() => navigator(`../${expense.travelerId}`)}><Button className="w-fit" variant={"outline"} size={"sm"}><UserSearchIcon className="w-4 h-4" /></Button></TableCell>
            <TableCell>{expense.expenseDate.toString().substring(0, 10)}</TableCell>
            <TableCell className="flex gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Eye />
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
                        <div>
                            <Table>
                                <TableRow>
                                    <TableCell className="font-bold">Sr. No</TableCell>
                                    <TableCell className="font-bold">Document Type</TableCell>
                                    <TableCell className="font-bold">Action</TableCell>
                                </TableRow>
                                {
                                    expense?.proofs && expense.proofs.length > 0 ? (
                                        expense.proofs.map((p, idx) => (
                                            <TableRow key={p.id}>
                                                <TableCell>{idx + 1}</TableCell>
                                                <TableCell>{p.documentType}</TableCell>
                                                <TableCell>
                                                    <Button size="sm" onClick={() => window.open(p.proofDocumentUrl, "_blank")}>
                                                        <Eye />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center">
                                                No Proofs Available
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            </Table>
                        </div>
                    </DialogContent>
                </Dialog>
                {
                    expense.status === "Pending" &&
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogTrigger asChild>
                            <Button variant={"outline"} disabled={expense.status !== "Pending"}>
                                <Edit />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm">
                            <DialogHeader>
                                <DialogTitle>Edit Expense Status</DialogTitle>
                                <DialogDescription>Change the status of this expense and add remarks if necessary.</DialogDescription>
                            </DialogHeader>
                            <div className="mt-2">
                                <label className="font-bold italic">Change Status:</label>
                                <select
                                    className="border-2 w-full p-2 rounded"
                                    name="status"
                                    value={expenseStatus.status}
                                    onChange={handleInputChange}
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
                                            maxLength={90}
                                            value={expenseStatus.remarks || ""}
                                            onChange={handleInputChange}
                                            placeholder="Enter reason for rejection..."
                                            rows={3}
                                        />
                                    </div>
                                )}
                                <Button className="mt-2" onClick={handleApplyChanges} disabled={isPending}>
                                    Apply Changes
                                </Button>
                                {
                                    error && (
                                        <div className="flex items-center gap-2 mt-2 text-red-600">
                                            <CircleAlert className="w-4 h-4" />
                                            <span>{error}</span>
                                        </div>
                                    )
                                }
                            </div>
                        </DialogContent>
                    </Dialog>

                }
            </TableCell>
        </TableRow>
    )
}

export default ExpenseCard
