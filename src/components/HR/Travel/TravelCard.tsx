import { useNavigate } from "react-router-dom"
import type { TravelResponse } from "../../../type/Types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarClock, IndianRupee, MapPin } from "lucide-react"

function TravelCard({ travel }: { travel: TravelResponse }) {

    const navigator = useNavigate()

    const handleViewTravelDetail = () => {
        navigator(`./${travel.id}`)
    }
    return (
        <>
            <Card className="mx-auto w-full max-w-sm">
                <CardHeader>
                    <CardTitle>{travel.title}</CardTitle>
                    <CardDescription>
                        {travel.description || "No description available"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-2">
                    <div className="flex font-semibold"><span className="text-black/50"><CalendarClock className="w-5 h-5 mr-2" /></span> : {travel?.startDate.toString().substring(0, 10)} <span className="text-black/50 mx-1">to</span> {travel?.endDate.toString().substring(0, 10)}</div>
                    <div className="flex font-semibold"><span className="text-black/50"><MapPin className="w-5 h-5 mr-2" /></span> : {travel?.location}</div>
                    <div className="flex font-semibold"><span className="text-black/50"><IndianRupee className="w-5 h-5 mr-2" /></span> : ₹{travel?.maxAmountLimit}/Ex.</div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" onClick={handleViewTravelDetail}>
                        View Details
                    </Button>
                </CardFooter>
            </Card>
            {/* <div className="border-2 p-3 m-3">
                <div><span className="font-bold italic">Title</span> : {travel.title}</div>
                <div><span className="font-bold italic">Detail</span> : {travel.description || "N/A"}</div>
                <div><span className="font-bold italic">Date</span> : {travel.startDate.toString().substring(0, 10)} to {travel.endDate.toString().substring(0, 10)}</div>
                <div><span className="font-bold italic">Location</span> : {travel.location}</div>
                <div className="italic"><span className="font-bold italic">Max Amount Per Expense</span> : ₹{travel.maxAmountLimit}</div>
                <div
                    onClick={handleViewTravelDetail}
                    className="p-3 bg-slate-800 text-white font-bold rounded-2xl hover:cursor-pointer">
                    View Details
                </div>
            </div> */}
        </>

    )
}

export default TravelCard
