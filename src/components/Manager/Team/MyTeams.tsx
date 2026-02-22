import { useQuery } from "@tanstack/react-query"
import { GetMyTeamMembers } from "@/api/UserService"
import { useEffect, useState } from "react"
import type { UserReponseDto, PagedRequestDto } from "@/type/Types"
import { Users, Search, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import MemberCard from "./MemberCard"

function MyTeams() {
  const navigate = useNavigate()
  
  const [paged] = useState<PagedRequestDto>({
    pageNumber: 1,
    pageSize: 10
  })
  const [search, setSearch] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [teamMembers, setTeamMembers] = useState<UserReponseDto[]>([])
  const [filteredMembers, setFilteredMembers] = useState<UserReponseDto[]>([])

  const { data: teamData } = useQuery({
    queryKey: ["my-team", paged],
    queryFn: () => GetMyTeamMembers(paged)
  })

  useEffect(() => {
    setLoading(true)
    if (teamData) {
      setTeamMembers(teamData.data)
      if (search.trim() === "") {
        setFilteredMembers(teamData.data)
      } else {
        const filtered = teamData.data?.filter(
          member =>
            member.fullName.toLowerCase().includes(search.toLowerCase()) ||
            member.email.toLowerCase().includes(search.toLowerCase())
        )
        setFilteredMembers(filtered)
      }
    }
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [teamData, search])

  return (
    <div>
      <div className="mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} /> Back
        </Button>
      </div>

      <Card className="m-2">
        <div className="flex justify-center font-bold text-2xl gap-1 mx-10">
          <Users className="h-8" />
          <span>My Team Members</span>
        </div>

        <div className="mx-10">
          <InputGroup className="">
            <InputGroupInput 
              placeholder="Search members..." 
              onChange={(e) => setSearch(e.target.value)} 
              value={search} 
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">{teamMembers?.length || 0} Members</InputGroupAddon>
          </InputGroup>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredMembers && filteredMembers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6 pb-6">
              {filteredMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center p-8">
              <p className="text-muted-foreground font-semibold">No Team Members Found</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default MyTeams
