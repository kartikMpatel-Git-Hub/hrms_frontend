import { useQuery } from "@tanstack/react-query"
import { GetDepartments } from "../../../api/DepartmentService"
import { useEffect, useState } from "react"
import { type DepartmentResponseDto } from "../../../type/Types"
import { Loader, Plus } from "lucide-react"
import DepartmentCard from "./DepartmentCard"
import { useNavigate } from "react-router-dom"

function Department() {

    const [departments, setDepartments] = useState<DepartmentResponseDto[]>()
    const navigator = useNavigate()
    const { isLoading, data, error } = useQuery({
        queryKey: ["departments"],
        queryFn: GetDepartments
    })

    useEffect(() => {
        if (data) {
            setDepartments(data)
        }
    }, [data])

    const handleOpenAddForm = ()=>{
        navigator("./add")
    }

    if (isLoading)
        return (<div className="flex justify-center"><Loader /> Loading...</div>)

    return (
        <div>
            <div className="flex justify-end">
                <div
                    onClick={handleOpenAddForm}
                    title="Add New Department"
                    className="p-3 bg-slate-800 text-white m-3 rounded-2xl hover:cursor-pointer flex">
                    <Plus className="font-bold" />
                </div>
            </div>
            <div className="flex justify-center m-3">
                <div>
                    <table className="border-2">
                        <td className='border-2 p-3 font-bold'>ID</td>
                        <td className='border-2 p-3 font-bold'>Department</td>
                        <td className='border-2 p-3 font-bold'>Action</td>
                        <tbody>
                            {
                                departments && departments?.map(d => (
                                    <DepartmentCard department={d} key={d.id} />
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Department
