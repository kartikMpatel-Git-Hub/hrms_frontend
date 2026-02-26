import { GetJobReferrals, UpdateReferralStatus } from "@/api/JobService"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import type { ReferredResponseDto } from "@/type/Types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CircleAlert, Search, UserPlus } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import JobReferralCard from "@/components/HR/Job/JobReferralCard"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination"

function JobReferrals() {
    const { jobId } = useParams()
    const [paged, setPaged] = useState({
        pageNumber: 1,
        pageSize: 10
    })
    const [referrals, setReferrals] = useState<ReferredResponseDto[]>([])
    const [filteredReferrals, setFilteredReferrals] = useState<ReferredResponseDto[]>([])
    const [search, setSearch] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const navigator = useNavigate()
    const queryClient = useQueryClient()

    const { data } = useQuery({
        queryKey: ["job-referrals", jobId, paged],
        queryFn: () => GetJobReferrals({ jobid: Number(jobId), paged: paged })
    })

    const { mutate, isPending } = useMutation({
        mutationFn: ({ rid, status }: any) => UpdateReferralStatus(rid, Number(jobId), status),
        mutationKey: ["job-referrals-status-update"],
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["job-referrals"] })
            toast.success("Referral status updated successfully")
            console.log(data);
        },
        onError: (e) => {
            toast.error("Failed to update referral status")
            console.log(e);
        }
    })

    const handleStatusChange = (id: number, status: string) => {
        mutate({ rid: id, status })
    }

    useEffect(() => {
        setLoading(true)
        if (data) {
            if (search.trim() === "") {
                setReferrals(data.data)
                setFilteredReferrals(data.data)
            } else {
                const filtered = data.data?.filter(
                    t =>
                        t.referedPersonEmail.toLowerCase().includes(search.toLowerCase()) ||
                        t.referedPersonName.toLowerCase().includes(search.toLowerCase()))
                setFilteredReferrals(filtered)
            }
        }
        setTimeout(() => {
            setLoading(false)
        }, 500);
    }, [data, search])

    return (
        <div className="p-10">
            <Card className="m-2">
                <div className="flex justify-center font-bold text-2xl gap-1"><UserPlus className="h-8" /><span>Jobs Referrals</span></div>
                <div className="mx-10">
                    <InputGroup className="">
                        <InputGroupInput placeholder="Search Referral..." onChange={(e) => setSearch(e.target.value)} value={search} />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">{filteredReferrals?.length || 0} Results</InputGroupAddon>
                    </InputGroup>
                    <Table>
                        <TableHeader>
                            <TableRow className="font-bold">
                                <TableCell>Sr.No</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Referred By</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                !loading ?
                                    (
                                        filteredReferrals && filteredReferrals.length > 0
                                            ? (
                                                filteredReferrals.map((r, idx) =>
                                                    <JobReferralCard referral={r} idx={idx} key={idx} handleStatusChange={handleStatusChange} isPending={isPending} />
                                                )
                                            )
                                            : (<TableRow><TableCell colSpan={5} ><div className="flex justify-center m-10"><CircleAlert className="h-7" /><div className="font-bold m-1">No Referrals Found</div></div></TableCell></TableRow>)
                                    ) :
                                    (
                                        Array.from({ length: 5 }, (_, i) => i + 1).map((_, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell><Skeleton className="h-6 w-6" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                <TableCell><Skeleton className="h-10 w-10" /></TableCell>
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

export default JobReferrals
