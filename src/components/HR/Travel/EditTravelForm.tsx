import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { UpdateTravel } from "@/api/TravelService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import type { TravelResponseWithTraveler } from "@/type/Types"

interface FormErrors {
    [key: string]: string
}

interface EditTravelFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    travel: TravelResponseWithTraveler | null
}

function EditTravelForm({ open, onOpenChange, travel }: EditTravelFormProps) {
    const queryClient = useQueryClient()

    const [formData, setFormData] = useState({
        title: "",
        desciption: "",
        location: "",
        maxAmountLimit: "",
    })

    const [formErrors, setFormErrors] = useState<FormErrors>({})

    useEffect(() => {
        if (travel && open) {
            setFormData({
                title: travel.title || "",
                desciption: travel.description || "",
                location: travel.location || "",
                maxAmountLimit: travel.maxAmountLimit?.toString() || "",
            })
            setFormErrors({})
        }
    }, [travel, open])

    const { mutate: updateTravel, isPending } = useMutation({
        mutationFn: UpdateTravel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["travel", travel?.id] })
            toast.success("Travel updated successfully")
            onOpenChange(false)
        },
        onError: (error: any) => {
            const errorMsg = error?.response?.data?.message || "Failed to update travel"
            setFormErrors({ submit: errorMsg })
            toast.error(errorMsg)
        },
    })

    const validateForm = (): boolean => {
        const errors: FormErrors = {}

        if (!formData.title || formData.title.trim().length === 0) {
            errors.title = "Title is required"
        } else if (formData.title.length < 5 || formData.title.length > 50) {
            errors.title = "Title must be between 5 and 50 characters"
        }

        if (!formData.desciption || formData.desciption.trim().length === 0) {
            errors.desciption = "Description is required"
        } else if (formData.desciption.length < 20 || formData.desciption.length > 300) {
            errors.desciption = "Description must be between 20 and 300 characters"
        }

        if (!formData.location || formData.location.trim().length === 0) {
            errors.location = "Location is required"
        } else if (formData.location.length < 5 || formData.location.length > 50) {
            errors.location = "Location must be between 5 and 50 characters"
        }

        if (!formData.maxAmountLimit || parseFloat(formData.maxAmountLimit) <= 0) {
            errors.maxAmountLimit = "Max amount must be greater than 0"
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!validateForm() || !travel) return

        updateTravel({
            travelId: travel.id,
            data: {
                title: formData.title,
                desciption: formData.desciption,
                location: formData.location,
                maxAmountLimit: parseFloat(formData.maxAmountLimit)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Travel</DialogTitle>
                    <DialogDescription>Update travel details below</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Travel title"
                            value={formData.title}
                            onChange={handleChange}
                            className={formErrors.title ? "border-destructive" : ""}
                        />
                        {formErrors.title && (
                            <p className="text-sm text-destructive">{formErrors.title}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{formData.title.length}/50 characters</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="desciption">Description</Label>
                        <Textarea
                            id="desciption"
                            name="desciption"
                            placeholder="Travel description"
                            value={formData.desciption}
                            onChange={handleChange}
                            rows={4}
                            className={formErrors.desciption ? "border-destructive" : ""}
                        />
                        {formErrors.desciption && (
                            <p className="text-sm text-destructive">{formErrors.desciption}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{formData.desciption.length}/300 characters</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            name="location"
                            placeholder="Travel location"
                            value={formData.location}
                            onChange={handleChange}
                            className={formErrors.location ? "border-destructive" : ""}
                        />
                        {formErrors.location && (
                            <p className="text-sm text-destructive">{formErrors.location}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{formData.location.length}/50 characters</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="maxAmountLimit">Max Amount Limit (₹)</Label>
                        <Input
                            id="maxAmountLimit"
                            name="maxAmountLimit"
                            type="number"
                            placeholder="0"
                            step="0.01"
                            value={formData.maxAmountLimit}
                            onChange={handleChange}
                            className={formErrors.maxAmountLimit ? "border-destructive" : ""}
                        />
                        {formErrors.maxAmountLimit && (
                            <p className="text-sm text-destructive">{formErrors.maxAmountLimit}</p>
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
                                "Update Travel"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditTravelForm
