import type { Traveler } from "../../../type/Types"
import { Button } from "@/components/ui/button"
import { FileText, IndianRupee } from "lucide-react"
import { TableCell, TableRow } from "@/components/ui/table"

interface TravelCardProps {
  traveler: Traveler,
  handleOpenExpense: (id: number) => void,
  handleOpenDocument: (id: number) => void,
}

function TravelerCard({ traveler, handleOpenExpense, handleOpenDocument }: TravelCardProps) {
  return (
    <>
      <TableRow>
        <TableCell>
          <img src={traveler.image} className="h-10 w-10 rounded-full" />
        </TableCell>
        <TableCell>{traveler.fullName}</TableCell>
        <TableCell>{traveler.email}</TableCell>
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
