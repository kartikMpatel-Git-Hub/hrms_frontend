import { BookGameSlot, ChangeUserInterest, GetGameById, GetGameSlots, IsUserInterestedInGame } from "@/api/GameService"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type BookingSlotResponseDto, type GameResponseWithSlotDto, type SlotCreateDto } from "@/type/Types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Gamepad2, Star, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import GameSlot from "./GameSlot"
import { toast, ToastContainer } from "react-toastify"
import { Button } from "@/components/ui/button"

function EmployeeGameDetail() {

    const { id } = useParams()
    const { data } = useQuery({
        queryKey: ["game-detail"],
        queryFn: () => GetGameById(Number(id))
    })
    const { data: slots } = useQuery({
        queryKey: ["game-booking-slot"],
        queryFn: () => GetGameSlots(Number(id))
    })

    const { data: interested } = useQuery({
        queryKey: ["game-interest"],
        queryFn: () => IsUserInterestedInGame(Number(id))
    })
    const [game, setGame] = useState<GameResponseWithSlotDto>()
    const [bookingSlots, setBookingSlots] = useState<BookingSlotResponseDto[]>()
    const [isInterested, setIsInterested] = useState<boolean>(false)

    useEffect(() => {
        if (data) {
            console.log(data);
            setGame(data)
        }
    }, [data])
    useEffect(() => {
        if (slots) {
            console.log(slots);
            setBookingSlots(slots)
        }
    }, [slots])
    useEffect(() => {
        if(interested) {
            setIsInterested(interested.isInterested)
        }
    }, [interested])

    const queryClient = useQueryClient()

    const { mutate ,isPending} = useMutation({
        mutationKey: ["book-game-slot"],
        mutationFn: (data: { slotId: number, playerIds: number[] }) => BookGameSlot(Number(id), data.slotId, data.playerIds),
        onSuccess: (data) => {
            console.log(data);
            toast.success(data.status == "Booked" ? "Game slot booked successfully." : "Your Booking is in waiting list.")
            queryClient.invalidateQueries({ queryKey: ["game-booking-slot"] })
            return true
        },
        onError: (error: any) => {
            console.log(error);
            toast.error(error || error?.error?.details || "Failed to book game slot.")
            return false
        }
    })

    const { mutate: changeInterest } = useMutation({
        mutationKey: ["change-interest"],
        mutationFn: (isInterested: boolean) => ChangeUserInterest(Number(id)),
        onSuccess: (data) => {
            toast.success("Game interest changed successfully.")
            console.log(data);
            queryClient.invalidateQueries({ queryKey: ["game-interest"] })
            return true
        },
        onError: (error: any) => {
            console.log(error);
            toast.error(error || error?.error?.details || "Failed to change game interest.")
            return false
        }
    })

    function handleBooking(slotId: number, playerIds: number[]): boolean {
        if (playerIds.length + 1 === 0) {
            toast.error("Please select at least one player to book the game slot.")
            return false;
        }
        if (playerIds.length + 1 > (game?.maxPlayer || 0)) {
            toast.error(`You can select maximum ${game?.maxPlayer} players to book the game slot.`)
            return false;
        }
        if (playerIds.length + 1 < (game?.minPlayer || 0)) {
            toast.error(`You must select at least ${game?.minPlayer} players to book the game slot.`)
            return false;
        }
        mutate({ slotId, playerIds })
        return true;
    }

    return (
        <div className="m-10">
            <Card>
                <ToastContainer />
                <CardHeader>
                    <CardTitle className="flex justify-between">
                        <div className="flex font-bold text-2xl gap-2">
                            <Gamepad2 className="w-8 h-8" /> {game?.name.toUpperCase()}
                        </div>
                        <Button onClick={() => changeInterest(!isInterested)}><Star /> {isInterested ? "Remove Interest" : "Add Interest"}</Button>
                    </CardTitle>
                    <CardDescription>
                        <div className="flex ">
                            <Users className="w-4" />
                            <div className="m-1 flex">
                                Maximum Player : <div className="font-bold px-1">{game?.maxPlayer}</div>
                            </div>
                        </div>
                        <div className="flex ">
                            <Users className="w-4" />
                            <div className="m-1 flex">
                                Minimum Player : <div className="font-bold px-1">{game?.minPlayer}</div>
                            </div>
                        </div>
                    </CardDescription>
                    <CardContent>
                        <div>
                            <div className="flex justify-center font-bold text-2xl">
                                SLOTS
                            </div>
                            <Card className="w-full">
                                {
                                    bookingSlots && bookingSlots.length > 0
                                        ?
                                        (
                                            <div className="m-5 grid grid-cols-3 gap-3">
                                                {bookingSlots.map((s) => (
                                                    <GameSlot slot={s} handleBooking={handleBooking} isPending={isPending} />
                                                ))}
                                            </div>
                                        )
                                        : (<div>NOT FOUND</div>)
                                }
                            </Card>
                        </div>
                    </CardContent>
                </CardHeader>
            </Card>
        </div>
    )
}

export default EmployeeGameDetail
