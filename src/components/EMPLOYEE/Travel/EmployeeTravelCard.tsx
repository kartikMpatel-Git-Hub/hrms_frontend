import { useNavigate } from 'react-router-dom'
import type { TravelResponse } from '../../../type/Types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {  IndianRupee, MapPin, CalendarClock, Files } from 'lucide-react'

function EmployeeTravelCard({ travel, idx }: { travel: TravelResponse, idx: number }) {
    const navigator = useNavigate()

    const handleViewTravelDetail = () => {
        navigator(`./${travel.id}/expense`)
    }

    const handleViewTravelDocuments = () => {
        navigator(`./${travel.id}/documents`)
    }

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl">{travel.title}</CardTitle>
                        <CardDescription className="text-sm mt-1">{travel.description || "No description"}</CardDescription>
                    </div>
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded">ID: {travel.id}</span>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                        <CalendarClock className="w-5 h-5 text-black/50" />
                        <div>
                            <p className="text-xs text-black/60">Start Date</p>
                            <p className="font-semibold">{formatDate(travel.startDate)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <CalendarClock className="w-5 h-5 text-black/50" />
                        <div>
                            <p className="text-xs text-black/60">End Date</p>
                            <p className="font-semibold">{formatDate(travel.endDate)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-black/50" />
                        <div>
                            <p className="text-xs text-black/60">Location</p>
                            <p className="font-semibold">{travel.location}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <IndianRupee className="w-5 h-5 text-black/50" />
                        <div>
                            <p className="text-xs text-black/60">Max Amount</p>
                            <p className="font-semibold">₹{travel.maxAmountLimit.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 pt-2">
                    <Button onClick={handleViewTravelDetail} className="flex-1" variant="outline">
                        <IndianRupee size={18} /> View Expenses
                    </Button>
                    <Button onClick={handleViewTravelDocuments} className="flex-1" variant="outline">
                        <Files size={18} /> View Documents
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default EmployeeTravelCard
