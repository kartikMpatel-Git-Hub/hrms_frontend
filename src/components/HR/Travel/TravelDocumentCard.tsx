import type { TravelDocumentDto } from "../../../type/Types"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { Download, Eye } from "lucide-react"

function TravelDocumentCard({ document }: { document: TravelDocumentDto }) {
  return (
    <TableRow>
      <TableCell className="font-semibold">{document.documentName.toUpperCase()}</TableCell>
      <TableCell className="font-semibold">{document.documentType}</TableCell>
      <TableCell className="font-semibold">{document.uploadedAt.toString().substring(0, 10).toUpperCase()}</TableCell>
      <TableCell className="flex gap-3">
        <Button onClick={() => window.open(document?.documentUrl, "_blank")}><Eye /></Button>
        <Button disabled={true}><Download /> </Button>
      </TableCell>
    </TableRow>
  )
}
export default TravelDocumentCard