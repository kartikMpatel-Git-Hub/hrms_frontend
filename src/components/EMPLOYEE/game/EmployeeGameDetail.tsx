import { BookGameSlot, GetAvailablePlayers, GetGameSlots, IsUserInterestedInGame, ChangeUserInterest } from "@/api/GameService";
import type { GameSlotResponseDto, UserReponseDto } from "@/type/Types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarIcon, ClockIcon, HeartIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast, ToastContainer } from "react-toastify";
import GameSlotCard from "../../Game/GameSlotCard";

function EmployeeGameDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data } = useQuery<GameSlotResponseDto[]>({
        queryKey: ["game-slot", id],
        queryFn: () => GetGameSlots(Number(id))
    });

    const [game, setGame] = useState<GameSlotResponseDto[]>();
    const [selectedSlot, setSelectedSlot] = useState<GameSlotResponseDto | null>(null);
    const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
    const [searchKey, setSearchKey] = useState("");
    const [openBookingDialog, setOpenBookingDialog] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [isInterested, setIsInterested] = useState(false);

    const { data: interestedData } = useQuery({
        queryKey: ["user-game-interest", id],
        queryFn: () => IsUserInterestedInGame(Number(id))
    });

    useEffect(() => {
        if (interestedData) {
            setIsInterested(interestedData.isInterested);
        }
    }, [interestedData]);

    const interestMutation = useMutation({
        mutationFn: () => ChangeUserInterest(Number(id)),
        onSuccess: () => {
            setIsInterested(prev => !prev);
            queryClient.invalidateQueries({ queryKey: ["user-game-interest", id] });
            toast.success(isInterested ? "Removed from interests" : "Added to interests");
        },
        onError: () => {
            toast.error("Failed to toggle interest");
        }
    });

    useEffect(() => {
        if (data) {
            // console.log(data);
            setGame(data);

            if (data.length > 0) {
                const today = new Date().toISOString().split('T')[0];
                const dates = [...new Set(data.map(slot => slot.date.toString().split('T')[0]))];
                setSelectedDate(dates.includes(today) ? today : dates[0]);
            }
        }
    }, [data]);

    const groupedSlots = game?.reduce((acc, slot) => {
        const dateKey = slot.date.toString().split('T')[0];
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(slot);
        return acc;
    }, {} as Record<string, GameSlotResponseDto[]>);

    if (groupedSlots) {
        Object.keys(groupedSlots).forEach(dateKey => {
            groupedSlots[dateKey].sort((a, b) => {
                const getPriority = (status: string) => {
                    const s = status.toLowerCase();
                    if (s === 'available') return 1;
                    if (s === 'waiting') return 2;
                    if (s === 'booked') return 3;
                    return 4;
                };
                return getPriority(a.status) - getPriority(b.status);
            });
        });
    }

    const availableDates = groupedSlots ? Object.keys(groupedSlots).sort() : [];

    const { data: availablePlayers } = useQuery<UserReponseDto[]>({
        queryKey: ["available-players", id, searchKey],
        queryFn: () => GetAvailablePlayers(Number(id), 20, 1, searchKey),
        enabled: openBookingDialog
    });

    const bookingMutation = useMutation({
        mutationFn: ({ gameId, slotId, playerIds }: { gameId: number; slotId: number; playerIds: number[] }) =>
            BookGameSlot(gameId, slotId, playerIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["game-slot", id] });
            setOpenBookingDialog(false);
            setSelectedPlayers([]);
            setSelectedSlot(null);
            toast.success("Slot booked successfully!");
        },
        onError: (error: any) => {
            // console.log(error);
            toast.error(error?.error?.details || "Failed to book slot");
        }
    });

    const handleBookSlot = (slot: GameSlotResponseDto) => {
        setSelectedSlot(slot);
        setOpenBookingDialog(true);
    };

    const handleConfirmBooking = () => {
        if (selectedSlot && selectedPlayers.length > 0) {
            bookingMutation.mutate({
                gameId: Number(id),
                slotId: selectedSlot.id,
                playerIds: selectedPlayers
            });
        }
    };

    const handleViewWaitlist = (slotId: number) => {
        navigate(`./game/${id}/slots/${slotId}/waitlist`);
    };
    const handleViewDetails = (slotId: number) => {
        navigate(`./game/${id}/slots/${slotId}/details`);
    };

    const formatTime = (time: string) => {
        return time.substring(0, 5);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    };

    const togglePlayerSelection = (playerId: number) => {
        setSelectedPlayers(prev =>
            prev.includes(playerId)
                ? prev.filter(id => id !== playerId)
                : [...prev, playerId]
        );
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <ToastContainer />
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Game Slots</h1>
                <Button
                    variant={isInterested ? "default" : "outline"}
                    onClick={() => interestMutation.mutate()}
                    disabled={interestMutation.isPending}
                    className="gap-2"
                >
                    <HeartIcon className={`w-4 h-4 ${isInterested ? "fill-current" : ""}`} />
                    {isInterested ? "Interested" : "Add Interest"}
                </Button>
            </div>

            {(!game || game.length === 0) && (
                <Card className="p-12">
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <CalendarIcon className="w-16 h-16 text-muted-foreground opacity-50" />
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">No Slots Available</h3>
                            <p className="text-muted-foreground max-w-md">
                                There are currently no game slots scheduled. Please check back later or contact the administrator.
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {availableDates.length > 0 && (
                <div className="flex items-center gap-3 flex-wrap">
                    <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                    <div className="flex gap-2 flex-wrap">
                        {availableDates.map((date) => (
                            <Button
                                key={date}
                                variant={selectedDate === date ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedDate(date)}
                                className="min-w-35"
                            >
                                {formatDate(date)}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {groupedSlots && selectedDate && groupedSlots[selectedDate] && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold">{formatDate(selectedDate)}</h2>
                        <Badge variant="outline" className="ml-2">
                            {groupedSlots[selectedDate].length} slots
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {groupedSlots[selectedDate].map((slot) => (
                            <GameSlotCard
                                key={slot.id}
                                slot={slot}
                                onBook={handleBookSlot}
                                onViewWaitlist={handleViewWaitlist}
                                onViewDetails={handleViewDetails}
                            />
                        ))}
                    </div>
                </div>
            )}

            {groupedSlots && selectedDate && !groupedSlots[selectedDate] && (
                <Card className="p-12">
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <ClockIcon className="w-16 h-16 text-muted-foreground opacity-50" />
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">No Slots for This Date</h3>
                            <p className="text-muted-foreground max-w-md">
                                There are no game slots available for {formatDate(selectedDate)}. Please select a different date.
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            <Dialog open={openBookingDialog} onOpenChange={setOpenBookingDialog}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Book Slot</DialogTitle>
                        <DialogDescription>
                            {selectedSlot && (
                                <span>
                                    {formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)} on {formatDate(selectedSlot.date.toString())}
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Input
                                placeholder="Search players..."
                                value={searchKey}
                                onChange={(e) => setSearchKey(e.target.value)}
                                className="mb-4"
                            />
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-medium">Select Players ({selectedPlayers.length} selected)</p>
                            <div className="space-y-2 max-h-96 overflow-y-auto border rounded-lg p-4">
                                {availablePlayers?.map((player) => (
                                    <div
                                        key={player.id}
                                        className="flex items-center space-x-3 p-2 hover:bg-accent rounded-md cursor-pointer"
                                        onClick={() => togglePlayerSelection(player.id)}
                                    >
                                        <Checkbox
                                            checked={selectedPlayers.includes(player.id)}
                                            onCheckedChange={() => togglePlayerSelection(player.id)}
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium">{player.fullName}</p>
                                            <p className="text-sm text-muted-foreground">{player.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    setOpenBookingDialog(false);
                                    setSelectedPlayers([]);
                                    setSelectedSlot(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="default"
                                className="flex-1"
                                onClick={handleConfirmBooking}
                                disabled={selectedPlayers.length === 0 || bookingMutation.isPending}
                            >
                                {bookingMutation.isPending ? "Booking..." : "Confirm Booking"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default EmployeeGameDetail;
