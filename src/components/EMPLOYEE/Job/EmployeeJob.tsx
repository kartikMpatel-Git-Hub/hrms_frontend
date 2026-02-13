import { useQuery } from "@tanstack/react-query"
import { GetAllJob } from "../../../api/JobService"
import { useEffect, useState } from "react"
import type { JobResponseDto, PagedRequestDto } from "../../../type/Types"
import { Loader } from "lucide-react"
import EmployeeJobCard from "./EmployeeJobCard"

function EmployeeJob() {

    const [pagedRequest, setPagedRequest] = useState<PagedRequestDto>({
        pageNumber: 1,
        pageSize: 10
    })

    const [jobs, setJobs] = useState<JobResponseDto[]>()

    const { data, isLoading } = useQuery({
        queryKey: ["hr-jobs"],
        queryFn: () => GetAllJob(pagedRequest)
    })

    // const {} = useMutation({
    //     mutationKey : ["referred-job"],
    //     mutationFn : 
    // })

    const handleReferred = (id: number) => {

    }
    const handleShare = (id: number) => {

    }

    useEffect(() => {
        if (data) {
            console.log(data);
            setJobs(data.data)
        }
    }, [data])

    if (isLoading) {
        return (<div className="flex justify-center"> <Loader /> Loading...</div>)
    }

    return (
        <div>
            <div className="flex justify-center">
                <div className="grid grid-cols-4 m-5 gap-3">
                    {
                        jobs && jobs.map((j) => (
                            <EmployeeJobCard job={j} key={j.id} handleReferred={handleReferred} handleShare={handleShare} isPending={true}/>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default EmployeeJob
