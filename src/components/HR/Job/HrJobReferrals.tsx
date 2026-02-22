import { GetJobReferrals } from "@/api/JobService"
import { Card } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import type { ReferredResponseDto } from "@/type/Types"
import { useQuery } from "@tanstack/react-query"
import { Search, UserPlus } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import JobReferralCard from "./JobReferralCard"

function HrJobReferrals() {
    const { id } = useParams()
    const [pagedRequest, setPagedRequest] = useState({
        pageNumber: 1,
        pageSize: 10
    })
    const [referrals, setReferrals] = useState<ReferredResponseDto[]>([])
    const [filteredReferrals, setFilteredReferrals] = useState<ReferredResponseDto[]>([])
    const [search, setSearch] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const navigator = useNavigate()

    const { data, error, isLoading } = useQuery({
        queryKey: ["job-referrals", pagedRequest],
        queryFn: () => GetJobReferrals({ jobid: Number(id), paged: pagedRequest })
    })

    const handleStatusChange = (id: number,status: string) => {
        // Call API to update status
        // console.log("Updating referral with id:", id, "to status:", status)
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
                                                    <JobReferralCard referral={r} idx={idx} key={idx} handleStatusChange={handleStatusChange} />
                                                )
                                            )
                                            : (<TableRow><TableCell colSpan={5} className="flex justify-center font-bold">No Referrals Found</TableCell></TableRow>)
                                    ) :
                                    (
                                        Array.from({ length: 5 }, (_, i) => i + 1).map((_, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell><Skeleton className="h-6 w-6" /></TableCell>
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
        </div>
    )
}

export default HrJobReferrals
