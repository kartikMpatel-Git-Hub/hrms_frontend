import { useState } from "react"
import type { ExpenseCategoryCreateDto } from "../../../type/Types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { CreateExpenseCategory } from "../../../api/ExpenseService"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field"
import { ALargeSmall, AlertCircleIcon, Building2, List } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

function ExpenseCategoryForm() {
    const [newCategory, setNewCategory] = useState<ExpenseCategoryCreateDto>({
        category: ""
    })
    const [error, setError] = useState<string[]>([])
    const queryClient = useQueryClient()
    const navigator = useNavigate()
    const { mutate, isPending } = useMutation({
        mutationFn: CreateExpenseCategory,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['expense-categories'] })
            navigator("../")
        },
        onError: (err: any) => {
            console.log(err.error.details);
            setError([err.error.details])
        }
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setNewCategory((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError([])
        if (!validateForm()) {
            return
        }
        mutate(newCategory)
    }

    const handleCancleInput = ()=>{
        setNewCategory({
            category : ""
        })
        setError([])
    }

    const validateForm = (): boolean => {
        if (!newCategory.category || newCategory.category.length < 2 || newCategory.category.length > 30) {
            setError(["Category must have atleast 2 and atmost 30 character !"])
            return false
        }
        return true

    }


    return (
        <div className="m-10">
            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <FieldSet>
                        <FieldLegend><div className="text-2xl flex gap-2"><List /> ADD CATEGORY</div></FieldLegend>
                        <FieldDescription>
                            Add New Category with minimal required information and details.
                        </FieldDescription>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                    <ALargeSmall className="w-4 h-4" />Category Name
                                </FieldLabel>
                                <Input
                                    placeholder="Enter Category Name"
                                    required
                                    name="category"
                                    value={newCategory.category}
                                    onChange={handleInputChange}
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSeparator />
                    <Field orientation="horizontal">
                        <Button type="submit" disabled={isPending}>Submit</Button>
                        <Button variant="outline" type="button" onClick={handleCancleInput}>
                            Cancel
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
            {
                error && error.length > 0 && (
                    <Alert variant={"destructive"}>
                        <AlertCircleIcon />
                        <AlertTitle>Validation Failed</AlertTitle>
                        <AlertDescription>
                            {
                                error.map((e) => (
                                    <div>{e}</div>
                                ))
                            }
                        </AlertDescription>
                    </Alert>
                )
            }
        </div>
    )
}

export default ExpenseCategoryForm
