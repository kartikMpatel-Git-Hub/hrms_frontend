import { CreateGameSlot, DeleteGameSlot, GetGameById } from "@/api/GameService"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import type { GameResponseWithSlotDto, SlotCreateDto } from "@/type/Types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Gamepad2, Plus, Timer, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import GameSlot from "./GameSlot"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

function HrGameDetail() {

    const { id } = useParams()
    const { data } = useQuery({
        queryKey: ["game-detail"],
        queryFn: () => GetGameById(Number(id))
    })
    const [game, setGame] = useState<GameResponseWithSlotDto>()
    const [newSlot, setNewSlot] = useState<SlotCreateDto>({
        StartTime: "",
        EndTime: ""
    })
    const [dialogOpen, setDialogOpen] = useState(false)

    const queryClient = useQueryClient()


    const { mutate, isPending } = useMutation({
        mutationKey: ["create-game-slot"],
        mutationFn: CreateGameSlot,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["game-detail"] })
            console.log(res);
            setGame((prev) => (prev ? { ...prev, slots: [...prev.slots, res] } : prev))
            setDialogOpen(false)
        },
        onError: (err: any) => {
            setError(err?.error?.details || "Failed to create game slot. Please try again.")
        }
    })

    const { mutate: deleteSlot, isPending: isDeletePending } = useMutation({
        mutationKey: ["delete-game-slot"],
        mutationFn: (slotId: number) => DeleteGameSlot(Number(id), slotId),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["game-detail"] })
            setDialogOpen(false)
        },
        onError: (err: any) => {
            setError(err?.error?.details || "Failed to delete game slot. Please try again.")
        }
    })



    const [error, setError] = useState<string>("")

    useEffect(() => {
        if (data) {
            console.log(data);
            setGame(data)
        }
    }, [data])

    const handleSubmit = () => {
        setError("")
        if (!newSlot.StartTime || !newSlot.EndTime) {
            setError("Start time and End time is required !")
            return
        }
        if (newSlot.EndTime <= newSlot.StartTime) {
            setError("End time must be greater than start time !")
            return
        }
        mutate({ id: Number(id), dto: newSlot })
    }

    const handleDeleteSlot = (slotId: number) => {
        deleteSlot(slotId)
    }

    return (
        <div className="m-10">
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between">
                        <div className="flex font-bold text-2xl gap-2">
                            <Gamepad2 className="w-8 h-8" /> {game?.name.toUpperCase()}
                        </div>
                        <div>
                            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button title="create slot"><Plus />create slot</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-sm">
                                    <DialogHeader>
                                        <DialogTitle className="flex"><Timer /> <div className="m-1">Create New Slot</div></DialogTitle>
                                        <DialogDescription>
                                            Create new Time Slot of this game by providing minimum required information.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-4 py-4">
                                        <Field>
                                            <Label>Start Time</Label>
                                            <Input type="time" value={newSlot.StartTime} onChange={(e) => setNewSlot({ ...newSlot, StartTime: e.target.value })} />
                                        </Field>
                                        <Field>
                                            <Label>End Time</Label>
                                            <Input type="time" value={newSlot.EndTime} onChange={(e) => setNewSlot({ ...newSlot, EndTime: e.target.value })} />
                                        </Field>
                                        {error && <div className="text-red-600">{error}</div>}
                                        <Button disabled={isPending} className="self-end" onClick={handleSubmit}>Create Slot</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
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
                            {/* <hr /> */}
                            <Table>
                                <TableHeader>
                                    <TableRow className="font-bold">
                                        <TableCell>Slot</TableCell>
                                        <TableCell>Start Time</TableCell>
                                        <TableCell>End Time</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        game && game?.slots.length > 0 ?
                                            (
                                                game?.slots.map((s, idx) => (
                                                    <GameSlot key={s.id} slot={s} id={idx} handleDeleteSlot={handleDeleteSlot} isDeletingSlot={isDeletePending}/>
                                                ))
                                            )
                                            :
                                            (
                                                <TableRow>
                                                    <TableCell colSpan={3}>
                                                        <div className="flex justify-center font-bold">
                                                            No Slot Found
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                    }
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </CardHeader>
            </Card>
        </div>
    )
}

export default HrGameDetail
