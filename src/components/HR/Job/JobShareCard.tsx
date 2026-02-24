import { TableCell, TableRow } from "@/components/ui/table"
import type { ShareResponseDto } from "@/type/Types"
import { useNavigate } from "react-router-dom"

function JobShareCard({ share, idx }: { share: ShareResponseDto, idx: number }) {

    const navigator = useNavigate()

    return (
        <TableRow>
            <TableCell>{idx + 1}</TableCell>
            <TableCell>{share.sharedTo}</TableCell>
            <TableCell className="hover:cursor-pointer" title="View Shared By User Profile" onClick={ () => navigator(`/hr/${share?.sharedBy}`)} >{share.shared}</TableCell>
            <TableCell>{share.sharedAt.toString().substring(0, 10)}</TableCell>
        </TableRow>
    )
}

export default JobShareCard
