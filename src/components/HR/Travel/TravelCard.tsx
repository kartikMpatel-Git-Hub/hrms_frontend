import { useNavigate } from "react-router-dom"
import type { TravelResponse } from "../../../type/Types"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { Edit, Eye } from "lucide-react"

function TravelCard({ travel, idx }: { travel: TravelResponse, idx: number }) {

    const navigator = useNavigate()

    return (
        <TableRow >
            <TableCell>{travel.id}</TableCell>
            <TableCell>{travel.title}</TableCell>
            <TableCell>{travel.location}</TableCell>
            <TableCell>{new Date(travel.startDate).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(travel.endDate).toLocaleDateString()}</TableCell>
            <TableCell className="flex gap-2">
                <Button onClick={() => navigator(`./${travel.id}`)}><Eye /></Button>
                {/* <Button disabled={true}><Edit /></Button> */}
            </TableCell>
        </TableRow>
    )
}

export default TravelCard
