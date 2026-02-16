import { Card, CardHeader, CardAction, CardDescription, CardFooter, CardTitle } from '@/components/ui/card'
import { type JobResponseDto } from '../../../type/Types'
import { ALargeSmall, Briefcase, Eye, File, LucideUserPlus, Mail, MapPin, Send, Text, User, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useEffect, useState, type ChangeEvent } from 'react'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ToastContainer } from 'react-toastify'
import { Textarea } from '@/components/ui/textarea'

interface EmployeeJobCardProp {
    job: JobResponseDto,
    isPending: boolean,
    isCompleted: boolean,
    handleReferred: (id: number, dto: any, cv: File) => void,
    handleShare: (id: number, email: string) => void,
}

function EmployeeJobCard({ job, isPending, handleReferred, handleShare, isCompleted }: EmployeeJobCardProp) {


    const [shareEmail, setShareEmail] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [referenceRequest, setReferrenceRequest] = useState({
        ReferedPersonName: "",
        ReferedPersonEmail: "",
        Note: ""
    })
    const [cv, setCv] = useState<File | null>(null)
    const [errors, setErrors] = useState<string[]>([])

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setCv(e.target.files[0]);
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
        }
    }, [isCompleted])


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
            setErrors((p) => [...p, "Person cv is Required !"])
            flag = false
        }
        return flag;
    }

    const handleReferredSubmit = () => {
        setErrors([])
        if (!isValidForm()) {
            return
        }
        if (cv)
            handleReferred(job.id, referenceRequest, cv)
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
        handleShare(job.id, shareEmail)
    }

    function validateEmail(email: string): boolean {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

    return (
        <Card className="relative mx-auto w-full max-w-sm p-3 ">
            <ToastContainer />
            <CardHeader>
                <CardAction>
                    <div className={`${job.isActive ? "bg-green-700" : "bg-red-500"} p-1 rounded-sm font-bold text-sm text-white`}>{job.isActive ? "Active" : "Inactive"}</div>
                </CardAction>
                <CardTitle>
                    <div className="flex gap-1 font-bold text-black/90">
                        <Briefcase className="w-4 h-4 inline " />
                        {job.title}
                    </div>
                </CardTitle>
                <div className="text-black/50 text-sm flex gap-1"><MapPin className="w-4 h-4 mt-0.5" /> {job.place}</div>
                <CardDescription>
                    <div className="flex gap-1 text-black/60">
                        <ALargeSmall className="w-5 h-5 inline " />
                        {job.requirements}
                    </div>
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <div className='w-full'>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="mt-4 w-full">
                                <Eye /> View
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
                            <Button variant="default" className="mt-1 w-full">
                                <Send /> Share
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
                            <Button variant="default" className="mt-1 w-full">
                                <LucideUserPlus /> Referred
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm">
                            <DialogHeader>
                                <DialogTitle className='flex'><LucideUserPlus className='w-4 h-5 mr-1' />REFERRED JOB</DialogTitle>
                                <DialogDescription>
                                    Enter Detail to whom you want to Referred
                                </DialogDescription>
                            </DialogHeader>
                            <div className='flex flex-col gap-2'>
                                <Field>
                                    <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                        <User className="w-4 h-4" />Referred Person Name
                                    </FieldLabel>
                                    <Input
                                        placeholder="Enter Name of Person you want to Referred"
                                        required
                                        name="ReferedPersonName"
                                        value={referenceRequest.ReferedPersonName}
                                        onChange={handleInputChange}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                        <Mail className="w-4 h-4" />Referred Person Email
                                    </FieldLabel>
                                    <Input
                                        placeholder="Enter Email of Person you want to Referred"
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
                                        onChange={handleFileChange}
                                    />
                                    {/* <File */}
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
                </div>
            </CardFooter>
        </Card>
    )
}

export default EmployeeJobCard
