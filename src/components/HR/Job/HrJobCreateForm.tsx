import { useEffect, useState } from "react"
import type { UserReponseDto, JobCreateDto } from "../../../type/Types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AddJob, GetHrByKey, GetUserByKey } from "../../../api/JobService"
import useDebounce from "../../../hook/useDebounce"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Card, CardHeader } from "@/components/ui/card"
import { Field } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ALargeSmall, FileArchive, List, MapPin, Paperclip, User2 } from "lucide-react"
import UserCard from "./UserCard"

function HrJobCreateForm() {

    const [newJob, setNewJob] = useState<JobCreateDto>({
        Title: "",
        JobRole: "",
        Place: "",
        Requirements: "",
    })
    const [Jd, setJd] = useState<File | null>(null)
    const [fileError, setFileError] = useState<string>("")
    const [reviewers, setReviewers] = useState<UserReponseDto[]>([])
    const [allReviewers, setAllReviewers] = useState<UserReponseDto[]>([])
    const [contactTo, setContactTo] = useState<UserReponseDto | null>()
    const [hrs, setHrs] = useState<UserReponseDto[]>()
    const [hrKey, setHrKey] = useState<string>("")
    const [reviewerKey, setReviewerKey] = useState<string>("")
    const fetchedHrs = useDebounce<UserReponseDto>(hrKey, 1000, GetHrByKey);
    const fetchedUsers = useDebounce<UserReponseDto>(reviewerKey, 1000, GetUserByKey);
    const [errors, setErrors] = useState<string[]>([])
    const navigator = useNavigate()

    useEffect(() => {
        if (fetchedHrs != null) {
            setHrs(fetchedHrs)
        }
    }, [fetchedHrs])

    useEffect(() => {
        if (fetchedUsers != null) {
            setAllReviewers(fetchedUsers)
        }
    }, [fetchedUsers])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setNewJob((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectContacTo = (user: UserReponseDto) => {
        setContactTo(user)
    }
    const handleSelectReviewer = (user: UserReponseDto) => {
        if (!reviewers.every((r) => r.id !== user.id))
            return
        setReviewers((prev) => [...prev, user])
    }
    const handleRemoveContactTo = (user: UserReponseDto) => {
        setContactTo(null)
    }
    const handleRemoveReviewer = (user: UserReponseDto) => {
        setReviewers((prev) => prev.filter((r) => r.id !== user.id))
    }

    const isValidPdfFile = (file: File): boolean => {
        return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    }

    const HandleSubmitForm = () => {
        setErrors([])
        if (!isValidForm()) {
            return;
        }
        const formData = new FormData()
        formData.append("Title", String(newJob.Title))
        formData.append("JobRole", String(newJob.JobRole))
        formData.append("Place", String(newJob.Place))
        formData.append("Requirements", String(newJob.Requirements))
        formData.append("ContactTo", String(contactTo?.id))
        Array.from(reviewers).forEach(r => formData.append("Reviewer", String(r.id)))
        if (Jd)
            formData.append("Jd", Jd);
        mutate({ dto: formData })
    }

    const isValidForm = () => {
        let flag = true;
        if (!newJob.Title.trim() || (newJob.Title.trim().length < 3 && newJob.Title.trim().length > 50)) {
            flag = false
            setErrors((prev) => [...prev, "Title Length must be between 3 to 50"])
        }
        if (!newJob.JobRole.trim() || (newJob.JobRole.trim().length < 3 && newJob.JobRole.trim().length > 20)) {
            flag = false
            setErrors((prev) => [...prev, "Job Role Length must be between 3 to 20"])
        }
        if (!newJob.Place.trim() || (newJob.Place.trim().length < 3 && newJob.Place.trim().length > 30)) {
            flag = false
            setErrors((prev) => [...prev, "Place Length must be between 3 to 30"])
        }
        if (!newJob.Requirements.trim() || (newJob.Requirements.trim().length < 3 && newJob.Requirements.trim().length > 30)) {
            flag = false
            setErrors((prev) => [...prev, "Requirements Length must be between 3 to 300"])
        }
        if (!Jd) {
            flag = false;
            setErrors((prev) => [...prev, "Job Description PDF is required!"])
        } else if (!isValidPdfFile(Jd)) {
            flag = false;
            setErrors((prev) => [...prev, "Job Description must be a PDF file!"])
        }
        if (!contactTo) {
            flag = false;
            setErrors((prev) => [...prev, "Contact To Hr Required !"])
        }
        if (reviewers.length == 0) {
            flag = false;
            setErrors((prev) => [...prev, "Reviewers are Required !"])
        }
        return flag
    }

    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationKey: ["new-job"],
        mutationFn: AddJob,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['hr-jobs'] })
            toast.success("Job created successfully")
            navigator("../")
        },
        onError: (err) => {
            // console.log(err);
            toast.error("Failed to add JOB")
        }
    })

    return (
        <div className="m-10">
            <div className="">
                <Card className="w-full">
                    <CardHeader className="">
                        <div className="flex flex-col gap-3">
                            <div className="font-bold text-black/90 text-3xl flex justify-center">Job Details</div>
                            <Field className="m-1">
                                <Label><span className="flex"><ALargeSmall className="w-4 h-4 mr-2" /><span className="">Title</span></span></Label>
                                <Input name="Title" maxLength={40} placeholder="Enter Job Title" onChange={handleInputChange} value={newJob.Title} required />
                            </Field>
                            <Field className="m-1">
                                <Label><span className="flex"><User2 className="w-4 h-4 mr-2" /><span className="">Job Role</span></span></Label>
                                <Input name="JobRole" max={15} placeholder="Enter Job Role" onChange={handleInputChange} value={newJob.JobRole} required />
                            </Field>
                            <Field className="m-1">
                                <Label><span className="flex"><MapPin className="w-4 h-4 mr-2" /><span className="">Place</span></span></Label>
                                <Input name="Place" maxLength={25} placeholder="Enter Place" onChange={handleInputChange} value={newJob.Place} required />
                            </Field>
                            <Field className="m-1">
                                <Label><span className="flex"><List className="w-4 h-4 mr-2" /><span className="">Requirements</span></span></Label>
                                <Input name="Requirements" maxLength={250} placeholder="Enter Requirements" onChange={handleInputChange} value={newJob.Requirements} required />
                            </Field>
                            <Field className="m-1">
                                <Label><span className="flex"><Paperclip className="w-4 h-4 mr-2" /><span className="">JD PDF</span></span></Label>
                                <Input
                                    name="Jd"
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    onChange={(event) => {
                                        setFileError("")
                                        if (event.target.files && event.target.files[0]) {
                                            const file = event.target.files[0]
                                            if (!isValidPdfFile(file)) {
                                                setFileError("Only PDF files are allowed!")
                                                event.target.value = ""
                                                setJd(null)
                                                return
                                            }
                                            setJd(file)
                                        }
                                    }}
                                    required
                                />
                                {fileError && <p className="mt-1 text-sm text-red-500">{fileError}</p>}
                                {Jd && <p className="mt-1 text-sm text-green-600">✓ {Jd.name}</p>}
                            </Field>
                            <Button
                                disabled={isPending}
                                className="bg-slate-800 mt-4"
                                onClick={HandleSubmitForm}>Submit</Button>
                            <div>
                                {
                                    errors.length > 0 && (
                                        <div className="text-red-700">
                                            {errors.map((err, index) => (
                                                <div key={index}>{err}</div>
                                            ))}
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            </div>
            <div className="mt-8 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-slate-200 dark:border-slate-700">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2 text-lg font-semibold">
                                <User2 className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                <span>Selected HR - Contact To</span>
                            </div>
                        </CardHeader>
                        <div className="px-6 pb-6">
                            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/30 min-h-30 flex items-center justify-center">
                                {contactTo ? (
                                    <UserCard user={contactTo} fn={handleRemoveContactTo} isPending={isPending} />
                                ) : (
                                    <div className="text-center text-muted-foreground">
                                        {/* <User2 className="w-8 h-8 mx-auto mb-2 opacity-50" /> */}
                                        <p>No HR selected</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-700">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2 text-lg font-semibold">
                                <User2 className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                <span>Selected Reviewers</span>
                            </div>
                        </CardHeader>
                        <div className="px-6 pb-6">
                            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/30 max-h-75 overflow-y-auto">
                                {reviewers && reviewers.length > 0 ? (
                                    <div className="space-y-2">
                                        {reviewers.map((u) => (
                                            <UserCard key={u.id} user={u} fn={handleRemoveReviewer} isPending={isPending} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground py-8">
                                        {/* <User2 className="w-8 h-8 mx-auto mb-2 opacity-50" /> */}
                                        <p>No reviewers selected</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-slate-200 dark:border-slate-700">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2 text-lg font-semibold">
                                <FileArchive className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                <span>Search HR</span>
                            </div>
                        </CardHeader>
                        <div className="px-6 pb-6 space-y-4">
                            <Field>
                                <Input
                                    type="text"
                                    placeholder="Type HR name or email..."
                                    value={hrKey}
                                    onChange={(e) => setHrKey(e.target.value)}
                                    className="bg-background"
                                />
                            </Field>
                            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-900/30 max-h-75 overflow-y-auto">
                                {hrs && hrs.length > 0 ? (
                                    <div className="space-y-2">
                                        {hrs.map((u) => (
                                            <UserCard key={u.id} user={u} fn={handleSelectContacTo} isPending={isPending} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground py-6">
                                        {hrKey.length > 0 ? (
                                            <>
                                                <User2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                <p>No HR found</p>
                                            </>
                                        ) : (
                                            <>
                                                <FileArchive className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                <p>Start typing to search</p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-slate-200 dark:border-slate-700">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2 text-lg font-semibold">
                                <FileArchive className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                <span>Search Employees</span>
                            </div>
                        </CardHeader>
                        <div className="px-6 pb-6 space-y-4">
                            <Field>
                                <Input
                                    type="text"
                                    placeholder="Type employee name or email..."
                                    value={reviewerKey}
                                    onChange={(e) => setReviewerKey(e.target.value)}
                                    className="bg-background"
                                />
                            </Field>
                            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-900/30 max-h-75 overflow-y-auto">
                                {allReviewers && allReviewers.length > 0 ? (
                                    <div className="space-y-2">
                                        {allReviewers.map((u) => (
                                            <UserCard key={u.id} user={u} fn={handleSelectReviewer} isPending={isPending} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground py-6">
                                        {reviewerKey.length > 0 ? (
                                            <>
                                                <User2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                <p>No employees found</p>
                                            </>
                                        ) : (
                                            <>
                                                <FileArchive className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                <p>Start typing to search</p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default HrJobCreateForm
