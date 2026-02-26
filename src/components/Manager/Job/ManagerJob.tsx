import { useMutation, useQuery } from "@tanstack/react-query"
import { GetAllJob, ReferedJob, ShareJob } from "@/api/JobService"
import { useEffect, useState } from "react"
import type { JobResponseDto, PagedRequestDto } from "@/type/Types"
import { Briefcase, Search, ArrowLeft, ScanEye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import ManagerJobCard from "./ManagerJobCard"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"


function ManagerJob() {
  const [paged, setPaged] = useState<PagedRequestDto>({
    pageNumber: 1,
    pageSize: 5
  })
  const navigator = useNavigate()
  const [search, setSearch] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [jobs, setJobs] = useState<JobResponseDto[]>()

  const { data } = useQuery({
    queryKey: ["manager-jobs", paged],
    queryFn: () => GetAllJob(paged)
  })

  const { isPending: loadingReference, mutate: referred, isSuccess: referreComplete } = useMutation({
    mutationKey: ["referred-job"],
    mutationFn: ReferedJob,
    onSuccess: () => {
      toast.success("Reference Added Successfully!")
    },
    onError: (err: any) => {
      // console.log(err)
      toast.error("Something went wrong while adding job reference!")
    }
  })

  const { isPending: loadingShare, mutate: shared, isSuccess: shareComplete } = useMutation({
    mutationKey: ["share-job"],
    mutationFn: ShareJob,
    onSuccess: () => {
      toast.success("Job Shared Successfully!")
    },
    onError: () => {
      toast.error("Something went wrong while sharing job!")
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
      } else {
        const filtered = data.data?.filter(
          t => t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.jobRole.toLowerCase().includes(search.toLowerCase()) ||
            t.place.toLowerCase().includes(search.toLowerCase())
        )
        setJobs(filtered)
      }
    }
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [data, search])

  return (
    <div>
      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigator(-1)}
        >
          <ArrowLeft size={18} /> Back
        </Button>
        <div className="flex justify-end mr-10">
          <Button onClick={() => navigator("./review")} className="">
            <ScanEye />  Job To Review
          </Button>
        </div>
      </div>

      <Card className="m-2">
        <div className="font-bold text-2xl gap-1 mx-10">
          <div className="flex justify-center ">
            <Briefcase className="h-8" /><span>Job List</span>
          </div>

        </div>
        <div className="mx-5">
          <InputGroup className="">
            <InputGroupInput placeholder="Search jobs..." onChange={(e) => setSearch(e.target.value)} value={search} />
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
                          <ManagerJobCard
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
                              No Jobs Found
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                  ) :
                  (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
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

export default ManagerJob
