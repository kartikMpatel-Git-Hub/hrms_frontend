import { useQuery } from "@tanstack/react-query";
import { GetHrTravel } from "../../api/TravelService";
import {  useEffect, useState } from "react";
import { type TravelResponse } from "../../type/Types";
import TravelCard from "./Travel/TravelCard";
import { CircleAlert, Loader, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

function HrTravel() {

  const [pageNumber,setPageNumber] = useState<number>(1)
  const [pageSize,setPageSize] = useState<number>(10)
  const [travels,setTravels] = useState<TravelResponse[]>()
  const navigator = useNavigate()

  const {isLoading,error,data} = useQuery({
    queryKey : ['travels'],
    queryFn : () => GetHrTravel({pageNumber,pageSize})
  })

  useEffect(()=>{
    if(data)
      setTravels(data.data)
  },[data])

  

  const handleOpenAddForm = ()=>{
    navigator(`./add`)
  }


  if(isLoading)
    return <p className='flex justify-center my-30'><Loader /> Loading...</p>
  
  if (error)
    return <p className='flex justify-center my-30'><CircleAlert /> an error occurred : {error.message}</p>

  return (
    <div>
      <div className="flex justify-end mr-3">
        <Button
          onClick={handleOpenAddForm}
          >
          <Plus className="font-bold"/> Add New Travel
        </Button>
      </div>
      <div className="flex justify-center ">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-3">
          {
            travels?.map((t)=>(
              <TravelCard travel={t} key={t.id} />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default HrTravel
