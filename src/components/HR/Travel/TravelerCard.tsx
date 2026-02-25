import type { Traveler } from "../../../type/Types"
import { Button } from "@/components/ui/button"
import { FileText, IndianRupee } from "lucide-react"
import { TableCell, TableRow } from "@/components/ui/table"
import { useNavigate } from "react-router-dom"

interface TravelCardProps {
  traveler: Traveler,
  handleOpenExpense: (id: number) => void,
  handleOpenDocument: (id: number) => void,
}

function TravelerCard({ traveler, handleOpenExpense, handleOpenDocument }: TravelCardProps) {

  const navigator = useNavigate()

  return (
    <>
      <TableRow >
        <TableCell className="hover:cursor-pointer" onClick={() => navigator(`../../${traveler.id}`)}><img src={traveler.image} className="h-10 w-10 rounded-full" /></TableCell>
        <TableCell className="hover:cursor-pointer" onClick={() => navigator(`../../${traveler.id}`)}>{traveler.fullName}</TableCell>
        <TableCell className="hover:cursor-pointer" onClick={() => navigator(`../../${traveler.id}`)}>{traveler.email}</TableCell>
        <TableCell>{traveler.designation}</TableCell>
        <TableCell className="flex gap-1">
          <Button size={"sm"} onClick={() => handleOpenExpense(traveler.id)}><IndianRupee /></Button>
          <Button size={"sm"} onClick={() => handleOpenDocument(traveler.id)}><FileText /> </Button>
        </TableCell>
      </TableRow>
    </>
  )
}

export default TravelerCard
