import { useState } from "react"
import type { DepartmentCreateDto } from "../../../type/Types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { CreateDepartment } from "../../../api/DepartmentService"

function DepartmentForm() {
  const [newDepartment, setNewDepartment] = useState<DepartmentCreateDto>({
    departmentName: ""
  })
  const [error, setError] = useState<string[]>([])
  const queryClient = useQueryClient()
  const navigator = useNavigate()
  const { mutate, isPending } = useMutation({
    mutationFn: CreateDepartment,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      navigator("../")
    },
    onError: (err: any) => {
      console.log(err.error.details);
      setError([err.error.details])
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewDepartment((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    setError([])
    if (!validateForm()) {
      return
    }
    mutate(newDepartment)
  }

  const validateForm = (): boolean => {
    if (!newDepartment.departmentName || newDepartment.departmentName.length < 2 || newDepartment.departmentName.length > 30) {
      setError(["Department name must have atleast 2 and atmost 30 character !"])
      return false
    }
    return true

  }


  return (
    <div className="flex justify-center">
      <div className="border-2 p-3 m-3 rounded-2xl">
        <div>
          <input
            type="text"
            name="departmentName"
            placeholder="Enter Department Name"
            className="border-2 m-1 w-full"
            value={newDepartment.departmentName}
            onChange={handleInputChange} />
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className={`p-3 bg-slate-800 text-white rounded-2xl hover:cursor-pointer disabled:opacity-50`}
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create Department"}
          </button>
        </div>
        <div>
          {
            error.length > 0 && (
              <div className="text-red-700">
                {error.map((err, index) => (
                  <div key={index}>{err}</div>
                ))}
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default DepartmentForm
