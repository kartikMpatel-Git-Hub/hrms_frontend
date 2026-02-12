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
            console.log(data);
            setDepartments(data)
        }
    }, [data])

    const handleOpenAddForm = () => {
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
            <div className="flex justify-center">
                <div className="border-2 m-2">
                    <div className="grid grid-cols-4 gap-4 p-4 font-bold">
                        <div>ID</div>
                        <div>Department</div>
                        <div>Action</div>
                    </div>
                    <hr />
                    {
                        departments && departments?.map(d => (
                            <DepartmentCard department={d} key={d.id} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Department
