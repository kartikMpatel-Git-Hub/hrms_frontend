import { Eye } from "lucide-react"
import type { JobResponseDto } from "../../../type/Types"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"

function HrJobCard({ job, idx }: { job: JobResponseDto, idx: number }) {

    const navigator = useNavigate()
    const handleOpenJob = () => {
        navigator(`./${job.id}`)
    }

    return (
        <TableRow>
            <TableCell>{idx + 1}</TableCell>
            <TableCell>{job.title}</TableCell>
            <TableCell>{job.jobRole}</TableCell>
            <TableCell>{job.isActive ? <span className="text-green-600 font-semibold">Active</span> : <span className="text-red-500 font-semibold">Inactive</span>}</TableCell>
            <TableCell>{job.place}</TableCell>
            <TableCell><Button onClick={() => handleOpenJob()}><Eye /></Button></TableCell>
        </TableRow>
    )
}

export default HrJobCard
