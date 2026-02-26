import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { AddTraveler, GetTravelersByName, GetTravelWithTravelers } from "../../../api/TravelService";
import { type Traveler, type TravelResponseWithTraveler } from "../../../type/Types";
import TravelerCard from "./TravelerCard";
import EditTravelForm from "./EditTravelForm";
import { CalendarClock, IndianRupee, InfoIcon, MapPin, PlaneTakeoff, Search, Pencil } from "lucide-react";
import { toast } from "sonner"
import useDebounce from "../../../hook/useDebounce";
import EmployeesCard from "./EmployeesCard";
import { ItemGroup } from "@/components/ui/item";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableCell, TableRow, TableHeader, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

function TravelDetail() {
    const { id } = useParams<number | any>()
    const [travel, setTravel] = useState<TravelResponseWithTraveler>()
    const [searchTerm, setSearchTerm] = useState('');
    const [travelers, setTravelers] = useState<Traveler[]>();
    const [loading, setLoading] = useState<boolean>(true)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
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
            queryClient.invalidateQueries({ queryKey: ['travel', id] });
            toast.success("Traveler added successfully")
        },
        onError: (err: any) => {
            toast.error(err.error.details)
        },
    });

    const { isLoading, data } = useQuery({
        queryKey: ["travel", id],
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
        // traveler/:travelerId/expense
    }
    const handleOpenDocument = (travelerId: number) => {
        if (travelerId == null || travel?.id == null)
            return
        navigator(`./traveler/${travelerId}/document`)
    }

    if (isLoading)
        return (
            <div className="flex justify-center p-6">
                <div className="w-full max-w-5xl space-y-4">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-8 w-48 mx-auto" />
                    <Skeleton className="h-64 w-full rounded-lg" />
                </div>
            </div>
        )

    return (
        <div className="flex justify-center p-3">
            <div className="w-full max-w-5xl">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-2xl flex gap-3"><PlaneTakeoff /> {travel?.title?.toUpperCase()}</CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditDialogOpen(true)}
                            >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        </div>
                        <CardDescription>{travel?.description || "No description available"}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 font-semibold"><CalendarClock className="w-5 h-5 text-muted-foreground" /> <span className="text-muted-foreground">:</span> {travel?.startDate.toString().substring(0, 10)} to {travel?.endDate.toString().substring(0, 10)}</div>
                        <div className="flex items-center gap-2 font-semibold"><MapPin className="w-5 h-5 text-muted-foreground" /> <span className="text-muted-foreground">:</span> {travel?.location}</div>
                        <div className="flex items-center gap-2 font-semibold"><IndianRupee className="w-5 h-5 text-muted-foreground" /> <span className="text-muted-foreground">:</span> ₹{travel?.maxAmountLimit}/Ex.</div>
                    </CardContent>
                </Card>
                <div className="font-bold flex justify-center text-2xl border-b-2 border-t-2 border-border m-4 py-2">Travelers</div>
                <div className="rounded-lg border border-border">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
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
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={5} >
                                            <div className="flex justify-center font-semibold text-destructive">
                                                No Travelers
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                        }
                    </TableBody>
                </Table>
                </div>
                <div className="flex justify-center p-3 font-bold text-2xl border-t-2 border-b-2 border-border m-3">
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
            <EditTravelForm
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                travel={travel || null}
            />
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
