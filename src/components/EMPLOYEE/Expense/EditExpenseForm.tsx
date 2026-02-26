import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { UpdateExpense, GetExpensesCategories } from "@/api/ExpenseService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import type { TravelerExpenseDto, ExpenseCategoryResponseDto } from "@/type/Types"

interface FormErrors {
    [key: string]: string
}

interface EditExpenseFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    expense: TravelerExpenseDto | null
    travelId: number
    onSuccess?: () => void
}

function EditExpenseForm({ open, onOpenChange, expense, travelId, onSuccess }: EditExpenseFormProps) {
    const queryClient = useQueryClient()

    const [formData, setFormData] = useState({
        amount: "",
        categoryId: "",
        details: "",
        remarks: "",
        expenseDate: "",
    })

    const [formErrors, setFormErrors] = useState<FormErrors>({})
    const [categories, setCategories] = useState<ExpenseCategoryResponseDto[]>([])

    const { data: categoriesData } = useQuery({
        queryKey: ["expense-categories"],
        queryFn: GetExpensesCategories,
    })

    useEffect(() => {
        if (categoriesData) {
            setCategories(categoriesData)
        }
    }, [categoriesData])

    useEffect(() => {
        if (expense && open) {
            console.log(expense);
            
            setFormData({
                amount: expense.amount?.toString() || "",
                categoryId: expense.category?.id?.toString() || "",
                details: expense.details || "",
                remarks: expense.remarks || "",
                expenseDate: expense.expenseDate.toString().substring(0,10),
            })
            setFormErrors({})
        }
    }, [expense, open])

    const { mutate: updateExpense, isPending } = useMutation({
        mutationFn: UpdateExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employee-travel-expense"] })
            toast.success("Expense updated successfully")
            onOpenChange(false)
            onSuccess?.()
        },
        onError: (error: any) => {
            console.log(error);
            const errorMsg = error?.response?.data?.message || "Failed to update expense"
            setFormErrors({ submit: errorMsg })
            toast.error(errorMsg)
        },
    })

    const validateForm = (): boolean => {
        const errors: FormErrors = {}

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            errors.amount = "Amount must be greater than 0"
        }

        if (!formData.categoryId) {
            errors.categoryId = "Category is required"
        }

        if (!formData.details || formData.details.trim().length === 0) {
            errors.details = "Details are required"
        } else if (formData.details.length < 5) {
            errors.details = "Details must be at least 5 characters"
        }

        if (!formData.expenseDate) {
            errors.expenseDate = "Expense date is required"
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ""
            }))
        }
    }

    const handleCategoryChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            categoryId: value
        }))
        if (formErrors.categoryId) {
            setFormErrors(prev => ({
                ...prev,
                categoryId: ""
            }))
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!validateForm() || !expense) {
            toast.error("Please fix all errors before submitting")
            return
        }

        updateExpense({
            travelId: travelId,
            expenseId: expense.id,
            data: {
                amount: parseFloat(formData.amount),
                categoryId: parseInt(formData.categoryId),
                details: formData.details,
                remarks: formData.remarks,
                expenseDate: new Date(formData.expenseDate).toISOString()
            }
        })
    }

    const isDisabled = expense?.status?.toLowerCase() !== 'pending'

    if (isDisabled) {
        return null
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Expense</DialogTitle>
                    <DialogDescription>Update expense details below. This expense can only be edited while status is Pending.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount (₹)</Label>
                        <Input
                            id="amount"
                            name="amount"
                            type="number"
                            placeholder="0"
                            step="0.01"
                            value={formData.amount}
                            onChange={handleChange}
                            className={formErrors.amount ? "border-destructive" : ""}
                        />
                        {formErrors.amount && (
                            <p className="text-sm text-destructive">{formErrors.amount}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="categoryId">Category</Label>
                        <Select value={formData.categoryId} onValueChange={handleCategoryChange}>
                            <SelectTrigger className={formErrors.categoryId ? "border-destructive" : ""}>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                        {cat.category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {formErrors.categoryId && (
                            <p className="text-sm text-destructive">{formErrors.categoryId}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="details">Details</Label>
                        <Textarea
                            id="details"
                            name="details"
                            placeholder="Expense details"
                            value={formData.details}
                            onChange={handleChange}
                            rows={3}
                            className={formErrors.details ? "border-destructive" : ""}
                        />
                        {formErrors.details && (
                            <p className="text-sm text-destructive">{formErrors.details}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{formData.details.length} characters</p>
                    </div>

                    {/* <div className="space-y-2">
                        <Label htmlFor="remarks">Description/Remarks</Label>
                        <Textarea
                            id="remarks"
                            name="remarks"
                            placeholder="Additional remarks or description (optional)"
                            value={formData.remarks}
                            onChange={handleChange}
                            rows={2}
                        />
                    </div> */}

                    <div className="space-y-2">
                        <Label htmlFor="expenseDate">Expense Date</Label>
                        <Input
                            id="expenseDate"
                            name="expenseDate"
                            type="date"
                            value={formData.expenseDate}
                            onChange={handleChange}
                            className={formErrors.expenseDate ? "border-destructive" : ""}
                        />
                        {formErrors.expenseDate && (
                            <p className="text-sm text-destructive">{formErrors.expenseDate}</p>
                        )}
                    </div>

                    {formErrors.submit && (
                        <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
                            <p className="text-sm text-destructive">{formErrors.submit}</p>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Spinner className="mr-2 h-4 w-4" />
                                    Updating...
                                </>
                            ) : (
                                "Update Expense"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditExpenseForm
