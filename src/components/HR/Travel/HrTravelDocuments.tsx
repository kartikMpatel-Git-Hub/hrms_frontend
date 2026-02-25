import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { GetTravelTravelerDocuments, AddTravelDocument } from "../../../api/TravelService"
import { useEffect, useState, type ChangeEvent } from "react"
import type { TravelDocumentDto } from "../../../type/Types"
import TravelDocumentCard from "./TravelDocumentCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { File, Search, Plus } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"

function HrTravelDocuments() {
    const { id, travelerId } = useParams()
    const [documents, setDocuments] = useState<TravelDocumentDto[]>()
    const [search, setSearch] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [filteredData, setFilteredData] = useState<TravelDocumentDto[]>()
    const [documentName, setDocumentName] = useState<string>("")
    const [documentType, setDocumentType] = useState<string>("")
    const [documentFile, setDocumentFile] = useState<File | null>(null)
    const [fileError, setFileError] = useState<string>("")
    const [openDialog, setOpenDialog] = useState(false)
    const queryClient = useQueryClient()

    const isValidPdfFile = (file: File): boolean => {
        return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    }

    const { data, isLoading } = useQuery({
        queryKey: ["travel-document", id, travelerId],
        queryFn: () => GetTravelTravelerDocuments({ travelId: id, travelerId: travelerId })
    })

    const { mutate: submitDocument, isPending } = useMutation({
        mutationFn: AddTravelDocument,
        onSuccess: () => {
            toast.success("Document added successfully!")
            setDocumentName("")
            setDocumentType("")
            setDocumentFile(null)
            setFileError("")
            setOpenDialog(false)
            queryClient.invalidateQueries({ queryKey: ["travel-document"] })
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to add document"
            toast.error(errorMessage)
        }
    })

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFileError("")
        if (e.target.files) {
            const file = e.target.files[0]
            if (!isValidPdfFile(file)) {
                setFileError("Only PDF files are allowed!")
                e.target.value = ""
                setDocumentFile(null)
                return
            }
            setDocumentFile(file)
        }
    }

    const handleSubmitDocument = () => {
        if (!documentName.trim()) {
            setFileError("Document name is required!")
            return
        }
        if (!documentType.trim()) {
            setFileError("Document type is required!")
            return
        }
        if (!documentFile) {
            setFileError("Document file is required!")
            return
        }

        const formData = new FormData()
        formData.append("DocumentName", documentName)
        formData.append("DocumentType", documentType)
        formData.append("Document", documentFile)

        if (id && travelerId) {
            submitDocument({
                travelId: Number(id),
                travelerId: Number(travelerId),
                formData
            })
        }
    }

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
        <>
            <ToastContainer position="top-right"/>
            <Card className="m-10 p-5">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex justify-center font-bold text-2xl gap-1"><File className="h-8 mr-1" /><span>Travel Documents</span></div>
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogTrigger asChild>
                            <Button><Plus size={18} /> Add Document</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Add Travel Document</DialogTitle>
                                <DialogDescription>
                                    Upload a PDF document for this travel
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <Field>
                                    <FieldLabel>Document Name</FieldLabel>
                                    <Input
                                        placeholder="Enter document name"
                                        value={documentName}
                                        onChange={(e) => setDocumentName(e.target.value)}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>Document Type</FieldLabel>
                                    <Input
                                        placeholder="e.g., Ticket, Invoice, Receipt"
                                        value={documentType}
                                        onChange={(e) => setDocumentType(e.target.value)}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>Document File</FieldLabel>
                                    <Input
                                        type="file"
                                        accept=".pdf,application/pdf"
                                        onChange={handleFileChange}
                                    />
                                    {documentFile && <p className="text-sm text-green-600">✓ {documentFile.name}</p>}
                                </Field>
                                {fileError && <p className="text-sm text-red-600">{fileError}</p>}
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                                <Button onClick={handleSubmitDocument} disabled={isPending}>
                                    {isPending ? "Uploading..." : "Upload Document"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <InputGroup className="mb-4">
                    <InputGroupInput placeholder="Search Document..." onChange={(e) => setSearch(e.target.value)} value={search} />
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
                            <TableCell className="font-bold">Uploaded By</TableCell>
                            <TableCell className="font-bold">Uploaded At</TableCell>
                            <TableCell className="font-bold" colSpan={2}>Action</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            !loading ? (
                                filteredData && filteredData.map((d) => (
                                    <TravelDocumentCard document={d} key={d.id} />
                                ))
                            ) : (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
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
        </>
    )
}

export default HrTravelDocuments
