import { Table, TableCell, TableRow } from '@/components/ui/table';
import type { TravelerExpenseDto } from '../../../type/Types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CircleAlert, Edit, Eye, IndianRupee } from 'lucide-react';
import { useState } from 'react';
import EditExpenseForm from './EditExpenseForm';

function EmployeeExpenseCard({ expense, idx, travelId }: {
    expense: TravelerExpenseDto,
    idx: number,
    travelId: number
}) {
    const [editDialogOpen, setEditDialogOpen] = useState(false)

    const canEdit = expense?.status?.toLowerCase() === 'pending'


    return (
        <TableRow>
            <TableCell>{idx + 1}</TableCell>
            <TableCell>{expense.details}</TableCell>
            <TableCell>{expense.category?.category || "N/A"}</TableCell>
            <TableCell className='flex'><IndianRupee className="h-4 w-4 mr-1" /> {expense.amount}</TableCell>
            <TableCell>{expense.status}</TableCell>
            <TableCell>{expense.expenseDate.toString().substring(0, 10)}</TableCell>
            <TableCell className='flex gap-2'>
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
                    </DialogContent>
                </Dialog>
                {canEdit && (
                    <Button
                        onClick={() => setEditDialogOpen(true)}
                        variant="outline"
                        title="Edit Expense"
                    >
                        <Edit />
                    </Button>
                )}
                <EditExpenseForm
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    expense={expense}
                    travelId={travelId}
                />
            </TableCell>
        </TableRow>
    )
}

export default EmployeeExpenseCard
