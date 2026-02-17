import type { UserReponseDto } from '../../../type/Types'
import { TableCell, TableRow } from '@/components/ui/table'

function ReviewerCard({ reviewer }: { reviewer: UserReponseDto }) {
    return (
        <TableRow>
            <TableCell>
                <img src={reviewer.image} className="h-10 w-10 rounded-full" />
            </TableCell>
            <TableCell>{reviewer.fullName}</TableCell>
            <TableCell>{reviewer.email}</TableCell>
            <TableCell>{reviewer.designation}</TableCell>
        </TableRow>
    )
}

export default ReviewerCard
