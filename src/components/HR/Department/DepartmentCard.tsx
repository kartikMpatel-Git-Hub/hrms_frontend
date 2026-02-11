import { ArrowUpRight, Trash } from 'lucide-react'
import type { DepartmentResponseDto } from '../../../type/Types'
import { useNavigate } from 'react-router-dom'

function DepartmentCard({ department }: { department: DepartmentResponseDto }) {

    const navigator = useNavigate()

    const handleOpenDepartment = ()=>{
        navigator(`./${department.id}`)
    }
    return (
        <tr>
            <td className='border-2 p-3'>{department.id}</td>
            <td className='border-2 p-3'>{department.departmentName}</td>
            <td className='border-b-2 p-3 flex gap-3'>
                <button
                    className='bg-slate-800 p-2 text-white rounded-2xl flex'
                    onClick={handleOpenDepartment}
                    title='View Department'
                >
                    <ArrowUpRight />
                </button>
            </td>
        </tr>
    )
}

export default DepartmentCard
