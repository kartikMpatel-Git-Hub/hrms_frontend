import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { GetTravelById } from "@/api/TravelService"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CalendarClock, IndianRupee, MapPin, PlaneTakeoff } from "lucide-react"
import type { TravelResponse } from "@/type/Types"

function EmployeeTravelDetails() {
  const { id } = useParams<{ id: string }>()
  const travelId = parseInt(id || "0", 10)
  const navigate = useNavigate()

  const { data: travel, isLoading } = useQuery<TravelResponse>({
    queryKey: ["travel", travelId],
    queryFn: () => GetTravelById(travelId),
    enabled: travelId > 0
  })

  if (isLoading) {
    return (
      <div className="flex justify-center p-3">
        <div>Loading...</div>
      </div>
    )
  }

  if (!travel) {
    return (
      <div className="flex justify-center p-3">
        <div className="text-red-700 font-bold">Travel not found</div>
      </div>
    )
  }

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-3xl">
        <Button variant="outline" onClick={() => navigate("../")} className="mb-6">
          <ArrowLeft size={18} /> Back
        </Button>
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-4xl flex gap-3 items-center mb-3">
              <PlaneTakeoff size={36} /> {travel.title.toUpperCase()}
            </CardTitle>
            <CardDescription className="text-base">{travel.description || "No description available"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <CalendarClock className="w-7 h-7 text-black/50 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-black/60 font-medium mb-1">Travel Duration</p>
                  <p className="text-xl font-semibold">{new Date(travel.startDate).toLocaleDateString()} to {new Date(travel.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <MapPin className="w-7 h-7 text-black/50 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-black/60 font-medium mb-1">Location</p>
                  <p className="text-xl font-semibold">{travel.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <IndianRupee className="w-7 h-7 text-black/50 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-black/60 font-medium mb-1">Max Amount Limit</p>
                  <p className="text-xl font-semibold">₹{travel.maxAmountLimit.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EmployeeTravelDetails
