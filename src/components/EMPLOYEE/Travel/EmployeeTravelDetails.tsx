import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { GetTravelWithTravelers } from "@/api/TravelService"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CalendarClock, IndianRupee, MapPin, PlaneTakeoff, Users, Mail, Briefcase } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { TravelResponseWithTraveler } from "@/type/Types"

function EmployeeTravelDetails() {
  const { id } = useParams<{ id: string }>()
  const travelId = parseInt(id || "0", 10)
  const navigate = useNavigate()

  const { data: travel, isLoading } = useQuery<TravelResponseWithTraveler>({
    queryKey: ["travel", travelId],
    queryFn: () => GetTravelWithTravelers(travelId),
    enabled: travelId > 0,
  })

  const getTravelStatus = () => {
    if (!travel) return null
    const now = new Date()
    const start = new Date(travel.startDate)
    const end = new Date(travel.endDate)
    if (now < start) return { label: "Upcoming", variant: "outline" as const }
    if (now >= start && now <= end) return { label: "Ongoing", variant: "default" as const }
    return { label: "Completed", variant: "secondary" as const }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <div className="w-full max-w-4xl space-y-6">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-56 w-full rounded-lg" />
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  if (!travel) {
    return (
      <div className="flex justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Travel not found</AlertTitle>
          <AlertDescription>The requested travel record does not exist or you don't have access.</AlertDescription>
        </Alert>
      </div>
    )
  }

  const status = getTravelStatus()

  return (
    <div className="flex justify-center p-3 md:p-6">
      <div className="w-full max-w-4xl space-y-6">
        <Button variant="outline" onClick={() => navigate("../")}>
          <ArrowLeft size={18} /> Back
        </Button>

        {/* Travel Info Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-2xl flex gap-3 items-center">
                <PlaneTakeoff className="text-primary" size={28} /> {travel.title.toUpperCase()}
              </CardTitle>
              {status && <Badge variant={status.variant}>{status.label}</Badge>}
            </div>
            <CardDescription className="text-base mt-1">
              {travel.description || "No description available"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <CalendarClock className="w-6 h-6 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Duration</p>
                <p className="font-semibold">
                  {new Date(travel.startDate).toLocaleDateString()} – {new Date(travel.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <MapPin className="w-6 h-6 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Location</p>
                <p className="font-semibold">{travel.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <IndianRupee className="w-6 h-6 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Budget / Person</p>
                <p className="font-semibold">₹{travel.maxAmountLimit.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Travelers Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="text-primary" size={22} /> Travelers
              <Badge variant="secondary" className="ml-auto">{travel.travelers?.length || 0}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {travel.travelers && travel.travelers.length > 0 ? (
              <div className="rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="font-bold">Traveler</TableCell>
                      <TableCell className="font-bold hidden sm:table-cell">Email</TableCell>
                      <TableCell className="font-bold hidden md:table-cell">Designation</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {travel.travelers.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={t.travelerr.image} alt={t.travelerr.fullName} />
                              <AvatarFallback>
                                {t.travelerr.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium leading-none">{t.travelerr.fullName}</p>
                              <p className="text-sm text-muted-foreground sm:hidden mt-1">{t.travelerr.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            {t.travelerr.email}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Briefcase className="h-4 w-4" />
                            {t.travelerr.designation}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <Alert>
                <Users className="h-4 w-4" />
                <AlertTitle>No travelers yet</AlertTitle>
                <AlertDescription>No travelers have been assigned to this trip.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EmployeeTravelDetails
