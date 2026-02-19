import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { GetTravelTravelerDocuments } from "../../../api/TravelService"
import { useEffect, useState } from "react"
import type { TravelDocumentDto } from "../../../type/Types"
import TravelDocumentCard from "./TravelDocumentCard"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { File, Search } from "lucide-react"

function HrTravelDocuments() {
    const { id, travelerId } = useParams()
    const [documents, setDocuments] = useState<TravelDocumentDto[]>()
    const [search, setSearch] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [filteredData, setFilteredData] = useState<TravelDocumentDto[]>()

    const { data, isLoading } = useQuery({
        queryKey: ["travel-document"],
        queryFn: () => GetTravelTravelerDocuments({ travelId: id, travelerId: travelerId })
    })

    useEffect(() => {
        if (data) {
            setDocuments(data)
        }
    }, [data])

    useEffect(() => {
        setLoading(true)
        if (data) {
            if (search.trim() === "") {
                setDocuments(data)
                setFilteredData(data)
            } else {
                const filtered = data?.filter(
                    t =>
                        t.documentName.toLowerCase().includes(search.toLowerCase()) ||
                        t.documentType.toLowerCase().includes(search.toLowerCase())
                )
                setFilteredData(filtered)
            }
        }
        setTimeout(() => {
            setLoading(false)
        }, 500);
    }, [data, search])

    return (
        <Card className="m-10 p-5">
            <div className="flex justify-center font-bold text-2xl gap-1 mx-10"><File className="h-8 mr-1" /><span>Traveler Expenses</span></div>
            <InputGroup className="">
                <InputGroupInput placeholder="Search Expense..." onChange={(e) => setSearch(e.target.value)} value={search} />
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">{documents?.length || 0} Results</InputGroupAddon>
            </InputGroup>
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
                        !loading ? (
                            filteredData && filteredData.map((d) => (
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
        </Card>

    )
}

export default HrTravelDocuments
