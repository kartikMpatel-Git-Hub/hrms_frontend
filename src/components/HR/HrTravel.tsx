import { useQuery } from "@tanstack/react-query";
import { GetHrTravel } from "../../api/TravelService";
import { useEffect, useState } from "react";
import { type TravelResponse } from "../../type/Types";
import TravelCard from "./Travel/TravelCard";
import { Briefcase, CircleAlert, Eye, Loader, PlaneTakeoff, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { Field } from "../ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";

function HrTravel() {

  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [travels, setTravels] = useState<TravelResponse[]>()
  const [filteredTravels, setFilteredTravels] = useState<TravelResponse[]>()
  const [search, setSearch] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const navigator = useNavigate()

  const { isLoading, error, data } = useQuery({
    queryKey: ['travels'],
    queryFn: () => GetHrTravel({ pageNumber, pageSize })
  })

  useEffect(() => {
    setLoading(true)
    if (data) {
      if (search.trim() === "") {
        setTravels(data.data)
        setFilteredTravels(data.data)
      } else {
        const filtered = data.data?.filter(
          t =>
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.location.toLowerCase().includes(search.toLowerCase()))
        setFilteredTravels(filtered)
      }
    }
    setTimeout(() => {
      setLoading(false)
    }, 500);
  }, [data, search])

  const handleOpenAddForm = () => {
    navigator(`./add`)
  }


  if (isLoading)
    return <p className='flex justify-center my-30'><Loader /> Loading...</p>

  if (error)
    return <p className='flex justify-center my-30'><CircleAlert /> an error occurred : {error.message}</p>

  return (
    <div>
      <div className="flex justify-end mr-3">
        <Button
          onClick={handleOpenAddForm}
        >
          <Plus className="font-bold" /> Add Travel
        </Button>
      </div>
      <div>
      </div>
      <Card className="m-2">
        <div className="flex justify-center font-bold text-2xl gap-1 mx-10"><PlaneTakeoff className="h-8" /><span>Travel List</span></div>
        <div className="mx-10">
          <InputGroup className="">
            <InputGroupInput placeholder="Search Travel..." onChange={(e) => setSearch(e.target.value)} value={search} />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">{travels?.length || 0} Results</InputGroupAddon>
          </InputGroup>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="font-bold">Sr. No</TableCell>
                <TableCell className="font-bold">Travel Name</TableCell>
                <TableCell className="font-bold">Destination</TableCell>
                <TableCell className="font-bold">Start Date</TableCell>
                <TableCell className="font-bold">End Date</TableCell>
                <TableCell className="font-bold">Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                !loading ? (
                  filteredTravels && filteredTravels?.length > 0
                    ? filteredTravels.map((t, idx) => (
                      <TravelCard travel={t} key={t.id} idx={idx} />
                    ))
                    :
                    <TableRow>
                      <TableCell colSpan={5} >
                        <div className="flex justify-center font-bold">
                          No Travel Found !
                        </div>
                      </TableCell>
                    </TableRow>
                ) : (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="flex gap-2">
                        <Skeleton className="h-8 w-8" />
                      </TableCell>
                    </TableRow>
                  ))
                )

              }
            </TableBody>
          </Table>
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-3">
          {
            travels?.map((t)=>(
              <TravelCard travel={t} key={t.id} />
            ))
          }
        </div> */}
      </Card>
    </div>
  )
}

export default HrTravel
