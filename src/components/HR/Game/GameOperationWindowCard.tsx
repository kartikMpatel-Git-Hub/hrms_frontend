import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TableCell, TableRow } from "@/components/ui/table"
import type { GameOperatingHourResponseDto } from "@/type/Types"

interface GameOperationWindowCardProps {
    operationWindow: GameOperatingHourResponseDto,
    id: number,
    handleDeleteSlot: (id: number) => void,
    isDeletingSlot: boolean
}

function GameOperationWindowCard({ operationWindow, id, handleDeleteSlot, isDeletingSlot }: GameOperationWindowCardProps) {
    // console.log(operationWindow);
    return (
        <TableRow>
            <TableCell>{id + 1}</TableCell>
            <TableCell>{operationWindow.operationalStartTime.toString().substring(0, 16)}</TableCell>
            <TableCell>{operationWindow.operationalEndTime.toString().substring(0, 16)}</TableCell>
            <TableCell>
                <Button disabled={isDeletingSlot} variant="destructive" onClick={() => handleDeleteSlot(operationWindow.id)}>Delete</Button>
            </TableCell>
        </TableRow>
    )
}

export default GameOperationWindowCard
