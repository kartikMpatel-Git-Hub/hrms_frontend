import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { GetTravelTravelerDocuments } from "../../../api/TravelService"
import { useEffect, useState } from "react"
import type { TravelDocumentDto } from "../../../type/Types"
import TravelDocumentCard from "./TravelDocumentCard"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

function HrTravelDocuments() {
    const { id, travelerId } = useParams()
    const [documents, setDocuments] = useState<TravelDocumentDto[]>()

    const { data, isLoading } = useQuery({
        queryKey: ["travel-document"],
        queryFn: () => GetTravelTravelerDocuments({ travelId: id, travelerId: travelerId })
    })

    useEffect(() => {
        if (data) {
            setDocuments(data)
        }
    }, [data])

    return (
        <div className="m-5">
            <Card>
                <div className="flex justify-center text-2xl font-bold ">
                    Traveler Document
                </div>
            </Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableCell className="font-bold">Document Name</TableCell>
                        <TableCell className="font-bold">Document Type</TableCell>
                        <TableCell className="font-bold">Uploaded At</TableCell>
                        <TableCell className="font-bold" colSpan={2}>Action</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        !isLoading ? (
                            documents && documents.map((d) => (
                                <TravelDocumentCard document={d} />
                            ))
                        ) : (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell className="flex gap-2">
                                        <Skeleton className="h-8 w-8" />
                                        <Skeleton className="h-8 w-8" />
                                    </TableCell>
                                </TableRow>
                            ))
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default HrTravelDocuments
