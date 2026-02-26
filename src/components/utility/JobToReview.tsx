import { useQuery } from "@tanstack/react-query"
import { GetJobsToReview } from "@/api/JobService"
import { useEffect, useState } from "react"
import type { JobReviewDto, PagedRequestDto } from "@/type/Types"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Briefcase, } from "lucide-react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import JobToReviewCard from "./JobToReviewCard"
import { Card } from "../ui/card"

function JobToReview() {
    const [paged, setPaged] = useState<PagedRequestDto>({ pageNumber: 1, pageSize: 5 })
    const [filtered, setFiltered] = useState<JobReviewDto[]>([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)

    const { data } = useQuery({
        queryKey: ["jobs-review", paged],
        queryFn: () => GetJobsToReview(paged)
    })

    useEffect(() => {
        if (data) {
            if (search.trim() === "") {
                setFiltered(data.data)
            } else {
                const f = data.data.filter(
                    (j) =>
                        j.title.toLowerCase().includes(search.toLowerCase()) ||
                        j.jobRole.toLowerCase().includes(search.toLowerCase()) ||
                        j.place.toLowerCase().includes(search.toLowerCase())
                )
                setFiltered(f)
            }
        }
    }, [data, search])

    useEffect(() => {
        setLoading(true)
        const t = setTimeout(() => setLoading(false), 500)
        return () => clearTimeout(t)
    }, [data])


    return (
        <div className="">
            <Card className="m-2">
                <div className="font-bold text-2xl flex items-center justify-center gap-2">
                    <Briefcase /> <span>Jobs To Review</span>
                </div>
                <div className="m-4">
                    <input
                        placeholder="Search jobs..."
                        className="mb-2 w-full border p-1"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Table>
                        <TableHeader className="font-bold">
                            <TableCell>Sr. No</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Place</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableHeader>
                        <TableBody>
                            {!loading ? (
                                filtered && filtered.length > 0 ? (
                                    filtered.map((j, idx) => (
                                        <JobToReviewCard j={j} idx={idx} />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <div className="flex justify-center p-2 font-bold">
                                                No jobs to review
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            ) : (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <Skeleton className="h-8 w-8" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-40" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-20" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-20" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                        <TableCell className="flex gap-2">
                                            <Skeleton className="h-8 w-8" />
                                            <Skeleton className="h-8 w-8" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
            {data && data.totalPages >= 1 && (
                <div className="mt-4 flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() =>
                                        setPaged((prev) => ({
                                            ...prev,
                                            pageNumber: Math.max(1, prev.pageNumber - 1),
                                        }))
                                    }
                                    disabled={paged.pageNumber === 1}
                                />
                            </PaginationItem>
                            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        onClick={() =>
                                            setPaged((prev) => ({ ...prev, pageNumber: page }))
                                        }
                                        isActive={paged.pageNumber === page}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        setPaged((prev) => ({
                                            ...prev,
                                            pageNumber: Math.min(
                                                data.totalPages,
                                                prev.pageNumber + 1
                                            ),
                                        }))
                                    }
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

export default JobToReview
