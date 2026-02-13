import type { TravelDocumentDto } from "../../../type/Types"
import UserCard from "./UserCard"

function TravelDocumentCard({document}:{document : TravelDocumentDto}) {
  return (
    <div className="p-2 m-2 border-2 rounded-sm">
        <div><img src={document.documentUrl} /> </div>
        <div><span>Document Name :</span>{document.documentName}</div>
        <div><span>Document Uploaded At:</span>{document.uploadedAt.toString().substring(0,10)}</div>
        <div>
            <UserCard user={document.uploader} />
        </div>
        <div><span className="font-bold italic">Uploaded By :</span> {document.uploader.role == "Hr" ? "You" : "Traveler" }</div>
    </div>
  )
}

export default TravelDocumentCard
