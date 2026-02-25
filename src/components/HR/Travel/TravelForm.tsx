import { useState } from "react"
import type { TravelCreateRequest } from "../../../type/Types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CreateTravel } from "../../../api/TravelService"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ALargeSmall, AlertCircleIcon, CalendarClock, IndianRupee, MapPin, PlaneTakeoff, Text } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"

function TravelForm() {

    const [newTravel, setNewTravel] = useState<TravelCreateRequest>({
        Title: "",
        Description: "",
        StartDate: null,
        EndDate: null,
        Location: "",
        MaxAmountLimit: 1
    })
    const [error, setError] = useState<string[]>([])
    const queryClient = useQueryClient()
    const navigator = useNavigate()

    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const minDate = `${year}-${month}-${day}`;

    const { mutate, isPending } = useMutation({
        mutationFn: CreateTravel,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['travels'] })
            toast.success("Travel created successfully")
            navigator("../")
        },
        onError: (err: any) => {
            // console.log(err);
            toast.error("Failed to create travel")
            setError(["Failed To add Travel"])
        }
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setNewTravel((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError([])
        if (!validateForm()) {
            return
        }
        mutate(newTravel)
    }

    const validateForm = (): boolean => {
        let flag = true
        if (newTravel.Title.trim() === "" || newTravel.Location.trim() === "") {
            setError((prev) => [...prev, "Title and Location are required."])
            flag = false
        }
        if (newTravel.Title.trim().length < 5 || newTravel.Title.trim().length >= 50) {
            setError((prev) => [...prev, "Title Must contain atlest 5 charatcer and atmost 50 character"])
            flag = false
        }
        if (newTravel.Location.trim().length < 5 || newTravel.Location.trim().length >= 50) {
            setError((prev) => [...prev, "Location Must contain atlest 5 charatcer and atmost 50 character"])
            flag = false
        }
        if (newTravel.Description.trim().length < 20 || newTravel.Description.trim().length >= 300) {
            setError((prev) => [...prev, "Description Must contain atlest 20 charatcer and atmost 300 character"])
            flag = false
        }
        if (newTravel.StartDate === null || newTravel.EndDate === null) {
            setError((prev) => [...prev, "Start Date and End Date are required."])
            flag = false
        }
        if (newTravel.StartDate && newTravel.EndDate && newTravel.StartDate > newTravel.EndDate) {
            setError((prev) => [...prev, "Start Date cannot be after End Date."])
            flag = false
        }
        if (newTravel.MaxAmountLimit <= 0) {
            setError((prev) => [...prev, "Max Amount Limit cannot be negative or zero."])
            flag = false
        }
        return flag
    }


    return (

        <div className="mx-20 my-5">
            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <FieldSet>
                        <FieldLegend><div className="text-2xl flex gap-2"><PlaneTakeoff /> ADD TRAVEL</div></FieldLegend>
                        <FieldDescription>
                            Add New Travel with minimal required information and details. After adding travel you can add travelers and expenses related to that travel.
                        </FieldDescription>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                    <ALargeSmall className="w-4 h-4" />Travel Title
                                </FieldLabel>
                                <Input
                                    placeholder="Enter Travel Title"
                                    required
                                    maxLength={45}
                                    name="Title"
                                    value={newTravel.Title}
                                    onChange={handleInputChange}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                                    <Text className="w-4 h-4" />Travel Description
                                </FieldLabel>
                                <Textarea
                                    placeholder="Enter Travel Description"
                                    required
                                    maxLength={290}
                                    name="Description"
                                    value={newTravel.Description}
                                    onChange={handleInputChange}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                                    <MapPin className="w-4 h-4" /> Travel Location
                                </FieldLabel>
                                <Input
                                    placeholder="Enter Travel Location"
                                    required
                                    name="Location"
                                    maxLength={45}
                                    value={newTravel.Location}
                                    onChange={handleInputChange}
                                />
                            </Field>
                            <Field className="">
                                <div className="flex">
                                    <div>
                                        <div className="flex mx-2 gap-1 text-sm">
                                            <CalendarClock className="w-4 h-4 m-1" /> Start Date
                                        </div>
                                        <div>
                                            <input
                                                type="date"
                                                name="StartDate"
                                                min={minDate}
                                                required={true}
                                                value={newTravel.StartDate ? newTravel.StartDate.toString().substring(0, 10) : ""}
                                                onChange={handleInputChange}
                                                className="border-1 shadow-2xl shadow-black/50 text-black/50 p-1 m-1 rounded-sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex mx-2 gap-1 text-sm">
                                            <CalendarClock className="w-4 h-4 m-1" /> End Date
                                        </div>
                                        <div>
                                            <input
                                                type="date"
                                                name="EndDate"
                                                min={minDate}
                                                required={true}
                                                value={newTravel.EndDate ? newTravel.EndDate.toString().substring(0, 10) : ""}
                                                onChange={handleInputChange}
                                                className="border-1 shadow-2xl shadow-black/50 text-black/50 p-1 m-1 rounded-sm" />
                                        </div>
                                    </div>
                                </div>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="checkout-7j9-card-number-uw1">
                                    <IndianRupee className="w-4 h-4" /> Max Amount Per Day
                                </FieldLabel>
                                <Input
                                    placeholder="Enter Max Amount Limit"
                                    required
                                    name="MaxAmountLimit"
                                    type="number"
                                    min={1}
                                    value={newTravel.MaxAmountLimit}
                                    onChange={handleInputChange}
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSeparator />
                    <Field orientation="horizontal">
                        <Button type="submit" disabled={isPending}>Submit</Button>
                        <Button variant="outline" type="button">
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

export default TravelForm
