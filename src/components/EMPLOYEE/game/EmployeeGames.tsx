import { GetAllGames } from "@/api/GameService"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import type { GameResponseDto, PagedRequestDto } from "@/type/Types"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import GameRow from "./GameRow"
import { Gamepad2, Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"


function EmployeeGames() {

    const { data, isLoading } = useQuery({
        queryKey: ["games"],
        queryFn: () => GetAllGames()
    })
    const [games, setGames] = useState<GameResponseDto[] | null>(null)
    const [filteredGames, setFilteredGames] = useState<GameResponseDto[] | null>(null)
    const [search, setSearch] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setLoading(true)
        if (data) {
            if (search.trim() === "") {
                setGames(data.data)
                setFilteredGames(data.data)
            } else {
                const filtered = data.data?.filter(
                    t =>
                        t.name.toLowerCase().includes(search.toLowerCase()))
                setFilteredGames(filtered)
            }
        }
        setTimeout(() => {
            setLoading(false)
        }, 500);
    }, [data, search])
    const navigator = useNavigate()

    const handleOpenGameDetail = (id: number) => {
        navigator(`./${id}/slots`)
    }

    return (
        <div>
            <Card className="m-2">
                <div className="flex justify-center font-bold text-2xl gap-1 mx-10"><Gamepad2 className="h-8" /><span>Game List</span></div>
                <div className="mx-10">
                    <InputGroup className="">
                        <InputGroupInput placeholder="Search Game..." onChange={(e) => setSearch(e.target.value)} value={search} />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">{games?.length || 0} Results</InputGroupAddon>
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
                                !(isLoading || loading)
                                    ? (
                                        filteredGames && filteredGames.length > 0
                                            ? (
                                                filteredGames.map((g, idx) => (
                                                    <GameRow
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
                                                            No Game Found
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

export default EmployeeGames
