import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import type { GameResponseDto } from '@/type/Types'
import { Book, BookMarked, CalendarCheck2, Edit, Eye, LucideListStart, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface GameRowProps {
    idx: number,
    game: GameResponseDto
    handleOpenGameDetail: (id: number) => void,
    handleDeleteGame: (id: number) => void
}

function GameRow({ idx, game, handleOpenGameDetail, handleDeleteGame }: GameRowProps) {

    const navigator = useNavigate()

    return (
        <TableRow key={game.id}>
            <TableCell ><div className="flex justify-center">{idx + 1}</div></TableCell>
            <TableCell ><div className="flex justify-center">{game.name || "N/A"}</div></TableCell>
            <TableCell ><div className="flex justify-center">{game.maxPlayer}</div></TableCell>
            <TableCell ><div className="flex justify-center">{game.minPlayer}</div></TableCell>
            <TableCell className='flex gap-2 justify-center'>
                <Button disabled={true}><CalendarCheck2 /> </Button>
                <Button onClick={() => handleOpenGameDetail(game.id)}><Edit /> </Button>
                <Button onClick={() => handleDeleteGame(game.id)}><Trash2 /> </Button>
                <Button onClick={() => navigator(`./${game.id}/offere`)}><LucideListStart /> </Button>
            </TableCell>
        </TableRow>
    )
}

export default GameRow
