import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { GetJobById } from "../../../api/JobService"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import type { JobResponseWithReviewerDto } from "../../../type/Types"
import UserCard from "./UserCard"
import ContactToCard from "./ContactToCard"
import ReviewerCard from "./ReviewerCard"

function HrJobDetail() {
    const { id } = useParams()
    const [job, setJob] = useState<JobResponseWithReviewerDto>()

    const { data, error, isLoading } = useQuery({
        queryKey: ["job-detail"],
        queryFn: () => GetJobById(Number(id))
    })

    useEffect(() => {
        if (data) {
            console.log(data);
            setJob(data)
        }
    }, [data])

    if (isLoading) {
        return (
            <div className="flex gap-2">
                <Loader /> Loading...
            </div>
        )
    }

    return (
        <div className="flex justify-center p-5">
            <div className="">
                <div className="flex justify-center">
                    <div >
                        <div><span className="font-bold italic">Title : </span>{job?.title}</div>
                        <div><span className="font-bold italic">Job Role : </span>{job?.title}</div>
                        <div><span className="font-bold italic">Place : </span>{job?.place}</div>
                        <div><span className="font-bold italic">Requirements : </span>{job?.requirements}</div>
                        <div><span className="font-bold italic">Activation Status : </span>{job?.isActive ? "Active" : "Inactive"}</div>
                        <div className="flex justify-center border-2 p-2">
                            <img
                                src={job?.jdUrl}
                                className="w-20"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <div >
                        <div className="p-2 border-t-2 border-b-2 m-2 w-full flex justify-center font-bold text-2xl">
                            Contact To
                        </div>
                        {
                            job && <ContactToCard contact={job?.contact} />
                        }
                    </div>
                </div>
                <div className="flex justify-center">
                    <div >
                        <div className="p-2 border-t-2 border-b-2 m-2 w-full flex justify-center  font-bold text-2xl">
                            Reviewers
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {
                                job && job?.reviewers.length > 0
                                    ? job?.reviewers.map((r) => <ReviewerCard reviewer={r.reviewer} />)
                                    : <div>Not Reviewers</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HrJobDetail
