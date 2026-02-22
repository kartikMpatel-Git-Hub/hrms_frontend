import { GetAvailablePlayers } from "@/api/GameService"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Skeleton } from "@/components/ui/skeleton"
import useDebounce from "@/hook/useDebounce"
import type { BookingSlotResponseDto, PagedRequestDto, UserReponseDto } from "@/type/Types"
import { BookMarked, CalendarCheck2, Eye, MoveRight, Plus, Search, Users2, X } from "lucide-react"
import { useEffect, useState } from "react"

interface GameSlotProps {
    slot: BookingSlotResponseDto,
    handleBooking: (slotId: number, playerIds: number[]) => boolean,
    isPending : boolean
}

function GameSlot({ slot, handleBooking, isPending }: GameSlotProps) {

    const [search, setSearch] = useState<string>("")
    const [players, setPlayers] = useState<UserReponseDto[] | null>(null)
    const [selectedPlayer, setSelectedPlayer] = useState<UserReponseDto[]>([])
    const [page, setPage] = useState<PagedRequestDto>({
        pageNumber: 1,
        pageSize: 10,
    })
    const [loading, setLoading] = useState<boolean>(false)
    const fetchedPlayers = useDebounce<UserReponseDto>(search || "", 1000, () => GetAvailablePlayers(slot.gameId, page.pageSize, page.pageNumber, search));
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (fetchedPlayers) {
            setPlayers(fetchedPlayers)
            console.log(fetchedPlayers);

        }
        setLoading(false)
    }, [fetchedPlayers])

    useEffect(() => {
        setPlayers(null)
        setSelectedPlayer([])
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        setLoading(true)
    }

    const handleSelectPlayer = (player: UserReponseDto) => {
        if (selectedPlayer.some((p) => p.id === player.id)) {
            setSelectedPlayer((prev) => prev.filter((p) => p.id !== player.id))
        } else {
            setSelectedPlayer((prev) => [...prev, player])
        }
    }


    function handleBookingSlot(): void {
        setOpen(!handleBooking(slot.id, selectedPlayer.map((p) => p.id)))
    }

    return (
        <div className="p-2 shadow-sm rounded-2xl font-bold">
            <div className="flex justify-center m-4 gap-2">
                <div className="flex justify-center">{slot.startTime.substring(0, 5)}</div>
                <div className="flex justify-center">
                    <MoveRight />
                </div>
                <div className="flex justify-center">{slot.endTime.substring(0, 5)}</div>
            </div>
            <div className="flex">
                {
                    slot.status == "Available"
                        ? (
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full p-1" disabled={isPending}>
                                        <CalendarCheck2 /> Book
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            <div className="flex text-md gap-2 font-bold">
                                                <Users2 /> Select Player
                                            </div>
                                        </DialogTitle>
                                        <DialogDescription>
                                            Select player for this game slot. You can select multiple players if the game allows multiple players.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <InputGroup className="">
                                        <InputGroupInput placeholder="Search Employee..." onChange={handleChange} value={search} />
                                        <InputGroupAddon>
                                            <Search />
                                        </InputGroupAddon>
                                        <InputGroupAddon align="inline-end">{players?.length || 0} Results</InputGroupAddon>
                                    </InputGroup>
                                    <div>
                                        selected players
                                        {
                                            selectedPlayer.length > 0 ? (

                                                selectedPlayer.map((p) => (
                                                    <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg shadow-sm">
                                                        <div>
                                                            {
                                                                p.image && p.image !== "" ? (
                                                                    <img src={p.image} alt={p.fullName} className="w-8 h-8 rounded-full" />
                                                                ) : (
                                                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                                                        {p.fullName?.[0] || '?'}
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                        <div className="font-medium">{p.email}</div>
                                                        <Button className="ml-auto" onClick={() => handleSelectPlayer(p)} disabled={isPending}>
                                                            <X />
                                                        </Button>
                                                    </div>
                                                ))
                                            ) : (<div className="flex justify-center">No Player Selected</div>)
                                        }
                                    </div>
                                    <div>
                                        select player from below list
                                        {
                                            !loading
                                                ? (
                                                    players && players.length > 0
                                                        ?
                                                        (
                                                            <div>
                                                                {players.map((p) => (
                                                                    <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg shadow-sm">
                                                                        <div>
                                                                            {
                                                                                p.image && p.image !== "" ? (
                                                                                    <img src={p.image} alt={p.fullName} className="w-8 h-8 rounded-full" />
                                                                                ) : (
                                                                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                                                                        {p.fullName?.[0] || '?'}
                                                                                    </div>
                                                                                )
                                                                            }</div>
                                                                        <div className="font-medium">{p.email}</div>
                                                                        <Button className="ml-auto" onClick={() => handleSelectPlayer(p)} disabled={isPending}>
                                                                            <Plus />
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )
                                                        : (<div>No Player Found</div>)
                                                )
                                                : (<div>
                                                    {Array.from({ length: 5 }).map((_) => (
                                                        <div className="p-1 flex gap-3">
                                                            <Skeleton className="h-8 w-100" />
                                                            <Skeleton className="h-8 w-8" />
                                                        </div>
                                                    ))}
                                                </div>)
                                        }
                                    </div>
                                    <Button className="w-full mt-4" onClick={handleBookingSlot} disabled={isPending}>
                                        <BookMarked /> Confirm Booking
                                    </Button>
                                </DialogContent>
                            </Dialog>
                        )
                        : <Button className="w-full p-1">
                            <Eye /> View
                        </Button>
                }
            </div>
        </div >
    )
}

export default GameSlot
