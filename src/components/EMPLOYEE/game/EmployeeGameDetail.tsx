import { GetGameById, GetGameSlots } from "@/api/GameService"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type BookingSlotResponseDto, type GameResponseWithSlotDto, type SlotCreateDto } from "@/type/Types"
import {  useQuery, useQueryClient } from "@tanstack/react-query"
import { Gamepad2,Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import GameSlot from "./GameSlot"

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
    const [game, setGame] = useState<GameResponseWithSlotDto>()
    const [bookingSlots, setBookingSlots] = useState<BookingSlotResponseDto[]>()

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

    return (
        <div className="m-10">
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between">
                        <div className="flex font-bold text-2xl gap-2">
                            <Gamepad2 className="w-8 h-8" /> {game?.name.toUpperCase()}
                        </div>
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
                                                    <GameSlot slot={s} />
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
