import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { GetTravelTravelerDocuments } from "../../../api/TravelService"
import { useEffect, useState } from "react"
import type { TravelDocumentDto } from "../../../type/Types"
import TravelDocumentCard from "./TravelDocumentCard"
import { Card, CardHeader } from "@/components/ui/card"
import ContactToCard from "../Job/ContactToCard"
import { Button } from "@/components/ui/button"

function HrTravelDocuments() {
    const { id, travelerId } = useParams()
    const [documents, setDocuments] = useState<TravelDocumentDto[]>()

    const { data, isLoading } = useQuery({
        queryKey: ["travel-document"],
        queryFn: () => GetTravelTravelerDocuments({ travelId: id, travelerId: travelerId })
    })

    useEffect(() => {
        if (data) {
            console.log(data);
            setDocuments(data)
        }
    }, [data])

    return (
        
        <div className="grid grid-cols-1 gap-2 m-3">
            {
                documents && documents.map((d) => (
                    <TravelDocumentCard document={d} />
                ))
            }
        </div>
    )
}

export default HrTravelDocuments
