import { useState } from "react"
import type { DepartmentCreateDto } from "../../../type/Types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { CreateDepartment } from "../../../api/DepartmentService"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field"
import { ALargeSmall, AlertCircleIcon, Building2, PlaneTakeoff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
      toast.success("Department created successfully")
      navigator("../")
    },
    onError: (err: any) => {
      // console.log(err.error.details);
      toast.error(err?.error?.details || "Failed to create department")
      setError([err.error.details])
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewDepartment((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
  const handleCancleInput = () => {
    setNewDepartment({
      departmentName: ""
    })
    setError([])
  }

  return (
    <div className="m-10">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend><div className="text-2xl flex gap-2"><Building2 /> ADD DEPARTMENT</div></FieldLegend>
            <FieldDescription>
              Add New Department with minimal required information and details.
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                  <ALargeSmall className="w-4 h-4" />Department Name
                </FieldLabel>
                <Input
                  placeholder="Enter Department Name"
                  required
                  maxLength={25}
                  name="departmentName"
                  value={newDepartment.departmentName}
                  onChange={handleInputChange}
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <Field orientation="horizontal">
            <Button type="submit" disabled={isPending}>Submit</Button>
            <Button variant="outline" type="button" onClick={handleCancleInput}>
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>
      {
        error && error.length > 0 && (
          <Alert variant={"destructive"}>
            <AlertCircleIcon />
            <AlertTitle>Validation Failed</AlertTitle>
            <AlertDescription>
              {
                error.map((e) => (
                  <div>{e}</div>
                ))
              }
            </AlertDescription>
          </Alert>
        )
      }
    </div>
  )
}

export default DepartmentForm
