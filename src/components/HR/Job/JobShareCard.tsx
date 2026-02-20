import { TableCell, TableRow } from "@/components/ui/table"
import type { ShareResponseDto } from "@/type/Types"

function JobShareCard({ share, idx }: { share: ShareResponseDto, idx: number }) {
    return (
        <TableRow>
            <TableCell>{idx + 1}</TableCell>
            <TableCell>{share.sharedTo}</TableCell>
            <TableCell>{share.shared}</TableCell>
            <TableCell>{share.sharedAt.toString().substring(0, 10)}</TableCell>
        </TableRow>
    )
}

export default JobShareCard
