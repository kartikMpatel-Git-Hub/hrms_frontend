import { GetTodayCelebrations } from "@/api/DashboardService"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { Cake, Gift } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import type { DailyCelebrationResponseDto } from "@/type/Types"

function Dashboard() {

    const [celebrations, setCelebrations] = useState<DailyCelebrationResponseDto[]>([])
    const { data, isLoading, error } = useQuery({
        queryKey: ["daily-celebrations"],
        queryFn: GetTodayCelebrations
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
            <Gift className="h-5 w-5 text-accent" />
        )
    }

    const getEventAccent = (eventType: string) => {
        return eventType === 'Birthday'
            ? 'border-l-primary'
            : 'border-l-accent'
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

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Today's Celebrations</h1>
                    <p className="mt-2 text-muted-foreground">
                        {celebrations.length === 0
                            ? "No celebrations today"
                            : `${celebrations.length} celebration${celebrations.length !== 1 ? 's' : ''} today`}
                    </p>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <Card className="border-destructive bg-destructive/10">
                        <CardContent className="pt-6">
                            <p className="text-destructive">
                                Failed to load celebrations. Please try again later.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Celebrations Grid */}
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

                {/* Empty State */}
                {!isLoading && celebrations.length === 0 && !error && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Cake className="mb-3 h-12 w-12 text-muted-foreground" />
                            <p className="text-muted-foreground">No celebrations scheduled for today</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default Dashboard
