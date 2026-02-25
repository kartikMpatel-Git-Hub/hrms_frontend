import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { CreateUser, GetAllUsers, GetManagers } from "@/api/UserService"
import { GetDepartments } from "@/api/DepartmentService"
import { toast } from "sonner"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { ArrowLeft } from "lucide-react"
import type { UserReponseDto } from "@/type/Types"

interface FormErrors {
    [key: string]: string
}

function HrUserAddForm() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        designation: "",
        role: "",
        dateOfBirth: "",
        dateOfJoin: "",
        managerId: "",
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

    const { mutate: createUser, isPending } = useMutation({
        mutationFn: CreateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hr-users"] })
            toast.success("User created successfully")
            navigate("../", { relative: "route" })
        },
        onError: (error: any) => {
            const errorMsg = error?.response?.data?.message || "Failed to create user"
            toast.error(errorMsg)
            setFormErrors({ submit: errorMsg })
        },
    })

    const isValidEmail = (email: string): boolean => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!pattern.test(email)) {
            return false;
        }
        const parts = email.split('@');
        if (parts.length !== 2) return false;
        const [localPart, domain] = parts;
        if (localPart.length > 64 || localPart.length === 0) return false;
        if (domain.length > 255 || domain.length === 0) return false;
        if (domain.startsWith('.') || domain.endsWith('.')) return false;
        if (domain.includes('..')) return false;
        if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
        if (localPart.includes('..')) return false;
        return true;
    };

    const validateForm = (): boolean => {
        const errors: FormErrors = {}

        if (!formData.fullName.trim()) errors.fullName = "Full Name is required"
        if (!formData.email.trim()) errors.email = "Email is required"
        else if (!isValidEmail(formData.email.trim()))
            errors.email = "Please enter a valid email address"
        if (!formData.password.trim()) errors.password = "Password is required"
        if (!formData.designation.trim()) errors.designation = "Designation is required"
        if (!formData.role) errors.role = "Role is required"
        if (!formData.dateOfBirth) errors.dateOfBirth = "Date of Birth is required"
        if (!formData.dateOfJoin) errors.dateOfJoin = "Date of Join is required"
        if (!formData.managerId.trim()) errors.managerId = "Manager is required"
        if (!formData.departmentId) errors.departmentId = "Department is required"
        if (!formData.image) errors.image = "Profile Image is required"

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFormData((prev) => ({
                ...prev,
                image: file,
            }))
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
            if (formErrors.image) {
                setFormErrors((prev) => ({
                    ...prev,
                    image: "",
                }))
            }
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        const data = new FormData()
        data.append("fullName", formData.fullName)
        data.append("email", formData.email)
        data.append("password", formData.password)
        data.append("designation", formData.designation)
        data.append("role", formData.role)
        data.append("dateOfBirth", formData.dateOfBirth)
        data.append("dateOfJoin", formData.dateOfJoin)
        data.append("managerId", formData.managerId)
        data.append("departmentId", formData.departmentId)
        if (formData.image) {
            data.append("image", formData.image)
        }

        createUser(data)
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate("../", { relative: "route" })}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Users
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Add New User</CardTitle>
                    <CardDescription>Fill in all the required fields to create a new user account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">
                                Full Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="fullName"
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
                            <Label htmlFor="email">
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
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
                            <Label htmlFor="password">
                                Password <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                maxLength={16}
                                minLength={8}
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={formErrors.password ? "border-red-500" : ""}
                            />
                            {formErrors.password && (
                                <p className="text-sm text-red-500">{formErrors.password}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="designation">
                                Designation <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="designation"
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
                            <Label htmlFor="role">
                                Role <span className="text-red-500">*</span>
                            </Label>
                            <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                                <SelectTrigger className={formErrors.role ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EMPLOYEE">Employee</SelectItem>
                                    <SelectItem value="HR">HR</SelectItem>
                                    <SelectItem value="MANAGER">Manager</SelectItem>
                                </SelectContent>
                            </Select>
                            {formErrors.role && (
                                <p className="text-sm text-red-500">{formErrors.role}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="departmentId">
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

                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">
                                Date of Birth <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="dateOfBirth"
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
                            <Label htmlFor="dateOfJoin">
                                Date of Join <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="dateOfJoin"
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

                        <div className="space-y-2">
                            <Label htmlFor="managerId">
                                Report To <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.managerId}
                                onValueChange={(value) => handleSelectChange("managerId", value)}
                                disabled={managersLoading}
                            >
                                <SelectTrigger className={formErrors.managerId ? "border-red-500" : ""}>
                                    <SelectValue placeholder={managersLoading ? "Loading users..." : "Select a Report to"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {managers?.map((manager) => (
                                        <SelectItem key={manager.id} value={manager.id.toString()}>
                                            {manager.fullName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formErrors.managerId && (
                                <p className="text-sm text-red-500">{formErrors.managerId}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">
                                Profile Image <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Input
                                        id="image"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className={formErrors.image ? "border-red-500" : ""}
                                    />
                                    {formErrors.image && (
                                        <p className="text-sm text-red-500 mt-1">{formErrors.image}</p>
                                    )}
                                </div>
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-20 h-20 rounded-lg object-cover border"
                                    />
                                )}
                            </div>
                        </div>

                        {formErrors.submit && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{formErrors.submit}</p>
                            </div>
                        )}

                        <div className="flex gap-4 pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("../", { relative: "route" })}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending} className="flex gap-2">
                                {isPending ? (
                                    <>
                                        <Spinner className="w-4 h-4" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create User"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default HrUserAddForm
