import { Eye, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

function Expenses() {

    const navigator = useNavigate()

    const handleOpenAddForm = ()=>{
        navigator("./category/add")
    }

    const handleOpenCategory = ()=>{
        navigator("./category")
    }

    return (
        <div>
            <div className="flex justify-end">
                <div
                    onClick={handleOpenCategory}
                    title="View Expense Category"
                    className="p-3 bg-slate-800 text-white m-3 rounded-2xl hover:cursor-pointer flex">
                    <Eye />
                </div>
                <div
                    onClick={handleOpenAddForm}
                    title="Add New Expense Category"
                    className="p-3 bg-slate-800 text-white m-3 rounded-2xl hover:cursor-pointer flex">
                    <Plus className="font-bold" />
                </div>
            </div>
        </div>
    )
}

export default Expenses
