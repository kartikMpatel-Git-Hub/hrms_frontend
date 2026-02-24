import { useMutation, useQuery } from "@tanstack/react-query"
import { GetAllJob, ReferedJob, ShareJob } from "../../../api/JobService"
import { useEffect, useState } from "react"
import type { JobResponseDto, PagedRequestDto } from "../../../type/Types"
import { Briefcase, Search } from "lucide-react"
import EmployeeJobCard from "./EmployeeJobCard"
import { useNavigate } from "react-router-dom"
import { toast} from "react-toastify"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Skeleton } from "@/components/ui/skeleton"

function EmployeeJob() {

    const [pagedRequest, setPagedRequest] = useState<PagedRequestDto>({
        pageNumber: 1,
        pageSize: 10
    })
    const navigator = useNavigate()
    const [search, setSearch] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [jobs, setJobs] = useState<JobResponseDto[]>()
    const [filteredJob, setFilteredJob] = useState<JobResponseDto[]>()

    const { data, isLoading } = useQuery({
        queryKey: ["jobs"],
        queryFn: () => GetAllJob(pagedRequest)
    })

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
    useEffect(() => {
        if (data) {
            setJobs(data.data)
        }
    }, [data])

    useEffect(() => {
        setLoading(true)
        if (data) {
            if (search.trim() === "") {
                setJobs(data.data)
                setFilteredJob(data.data)
            } else {
                const filtered = data.data?.filter(
                    t => t.title.toLowerCase().includes(search.toLowerCase()) ||
                        t.jobRole.toLowerCase().includes(search.toLowerCase()) ||
                        t.place.toLowerCase().includes(search.toLowerCase()))
                setJobs(filtered)
            }
        }
        setTimeout(() => {
            setLoading(false)
        }, 500);
    }, [data, search])

    return (
        <div>
            <Card className="m-2">
                <div className="flex justify-center font-bold text-2xl gap-1 mx-10"><Briefcase className="h-8" /><span>Job List</span></div>
                <div className="mx-5">
                    <InputGroup className="">
                        <InputGroupInput placeholder="Search Game..." onChange={(e) => setSearch(e.target.value)} value={search} />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">{jobs?.length || 0} Results</InputGroupAddon>
                    </InputGroup>
                    <Table>
                        <TableHeader className="font-bold">
                            <TableCell>Sr. No</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Role</TableCell>
                            {/* <TableCell>Place</TableCell> */}
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableHeader>
                        <TableBody>
                            {
                                !loading ?
                                    (
                                        jobs && jobs.length > 0 ?
                                            (
                                                jobs.map((j, idx) => (
                                                    <EmployeeJobCard
                                                        job={j}
                                                        key={j.id}
                                                        handleReferred={handleReferred}
                                                        handleShare={handleShare}
                                                        idx={idx}
                                                        isCompleted={referreComplete || shareComplete}
                                                        isPending={loadingShare || loadingReference}
                                                    />
                                                ))
                                            ) :
                                            (
                                                <TableRow>
                                                    <TableCell colSpan={6}>
                                                        <div className="flex justify-center p-2 font-bold">
                                                            No Job Found
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                    ) :
                                    (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <TableRow  key={i}>
                                                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                                                <TableCell className="flex gap-2">
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
        </div >
    )
}

export default EmployeeJob
