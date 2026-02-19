import { GetActiveOfferes } from "@/api/GameService"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import type { GameSlotOffereResponseDto } from "@/type/Types"
import { useQuery } from "@tanstack/react-query"
import { Check, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function GameSlotOfferes() {
    const { id } = useParams()
    const [offeres, setOfferes] = useState<GameSlotOffereResponseDto[] | null>(null)

    const { data, isFetching } = useQuery({
        queryKey: ["slot-offere"],
        queryFn: () => GetActiveOfferes(Number(id)),
    })
    useEffect(() => {
        if (data) {
            console.log(data);
            setOfferes(data)
        }
    }, [data])

    function getExpiredTime(date: Date) {
        const newDate = new Date(date);
        newDate.setMinutes(newDate.getMinutes() + 5);
        return newDate
    }

    return (
        <div className="p-10">
            <Card className="p-5">
                <Table>
                    <TableHeader className="font-bold">
                        <TableRow>
                            <TableCell>
                                Create Timing
                                <div>
                                    (HH/MM/SS)
                                </div>
                            </TableCell>
                            <TableCell>Expire After<div>
                                (HH/MM/SS)
                            </div></TableCell>
                            <TableCell>Start Time<div>
                                (HH/MM/SS)
                                </div></TableCell>
                            <TableCell>End Time<div>
                                (HH/MM/SS)
                                </div></TableCell>
                            <TableCell>Date<div>
                                (YYYY/MM/DD)
                                </div></TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            (!isFetching)
                                ? (
                                    offeres && offeres.length > 0
                                        ? (
                                            offeres.map((o, idx) => (
                                                <TableRow>
                                                    <TableCell>{o.createdAt.toString().substring(11, 19)}</TableCell>
                                                    <TableCell>{getExpiredTime(o.createdAt).toLocaleString().substring(10, 19)}</TableCell>
                                                    <TableCell>{o.slot.startTime}</TableCell>
                                                    <TableCell>{o.slot.endTime}</TableCell>
                                                    <TableCell>{o.slot.date.toString().substring(0, 10)}</TableCell>
                                                    <TableCell>{o.status}</TableCell>
                                                    <TableCell className="flex gap-2">
                                                        <Button><Check /> </Button>
                                                        <Button><X /> </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )
                                        : (
                                            <TableRow>
                                                <TableCell colSpan={7} >
                                                    <div className="flex justify-center">
                                                        You Have No Offer Yet
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                )
                                : (
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <div className="flex justify-center">
                                                Fetching...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                        }
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}

export default GameSlotOfferes
