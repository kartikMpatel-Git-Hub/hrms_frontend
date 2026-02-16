import { Card, CardHeader } from "@/components/ui/card"
import type { TravelDocumentDto } from "../../../type/Types"
import { Button } from "@/components/ui/button"
import UploderCard from "./UploderCard"

function TravelDocumentCard({ document }: { document: TravelDocumentDto }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3">
          <div className="flex gap-1 font-bold text-black/90 text-3xl">
            {document.documentName.toUpperCase()}
          </div>
          <div className="flex gap-1 text-black/60">
            <span className="font-semibold text-black">Document Type :</span>
            {document.documentType}
          </div>
          <div className="flex gap-1 text-black/60">
            <span className="font-semibold text-black">Uploaded By :</span>
            {document.uploader?.role == "Hr" ? "HR" : "TRAVELER"}
          </div>
          <div className="flex gap-1 text-black/60">
            <span className="font-semibold text-black">Uploaded At :</span>
            {document.uploadedAt.toString().substring(0, 10)}
          </div>
          <div>
            <img src={document.documentUrl} alt="Document" className="h-10 object-cover rounded-md hover:cursor-pointer hover:opacity-80" title="View Document" onClick={() => window.open(document?.documentUrl, "_blank")}/>
          </div>
          <div>
            <Button variant="outline" className="mt-2" onClick={() => window.open(document?.documentUrl, "_blank")}>
              View Document
            </Button>
            <Button variant="outline" className="mt-2" disabled={true}>
              Download Document
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="font-bold text-black/90 text-3xl">Uploader Information</div>
          {
            document && <UploderCard contact={document.uploader} />
          }
        </div>
      </CardHeader>
    </Card>

  )
}
export default TravelDocumentCard
