import { CreateGame, DeleteGame, GetAllGames } from "@/api/GameService"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import type { GameCreateDto, GameResponseDto } from "@/type/Types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import GameRow from "./GameRow"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Gamepad2, Plus, Search, Timer } from "lucide-react"
import { Field } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"


function HrGames() {

    const { data, isLoading } = useQuery({
        queryKey: ["games"],
        queryFn: GetAllGames
    })
    const queryClient = useQueryClient()
    const { mutate, isPending } = useMutation({
        mutationKey: ["create-game"],
        mutationFn: (game: GameCreateDto) => CreateGame(game),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["games"] })
            setDialogOpen(false)
        }
    })
    const { mutate: deleteGame, isPending: isDeletePending } = useMutation({
        mutationKey: ["delete-game"],
        mutationFn: (id: number) => DeleteGame(id),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["games"] })
            setDialogOpen(false)
        }
    })

    const [games, setGames] = useState<GameResponseDto[] | null>(null)
    const [filteredTravels, setFilteredTravels] = useState<GameResponseDto[] | null>(null)
    const [error, setError] = useState<string[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [search, setSearch] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [newGame, setNewGame] = useState<GameCreateDto>({
        Name: "",
        MaxPlayer: 1,
        MinPlayer: 1,
        SlotAssignedBeforeMinutes : 60,
        SlotCreateForNextXDays : 7
    })

    useEffect(() => {
        setLoading(true)
        if (data) {
            if (search.trim() === "") {
                setGames(data.data)
                setFilteredTravels(data.data)
            } else {
                const filtered = data.data?.filter(
                    t =>
                        t.name.toLowerCase().includes(search.toLowerCase()))
                setGames(filtered)
            }
        }
        setTimeout(() => {
            setLoading(false)
        }, 500);
    }, [data, search])
    const navigator = useNavigate()

    const handleOpenGameDetail = (id: number) => {
        navigator(`./${id}`)
    }

    const handleOpenSlots = (id: number) => {
        navigator(`./${id}/slots`)  
    }

    const handleSubmit = () => {
        setError([])
        if (!isValidForm()) {
            return
        }
        mutate(newGame)
    }

    const handleDeleteGame = (id: number) => {
        deleteGame(id)
    }

    const isValidForm = (): boolean => {
        const errors: string[] = []
        if (!newGame.Name || newGame.Name.trim().length < 2 || newGame.Name.trim().length > 50) {
            errors.push("Game name must be between 2 and 50 characters.")
        }
        if (newGame.MaxPlayer <= 0) {
            errors.push("Max player must be greater than 0.")
        }
        if (newGame.MinPlayer <= 0) {
            errors.push("Min player must be greater than 0.")
        }
        if (newGame.MinPlayer > newGame.MaxPlayer) {
            errors.push("Min player cannot be greater than max player.")
        }
        if (newGame.SlotAssignedBeforeMinutes <= 0) {
            errors.push("Slot Assigned Before Minutes must be greater than 0.")
        }
        if (newGame.SlotCreateForNextXDays <= 0) {
            errors.push("Slot Create For Next X Days must be greater than 0.")
        }
        setError(errors)
        return errors.length === 0
    }

    return (
        <div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <div className="flex justify-end mr-5">
                        <Button title="create slot" className=""><Plus />Add Game</Button>
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="flex"><Gamepad2 /> <div className="m-1">Create New Game</div></DialogTitle>
                        <DialogDescription>
                            Create new Game by providing minimum required information.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                        <Field>
                            <Label>Name</Label>
                            <Input type="text" placeholder="Enter Game Name" value={newGame.Name} onChange={(e) => setNewGame({ ...newGame, Name: e.target.value })} />
                        </Field>
                        <Field>
                            <Label>Max Player</Label>
                            <Input type="number" min={1} value={newGame.MaxPlayer} onChange={(e) => setNewGame({ ...newGame, MaxPlayer: parseInt(e.target.value) || 0 })} />
                        </Field>
                        <Field>
                            <Label>Min Player</Label>
                            <Input type="number" min={1} value={newGame.MinPlayer} onChange={(e) => setNewGame({ ...newGame, MinPlayer: parseInt(e.target.value) || 0 })} />
                        </Field>
                        <Field>
                            <Label>Slot Assigned Before (Minutes)</Label>
                            <Input type="number" min={1} value={newGame.SlotAssignedBeforeMinutes} onChange={(e) => setNewGame({ ...newGame, SlotAssignedBeforeMinutes: parseInt(e.target.value) || 0 })} />
                        </Field>
                        <Field>
                            <Label>Slot Create For Next (Days)</Label>
                            <Input type="number" min={1} value={newGame.SlotCreateForNextXDays} onChange={(e) => setNewGame({ ...newGame, SlotCreateForNextXDays: parseInt(e.target.value) || 0 })} />
                        </Field>
                        {error && <div className="text-red-600">{error}</div>}
                        <Button disabled={isPending} className="self-end" onClick={handleSubmit}>Create Slot</Button>
                    </div>
                </DialogContent>
            </Dialog>
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
                                <TableCell ><div className="flex justify-center">Sr.No</div></TableCell>
                                <TableCell ><div className="flex justify-center">Name</div></TableCell>
                                <TableCell ><div className="flex justify-center">Max Player</div></TableCell>
                                <TableCell ><div className="flex justify-center">Min Player</div></TableCell>
                                <TableCell><div className="flex justify-center">Action</div></TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                !(isLoading || loading)
                                    ? (
                                        games && games.length > 0
                                            ? (
                                                games.map((g, idx) => (
                                                    <GameRow
                                                        key={g.id}
                                                        game={g}
                                                        idx={idx}
                                                        handleOpenGameDetail={handleOpenGameDetail}
                                                        handleDeleteGame={handleDeleteGame}
                                                        handleOpenSlots={handleOpenSlots}
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
        </div>

    )
}

export default HrGames
