import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import type { JobResponseDto, PagedRequestDto } from "../../../type/Types"
import { GetHrJobs } from "../../../api/JobService"
import HrJobCard from "./HrJobCard"
import { useNavigate } from "react-router-dom"
import { Briefcase, CircleAlert, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

function HrJobs() {

    const [pagedRequest, setPagedRequest] = useState<PagedRequestDto>({
        pageNumber: 1,
        pageSize: 10
    })

    const [jobs, setJobs] = useState<JobResponseDto[]>()
    const [filteredJobs, setFilteredJobs] = useState<JobResponseDto[]>()
    const [search, setSearch] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const navigator = useNavigate()


    const { data, isLoading, error } = useQuery({
        queryKey: ["hr-jobs"],
        queryFn: () => GetHrJobs(pagedRequest)
    })

    const handleOpenAddForm = () => {
        navigator(`./add`)
    }

    useEffect(() => {
        setLoading(true)
        if (data) {
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
                                                    <HrJobCard job={j} key={j.id} idx={idx} />
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
                                                <TableCell className="flex gap-2">
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
        </div>
    )
}

export default HrJobs
