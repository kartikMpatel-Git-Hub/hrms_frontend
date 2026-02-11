import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { AddTraveler, GetTravelWithTravelers } from "../../../api/TravelService";
import { type Traveler, type TravelResponseWithTraveler } from "../../../type/Types";
import TravelerCard from "./TravelerCard";
import { Loader } from "lucide-react";
import { toast, ToastContainer } from "react-toastify"
import useDebounce from "../../../hook/useDebounce";
import EmployeesCard from "./EmployeesCard";

function TravelDetail() {
    const { id } = useParams<number | any>()
    const [travel, setTravel] = useState<TravelResponseWithTraveler>()
    const [searchTerm, setSearchTerm] = useState('');
    const [travelers, setTravelers] = useState<Traveler[]>();
    const [loading, setLoading] = useState<boolean>(true)
    const fetchedTraveler = useDebounce(searchTerm, 1000);
    const navigator = useNavigate()

    const queryClient = useQueryClient();
    const {
        mutate,
        isPending,
        error
    } = useMutation({
        mutationFn: AddTraveler,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['travel'] });
        },
        onError: (err: any) => {
            toast.error(err.error.details)
        },
    });

    const { isLoading, data } = useQuery({
        queryKey: ["travel"],
        queryFn: () => GetTravelWithTravelers(Number(id))
    })

    useEffect(() => {
        if (data) {
            setTravel(data)
        }
    }, [data])


    useEffect(() => {
        if (fetchedTraveler) {
            var filteredTraveler =
                fetchedTraveler
                    .filter(
                        (ft) => travel?.travelers.every((t) => t.travelerr.id !== ft.id) ?? true
                    )
            setTravelers(filteredTraveler)
        }
        setLoading(false)
    }, [fetchedTraveler,travel]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = e.target
        setSearchTerm(value)
        setLoading(true)
    }

    const handleAddTraveler = (travelerId: number) => {
        const travelId = travel?.id
        if (!travelId)
            return
        mutate({ travelId, travelerId })
    }

    const handleOpenExpense = (travelerId : number) => {
        if(travelerId == null || travel?.id == null)
            return
        navigator(`./traveler/${travelerId}/expense`)
    }

    if (isLoading)
        return (<div>Fetching...</div>)

    return (
        <div className="flex justify-center p-3">
            <ToastContainer position="top-right" />
            <div>
                <div><span className="font-bold italic">Title</span> : {travel?.title}</div>
                <div><span className="font-bold italic">Detail</span> : {travel?.description || "N/A"}</div>
                <div><span className="font-bold italic">Date</span> : {travel?.startDate.toString().substring(0, 10)} to {travel?.endDate.toString().substring(0, 10)}</div>
                <div><span className="font-bold italic">Location</span> : {travel?.location}</div>
                <div className="italic"><span className="font-bold italic">Max Amount Per Expense</span> : ₹{travel?.maxAmountLimit}</div>
                <div className="font-bold flex justify-center text-2xl border-b-2 border-t-2 m-4">Travelers</div>
                <div>
                    
                </div>
                <div className="flex gap-3 justify-center">
                    {
                        travel?.travelers && travel?.travelers?.length > 0 ?
                            travel?.travelers?.map((t) => (
                                <TravelerCard 
                                    traveler={t.travelerr} 
                                    handleOpenExpense={handleOpenExpense}
                                    key={t.id} />
                            ))
                            :
                            (
                                <div className="text-2xl font-semibold text-red-700">
                                    No Travelers
                                </div>
                            )
                    }
                </div>
                <div className="flex justify-center p-3 font-bold text-2xl border-t-2 border-b-2 m-3">
                    Search Traveler
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Search Employee..."
                        className="border-2 w-full"
                        value={searchTerm}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    {
                        !loading
                            ? (travelers && travelers?.length > 0
                                ? (
                                    <div className="p-3">
                                        {
                                            travelers?.map((t) => (
                                                <EmployeesCard 
                                                    key={t.id}
                                                    t={t} 
                                                    handleAddTraveler={handleAddTraveler}
                                                    isPending={isPending}
                                                    />
                                            ))
                                        }
                                    </div>
                                )
                                : (<div>-Not Found-</div>)
                            )
                            : (<div className="flex justify-center"><Loader /> Fetching...</div>)
                    }
                </div>
            </div>
        </div>
    )
}

export default TravelDetail
