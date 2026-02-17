import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { AddTraveler, GetTravelersByName, GetTravelWithTravelers } from "../../../api/TravelService";
import { type Traveler, type TravelResponseWithTraveler } from "../../../type/Types";
import TravelerCard from "./TravelerCard";
import { CalendarClock, IndianRupee, InfoIcon, MapPin, PlaneTakeoff, Search } from "lucide-react";
import { toast, ToastContainer } from "react-toastify"
import useDebounce from "../../../hook/useDebounce";
import EmployeesCard from "./EmployeesCard";
import { ItemGroup } from "@/components/ui/item";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableCell, TableRow, TableHeader, TableBody } from "@/components/ui/table";

function TravelDetail() {
    const { id } = useParams<number | any>()
    const [travel, setTravel] = useState<TravelResponseWithTraveler>()
    const [searchTerm, setSearchTerm] = useState('');
    const [travelers, setTravelers] = useState<Traveler[]>();
    const [loading, setLoading] = useState<boolean>(true)
    const fetchedTraveler = useDebounce<Traveler>(searchTerm, 1000, () => GetTravelersByName(searchTerm));
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
    }, [fetchedTraveler, travel]);

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


    const handleOpenExpense = (travelerId: number) => {
        if (travelerId == null || travel?.id == null)
            return
        navigator(`./traveler/${travelerId}/expense`)
    }
    const handleOpenDocument = (travelerId: number) => {
        if (travelerId == null || travel?.id == null)
            return
        navigator(`./traveler/${travelerId}/document`)
    }

    if (isLoading)
        return (<div>Fetching...</div>)

    return (
        <div className="flex justify-center p-3">
            <ToastContainer position="top-right" />
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl flex gap-3"><PlaneTakeoff className="" /> {travel?.title?.toUpperCase()}</CardTitle>
                        <CardDescription>{travel?.description || "No description available"}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <div className="flex font-semibold"><span className="text-black/50"><CalendarClock className="w-5 h-5 mr-2" /></span> : {travel?.startDate.toString().substring(0, 10)} to {travel?.endDate.toString().substring(0, 10)}</div>
                        <div className="flex font-semibold"><span className="text-black/50"><MapPin className="w-5 h-5 mr-2" /></span> : {travel?.location}</div>
                        <div className="flex font-semibold"><span className="text-black/50"><IndianRupee className="w-5 h-5 mr-2" /></span> : ₹{travel?.maxAmountLimit}/Ex.</div>
                    </CardContent>

                </Card>
                <div className="font-bold flex justify-center text-2xl border-b-2 border-t-2 m-4">Travelers</div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell className="font-bold">Image</TableCell>
                            <TableCell className="font-bold">Traveler Name</TableCell>
                            <TableCell className="font-bold">Email</TableCell>
                            <TableCell className="font-bold">Designation</TableCell>
                            <TableCell className="font-bold">Action</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            travel?.travelers && travel?.travelers?.length > 0 ?
                                travel?.travelers?.map((t, idx) => (
                                    <TravelerCard
                                        traveler={t.travelerr}
                                        handleOpenExpense={handleOpenExpense}
                                        handleOpenDocument={handleOpenDocument}
                                        key={t.id} />
                                ))
                                :
                                (
                                    <TableRow>
                                        <TableCell colSpan={6} >
                                            <div className="flex justify-center font-bold text-red-700">
                                                No Travelers
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                        }
                    </TableBody>

                </Table>
                <div className="flex justify-center p-3 font-bold text-2xl border-t-2 border-b-2 m-3">
                    Search Traveler
                </div>
                <div>
                    <InputGroup className="">
                        <InputGroupInput placeholder="Search Traveler..." onChange={handleChange} value={searchTerm} />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">{travelers?.length || 0} results</InputGroupAddon>
                    </InputGroup>
                </div>
                <div className="my-4">
                    {
                        !loading
                            ? (travelers && travelers?.length > 0
                                ? (
                                    <ItemGroup className="p-3">
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
                                    </ItemGroup>
                                )
                                : (<Alert>
                                    <InfoIcon />
                                    <AlertTitle>No Travelers Found</AlertTitle>
                                    <AlertDescription>Try searching with different name</AlertDescription>
                                </Alert>)
                            )
                            : (
                                <div className="flex flex-col gap-4 p-3">
                                    {
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <SkeletonAvatar key={i} />
                                        ))
                                    }
                                </div>
                            )
                    }
                </div>
            </div>
        </div>
    )
}

function SkeletonAvatar() {
    return (
        <div className="flex w-fit items-center gap-4">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="grid gap-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
            </div>
        </div>
    )
}

export default TravelDetail
