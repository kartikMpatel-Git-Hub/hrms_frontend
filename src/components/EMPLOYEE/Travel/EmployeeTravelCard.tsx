import { useNavigate } from 'react-router-dom'
import type { TravelResponse } from '../../../type/Types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IndianRupee, MapPin, CalendarClock, Files } from 'lucide-react'
import { TableCell, TableRow } from '@/components/ui/table'

function EmployeeTravelCard({ travel, idx }: { travel: TravelResponse, idx: number }) {
    const navigator = useNavigate()

    const handleViewTravelExpense = () => {
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
        <TableRow key={travel.id} className="hover:bg-muted/50">
            <TableCell className="font-medium">{idx + 1}</TableCell>
            <TableCell className="font-medium">{travel.title}</TableCell>
            <TableCell className="text-sm text-gray-600">{travel.location}</TableCell>
            <TableCell className="text-sm">{formatDate(travel.startDate)}</TableCell>
            <TableCell className="text-sm">{formatDate(travel.endDate)}</TableCell>
            <TableCell>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-semibold">
                    ₹{travel.maxAmountLimit.toLocaleString()}
                </span>
            </TableCell>
            <TableCell>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleViewTravelExpense}
                        title="View Expenses"
                    >
                        <IndianRupee className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleViewTravelDocuments}
                        title="View Documents"
                    >
                        <Files className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    )
}

export default EmployeeTravelCard
