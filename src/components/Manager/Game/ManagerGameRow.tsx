import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import type { GameResponseDto } from '@/type/Types'
import { Eye } from 'lucide-react'

interface ManagerGameRowProps {
  idx: number
  game: GameResponseDto
  handleOpenGameDetail: (id: number) => void
}

function ManagerGameRow({ idx, game, handleOpenGameDetail }: ManagerGameRowProps) {
  return (
    <TableRow key={game.id}>
      <TableCell className="">{idx + 1}</TableCell>
      <TableCell className="">{game.name || "N/A"}</TableCell>
      <TableCell className="">{game.maxPlayer}</TableCell>
      <TableCell className="">{game.minPlayer}</TableCell>
      <TableCell className="">{game.duration} Minutes</TableCell>
      <TableCell className='flex gap-2'>
        <Button onClick={() => handleOpenGameDetail(game.id)}><Eye /></Button>
      </TableCell>
    </TableRow>
  )
}

export default ManagerGameRow
