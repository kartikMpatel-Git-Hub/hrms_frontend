import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { AddTravelDocument, GetTravelTravelerDocuments } from "../../../api/TravelService"
import { useEffect, useState, type ChangeEvent } from "react"
import type { PagedRequestDto, TravelDocumentDto } from "../../../type/Types"
import TravelDocumentCard from "../../HR/Travel/TravelDocumentCard"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { File, Plus, Search } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

function EmployeeTravelDocuments() {
    const { id } = useParams()
    const { user } = useAuth()
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
    const [paged, setPaged] = useState<PagedRequestDto>({
        pageNumber: 1,
        pageSize: 5
    })

    const { data, isLoading } = useQuery({
        queryKey: ["employee-travel-document", id, user?.id, paged],
        queryFn: () => GetTravelTravelerDocuments(Number(id), Number(user?.id), paged),
        enabled: !!user?.id && !!id
    })

    useEffect(() => {
        if (data) {
            console.log(data);
            setDocuments(data.data)
        }
    }, [data])

    const { mutate: submitDocument, isPending } = useMutation({
        mutationFn: AddTravelDocument,
        onSuccess: () => {
            toast.success("Document added successfully!")
            setDocumentName("")
            setDocumentType("")
            setDocumentFile(null)
            setFileError("")
            setOpenDialog(false)
            queryClient.invalidateQueries({ queryKey: ["employee-travel-document"] })
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to add document"
            toast.error(errorMessage)
        }
    })

    const isValidPdfFile = (file: File): boolean => {
        return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    }

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

        if (id && user?.id) {
            submitDocument({
                travelId: Number(id),
                travelerId: Number(user?.id),
                formData
            })
        }
    }

    useEffect(() => {
        setLoading(true)
        if (data) {
            if (search.trim() === "") {
                setDocuments(data.data)
                setFilteredData(data.data)
            } else {
                const filtered = data?.data.filter(
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
        <div>
            <div className="flex justify-end mr-5">
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <Button className="w-fit"><Plus size={18} /> Add Document</Button>
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
                                    maxLength={25}
                                    value={documentName}
                                    onChange={(e) => setDocumentName(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Document Type</FieldLabel>
                                <Input
                                    placeholder="e.g., Ticket, Invoice, Receipt"
                                    maxLength={40}
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
            <Card className="m-10 p-5">
                <div className="flex justify-center font-bold text-2xl gap-1 mb-4"><File className="h-8 mr-1" /><span>Travel Documents</span></div>
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
                            <TableCell className="font-bold">Uploaded At</TableCell>
                            <TableCell className="font-bold" colSpan={2}>Action</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            !loading ? (
                                filteredData && filteredData.length > 0 ? (
                                    filteredData.map((d) => (
                                        <TravelDocumentCard document={d} key={d.id} />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <p className="font-semibold text-gray-500">No documents found</p>
                                        </TableCell>
                                    </TableRow>
                                )
                            ) : (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell className="flex gap-2">
                                            <Skeleton className="h-8 w-8" />
                                            {/* <Skeleton className="h-8 w-8" /> */}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )
                        }
                    </TableBody>
                </Table>
            </Card>
            {data && data.totalPages >= 1 && (
                <div className="mt-8 flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setPaged(prev => ({ ...prev, pageNumber: Math.max(1, prev.pageNumber - 1) }))}
                                    disabled={paged.pageNumber === 1}
                                />
                            </PaginationItem>
                            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        onClick={() => setPaged(prev => ({ ...prev, pageNumber: page }))}
                                        isActive={paged.pageNumber === page}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setPaged(prev => ({ ...prev, pageNumber: Math.min(data.totalPages, prev.pageNumber + 1) }))}
                                    disabled={paged.pageNumber === data.totalPages}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    )
}

export default EmployeeTravelDocuments
