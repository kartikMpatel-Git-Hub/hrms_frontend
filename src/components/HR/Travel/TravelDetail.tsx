import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { GetTravelWithTravelers } from "../../../api/TravelService";
import { type TravelResponseWithTraveler } from "../../../type/Types";
import TravelerCard from "./TravelerCard";

function TravelDetail() {
    const { id } = useParams<number | any>()
    const [travel,setTravel] = useState<TravelResponseWithTraveler>()

    const queryClient = useQueryClient();
    const {
        mutate,
        isPending,
        error
    } = useMutation({
        mutationFn: GetTravelWithTravelers,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['hr-travel'] });
            setTravel(res)
        },
        onError: (err: any) => {
            console.log(err);
        },
    });

    useEffect(() => {
        mutate(Number(id))
    }, [])

    if(error)
        return (<div className="text-red-700">{error}</div>)

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
                        travel?.travelers && travel?.travelers?.length > 0 ?
                            travel?.travelers?.map((t)=>(
                                <TravelerCard traveler={t.travelerr} key={t.id}/>
                            ))
                        :
                        (
                            <div className="text-2xl font-semibold text-red-700">
                                No Travelers
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default TravelDetail
