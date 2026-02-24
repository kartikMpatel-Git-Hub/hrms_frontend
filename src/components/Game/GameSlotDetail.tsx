import { GetGameSlot, CancelGameBooking } from "@/api/GameService";
import type { GameSlotDetaildResponseDto } from "@/type/Types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ClockIcon, CalendarIcon, UsersIcon, ArrowLeftIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";

function GameSlotDetail() {
    const { id, slotId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

    const { data: slotDetail, isLoading, isError } = useQuery<GameSlotDetaildResponseDto>({
        queryKey: ["game-slot-detail", id, slotId],
        queryFn: () => GetGameSlot(Number(id), Number(slotId))
    });

    const { mutate: cancelBooking, isPending: isCancelling } = useMutation({
        mutationFn: () => CancelGameBooking(Number(id), Number(slotId)),
        onSuccess: () => {
            toast.success("Booking cancelled successfully!")
            queryClient.invalidateQueries({ queryKey: ["game-slot-detail", id, slotId] })
            setCancelDialogOpen(false)
            navigate(-1)
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to cancel booking"
            toast.error(errorMessage)
        }
    });

    const canCancelBooking = (): boolean => {
        if (!slotDetail || !user) return false;
        if (slotDetail.bookedById !== user.id) return false;
        
        const slotDateTime = new Date(`${slotDetail.date.toString().split('T')[0]}T${slotDetail.startTime}`);
        const now = new Date();
        const timeDiffMinutes = (slotDateTime.getTime() - now.getTime()) / (1000 * 60);
        console.log(timeDiffMinutes);
        
        return timeDiffMinutes > 5;
    };

    const handleCancelClick = () => {
        setCancelDialogOpen(true);
    };

    const confirmCancellation = () => {
        cancelBooking();
    };

    if (isError) {
        return (
            <div className="container mx-auto p-6">
                <Card className="p-12">
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <ClockIcon className="w-16 h-16 text-destructive opacity-50" />
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">Failed to Load Slot Details</h3>
                            <p className="text-muted-foreground">An error occurred while fetching slot details.</p>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" disabled>
                        <ArrowLeftIcon className="w-4 h-4" />
                    </Button>
                    <Skeleton className="h-12 w-64" />
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <Skeleton className="h-64 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    const formatTime = (time: string) => time.substring(0, 5);
    const formatDate = (date: Date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

    const getStatusBadge = (status: string) => {
        switch (status.toUpperCase()) {
            case "BOOKED":
                return <Badge variant="default" className="capitalize"><CheckCircleIcon className="w-3 h-3 mr-1" />Booked</Badge>;
            case "AVAILABLE":
                return <Badge variant="success" className="capitalize">Available</Badge>;
            case "COMPLETED":
                return <Badge variant="secondary" className="capitalize">Completed</Badge>;
            case "WAITING":
                return <Badge variant="warning" className="capitalize">Waiting</Badge>;
            default:
                return <Badge variant="outline" className="capitalize">{status}</Badge>;
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <ToastContainer />
            
            <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangleIcon className="w-5 h-5 text-orange-600" />
                            Cancel Booking
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel this booking? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangleIcon className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-orange-900">Important</p>
                                    <p className="text-sm text-orange-700">
                                        Once cancelled, this slot will become available for other players to book.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => setCancelDialogOpen(false)}
                            disabled={isCancelling}
                        >
                            Keep Booking
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={confirmCancellation}
                            disabled={isCancelling}
                            className="gap-2"
                        >
                            <XCircleIcon className="w-4 h-4" />
                            {isCancelling ? "Cancelling..." : "Cancel Booking"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <ClockIcon className="w-8 h-8" />
                        Slot Details
                    </h1>
                </div>
            </div>

            {slotDetail && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="bg-muted/50 pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl">
                                    {formatTime(slotDetail.startTime)} - {formatTime(slotDetail.endTime)}
                                </CardTitle>
                                {getStatusBadge(slotDetail.status)}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-3">
                                    <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Date</p>
                                        <p className="font-medium">{formatDate(slotDetail.date)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <UsersIcon className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Players</p>
                                        <p className="font-medium">{slotDetail.players?.length || 0}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-primary/10" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Slot ID</p>
                                        <p className="font-medium">#{slotDetail.id}</p>
                                    </div>
                                </div>
                            </div>

                            {slotDetail.bookedBy && slotDetail.status.toUpperCase() === "BOOKED" && (
                                <div className="border-t pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <CheckCircleIcon className="w-5 h-5" />
                                            Booking Information
                                        </h3>
                                        {canCancelBooking() && (
                                            <Button 
                                                variant="destructive" 
                                                size="sm" 
                                                className="gap-2"
                                                onClick={handleCancelClick}
                                            >
                                                <XCircleIcon className="w-4 h-4" />
                                                Cancel Booking
                                            </Button>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:cursor-pointer" onClick={() =>navigate(`../../${slotDetail.bookedById}`)}>
                                        {slotDetail.bookedBy.image && (
                                            <img
                                                src={slotDetail.bookedBy.image}
                                                alt={slotDetail.bookedBy.fullName}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <p className="font-medium">{slotDetail.bookedBy.fullName}</p>
                                            <p className="text-sm text-muted-foreground">{slotDetail.bookedBy.email}</p>
                                            {slotDetail.bookedAt && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Booked at: {new Date(slotDetail.bookedAt).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {slotDetail.players && slotDetail.players.length > 0 && (
                        <Card>
                            <CardHeader className="bg-muted/50 pb-3">
                                <CardTitle className="flex items-center gap-2">
                                    <UsersIcon className="w-5 h-5" />
                                    Players in Slot ({slotDetail.players.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-3">
                                    {slotDetail.players.map((playerSlot, index) => (
                                        <div key={playerSlot.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors hover:cursor-pointer" onClick={() =>navigate(`../../${playerSlot.playerId}`)}>
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                                {index + 1}
                                            </div>
                                            {playerSlot.player?.image && (
                                                <img
                                                    src={playerSlot.player.image}
                                                    alt={playerSlot.player.fullName}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium">{playerSlot.player?.fullName}</p>
                                                <p className="text-sm text-muted-foreground">{playerSlot.player?.email}</p>
                                            </div>
                                            <Badge variant="secondary">Player #{index + 1}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}

export default GameSlotDetail;
