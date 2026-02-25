import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import type { JobResponseDto, PagedRequestDto } from "../../../type/Types"
import { DeleteJob, GetHrJobs, ReferedJob, ShareJob } from "../../../api/JobService"
import HrJobCard from "./HrJobCard"
import { useNavigate } from "react-router-dom"
import { Briefcase, CircleAlert, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { toast } from "sonner"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"


function HrJobs() {

    const [paged, setPaged] = useState<PagedRequestDto>({
        pageNumber: 1,
        pageSize: 2
    })

    const [jobs, setJobs] = useState<JobResponseDto[]>()
    const [filteredJobs, setFilteredJobs] = useState<JobResponseDto[]>()
    const [search, setSearch] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const queryClient = useQueryClient()
    const navigator = useNavigate()


    const { data } = useQuery({
        queryKey: ["hr-jobs", paged],
        queryFn: () => GetHrJobs(paged)
    })

    const { mutate: deleteMutation, error: deleteError, isPending: isDeletePending } = useMutation({
        mutationKey: ["delete-job"],
        mutationFn: (id: number) => DeleteJob(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hr-jobs"] })
            toast.success("Job deleted successfully")
        },
        onError: (error) => {
            toast.error("Failed to delete job. Please try again.")
        }
    })

    const handleOpenAddForm = () => {
        navigator(`./add`)
    }

    useEffect(() => {
        setLoading(true)
        if (data) {
            console.log(data);
            
            if (search.trim() === "") {
                setJobs(data.data)
                setFilteredJobs(data.data)
            } else {
                const filtered = data.data?.filter(
                    t =>
                        t.title.toLowerCase().includes(search.toLowerCase()) ||
                        t.jobRole.toLowerCase().includes(search.toLowerCase()))
                setFilteredJobs(filtered)
            }
        }
        setTimeout(() => {
            setLoading(false)
        }, 500);
    }, [data, search])

    const handleJobDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this job?")) {
            deleteMutation(id)
        }
    }

    const { isPending: loadingReference, mutate: referred, isSuccess: referreComplete } = useMutation({
        mutationKey: ["referred-job"],
        mutationFn: ReferedJob,
        onSuccess: () => {
            toast.success("Referrence Added Successfully !")
        },
        onError: (err: any) => {
            // console.log(err);
            toast.error("something went wrong while adding job referrence !")
        }
    })
    const { isPending: loadingShare, mutate: shared, isSuccess: shareComplete, isError } = useMutation({
        mutationKey: ["share-job"],
        mutationFn: ShareJob,
        onSuccess: () => {
            toast.success("Job Shared Successfully !")
        },
        onError: () => {
            toast.error("something went wrong while sharing job referrence !")
        }
    })

    const handleReferred = (id: number, dto: any, cv: File) => {
        var request = new FormData()
        request.append("ReferedPersonName", dto.ReferedPersonName)
        request.append("ReferedPersonEmail", dto.ReferedPersonEmail)
        request.append("Cv", cv)
        request.append("Note", dto.Note)
        referred({ id, dto: request })
    }
    const handleShare = (id: number, email: string) => {
        shared({ id, email })
    }

    return (
        <div>
            <div className="flex justify-end mr-5">
                <Button
                    title="Add New Job"
                    onClick={handleOpenAddForm}
                >
                    <Plus /> Add Job
                </Button>
            </div>
            <Card className="m-2">
                <div className="flex justify-center font-bold text-2xl gap-1"><Briefcase className="h-8" /><span>Jobs Openings</span></div>
                <div className="mx-10">
                    <InputGroup className="">
                        <InputGroupInput placeholder="Search Job..." onChange={(e) => setSearch(e.target.value)} value={search} />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">{filteredJobs?.length || 0} Results</InputGroupAddon>
                    </InputGroup>
                    <Table className="">
                        <TableHeader>
                            <TableRow>
                                <TableCell className="font-bold">Sr. No</TableCell>
                                <TableCell className="font-bold">Title</TableCell>
                                <TableCell className="font-bold">Job Role</TableCell>
                                <TableCell className="font-bold">Status</TableCell>
                                <TableCell className="font-bold">Place</TableCell>
                                <TableCell className="font-bold">Action</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                !loading
                                    ? (
                                        filteredJobs && filteredJobs?.length > 0
                                            ? (
                                                filteredJobs.map((j, idx) => (
                                                    <HrJobCard
                                                        job={j}
                                                        key={j.id}
                                                        idx={idx}
                                                        handleDelete={handleJobDelete}
                                                        handleReferred={handleReferred}
                                                        handleShare={handleShare}
                                                        isCompleted={referreComplete || shareComplete}
                                                        isPending={loadingShare || loadingReference}
                                                    />
                                                ))
                                            )
                                            : (
                                                <TableRow>
                                                    <TableCell colSpan={6} >
                                                        <div className="flex justify-center m-10">
                                                            <div>
                                                                <CircleAlert className="h-7" />
                                                            </div>
                                                            <div className="font-bold m-1">
                                                                No Jobs Found
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                    )
                                    : (
                                        Array.from({ length: 5 }).map((_, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell><Skeleton className="h-6 w-6" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                                <TableCell className="grid grid-cols-3 gap-2">
                                                    <Skeleton className="h-8 w-8" />
                                                    <Skeleton className="h-8 w-8" />
                                                    <Skeleton className="h-8 w-8" />
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

export default HrJobs
