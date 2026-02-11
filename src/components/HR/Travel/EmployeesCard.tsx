import { Plus } from 'lucide-react'
import type { Traveler } from '../../../type/Types'

interface EmployeesCardProps{
    t : Traveler,
    handleAddTraveler : (id : number) => void,
    isPending : boolean
}

function EmployeesCard({t,handleAddTraveler,isPending}:EmployeesCardProps) {
    return (
        <div className="flex gap-3 border-2 m-2 justify-between">
            <div className="p-3"><img src={t.image} className="w-10" /></div>
            <div>
                <div className="font-bold">{t.fullName}</div>
                <div>{t.email}</div>
            </div>
            <div className="p-3">
                <button
                    title="Add Traveler"
                    onClick={() => handleAddTraveler(t.id)}
                    className="border-2 rounded-2xl h-fit m-auto hover:cursor-pointer hover:bg-slate-800 hover:text-white hover:border-slate-800 disabled:opacity-50"
                    disabled={isPending}
                >
                    <Plus />
                </button>
            </div>
        </div>
    )
}

export default EmployeesCard
