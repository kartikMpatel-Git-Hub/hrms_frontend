import { Edit, Eye, Trash } from "lucide-react"
import type { JobResponseDto } from "../../../type/Types"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"

function HrJobCard({ job, idx, handleDelete }: { job: JobResponseDto, idx: number, handleDelete: (id: number) => void }) {

    const navigator = useNavigate()
    return (
        <TableRow>
            <TableCell>{idx + 1}</TableCell>
            <TableCell>{job.title}</TableCell>
            <TableCell>{job.jobRole}</TableCell>
            <TableCell>{job.isActive ? <span className="text-green-600 font-semibold">Active</span> : <span className="text-red-500 font-semibold">Inactive</span>}</TableCell>
            <TableCell>{job.place}</TableCell>
            <TableCell className="flex gap-2">
                <Button onClick={() => navigator(`./${job.id}`)}><Eye /></Button>
                <Button disabled={true}><Edit /></Button>
                <Button onClick={() => handleDelete(job.id)}><Trash /></Button>
            </TableCell>
        </TableRow>
    )
}

export default HrJobCard
