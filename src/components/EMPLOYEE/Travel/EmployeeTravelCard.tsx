import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { TravelResponse } from '../../../type/Types'

function EmployeeTravelCard({ travel }: { travel: TravelResponse }) {
    const navigator = useNavigate()

    const handleViewTravelDetail = () => {
        navigator(`./${travel.id}/expense`)
    }
    return (
        <div className="border-2 p-3 m-3">
            <div><span className="font-bold italic">Title</span> : {travel.title}</div>
            <div><span className="font-bold italic">Detail</span> : {travel.description || "N/A"}</div>
            <div><span className="font-bold italic">Date</span> : {travel.startDate.toString().substring(0, 10)} to {travel.endDate.toString().substring(0, 10)}</div>
            <div><span className="font-bold italic">Location</span> : {travel.location}</div>
            <div className="italic"><span className="font-bold italic">Max Amount Per Expense</span> : ₹{travel.maxAmountLimit}</div>
            <div
                onClick={handleViewTravelDetail}
                className="p-3 bg-slate-800 text-white font-bold rounded-2xl hover:cursor-pointer">
                View Expense
            </div>
        </div>
    )
}

export default EmployeeTravelCard
