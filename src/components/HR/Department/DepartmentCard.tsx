import { ArrowUpRight, Trash } from 'lucide-react'
import type { DepartmentResponseDto } from '../../../type/Types'
import { useNavigate } from 'react-router-dom'

function DepartmentCard({ department }: { department: DepartmentResponseDto }) {

    const navigator = useNavigate()

    const handleOpenDepartment = ()=>{
        navigator(`./${department.id}`)
    }
    return (
        <div className='grid grid-cols-4 gap-4 p-4'>
            <div>{department.id}</div>
            <div>{department.departmentName}</div>
            <div>
                <button
                    className='bg-slate-800 p-2 text-white rounded-2xl flex'
                    onClick={handleOpenDepartment}
                    title='View Department'
                >
                    <ArrowUpRight />
                </button>
            </div>
        </div>
    )
}

export default DepartmentCard
