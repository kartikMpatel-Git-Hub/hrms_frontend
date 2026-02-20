import { GetJobReferrals, GetSharedJobs } from "@/api/JobService"
import { Card } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import type { ReferredResponseDto, ShareResponseDto } from "@/type/Types"
import { useQuery } from "@tanstack/react-query"
import { Search, UserPlus } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import JobReferralCard from "./JobReferralCard"
import JobShareCard from "./JobShareCard"

function HrJobShared() {
    const { id } = useParams()
    const [pagedRequest, setPagedRequest] = useState({
        pageNumber: 1,
        pageSize: 10
    })
    const [shares, setShares] = useState<ShareResponseDto[]>([])
    const [filterShares, setFilterShares] = useState<ShareResponseDto[]>([])
    const [search, setSearch] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const navigator = useNavigate()

    const { data, error, isLoading } = useQuery({
        queryKey: ["job-referrals", pagedRequest],
        queryFn: () => GetSharedJobs({ jobid: Number(id), paged: pagedRequest })
    })


    useEffect(() => {
        setLoading(true)
        if (data) {
            if (search.trim() === "") {
                setShares(data.data)
                setFilterShares(data.data)
            } else {
                const filtered = data.data?.filter(
                    t =>
                        t.sharedTo.toLowerCase().includes(search.toLowerCase()) ||
                        t.shared.toString().includes(search.toLowerCase()))
                setFilterShares(filtered)
            }
        }
        setTimeout(() => {
            setLoading(false)
        }, 500);
    }, [data, search])

    return (
        <div className="p-10">
            <Card className="m-2">
                <div className="flex justify-center font-bold text-2xl gap-1"><UserPlus className="h-8" /><span>Jobs Shared</span></div>
                <div className="mx-10">
                    <InputGroup className="">
                        <InputGroupInput placeholder="Search Shared Jobs..." onChange={(e) => setSearch(e.target.value)} value={search} />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">{filterShares?.length || 0} Results</InputGroupAddon>
                    </InputGroup>
                    <Table>
                        <TableHeader>
                            <TableRow className="font-bold">
                                <TableCell>Sr.No</TableCell>
                                <TableCell>Shared To</TableCell>
                                <TableCell>Shared By</TableCell>
                                <TableCell>Shared At</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                !loading ?
                                    (
                                        filterShares && filterShares.length > 0
                                            ? (
                                                filterShares.map((r, idx) =>
                                                    <JobShareCard share={r} idx={idx} key={idx}  />
                                                )
                                            )
                                            : (<TableRow><TableCell colSpan={5}><div className="flex justify-center font-bold py-2">No Shared Jobs Found</div></TableCell></TableRow>)
                                    ) :
                                    (
                                        Array.from({ length: 5 }, (_, i) => i + 1).map((_, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell><Skeleton className="h-6 w-6" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            </TableRow>
                                        ))
                                    )
                            }
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    )
}

export default HrJobShared
