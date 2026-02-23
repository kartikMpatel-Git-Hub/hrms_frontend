import { GetAllGames } from "@/api/GameService"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import type { PagedRequestDto } from "@/type/Types"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ManagerGameRow from "./ManagerGameRow"
import { Gamepad2, Search, ArrowLeft } from "lucide-react"
import { Card } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

function ManagerGames() {

  const { data, isLoading } = useQuery({
    queryKey: ["manager-games"],
    queryFn: () => GetAllGames()
  })
  const [search, setSearch] = useState<string>("")

  const filteredGames = data?.data.filter(game =>
    search === "" || game.name.toLowerCase().includes(search.toLowerCase())
  )

  const navigator = useNavigate()

  const handleOpenGameDetail = (id: number) => {
    navigator(`./${id}/slots`)
  }

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
      </div>

      <Card className="m-2">
        <div className="flex justify-center font-bold text-2xl gap-1 mx-10"><Gamepad2 className="h-8" /><span>Game List</span></div>
        <div className="mx-10">
          <InputGroup className="">
            <InputGroupInput placeholder="Search Game..." onChange={(e) => setSearch(e.target.value)} value={search} />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">{data?.totalRecords || 0} Total</InputGroupAddon>
          </InputGroup>
          <Table>
            <TableHeader>
              <TableRow className="font-bold">
                <TableCell>Sr. No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Max Player</TableCell>
                <TableCell>Min Player</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                !isLoading
                  ? (
                    filteredGames && filteredGames.length > 0
                      ? (
                        filteredGames.map((g, idx) => (
                          <ManagerGameRow
                            key={g.id}
                            game={g}
                            idx={idx}
                            handleOpenGameDetail={handleOpenGameDetail}
                          />
                        ))
                      )
                      : (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <div className="flex justify-center p-2 font-bold">
                              No Games Found
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                  )
                  : (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
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

export default ManagerGames
