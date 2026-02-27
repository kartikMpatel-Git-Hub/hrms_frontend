import { type JobResponseDto } from '../../../type/Types'
import { ALargeSmall, Briefcase, Eye, ExternalLink, File, LucideUserPlus, Mail, MapPin, Send, ScrollText, Text, User, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useEffect, useState, type ChangeEvent } from 'react'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { TableCell, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface EmployeeJobCardProp {
    job: JobResponseDto,
    isPending: boolean,
    isCompleted: boolean,
    idx: number,
    handleReferred: (id: number, dto: any, cv: File) => void,
    handleShare: (id: number, email: string) => void,
}

function EmployeeJobCard({ job, idx, isPending, handleReferred, handleShare, isCompleted }: EmployeeJobCardProp) {


    const [shareEmail, setShareEmail] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [referenceRequest, setReferrenceRequest] = useState({
        ReferedPersonName: "",
        ReferedPersonEmail: "",
        Note: ""
    })
    const [cv, setCv] = useState<File | null>(null)
    const [fileError, setFileError] = useState<string>("")
    const [errors, setErrors] = useState<string[]>([])
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
            if (actionType === 'share') {
                toast.success('Job shared successfully!')
            } else if (actionType === 'refer') {
                toast.success('Job referred successfully!')
            }
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


    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target
        setReferrenceRequest((prev) => ({ ...prev, [name]: value }))
    }

    const isValidForm = () => {
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
        if (!isValidForm()) {
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

    return (
        <TableRow>
            <TableCell>{idx + 1}</TableCell>
            <TableCell>{job.title}</TableCell>
            <TableCell>{job.jobRole}</TableCell>
            <TableCell>{job.place}</TableCell>
            <TableCell>{job.isActive ? "Active" : "Closed"}</TableCell>
            <TableCell className='flex gap-2'>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" title='View Job Details'>
                            <Eye />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-xl">
                        <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent px-6 pt-6 pb-4">
                            <DialogHeader className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <DialogTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/15">
                                            <Briefcase className="w-4 h-4 text-primary" />
                                        </div>
                                        Job Details
                                    </DialogTitle>
                                    <Badge variant={job.isActive ? "success" : "destructive"} className="text-xs px-2.5 py-1 rounded-full">
                                        {job.isActive ? "Active" : "Closed"}
                                    </Badge>
                                </div>
                                <DialogDescription className="text-muted-foreground text-sm">
                                    Complete information about this job position
                                </DialogDescription>
                            </DialogHeader>
                        </div>
                        <Separator />
                        <div className="px-6 pb-6 pt-2 space-y-4">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                                <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary/10 shrink-0 mt-0.5">
                                    <ClipboardList className="w-4 h-4 text-primary" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</p>
                                    <p className="text-sm font-semibold mt-0.5 wrap-break-word">{job.title}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-accent shrink-0 mt-0.5">
                                        <User className="w-4 h-4 text-accent-foreground" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</p>
                                        <p className="text-sm font-semibold mt-0.5 wrap-break-word">{job.jobRole}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-secondary shrink-0 mt-0.5">
                                        <MapPin className="w-4 h-4 text-secondary-foreground" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</p>
                                        <p className="text-sm font-semibold mt-0.5 wrap-break-word">{job.place}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-muted shrink-0">
                                        <ScrollText className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Requirements</p>
                                </div>
                                <p className="text-sm leading-relaxed text-foreground/80 pl-11 wrap-break-word">{job.requirements}</p>
                            </div>

                            <Button
                                className="w-full gap-2"
                                onClick={() => window.open(job.jdUrl, "_blank")}
                            >
                                <ExternalLink className="w-4 h-4" />
                                View Job Description
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="default" title='Share Job'>
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
                        <Button variant="default" title='Refere'>
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
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
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

export default EmployeeJobCard
