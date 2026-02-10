import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { GetTravelWithTravelers } from "../../../api/TravelService";
import { type TravelResponseWithTraveler } from "../../../type/Types";
import TravelerCard from "./TravelerCard";

function TravelDetail() {
    const { id } = useParams()
    console.log(id);
    const [travel,setTravel] = useState<TravelResponseWithTraveler>()

    const queryClient = useQueryClient();
    const {
        mutate,
        isPending,
    } = useMutation({
        mutationFn: GetTravelWithTravelers,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['hr-travel'] });
            console.log(res);
            setTravel(res)
        },
        onError: (err: any) => {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                'Login failed. Please try again.';
        },
    });

    useEffect(() => {
        mutate(id)
    }, [])

    if(isPending)
        return (<div>Fetching...</div>)

    return (
        <div className="flex justify-center p-3">
            <div>
                <div><span className="font-bold italic">Title</span> : {travel?.title}</div>
                <div><span className="font-bold italic">Detail</span> : {travel?.description || "N/A"}</div>
                <div><span className="font-bold italic">Date</span> : {travel?.startDate.toString().substring(0, 10)} to {travel?.endDate.toString().substring(0, 10)}</div>
                <div><span className="font-bold italic">Location</span> : {travel?.location}</div>
                <div className="italic"><span className="font-bold italic">Max Amount Per Expense</span> : ₹{travel?.maxAmountLimit}</div>
                <div className="font-bold flex justify-center text-2xl border-b-2 border-t-2 m-4">Travelers</div>
                <div className="flex gap-3 justify-center">
                    {
                        travel?.travelers?.map((t)=>(
                            <TravelerCard traveler={t.travelerr} key={t.id}/>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default TravelDetail
