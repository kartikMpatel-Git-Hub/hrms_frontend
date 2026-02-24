import { GetTodayCelebrations, GetUpcomingBookings } from "@/api/DashboardService"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { Cake, Gift } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import type { DailyCelebrationResponseDto, UpcomingBookingResponseDto } from "@/type/Types"

function Dashboard() {

    const [celebrations, setCelebrations] = useState<DailyCelebrationResponseDto[]>([])
    const { data, isLoading, error } = useQuery({
        queryKey: ["daily-celebrations"],
        queryFn: GetTodayCelebrations
    })

    const { data: upcomingData, isLoading: isUpcomingLoading, error: upcomingError } = useQuery({
        queryKey: ["upcoming-bookings"],
        queryFn: GetUpcomingBookings
    })

    useEffect(() => {
        if (data) {
            setCelebrations(Array.isArray(data) ? data : [])
        }
    }, [data])

    const getEventIcon = (eventType: string) => {
        return eventType === 'Birthday' ? (
            <Cake className="h-5 w-5 text-primary" />
        ) : (
            <Gift className="h-5 w-5 text-primary" />
        )
    }

    const getEventAccent = (eventType: string) => {
        return eventType === 'Birthday'
            ? 'border-l-primary'
            : 'border-l-primary'
    }

    const getEventLabel = (eventType: string) => {
        return eventType === 'Birthday' ? '🎂 Birthday' : '🎉 Work Anniversary'
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    }

    // const formatTime = (dateString: string) => {
    //     const date = new Date(dateString)
    //     return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    // }

    const uniqueUpcomingBookings = useMemo<UpcomingBookingResponseDto[]>(() => {
        if (!Array.isArray(upcomingData)) {
            return []
        }
        const sorted = [...upcomingData].sort((a, b) => {
            const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime()
            if (dateDiff !== 0) {
                return dateDiff
            }
            return a.startTime.localeCompare(b.startTime)
        })
        const unique = new Map<number, UpcomingBookingResponseDto>()
        sorted.forEach((booking) => {
            if (!unique.has(booking.game.id)) {
                unique.set(booking.game.id, booking)
            }
        })
        return Array.from(unique.values())
    }, [upcomingData])

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Today's Celebrations</h1>
                    <p className="mt-2 text-muted-foreground">
                        {celebrations.length === 0
                            ? "No celebrations today"
                            : `${celebrations.length} celebration${celebrations.length !== 1 ? 's' : ''} today`}
                    </p>
                </div>

                {isLoading && (
                    <div className="flex justify-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"></div>
                    </div>
                )}

                {error && (
                    <Card className="border-destructive bg-destructive/10">
                        <CardContent className="pt-6">
                            <p className="text-destructive">
                                Failed to load celebrations. Please try again later.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {!isLoading && celebrations.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {celebrations.map((celebration) => (
                            <Card
                                key={celebration.id}
                                className={`flex flex-col border-l-4 transition hover:shadow-lg ${getEventAccent(celebration.eventType)}`}
                            >
                                <CardHeader className="pb-3">
                                    <div className="mb-2 flex items-center gap-2">
                                        {getEventIcon(celebration.eventType)}
                                        <CardTitle className="text-base">
                                            {getEventLabel(celebration.eventType)}
                                        </CardTitle>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">
                                            {celebration.user.fullName}
                                        </p>
                                        <CardDescription className="text-xs">
                                            {celebration.user.email}
                                        </CardDescription>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-3 pt-0">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">
                                            <span className="font-semibold">Date:</span> {formatDate(celebration.eventDate.toString().substring(0, 10))}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="inline-block rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                            ID: {celebration.userId}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {!isLoading && celebrations.length === 0 && !error && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Cake className="mb-3 h-12 w-12 text-muted-foreground" />
                            <p className="text-muted-foreground">No celebrations scheduled for today</p>
                        </CardContent>
                    </Card>
                )}

                <div className="mt-12">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-foreground">Current Game Bookings</h2>
                        <p className="mt-2 text-muted-foreground">
                            {uniqueUpcomingBookings.length === 0
                                ? "No upcoming bookings"
                                : `${uniqueUpcomingBookings.length} game${uniqueUpcomingBookings.length !== 1 ? 's' : ''} with upcoming bookings`}
                        </p>
                    </div>

                    {isUpcomingLoading && (
                        <div className="flex justify-center py-8">
                            <div className="h-7 w-7 animate-spin rounded-full border-4 border-border border-t-primary"></div>
                        </div>
                    )}

                    {upcomingError && (
                        <Card className="border-destructive bg-destructive/10">
                            <CardContent className="pt-6">
                                <p className="text-destructive">
                                    Failed to load current bookings. Please try again later.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {!isUpcomingLoading && uniqueUpcomingBookings.length > 0 && (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {uniqueUpcomingBookings.map((booking) => (
                                <Card key={booking.id} className="flex flex-col transition hover:shadow-lg">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base">
                                            {booking.game.name}
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            {booking.bookedBy.fullName} • {booking.bookedBy.email}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2 pt-0">
                                        <div className="text-sm text-muted-foreground">
                                            <span className="font-semibold text-foreground">Date:</span> {formatDate(booking.date.toString())}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            <span className="font-semibold text-foreground">Time:</span> {booking.startTime.substring(0, 5)} - {booking.endTime.substring(0, 5)}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            <span className="font-semibold text-foreground">Players:</span> {booking.playerCount}
                                        </div>
                                        <div className="text-xs uppercase tracking-wide text-muted-foreground">
                                            Status: {booking.status}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {!isUpcomingLoading && uniqueUpcomingBookings.length === 0 && !upcomingError && (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-10">
                                <p className="text-muted-foreground">No current bookings scheduled</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
