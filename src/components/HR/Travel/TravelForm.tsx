import { useState } from "react"
import type { TravelCreateRequest } from "../../../type/Types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CreateTravel } from "../../../api/TravelService"
import { useNavigate } from "react-router-dom"

function TravelForm() {

    const [newTravel, setNewTravel] = useState<TravelCreateRequest>({
        Title: "",
        Description: "",
        StartDate: null,
        EndDate: null,
        Location: "",
        MaxAmountLimit: 0
    })
    const [error, setError] = useState<string[]>([])
    const queryClient = useQueryClient()
    const navigator = useNavigate()
    const {mutate,isPending} = useMutation({
        mutationFn : CreateTravel,
        onSuccess : (res)=>{
            queryClient.invalidateQueries({queryKey : ['travels']})
            navigator("../")
        },
        onError : (err:any)=>{
            console.log(err);
            setError(["Failed To add Travel"])
        }
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setNewTravel((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = () =>{
        setError([])
        if(!validateForm()){
            return
        }
        console.log(newTravel);
        mutate(newTravel)
    }

    const validateForm = (): boolean =>{
        let flag = true
        if(newTravel.Title.trim() === "" || newTravel.Location.trim() === ""){
            setError((prev)=>[...prev, "Title and Location are required."])
            flag = false
        }
        if(newTravel.Title.trim().length < 5 || newTravel.Title.trim().length >= 50){
            setError((prev)=>[...prev, "Title Must contain atlest 5 charatcer and atmost 50 character"])
            flag = false
        }
        if(newTravel.Description.trim().length < 20 || newTravel.Description.trim().length >= 300){
            setError((prev)=>[...prev,"Description Must contain atlest 20 charatcer and atmost 300 character"])
            flag = false
        }
        if(newTravel.StartDate === null || newTravel.EndDate === null){
            setError((prev)=>[...prev, "Start Date and End Date are required."])
            flag = false
        }
        if(newTravel.StartDate && newTravel.EndDate && newTravel.StartDate > newTravel.EndDate){
            setError((prev)=>[...prev, "Start Date cannot be after End Date."])
            flag = false
        }
        if(newTravel.MaxAmountLimit <= 0){
            setError((prev)=>[...prev, "Max Amount Limit cannot be negative or zero."])
            flag = false
        }
        return flag
    }


    return (
        <div className="flex justify-center">
            <div className="border-2 p-3 m-3 rounded-2xl">
                <div>
                    Title
                    <input 
                        type="text" 
                        name="Title" 
                        className="border-2 m-1"
                        value={newTravel.Title} 
                        onChange={handleInputChange} />
                </div>
                <div>
                    Description
                    <textarea 
                        name="Description" 
                        value={newTravel.Description} 
                        className="border-2 m-1"
                        onChange={handleInputChange} />
                </div>
                <div>
                    Start Date
                    <input 
                        type="date" 
                        name="StartDate" 
                        value={newTravel.StartDate ? newTravel.StartDate.toString().substring(0, 10) : ""} 
                        onChange={handleInputChange} 
                        className="border-2 m-1" />
                </div>
                <div>
                    End Date
                    <input 
                        type="date" 
                        name="EndDate" 
                        value={newTravel.EndDate ? newTravel.EndDate.toString().substring(0, 10) : ""} 
                        onChange={handleInputChange} 
                        className="border-2 m-1" />
                </div>
                <div>
                    Location
                    <input 
                        type="text" 
                        name="Location" 
                        value={newTravel.Location} 
                        onChange={handleInputChange} 
                        className="border-2 m-1" />
                </div>
                <div>
                    Max Amount Limit
                    <input 
                        type="number" 
                        name="MaxAmountLimit" 
                        min={0}
                        value={newTravel.MaxAmountLimit} 
                        onChange={handleInputChange} 
                        className="border-2 m-1" />
                </div>
                <div>
                    <button 
                        onClick={handleSubmit}
                        className={`p-3 bg-slate-800 text-white rounded-2xl hover:cursor-pointer disabled:opacity-50`}
                        disabled={isPending}
                        >
                            {isPending ? "Creating..." : "Create Travel" }
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

export default TravelForm
