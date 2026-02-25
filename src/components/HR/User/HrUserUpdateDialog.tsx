import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { UpdateUser, GetManagers } from "@/api/UserService"
import { GetDepartments } from "@/api/DepartmentService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import type { UserReponseDto } from "@/type/Types"

interface FormErrors {
    [key: string]: string
}

interface HrUserUpdateDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: UserReponseDto
}

function HrUserUpdateDialog({ open, onOpenChange, user }: HrUserUpdateDialogProps) {
    const queryClient = useQueryClient()

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        designation: "",
        dateOfBirth: "",
        dateOfJoin: "",
        reportTo: "",
        departmentId: "",
        image: null as File | null,
    })

    const [formErrors, setFormErrors] = useState<FormErrors>({})
    const [imagePreview, setImagePreview] = useState("")
    const [managers, setManagers] = useState<UserReponseDto[]>([])

    const { data: departments, isLoading: departmentsLoading } = useQuery({
        queryKey: ["departments"],
        queryFn: GetDepartments,
    })

    const { data: managerData, isLoading: managersLoading } = useQuery({
        queryKey: ["managers"],
        queryFn: GetManagers,
    })

    useEffect(() => {
        if (managerData) {
            setManagers(managerData.data)
        }
    }, [managerData])

    useEffect(() => {
        if (user && open) {
            const dob = user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : ""
            const doj = user.dateOfJoin ? new Date(user.dateOfJoin).toISOString().split("T")[0] : ""
            setFormData({
                fullName: user.fullName || "",
                email: user.email || "",
                designation: user.designation || "",
                dateOfBirth: dob,
                dateOfJoin: doj,
                reportTo: user.reportTo ? user.reportTo.toString() : "",
                departmentId: user.department ? user.department.id.toString() : "",
                image: null,
            })
            setImagePreview(user.image || "")
            setFormErrors({})
            console.log(user);
        }
        
    }, [user, open])

    const { mutate: updateUser, isPending } = useMutation({
        mutationFn: UpdateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hr-users"] })
            onOpenChange(false)
        },
        onError: (error: any) => {
            const errorMsg = error?.response?.data?.message || "Failed to update user"
            setFormErrors({ submit: errorMsg })
        },
    })

    const isValidEmail = (email: string): boolean => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!pattern.test(email)) return false
        const parts = email.split("@")
        if (parts.length !== 2) return false
        const [localPart, domain] = parts
        if (localPart.length > 64 || localPart.length === 0) return false
        if (domain.length > 255 || domain.length === 0) return false
        if (domain.startsWith(".") || domain.endsWith(".")) return false
        if (domain.includes("..")) return false
        if (localPart.startsWith(".") || localPart.endsWith(".")) return false
        if (localPart.includes("..")) return false
        return true
    }

    const validateForm = (): boolean => {
        const errors: FormErrors = {}

        if (!formData.fullName.trim()) errors.fullName = "Full Name is required"
        if (!formData.email.trim()) errors.email = "Email is required"
        else if (!isValidEmail(formData.email.trim()))
            errors.email = "Please enter a valid email address"
        if (!formData.designation.trim()) errors.designation = "Designation is required"
        if (!formData.dateOfBirth) errors.dateOfBirth = "Date of Birth is required"
        if (!formData.dateOfJoin) errors.dateOfJoin = "Date of Join is required"
        if (!formData.reportTo) errors.reportTo = "Report To is required"
        if (!formData.departmentId) errors.departmentId = "Department is required"

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }))
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
            if (formErrors.image) {
                setFormErrors((prev) => ({ ...prev, image: "" }))
            }
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        const data = new FormData()
        data.append("FullName", formData.fullName)
        data.append("Email", formData.email)
        data.append("Designation", formData.designation)
        data.append("DateOfBirth", formData.dateOfBirth)
        data.append("DateOfJoin", formData.dateOfJoin)
        data.append("ReportTo", formData.reportTo)
        data.append("DepartmentId", formData.departmentId)
        if (formData.image) {
            data.append("Image", formData.image)
        }

        updateUser({ id: user.id, data })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Update User</DialogTitle>
                    <DialogDescription>
                        Update the details for {user.fullName}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="update-fullName">
                            Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="update-fullName"
                            name="fullName"
                            maxLength={100}
                            placeholder="Enter full name"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={formErrors.fullName ? "border-red-500" : ""}
                        />
                        {formErrors.fullName && (
                            <p className="text-sm text-red-500">{formErrors.fullName}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="update-email">
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="update-email"
                            name="email"
                            maxLength={40}
                            type="email"
                            placeholder="Enter email address"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={formErrors.email ? "border-red-500" : ""}
                        />
                        {formErrors.email && (
                            <p className="text-sm text-red-500">{formErrors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="update-designation">
                            Designation <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="update-designation"
                            name="designation"
                            maxLength={20}
                            placeholder="e.g., Technical Intern, Senior Developer"
                            value={formData.designation}
                            onChange={handleInputChange}
                            className={formErrors.designation ? "border-red-500" : ""}
                        />
                        {formErrors.designation && (
                            <p className="text-sm text-red-500">{formErrors.designation}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="update-departmentId">
                            Department <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.departmentId}
                            onValueChange={(value) => handleSelectChange("departmentId", value)}
                            disabled={departmentsLoading}
                        >
                            <SelectTrigger className={formErrors.departmentId ? "border-red-500" : ""}>
                                <SelectValue placeholder={departmentsLoading ? "Loading departments..." : "Select a department"} />
                            </SelectTrigger>
                            <SelectContent>
                                {departments?.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.id.toString()}>
                                        {dept.departmentName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {formErrors.departmentId && (
                            <p className="text-sm text-red-500">{formErrors.departmentId}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="update-dateOfBirth">
                                Date of Birth <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="update-dateOfBirth"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                className={formErrors.dateOfBirth ? "border-red-500" : ""}
                            />
                            {formErrors.dateOfBirth && (
                                <p className="text-sm text-red-500">{formErrors.dateOfBirth}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="update-dateOfJoin">
                                Date of Join <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="update-dateOfJoin"
                                name="dateOfJoin"
                                type="date"
                                value={formData.dateOfJoin}
                                onChange={handleInputChange}
                                className={formErrors.dateOfJoin ? "border-red-500" : ""}
                            />
                            {formErrors.dateOfJoin && (
                                <p className="text-sm text-red-500">{formErrors.dateOfJoin}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="update-reportTo">
                            Report To <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.reportTo}
                            onValueChange={(value) => handleSelectChange("reportTo", value)}
                            disabled={managersLoading}
                        >
                            <SelectTrigger className={formErrors.reportTo ? "border-red-500" : ""}>
                                <SelectValue placeholder={managersLoading ? "Loading users..." : "Select Report To"} />
                            </SelectTrigger>
                            <SelectContent>
                                {managers?.map((manager) => (
                                    <SelectItem key={manager.id} value={manager.id.toString()}>
                                        {manager.fullName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {formErrors.reportTo && (
                            <p className="text-sm text-red-500">{formErrors.reportTo}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="update-image">Profile Image</Label>
                        <div className="flex gap-4 items-center">
                            <div className="flex-1">
                                <Input
                                    id="update-image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-16 h-16 rounded-lg object-cover border"
                                />
                            )}
                        </div>
                    </div>

                    {formErrors.submit && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{formErrors.submit}</p>
                        </div>
                    )}

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending} className="flex gap-2">
                            {isPending ? (
                                <>
                                    <Spinner className="w-4 h-4" />
                                    Updating...
                                </>
                            ) : (
                                "Update User"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default HrUserUpdateDialog
