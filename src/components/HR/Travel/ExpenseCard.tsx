import { useState } from "react"
import type { ExpenseStatusCreateDto, TravelerExpenseDto } from "../../../type/Types"
import ExpenseProofCard from "./ExpenseProofCard"

function ExpenseCard({ expense }: { expense: TravelerExpenseDto }) {

    const [expenseStatus,setExpenseStatus] = useState<ExpenseStatusCreateDto>({
        status : "REJECTED",
        remarks : ""
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setExpenseStatus((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <div className="border-2 p-3 m-3 flex justify-center">
            <div className="">
                <div className="bg-slate-800 text-white w-fit px-2 rounded-2xl">{expense.id}</div>
                <div className="flex justify-center  border-t-2 border-b-2 m-3 text-2xl font-bold">Details</div>
                <div className="flex justify-center">
                    <div>
                        {/* <div className="p-1"><span className="font-bold italic">Id : </span>{expense.id}</div> */}
                        <div className="p-1"><span className="font-bold italic">Amount : </span>{expense.amount}</div>
                        <div className="p-1"><span className="font-bold italic">Category : </span>{expense.category.category}</div>
                        <div className="p-1"><span className="font-bold italic">Status : </span><span className="bg-slate-800 text-white p-1 rounded-sm">{expense.status}</span></div>
                        <div className="p-1"><span className="font-bold italic">Details : </span>{expense.details || "N/A"}</div>
                        {/* <div><span className="font-bold italic">Remakrs : </span>{expense.remarks}</div> */}
                    </div>
                </div>
                <div className="flex justify-center">
                    <div>
                        <div >
                            <select className="border-2 w-full" name="status" value={expense.status} onChange={handleInputChange}>
                                <option value={"APPROVED"}>Approved</option>
                                <option value={"REJECTED"}>Reject</option>
                            </select>
                        </div>
                        <div>
                        </div>
                        <div>
                            <button 
                                className="bg-slate-800 m-2 text-white rounded-sm p-2">
                                    Apply Changes
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center border-t-2 border-b-2 m-3 text-2xl font-bold">
                    Proofs
                </div>
                <div className="flex gap-3">
                    {
                        expense?.proofs?.map((p) => (
                            <ExpenseProofCard proof={p} key={p.id} />
                        ))
                    }
                </div>
                <div className="text-red-700">{expense.remarks && "! " +expense.remarks }</div>
            </div>
        </div>
    )
}

export default ExpenseCard
