import { useQuery } from "@tanstack/react-query";
import { GetHrTravel } from "../../api/TravelService";
import {  useEffect, useState } from "react";
import { type TravelResponse } from "../../type/Types";
import TravelCard from "./Travel/TravelCard";
import { CircleAlert, Loader, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      <div className="flex justify-end">
        <div 
        onClick={handleOpenAddForm}
        className="p-3 bg-slate-800 text-white m-3 rounded-2xl hover:cursor-pointer flex">
          <Plus className="font-bold"/> Add New Travel
        </div>
      </div>
      <div className="flex justify-center">
        
        <div className="flex gap-3">
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
