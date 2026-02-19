import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { TravelResponse } from '../../../type/Types'
import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Eye, IndianRupee } from 'lucide-react'

function EmployeeTravelCard({ travel, idx }: { travel: TravelResponse, idx: number }) {
    const navigator = useNavigate()

    const handleViewTravelDetail = () => {
        navigator(`./${travel.id}/expense`)
    }
    return (
        <TableRow>
            <TableCell>{idx+1}</TableCell>
            <TableCell>{travel.title}</TableCell>
            <TableCell>{travel.startDate.toString().substring(0,10)}</TableCell>
            <TableCell>{travel.location}</TableCell>
            <TableCell>
                <Button onClick={handleViewTravelDetail}><IndianRupee /></Button>
            </TableCell>
        </TableRow>
    )
}

export default EmployeeTravelCard
