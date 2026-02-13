import { useEffect, useState } from "react"
import type { UserReponseDto, JobCreateDto } from "../../../type/Types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AddJob, GetHrByKey, GetUserByKey } from "../../../api/JobService"
import useDebounce from "../../../hook/useDebounce"
import UserCard from "./UserCard"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

function HrJobCreateForm() {

    const [newJob, setNewJob] = useState<JobCreateDto>({
        Title: "",
        JobRole: "",
        Place: "",
        Requirements: "",
    })
    const [Jd, setJd] = useState<File | null>(null)
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

    const HandleSubmitForm = () => {
        setErrors([])
        if (!isValidForm()) {
            return;
        }
        console.log(newJob);
        console.log(reviewers);
        console.log(contactTo);
        const formData = new FormData()
        formData.append("Title", String(newJob.Title))
        formData.append("JobRole", String(newJob.JobRole))
        formData.append("Place", String(newJob.Place))
        formData.append("Requirements", String(newJob.Requirements))
        formData.append("ContactTo", String(contactTo?.id))
        Array.from(reviewers).forEach(r => formData.append("Reviewer", String(r.id)))
        if(Jd)
            formData.append("Jd",Jd);
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
            setErrors((prev) => [...prev, "Job Description is Required !"])
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
            navigator("../")
        },
        onError: (err) => {
            console.log(err);
            toast.error("Failed to add JOB")
        }
    })

    return (
        <div className="flex justify-center">
            <div>
                <div className="flex justify-center p-2 font-bold text-2xl">
                    Add New Job
                </div>
                <div className="border-2 p-3 m-3">
                    <div>
                    </div>
                    <div className="flex gap-3 m-2">
                        Title :
                        <input
                            type="text"
                            name="Title"
                            className="border-2"
                            onChange={handleInputChange}
                            value={newJob.Title}
                            required={true}
                        />
                    </div>
                    <div className="flex gap-3 m-2">
                        JobRole :
                        <input
                            type="text"
                            name="JobRole"
                            className="border-2"
                            onChange={handleInputChange}
                            value={newJob.JobRole}
                            required={true}
                        />
                    </div>
                    <div className="flex gap-3 m-2">
                        Place :
                        <input
                            type="text"
                            name="Place"
                            className="border-2"
                            onChange={handleInputChange}
                            value={newJob.Place}
                            required={true}
                        />
                    </div>

                    <div className="flex gap-3 m-2">
                        Requirements :
                        <input
                            type="text"
                            name="Requirements"
                            className="border-2"
                            onChange={handleInputChange}
                            value={newJob.Requirements}
                            required={true}
                        />
                    </div>

                    <div className="flex gap-3 m-2">
                        JD PDF :
                        <input
                            name="Jd"
                            multiple
                            type="file"
                            onChange={(event) => {
                                if (event.target.files && event.target.files[0]) {
                                    setJd(event.target.files[0]);
                                }
                            }}
                            required={true}
                        />
                    </div>
                    <button
                        disabled={isPending}
                        className="bg-slate-800 p-3 rounded-sm text-white disabled:opacity-50"
                        onClick={HandleSubmitForm}>Submit</button>

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
                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <div className="flex justify-center p-3 font-bold text-2xl border-t-2 border-b-2 m-3">
                            Selected Hr For Contact To
                        </div>
                        <div>
                            {
                                contactTo ? <UserCard user={contactTo} fn={handleRemoveContactTo} isPending={isPending} /> : <div className="flex justify-center">Not Selected</div>
                            }
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-center p-3 font-bold text-2xl border-t-2 border-b-2 m-3">
                            Selected Reviewers
                        </div>
                        <div>
                            {
                                (reviewers && reviewers?.length > 0
                                    ? (
                                        <div className="p-3">
                                            {
                                                reviewers?.map((u) => (
                                                    <UserCard user={u} key={u.id} fn={handleRemoveReviewer} isPending={isPending} />
                                                ))
                                            }
                                        </div>
                                    )
                                    : (<div className="flex justify-center">Not Selected</div>)
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <div className="flex justify-center p-3 font-bold text-2xl border-t-2 border-b-2 m-3">
                            Search Hr
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Search Hrs..."
                                className="border-2 w-full"
                                value={hrKey}
                                onChange={(e) => setHrKey(e.target.value)}
                            />
                        </div>
                        <div>
                            {
                                (hrs && hrs?.length > 0
                                    ? (
                                        <div className="p-3">
                                            {
                                                hrs?.map((u) => (
                                                    <UserCard user={u} key={u.id} fn={handleSelectContacTo} isPending={isPending} />
                                                ))
                                            }
                                        </div>
                                    )
                                    : (<div className="flex justify-center">-Not Found-</div>)
                                )
                            }
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-center p-3 font-bold text-2xl border-t-2 border-b-2 m-3">
                            Search Employee
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Search Employes..."
                                className="border-2 w-full"
                                value={reviewerKey}
                                onChange={(e) => setReviewerKey(e.target.value)}
                            />
                        </div>
                        <div>
                            {
                                (allReviewers && allReviewers?.length > 0
                                    ? (
                                        <div className="p-3">
                                            {
                                                allReviewers?.map((u) => (
                                                    <UserCard user={u} key={u.id} fn={handleSelectReviewer} isPending={isPending} />
                                                ))
                                            }
                                        </div>
                                    )
                                    : (<div className="flex justify-center">-Not Found-</div>)
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HrJobCreateForm
