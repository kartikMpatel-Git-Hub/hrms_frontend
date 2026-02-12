import React, { useState } from 'react'
import type { ExpenseCreateDto, TravelerExpenseDto } from '../../../type/Types';
import { useMutation } from '@tanstack/react-query';
import { AddExpense } from '../../../api/ExpenseService';
import ExpenseProofCard from '../../HR/Travel/ExpenseProofCard';

function EmployeeExpenseCard({ expense, travelId, travelerId }: {
    expense: TravelerExpenseDto,
    travelId: number,
    travelerId: number,
    onStatusChange?: () => void
}) {
    

    return (
        <div className="border-2 p-3 m-3 flex justify-center">
            <div className="">
                <div className="bg-slate-800 text-white w-fit px-2 rounded-2xl">{expense.id}</div>
                <div className="flex justify-center  border-t-2 border-b-2 m-3 text-2xl font-bold">Details</div>
                <div className="flex justify-center">
                    <div>
                        <div className="p-1"><span className="font-bold italic">Amount : </span>{expense.amount}</div>
                        <div className="p-1"><span className="font-bold italic">Category : </span>{expense.category.category}</div>
                        <div className="p-1"><span className="font-bold italic">Status : </span><span className="bg-slate-800 text-white p-1 rounded-sm">{expense.status}</span></div>
                        <div className="p-1"><span className="font-bold italic">Details : </span>{expense.details || "N/A"}</div>
                        <div className="p-1"><span className="font-bold italic">Expense Date : </span>{expense?.expenseDate?.toString().substring(0,10) || "N/A"}</div>
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
                {expense.remarks && (
                    <div className="text-red-700 mt-2 p-2 bg-red-50 rounded">
                        <span className="font-bold">Remarks:</span> {expense.remarks}
                    </div>
                )}
            </div>
        </div>
    )
}

export default EmployeeExpenseCard
