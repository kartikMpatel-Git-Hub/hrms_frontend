import { Eye } from "lucide-react"
import type { JobResponseDto } from "../../../type/Types"
import { useNavigate } from "react-router-dom"

function HrJobCard({ job }: { job: JobResponseDto }) {

    const navigator = useNavigate()
    const handleOpenJob = ()=>{
        navigator(`./${job.id}`)
    }

    return (
        <div className="border-2 p-2">
            <div><span>Title : </span>{job.title}</div>
            <div><span>Job Role : </span>{job.title}</div>
            <div><span>Place : </span>{job.place}</div>
            <div><span>Requirements : </span>{job.requirements}</div>
            <div><span>Acvtivation Status : </span>{job.isActive ? "Active" : "Inactive"}</div>
            <div className="flex justify-center border-2 p-2">
                <img
                    src={job.jdUrl}
                    className="w-20"
                />
            </div>
            <div className="flex justify-center">
                <div
                    onClick={handleOpenJob}
                    className="p-2 bg-slate-800 text-white m-3 rounded-sm w-full flex justify-center gap-2 hover:cursor-pointer">
                    <Eye /> View
                </div>
            </div>
            {/* Put Download button instead of image */}
        </div>
    )
}

export default HrJobCard
