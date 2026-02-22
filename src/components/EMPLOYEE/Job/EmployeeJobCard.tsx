import { Card, CardHeader, CardAction, CardDescription, CardFooter, CardTitle } from '@/components/ui/card'
import { type JobResponseDto } from '../../../type/Types'
import { ALargeSmall, Briefcase, Eye, File, LucideUserPlus, Mail, MapPin, Send, Text, User, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useEffect, useState, type ChangeEvent } from 'react'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ToastContainer, toast } from 'react-toastify'
import { Textarea } from '@/components/ui/textarea'
import { TableCell, TableRow } from '@/components/ui/table'

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
            <ToastContainer />
            <TableCell>{idx + 1}</TableCell>
            <TableCell>{job.title}</TableCell>
            <TableCell>{job.jobRole}</TableCell>
            {/* <TableCell>{job.place}</TableCell> */}
            <TableCell>{job.isActive ? "Active" : "Closed"}</TableCell>
            <TableCell className='flex gap-2'>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" title='View Job Details'>
                            <Eye />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle className='flex'><Briefcase className='w-4 h-5 mr-1' /> JOB DETAILS<span className='text-sm'>{job.isActive ? "(Active)" : "(closed)"}</span></DialogTitle>
                            <DialogDescription>
                                Here Is Description Related To this Perticular Job
                            </DialogDescription>
                        </DialogHeader>
                        <div className='flex flex-col gap-2'>
                            <div><span className='font-bold mr-1 italic'>Title:</span>{job.title.toUpperCase()}</div>
                            <div><span className='font-bold mr-1 italic'>Role :</span>{job.jobRole.toUpperCase()}</div>
                            <div><span className='font-bold mr-1 italic'>Place:</span>{job.place.toUpperCase()}</div>
                            <div><span className='font-bold mr-1 italic'>Requirements:</span>{job.requirements}</div>
                            <Button onClick={() => window.open(job.jdUrl, "_blank")}><Eye /> View JD</Button>
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
