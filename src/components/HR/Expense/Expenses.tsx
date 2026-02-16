import { Button } from "@/components/ui/button"
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
            <div className="flex justify-end mx-5 gap-4">
                <Button
                    onClick={handleOpenCategory}
                    title="View Expense Category">
                    <Eye />
                </Button>
                <Button
                    onClick={handleOpenAddForm}
                    title="Add New Expense Category">
                    <Plus className="font-bold" />
                </Button>
            </div>
        </div>
    )
}

export default Expenses
