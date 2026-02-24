import { ALargeSmall, Edit, Eye, File, LucideUserPlus, Mail, Send, Text, Trash, User } from "lucide-react"
import { useEffect, useMemo, useState, type ChangeEvent } from "react"
import type { JobResponseDto, JobUpdateDto } from "../../../type/Types"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UpdateJob } from "@/api/JobService"
import { toast } from "react-toastify"

interface HrJobCardProp {
    job: JobResponseDto,
    idx: number,
    handleDelete: (id: number) => void,
    handleReferred: (id: number, dto: any, cv: File) => void,
    handleShare: (id: number, email: string) => void,
    isCompleted : boolean,
    isPending : boolean
}

function HrJobCard({ job, idx, handleDelete,handleReferred,handleShare,isCompleted,isPending}: HrJobCardProp) {

    const navigator = useNavigate()
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)
    const [errors, setErrors] = useState<string[]>([])
    const [shareEmail, setShareEmail] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [referenceRequest, setReferrenceRequest] = useState({
        ReferedPersonName: "",
        ReferedPersonEmail: "",
        Note: ""
    })
    const [cv, setCv] = useState<File | null>(null)
    const [fileError, setFileError] = useState<string>("")
    const [actionType, setActionType] = useState<'share' | 'refer' | null>(null)

    const isValidPdfFile = (file: File): boolean => {
        return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFileError("")
        if (e.target.files) {
            const file = e.target.files[0]
            if (!isValidPdfFile(file)) {
                setFileError("Only PDF files are allowed!")
                e.target.value = ""
                setCv(null)
                return
            }
            setCv(file)
        }
    };

    useEffect(() => {
        if (isCompleted == true) {
            setReferrenceRequest({
                ReferedPersonName: "",
                ReferedPersonEmail: "",
                Note: ""
            })
            setError("")
            setErrors([])
            setCv(null)
            setShareEmail("")
            setActionType(null)
        }
    }, [isCompleted, actionType])

    const isValidFormForReferral = () => {
        var flag = true;
        if (!referenceRequest.ReferedPersonName.trim() || referenceRequest.ReferedPersonName.trim().length < 2 || referenceRequest.ReferedPersonName.trim().length > 50) {
            setErrors((p) => [...p, "Person name should contain 2 to 50 Character !"])
            flag = false
        }
        if (!referenceRequest.ReferedPersonEmail.trim() || referenceRequest.ReferedPersonEmail.trim().length < 2 || referenceRequest.ReferedPersonEmail.trim().length > 50) {
            setErrors((p) => [...p, "Person email should contain 2 to 50 Character !"])
            flag = false
        } else {
            if (!validateEmail(referenceRequest.ReferedPersonEmail)) {
                setErrors((p) => [...p, "Invalid Email"])
                flag = false
            }
        }
        if (!referenceRequest.Note.trim() || referenceRequest.Note.trim().length < 2 || referenceRequest.Note.trim().length > 500) {
            setErrors((p) => [...p, "Note should contain 20 to 500 Character !"])
            flag = false
        }
        if (!cv) {
            setErrors((p) => [...p, "CV is required!"])
            flag = false
        } else if (!isValidPdfFile(cv)) {
            setErrors((p) => [...p, "CV must be a PDF file!"])
            flag = false
        }
        return flag;
    }

    const handleReferredSubmit = () => {
        setErrors([])
        if (!isValidFormForReferral()) {
            return
        }
        if (cv) {
            setActionType('refer')
            handleReferred(job.id, referenceRequest, cv)
        }
    }

    const handleShareSubmit = () => {
        if (!shareEmail.trim()) {
            setError("Email can not be empty !")
            return;
        }
        else if (!validateEmail(shareEmail.trim())) {
            setError("Please Enter Valid email !")
            return;
        }
        setActionType('share')
        handleShare(job.id, shareEmail)
    }

    function validateEmail(email: string): boolean {
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
    }

    const initialForm = useMemo<JobUpdateDto>(() => ({
        Title: job.title,
        JobRole: job.jobRole,
        Place: job.place,
        Requirements: job.requirements,
        IsActive: job.isActive
    }), [job])

    const [form, setForm] = useState<JobUpdateDto>(initialForm)

    useEffect(() => {
        if (open) {
            setForm(initialForm)
            setErrors([])
        }
    }, [open, initialForm])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleInputChangeForReferral = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target
        setReferrenceRequest((prev) => ({ ...prev, [name]: value }))
    }

    const isValidForm = () => {
        const nextErrors: string[] = []
        if (!form.Title.trim() || form.Title.trim().length < 3 || form.Title.trim().length > 50) {
            nextErrors.push("Title length must be between 3 to 50")
        }
        if (!form.JobRole.trim() || form.JobRole.trim().length < 3 || form.JobRole.trim().length > 20) {
            nextErrors.push("Job role length must be between 3 to 20")
        }
        if (!form.Place.trim() || form.Place.trim().length < 3 || form.Place.trim().length > 30) {
            nextErrors.push("Place length must be between 3 to 30")
        }
        if (!form.Requirements.trim() || form.Requirements.trim().length < 3 || form.Requirements.trim().length > 300) {
            nextErrors.push("Requirements length must be between 3 to 300")
        }
        setErrors(nextErrors)
        return nextErrors.length === 0
    }

    const { mutate, isPending : isCreatePending  } = useMutation({
        mutationKey: ["update-job", job.id],
        mutationFn: (dto: JobUpdateDto) => UpdateJob({ id: job.id, dto }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hr-jobs"] })
            toast.success("Job updated successfully")
            setOpen(false)
        },
        onError: () => {
            toast.error("Failed to update job")
        }
    })

    const handleSubmit = () => {
        if (!isValidForm()) {
            return
        }
        mutate(form)
    }


    return (
        <TableRow>
            <TableCell>{idx + 1}</TableCell>
            <TableCell>{job.title}</TableCell>
            <TableCell>{job.jobRole}</TableCell>
            <TableCell>{job.isActive ? <span className="text-green-600 font-semibold">Active</span> : <span className="text-red-500 font-semibold">Inactive</span>}</TableCell>
            <TableCell>{job.place}</TableCell>
            <TableCell className="grid grid-cols-3 gap-2">
                <Button onClick={() => navigator(`./${job.id}`)}><Eye /></Button>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button title="Edit Job"><Edit /></Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Edit Job</DialogTitle>
                            <DialogDescription>Update job information.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <Field>
                                <Label>Title</Label>
                                <Input name="Title" maxLength={40} value={form.Title} onChange={handleInputChange} />
                            </Field>
                            <Field>
                                <Label>Job Role</Label>
                                <Input name="JobRole" maxLength={15} value={form.JobRole} onChange={handleInputChange} />
                            </Field>
                            <Field>
                                <Label>Place</Label>
                                <Input name="Place" maxLength={25} value={form.Place} onChange={handleInputChange} />
                            </Field>
                            <Field>
                                <Label>Requirements</Label>
                                <Textarea name="Requirements" maxLength={250} value={form.Requirements} onChange={handleInputChange} />
                            </Field>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={form.IsActive}
                                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, IsActive: checked === true }))}
                                />
                                <span className="text-sm">Active</span>
                            </div>
                        </div>
                        {errors.length > 0 && (
                            <div className="text-sm text-red-600">
                                {errors.map((err, index) => (
                                    <div key={index}>{err}</div>
                                ))}
                            </div>
                        )}
                        <DialogFooter>
                            <Button onClick={handleSubmit} disabled={isCreatePending}>
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Button onClick={() => handleDelete(job.id)}><Trash /></Button>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="default" title='Share Job' disabled={!job.isActive}>
                            <Send />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle className='flex'><Send className='w-4 h-5 mr-1' />SHARE JOB</DialogTitle>
                            <DialogDescription>
                                Enter Email to whom you want to share this job
                            </DialogDescription>
                        </DialogHeader>
                        <div>
                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                    <ALargeSmall className="w-4 h-4" />Travel Title
                                </FieldLabel>
                                <Input
                                    placeholder="Enter Email to whom you want to share"
                                    required
                                    name="Title"
                                    value={shareEmail}
                                    onChange={(e) => setShareEmail(e.target.value)}
                                />
                            </Field>
                        </div>
                        <DialogFooter>
                            <div className='mt-2 '>
                                <Button onClick={handleShareSubmit} disabled={isPending}><Send /> Send</Button>
                            </div>
                        </DialogFooter>
                        {
                            error &&
                            <div className='text-sm text-red-600'>
                                {error}
                            </div>
                        }
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="default" title='Refere' disabled={!job.isActive}>
                            <LucideUserPlus />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle className='flex'><LucideUserPlus className='w-4 h-5 mr-1' />REFERRE JOB</DialogTitle>
                            <DialogDescription>
                                Enter Detail to whom you want to Referre
                            </DialogDescription>
                        </DialogHeader>
                        <div className='flex flex-col gap-2'>
                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                    <User className="w-4 h-4" />Referre Person Name
                                </FieldLabel>
                                <Input
                                    placeholder="Enter Name of Person you want to Referre"
                                    required
                                    name="ReferedPersonName"
                                    value={referenceRequest.ReferedPersonName}
                                    onChange={handleInputChangeForReferral}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                    <Mail className="w-4 h-4" />Referre Person Email
                                </FieldLabel>
                                <Input
                                    placeholder="Enter Email of Person you want to Referre"
                                    required
                                    name="ReferedPersonEmail"
                                    value={referenceRequest.ReferedPersonEmail}
                                    onChange={handleInputChangeForReferral}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                    <Text className="w-4 h-4" />Note*
                                </FieldLabel>
                                <Textarea
                                    placeholder="Enter Detail About this person"
                                    required
                                    name="Note"
                                    value={referenceRequest.Note}
                                    onChange={handleInputChangeForReferral}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                    <File className="w-4 h-4" />Upload CV*
                                </FieldLabel>
                                <Input
                                    type='file'
                                    accept=".pdf,application/pdf"
                                    onChange={handleFileChange}
                                />
                                {fileError && <p className="mt-1 text-sm text-red-500">{fileError}</p>}
                                {cv && <p className="mt-1 text-sm text-green-600">✓ {cv.name}</p>}
                            </Field>
                            <DialogFooter>
                                <div className='mt-2 '>
                                    <Button onClick={handleReferredSubmit} disabled={isPending}>
                                        <Send /> Send
                                    </Button>
                                </div>
                            </DialogFooter>
                            <div>
                                {
                                    errors.map(e => (
                                        <p className='text-red-600 text-sm'>{e}</p>
                                    ))
                                }
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </TableCell>
        </TableRow>
    )
}

export default HrJobCard
