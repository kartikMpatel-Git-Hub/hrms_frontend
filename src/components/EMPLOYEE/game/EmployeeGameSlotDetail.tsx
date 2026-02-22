import { GetGameSlot } from "@/api/GameService";
import type { GameSlotDetaildResponseDto } from "@/type/Types";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClockIcon, CalendarIcon, UsersIcon, ArrowLeftIcon, CheckCircleIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function EmployeeGameSlotDetail() {
    const { id, slotId } = useParams();
    const navigate = useNavigate();

    const { data: slotDetail, isLoading, isError } = useQuery<GameSlotDetaildResponseDto>({
        queryKey: ["game-slot-detail", id, slotId],
        queryFn: () => GetGameSlot(Number(id), Number(slotId))
    });

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
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <CheckCircleIcon className="w-5 h-5" />
                                        Booking Information
                                    </h3>
                                    <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
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
                                        <div key={playerSlot.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
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

export default EmployeeGameSlotDetail;
