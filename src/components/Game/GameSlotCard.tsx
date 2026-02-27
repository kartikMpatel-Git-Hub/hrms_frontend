import type { GameSlotResponseDto } from "@/type/Types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClockIcon, UsersIcon, CheckCircle2Icon, XCircleIcon, HourglassIcon, CircleAlert, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface GameSlotCardProps {
    slot: GameSlotResponseDto;
    onBook?: (slot: GameSlotResponseDto) => void;
    onViewWaitlist?: (slotId: number) => void;
    onViewDetails?: (slotId: number) => void;
    onDelete: (slotId: number) => void;
    isDeleting?: boolean;
}

function GameSlotCard({ slot, onBook, onViewWaitlist, onViewDetails, onDelete, isDeleting }: GameSlotCardProps) {
    const { user } = useAuth();
    const isHR = user?.role?.toLowerCase() === "hr";
    const formatTime = (time: string) => time.substring(0, 5);

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "available":
                return <Badge variant="success" className="capitalize"><CheckCircle2Icon className="w-3 h-3 mr-1" />{status}</Badge>;
            case "completed":
                return <Badge variant="secondary" className="capitalize"><XCircleIcon className="w-3 h-3 mr-1" />{status}</Badge>;
            case "waiting":
                return <Badge variant="warning" className="capitalize"><HourglassIcon className="w-3 h-3 mr-1" />{status}</Badge>;
            case "booked":
                return <Badge variant="default" className="capitalize"><UsersIcon className="w-3 h-3 mr-1" />{status}</Badge>;
            default:
                return <Badge variant="outline" className="capitalize">{status}</Badge>;
        }
    };

    function isPossible() {
        if (isHR && (slot.status.toLowerCase() === "available" || slot.status.toLowerCase() === "completed")) {
            return true;
        }
        return false;
    }

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">

                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </CardTitle>
                    {isPossible() && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            title="Delete Slot"
                            disabled={isDeleting}
                            onClick={() => onDelete(slot.id)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                </div>
                <CardDescription className="flex text-sm text-yellow-800"><CircleAlert className="mr-2" /> Booking will added in queue and assigned to the Group who have highest priority</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    {getStatusBadge(slot.status)}
                </div>

                {slot.bookedAt && (
                    <div className="text-xs text-muted-foreground">
                        Booked at: {new Date(slot.bookedAt).toLocaleString()}
                    </div>
                )}

                <div className="pt-2">
                    {slot.status.toLowerCase() === "completed" ? (
                        <Button
                            variant="outline"
                            className="w-full"
                            disabled
                        >
                            Slot Completed
                        </Button>
                    ) : slot.status.toLowerCase() === "waiting" ? (
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                className=""
                                onClick={() => onViewWaitlist?.(slot.id)}
                            >
                                View Waitlist
                            </Button>
                            <Button
                                variant="default"
                                className=""
                                onClick={() => onBook?.(slot)}
                            >
                                Book Slot
                            </Button>
                        </div>
                    ) : slot.status.toLowerCase() === "available" ? (
                        <Button
                            variant="default"
                            className="w-full"
                            onClick={() => onBook?.(slot)}
                        >
                            Book Slot
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => onViewDetails?.(slot.id)}
                        >
                            View Booking Details
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default GameSlotCard;
