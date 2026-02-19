import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import type { GameResponseDto } from '@/type/Types'
import { Eye, LucideListStart, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface GameRowProps {
    idx : number,
    game : GameResponseDto
    handleOpenGameDetail: (id : number) => void,
    handleDeleteGame: (id : number) => void
}

function GameRow({ idx, game, handleOpenGameDetail, handleDeleteGame }: GameRowProps) {

    const navigator = useNavigate()

    return (
        <TableRow key={game.id}>
            <TableCell className="">{idx + 1}</TableCell>
            <TableCell className="">{game.name || "N/A"}</TableCell>
            <TableCell className="">{game.maxPlayer}</TableCell>
            <TableCell className="">{game.minPlayer}</TableCell>
            <TableCell className='flex gap-2'>
                <Button onClick={() => handleOpenGameDetail(game.id)}><Eye /> </Button>
                <Button onClick={() => navigator(`./${game.id}/offere`)}><LucideListStart /> </Button>
            </TableCell>
        </TableRow>
    )
}

export default GameRow
