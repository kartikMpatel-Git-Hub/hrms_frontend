import { useMutation, useQuery } from "@tanstack/react-query"
import { GetAllJob, ReferedJob, ShareJob } from "../../../api/JobService"
import { useEffect, useState } from "react"
import type { JobResponseDto, PagedRequestDto } from "../../../type/Types"
import { Loader } from "lucide-react"
import EmployeeJobCard from "./EmployeeJobCard"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

function EmployeeJob() {

    const [pagedRequest, setPagedRequest] = useState<PagedRequestDto>({
        pageNumber: 1,
        pageSize: 10
    })
    const navigator = useNavigate()

    const [jobs, setJobs] = useState<JobResponseDto[]>()

    const { data, isLoading } = useQuery({
        queryKey: ["jobs"],
        queryFn: () => GetAllJob(pagedRequest)
    })

    const { isPending: loadingReference, mutate: referred, isSuccess: referreComplete } = useMutation({
        mutationKey: ["referred-job"],
        mutationFn: ReferedJob,
        onSuccess: () => {
            toast.success("Referrence Added Successfully !")
        },
        onError: (err: any) => {
            console.log(err);
            toast.error("something went wrong while adding job referrence !")
        }
    })
    const { isPending: loadingShare, mutate: shared, isSuccess: shareComplete, isError } = useMutation({
        mutationKey: ["share-job"],
        mutationFn: ShareJob,
        onSuccess: () => {
            toast.success("Job Shared Successfully !")
        },
        onError: () => {
            toast.error("something went wrong while sharing job referrence !")
        }
    })

    const handleReferred = (id: number, dto: any, cv: File) => {
        var request = new FormData()
        request.append("ReferedPersonName", dto.ReferedPersonName)
        request.append("ReferedPersonEmail", dto.ReferedPersonEmail)
        request.append("Cv", cv)
        request.append("Note", dto.Note)
        referred({ id, dto : request })
    }
    const handleShare = (id: number, email: string) => {
        shared({ id, email })
    }
    useEffect(() => {
        if (data) {
            setJobs(data.data)
        }
    }, [data])

    if (isLoading) {
        return (<div className="flex justify-center"> <Loader /> Loading...</div>)
    }

    return (
        <div>
            <div className="grid grid-cols-2 m-5 gap-3">
                {
                    jobs && jobs.map((j) => (
                        <EmployeeJobCard
                            job={j}
                            key={j.id}
                            handleReferred={handleReferred}
                            handleShare={handleShare}
                            isCompleted={referreComplete || shareComplete}
                            isPending={loadingShare || loadingReference} />
                    ))
                }
            </div>
        </div>
    )
}

export default EmployeeJob
