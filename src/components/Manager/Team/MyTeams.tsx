import { useQuery } from "@tanstack/react-query"
import { GetMyTeamMembers } from "@/api/UserService"
import { useEffect, useState } from "react"
import type { UserReponseDto, PagedRequestDto } from "@/type/Types"
import { Users, Search, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import MemberCard from "./MemberCard"


function MyTeams() {
  const navigate = useNavigate()

  const [paged, setPaged] = useState<PagedRequestDto>({
    pageNumber: 1,
    pageSize: 10
  })
  const [search, setSearch] = useState<string>("")
  const [filteredMembers, setFilteredMembers] = useState<UserReponseDto[]>([])

  const { data } = useQuery({
    queryKey: ["my-team", paged],
    queryFn: () => GetMyTeamMembers(paged)
  })

  useEffect(() => {
    if (data) {
      if (search.trim() === "") {
        setFilteredMembers(data.data)
      } else {
        const filtered = data.data?.filter(
          member =>
            member.fullName.toLowerCase().includes(search.toLowerCase()) ||
            member.email.toLowerCase().includes(search.toLowerCase())
        )
        setFilteredMembers(filtered)
      }
    }
  }, [data, search])

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleViewTravels = (memberId: number) => {
    navigate(`/manager/my-team/${memberId}/travels`)
  }

  const handleViewProfile = (memberId: number) => {
    navigate(`../${memberId}`)
  }

  return (
    <div className="w-full p-4">
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} /> Back
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-8 w-8" />
          <h1 className="text-3xl font-bold">My Team Members</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search members by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!data ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  <TableCell>
                    <Skeleton className="h-6 w-6" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredMembers && filteredMembers.length > 0 ? (
              filteredMembers.map((member, index) => (
                  <MemberCard index={index} member={member} />
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No Team Members Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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

export default MyTeams
