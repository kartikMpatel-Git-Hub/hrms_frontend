import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import type { GameSlotResponseDto } from "@/type/Types"
import { Trash } from "lucide-react"

interface GameSlotProps {
    id: number,
    slot: GameSlotResponseDto,
    handleDeleteSlot: (slotId : number) => void,
    isDeletingSlot?: boolean
}

function GameSlot({ slot, id, handleDeleteSlot, isDeletingSlot }: GameSlotProps) {

    return (
        <TableRow>
            <TableCell>{id+1}</TableCell>
            <TableCell>{slot.startTime.substring(0, 5)}</TableCell>
            <TableCell>{slot.endTime.substring(0, 5)}</TableCell>
            <TableCell><Button onClick={() => handleDeleteSlot(slot.id)} disabled={isDeletingSlot}><Trash /></Button></TableCell>
        </TableRow>
    )
}

export default GameSlot
