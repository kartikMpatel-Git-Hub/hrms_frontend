import { CancelGameWaitlist, GetGameSlotWaitlist } from "@/api/GameService";
import type { GameSlotWaitingResponseDto } from "@/type/Types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HourglassIcon, UsersIcon, ArrowLeftIcon, XCircleIcon, AlertTriangleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { toast, ToastContainer } from "react-toastify";

function GameWaitlist() {
    const { id, slotId } = useParams();
    const [waitlists, setWaitlists] = useState<GameSlotWaitingResponseDto[] | null>(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedWaitlistId, setSelectedWaitlistId] = useState<number | null>(null);
    const navigate = useNavigate();
    const {user} = useAuth();

    const { data: waitlistData, isLoading, isError } = useQuery<GameSlotWaitingResponseDto[]>({
        queryKey: ["game-all-waitlists", id, slotId],
        queryFn: () => GetGameSlotWaitlist(Number(id), Number(slotId))
    });

    const queryClient = useQueryClient();

    const { mutate: cancelWaitlistMutation, isPending: isCancelling } = useMutation({
        mutationKey: ["cancel-waitlist"],
        mutationFn: (waitlistId: number) => CancelGameWaitlist(Number(id), Number(slotId), waitlistId),
        onSuccess: () => {
            toast.success("Waitlist request cancelled successfully!")
            queryClient.invalidateQueries({queryKey: ["game-all-waitlists", id, slotId]})
            setCancelDialogOpen(false)
            setSelectedWaitlistId(null)
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to cancel waitlist"
            toast.error(errorMessage)
        }
    })

    useEffect(() => {
        if (waitlistData) {
            setWaitlists(waitlistData);
        }
    }, [waitlistData]);

    if (isError) {
        return (
            <Card className="p-12">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <HourglassIcon className="w-16 h-16 text-muted-foreground opacity-50" />
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">Failed to Load Waitlist</h3>
                        <p className="text-muted-foreground max-w-md">
                            An error occurred while fetching the waitlist. Please try again later.
                        </p>
                    </div>
                </div>
            </Card>
        )
    }

    async function handleCancelWaitlist(waitlistId: number): Promise<void> {
        setSelectedWaitlistId(waitlistId)
        setCancelDialogOpen(true)
    }

    function confirmCancellation(): void {
        if (selectedWaitlistId) {
            cancelWaitlistMutation(selectedWaitlistId)
        }
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <ToastContainer />
            
            <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangleIcon className="w-5 h-5 text-orange-600" />
                            Cancel Waitlist Request
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel your waitlist request? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangleIcon className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-orange-900">Important</p>
                                    <p className="text-sm text-orange-700">
                                        Once cancelled, you'll need to rejoin the waitlist if you change your mind. Your position in the queue will be lost.
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
                            Keep Request
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={confirmCancellation}
                            disabled={isCancelling}
                            className="gap-2"
                        >
                            <XCircleIcon className="w-4 h-4" />
                            {isCancelling ? "Cancelling..." : "Cancel Request"}
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
                        <HourglassIcon className="w-8 h-8" />
                        All Waitlists
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {waitlists?.length || 0} waitlist{waitlists?.length !== 1 ? 's' : ''} found
                    </p>
                </div>
            </div>

            {waitlists && waitlists.length > 0 ? (
                <div className="space-y-4">

                    {
                        isLoading ? (
                            <Card className="p-12">
                                <Skeleton className="h-4 w-full mb-4" />
                                <Skeleton className="h-4 w-full mb-4" />
                                <Skeleton className="h-4 w-full mb-4" />
                            </Card>
                        ) : (
                            waitlists.map((waitlist) => (
                                <Card key={waitlist.id} className="overflow-hidden">
                                    <CardHeader className="bg-muted/50 pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg">Slot #{waitlist.gameSlotId}</CardTitle>
                                            <Badge variant="warning" className="flex items-center gap-1">
                                                <UsersIcon className="w-3 h-3" />
                                                {waitlist.waitingPlayers?.length || 0} waiting
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Requested At: {new Date(waitlist.requestedAt).toLocaleString()}
                                            </p>
                                        </div>
                                        {
                                            waitlist.requestedById === user?.id && (
                                                <Button 
                                                    variant="destructive" 
                                                    size="sm" 
                                                    className="mt-2 gap-2" 
                                                    onClick={() => handleCancelWaitlist(waitlist.id)}
                                                >
                                                    <XCircleIcon className="w-4 h-4" />
                                                    Cancel My Request
                                                </Button>
                                            )
                                        }
                                    </CardHeader>

                                    <CardContent className="pt-6 space-y-6">
                                        {waitlist.requestedBy && (
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                                    <span className="w-1 h-1 bg-primary rounded-full"></span>
                                                    Requested By
                                                </h4>
                                                <div className="flex items-center gap-4 pl-5">
                                                    {waitlist.requestedBy.image && (
                                                        <img
                                                            src={waitlist.requestedBy.image}
                                                            alt={waitlist.requestedBy.fullName}
                                                            className="w-12 h-12 rounded-full object-cover"
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="font-medium">{waitlist.requestedBy.fullName}</p>
                                                        <p className="text-sm text-muted-foreground">{waitlist.requestedBy.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-3">
                                            <h4 className="text-sm font-semibold flex items-center gap-2">
                                                <span className="w-1 h-1 bg-primary rounded-full"></span>
                                                Waiting Players ({waitlist.waitingPlayers?.length || 0})
                                            </h4>

                                            {waitlist.waitingPlayers && waitlist.waitingPlayers.length > 0 ? (
                                                <div className="space-y-2 pl-5">
                                                    {waitlist.waitingPlayers.map((waitingPlayer, index) => (
                                                        <div
                                                            key={waitingPlayer.id}
                                                            className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                                                        >
                                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0">
                                                                {index + 1}
                                                            </div>
                                                            {waitingPlayer.player?.image && (
                                                                <img
                                                                    src={waitingPlayer.player.image}
                                                                    alt={waitingPlayer.player.fullName}
                                                                    className="w-10 h-10 rounded-full object-cover shrink-0"
                                                                />
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium truncate">{waitingPlayer.player?.fullName || "Unknown Player"}</p>
                                                                <p className="text-sm text-muted-foreground truncate">{waitingPlayer.player?.email || "No email"}</p>
                                                            </div>
                                                            <Badge variant="secondary" className="shrink-0">
                                                                #{index + 1}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground text-center py-4 pl-5">No players in waitlist</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}

                </div>
            ) : (
                <Card className="p-12">
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <HourglassIcon className="w-16 h-16 text-muted-foreground opacity-50" />
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">No Waitlists</h3>
                            <p className="text-muted-foreground max-w-md">
                                There are currently no waitlists for this game. All slots are available or booked.
                            </p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}

export default GameWaitlist;
