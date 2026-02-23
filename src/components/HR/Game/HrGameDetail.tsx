import { CreateGameOperationSlot, DeleteGameOperationSlot, GetGameById, UpdateGameDetail } from "@/api/GameService"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import type { GameCreateDto, GameOperatingHourCreateDto, GameResponseWithSlotDto } from "@/type/Types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Gamepad2, Plus, Timer, Users, Edit, CalendarCheck2Icon, LucideCalendarRange } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import GameOperationWindowCard from "./GameOperationWindowCard"
import { toast, ToastContainer } from "react-toastify"

function HrGameDetail() {

    const { id } = useParams()
    const { data } = useQuery({
        queryKey: ["game-detail"],
        queryFn: () => GetGameById(Number(id))
    })
    const [game, setGame] = useState<GameResponseWithSlotDto>()
    const [newSlot, setNewSlot] = useState<GameOperatingHourCreateDto>({
        OperationalStartTime: "",
        OperationalEndTime: "",
    })
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)

    const initialGameForm = useMemo<GameCreateDto>(() => ({
        Name: game?.name || "",
        MaxPlayer: game?.maxPlayer || 1,
        MinPlayer: game?.minPlayer || 1,
        Duration: game?.duration || 30,
        SlotAssignedBeforeMinutes: game?.slotAssignedBeforeMinutes || 30,
        SlotCreateForNextXDays: game?.slotCreateForNextXDays || 2
    }), [game])

    const [editForm, setEditForm] = useState<GameCreateDto>(initialGameForm)

    const queryClient = useQueryClient()

    useEffect(() => {
        if (editDialogOpen) {
            setEditForm(initialGameForm)
            setError("")
        }
    }, [editDialogOpen, initialGameForm])


    const { mutate, isPending } = useMutation({
        mutationKey: ["create-game-slot"],
        mutationFn: (payload: { gameId: number; dto: GameOperatingHourCreateDto }) => CreateGameOperationSlot(payload.gameId, payload.dto),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["game-detail"] })
            setGame((prev) => (prev ? { ...prev, gameOperationWindows: [...prev.gameOperationWindows, res] } : prev))
            setDialogOpen(false)
            toast.success("Slot created successfully")
        },
        onError: (err: any) => {
            setError(err?.error?.details || "Failed to create game slot. Please try again.")
        }
    })

    const { mutate: deleteOperatingHour, isPending: isDeletePending } = useMutation({
        mutationKey: ["delete-game-operation-slot"],
        mutationFn: (slotId: number) => DeleteGameOperationSlot(Number(id), slotId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["game-detail"] })
            setDialogOpen(false)
            toast.success("Slot deleted successfully")
        },
        onError: (err: any) => {
            setError(err?.error?.details || "Failed to delete game operation slot. Please try again.")
        }
    })

    const { mutate: updateGame, isPending: isUpdatePending } = useMutation({
        mutationKey: ["update-game-detail"],
        mutationFn: (dto: GameCreateDto) => UpdateGameDetail(Number(id), dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["game-detail"] })
            setEditDialogOpen(false)
            toast.success("Game updated successfully")
        },
        onError: (err: any) => {
            setError(err?.error?.details || "Failed to update game. Please try again.")
            toast.error("Failed to update game")
        }
    })



    const [error, setError] = useState<string>("")

    useEffect(() => {
        if (data) {
            setGame(data)
        }
    }, [data])

    const handleSubmit = () => {
        setError("")
        if (!newSlot.OperationalStartTime || !newSlot.OperationalEndTime) {
            setError("Start time and End time is required !")
            return
        }
        if (newSlot.OperationalEndTime <= newSlot.OperationalStartTime) {
            setError("End time must be greater than start time !")
            return
        }
        mutate({ gameId: Number(id), dto: newSlot })
    }

    const handleDeleteSlot = (slotId: number) => {
        deleteOperatingHour(slotId)
    }

    const handleEditSubmit = () => {
        setError("")
        if (!editForm.Name.trim()) {
            setError("Game name is required")
            return
        }
        if (editForm.MaxPlayer < 1 || editForm.MinPlayer < 1) {
            setError("Player counts must be at least 1")
            return
        }
        if (editForm.MinPlayer > editForm.MaxPlayer) {
            setError("Minimum players cannot exceed maximum players")
            return
        }
        if (editForm.Duration < 1) {
            setError("Duration must be at least 1 minute")
            return
        }
        updateGame(editForm)
    }

    return (
        <div className="m-10">
            <ToastContainer position="top-right" />
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between">
                        <div className="flex font-bold text-2xl gap-2">
                            <Gamepad2 className="w-8 h-8" /> {game?.name.toUpperCase()}
                        </div>
                        <div className="flex gap-2">
                            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button title="edit game"><Edit /> Edit Game</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="flex gap-2"><Edit /> <div>Edit Game Details</div></DialogTitle>
                                        <DialogDescription>
                                            Update game information and configuration.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-4 py-4">
                                        <Field>
                                            <Label>Game Name</Label>
                                            <Input value={editForm.Name} maxLength={20} onChange={(e) => setEditForm({ ...editForm, Name: e.target.value })} />
                                        </Field>
                                        <Field>
                                            <Label>Maximum Players</Label>
                                            <Input type="number" min="1" value={editForm.MaxPlayer} onChange={(e) => setEditForm({ ...editForm, MaxPlayer: parseInt(e.target.value) || 1 })} />
                                        </Field>
                                        <Field>
                                            <Label>Minimum Players</Label>
                                            <Input type="number" min="1" value={editForm.MinPlayer} onChange={(e) => setEditForm({ ...editForm, MinPlayer: parseInt(e.target.value) || 1 })} />
                                        </Field>
                                        <Field>
                                            <Label>Duration (minutes)</Label>
                                            <Input type="number" min="1" max={100} value={editForm.Duration} onChange={(e) => setEditForm({ ...editForm, Duration: parseInt(e.target.value) || 30 })} />
                                        </Field>
                                        <Field>
                                            <Label>Slot Assigned Before (minutes)</Label>
                                            <Input type="number" min="1" max={100} value={editForm.SlotAssignedBeforeMinutes} onChange={(e) => setEditForm({ ...editForm, SlotAssignedBeforeMinutes: parseInt(e.target.value) || 60 })} />
                                        </Field>
                                        <Field>
                                            <Label>Create Slots For Next (days)</Label>
                                            <Input type="number" min="1" max={7} value={editForm.SlotCreateForNextXDays} onChange={(e) => setEditForm({ ...editForm, SlotCreateForNextXDays: parseInt(e.target.value) || 7 })} />
                                        </Field>
                                        {error && <div className="text-red-600 text-sm">{error}</div>}
                                        <Button disabled={isUpdatePending} className="self-end" onClick={handleEditSubmit}>Save Changes</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
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
                                            <Label>Operating Hour Start Time</Label>
                                            <Input type="time" value={newSlot.OperationalStartTime} onChange={(e) => setNewSlot({ ...newSlot, OperationalStartTime: e.target.value })} />
                                        </Field>
                                        <Field>
                                            <Label>Operating Hour End Time</Label>
                                            <Input type="time" value={newSlot.OperationalEndTime} onChange={(e) => setNewSlot({ ...newSlot, OperationalEndTime: e.target.value })} />
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
                        <div className="flex ">
                            <Timer className="w-4" />
                            <div className="m-1 flex">
                                Duration : <div className="font-bold px-1">{game?.duration} Min</div>
                            </div>
                        </div>
                        <div className="flex ">
                            <CalendarCheck2Icon className="w-4" />
                            <div className="m-1 flex">
                                Slot Assigned Before : <div className="font-bold px-1">{game?.slotAssignedBeforeMinutes} Min</div>
                            </div>
                        </div>
                        <div className="flex ">
                            <LucideCalendarRange className="w-4" />
                            <div className="m-1 flex">
                                Slot Create For Next : <div className="font-bold px-1">{game?.slotCreateForNextXDays} Days</div>
                            </div>
                        </div>
                    </CardDescription>
                    <CardContent>
                        <div>
                            <div className="flex justify-center font-bold text-2xl">
                                SLOTS
                            </div>
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
                                        game && game?.gameOperationWindows.length > 0 ?
                                            (
                                                game?.gameOperationWindows.map((s, idx) => (
                                                    <GameOperationWindowCard key={s.id} operationWindow={s} id={idx} handleDeleteSlot={handleDeleteSlot} isDeletingSlot={isDeletePending} />
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
