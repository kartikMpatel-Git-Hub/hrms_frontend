import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import type { JobResponseDto, PagedRequestDto } from "../../../type/Types"
import { GetHrJobs } from "../../../api/JobService"
import HrJobCard from "./HrJobCard"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"

function HrJobs() {

    const [pagedRequest, setPagedRequest] = useState<PagedRequestDto>({
        pageNumber: 1,
        pageSize: 10
    })

    const [jobs, setJobs] = useState<JobResponseDto[]>()
    const navigator = useNavigate()


    const { data, isLoading, error } = useQuery({
        queryKey: ["hr-jobs"],
        queryFn: () => GetHrJobs(pagedRequest)
    })

    const handleOpenAddForm = () => {
        navigator(`./add`)
    }

    useEffect(() => {
        if (data) {
            console.log(data);
            setJobs(data.data)
        }
    }, [data])

    return (
        <div>
            <div className="flex justify-end">
                <div
                    onClick={handleOpenAddForm}
                    className="p-3 bg-slate-800 text-white m-3 rounded-2xl hover:cursor-pointer flex">
                    <Plus className="font-bold" /> Add New Job
                </div>
            </div>
            <div className="flex justify-center">

                <div className="grid grid-cols-4 m-5 gap-3">
                    {
                        jobs && jobs.map((j) => (
                            <HrJobCard job={j} key={j.id} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default HrJobs
