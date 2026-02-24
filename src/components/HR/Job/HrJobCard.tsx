import { Edit, Eye, Trash } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import type { JobResponseDto, JobUpdateDto } from "../../../type/Types"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UpdateJob } from "@/api/JobService"
import { toast } from "react-toastify"

function HrJobCard({ job, idx, handleDelete }: { job: JobResponseDto, idx: number, handleDelete: (id: number) => void }) {

    const navigator = useNavigate()
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)
    const [errors, setErrors] = useState<string[]>([])

    const initialForm = useMemo<JobUpdateDto>(() => ({
        Title: job.title,
        JobRole: job.jobRole,
        Place: job.place,
        Requirements: job.requirements,
        IsActive: job.isActive
    }), [job])

    const [form, setForm] = useState<JobUpdateDto>(initialForm)

    useEffect(() => {
        if (open) {
            setForm(initialForm)
            setErrors([])
        }
    }, [open, initialForm])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const isValidForm = () => {
        const nextErrors: string[] = []
        if (!form.Title.trim() || form.Title.trim().length < 3 || form.Title.trim().length > 50) {
            nextErrors.push("Title length must be between 3 to 50")
        }
        if (!form.JobRole.trim() || form.JobRole.trim().length < 3 || form.JobRole.trim().length > 20) {
            nextErrors.push("Job role length must be between 3 to 20")
        }
        if (!form.Place.trim() || form.Place.trim().length < 3 || form.Place.trim().length > 30) {
            nextErrors.push("Place length must be between 3 to 30")
        }
        if (!form.Requirements.trim() || form.Requirements.trim().length < 3 || form.Requirements.trim().length > 300) {
            nextErrors.push("Requirements length must be between 3 to 300")
        }
        setErrors(nextErrors)
        return nextErrors.length === 0
    }

    const { mutate, isPending } = useMutation({
        mutationKey: ["update-job", job.id],
        mutationFn: (dto: JobUpdateDto) => UpdateJob({ id: job.id, dto }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hr-jobs"] })
            toast.success("Job updated successfully")
            setOpen(false)
        },
        onError: () => {
            toast.error("Failed to update job")
        }
    })

    const handleSubmit = () => {
        if (!isValidForm()) {
            return
        }
        mutate(form)
    }


    return (
        <TableRow>
            <TableCell>{idx + 1}</TableCell>
            <TableCell>{job.title}</TableCell>
            <TableCell>{job.jobRole}</TableCell>
            <TableCell>{job.isActive ? <span className="text-green-600 font-semibold">Active</span> : <span className="text-red-500 font-semibold">Inactive</span>}</TableCell>
            <TableCell>{job.place}</TableCell>
            <TableCell className="flex gap-2">
                <Button onClick={() => navigator(`./${job.id}`)}><Eye /></Button>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button title="Edit Job"><Edit /></Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Edit Job</DialogTitle>
                            <DialogDescription>Update job information.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <Field>
                                <Label>Title</Label>
                                <Input name="Title" maxLength={40} value={form.Title} onChange={handleInputChange} />
                            </Field>
                            <Field>
                                <Label>Job Role</Label>
                                <Input name="JobRole" maxLength={15} value={form.JobRole} onChange={handleInputChange} />
                            </Field>
                            <Field>
                                <Label>Place</Label>
                                <Input name="Place" maxLength={25} value={form.Place} onChange={handleInputChange} />
                            </Field>
                            <Field>
                                <Label>Requirements</Label>
                                <Textarea name="Requirements" maxLength={250} value={form.Requirements} onChange={handleInputChange} />
                            </Field>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={form.IsActive}
                                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, IsActive: checked === true }))}
                                />
                                <span className="text-sm">Active</span>
                            </div>
                        </div>
                        {errors.length > 0 && (
                            <div className="text-sm text-red-600">
                                {errors.map((err, index) => (
                                    <div key={index}>{err}</div>
                                ))}
                            </div>
                        )}
                        <DialogFooter>
                            <Button onClick={handleSubmit} disabled={isPending}>
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Button onClick={() => handleDelete(job.id)}><Trash /></Button>
            </TableCell>
        </TableRow>
    )
}

export default HrJobCard
