import { useQuery } from "@tanstack/react-query"
import { GetDepartments } from "../../../api/DepartmentService"
import { useEffect, useState } from "react"
import { type DepartmentResponseDto } from "../../../type/Types"
import { Loader, Plus } from "lucide-react"
import DepartmentCard from "./DepartmentCard"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

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
            <div className="flex justify-end mr-5">
                <Button
                    onClick={handleOpenAddForm}
                    title="Add New Department">
                    <Plus className="font-bold" /> Add Department
                </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 m-3">

                {
                    departments && departments?.map(d => (
                        <DepartmentCard department={d} key={d.id} />
                    ))
                }
            </div>
        </div>
    )
}

export default Department
