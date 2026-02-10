import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GetHrTravel } from "../../api/TravelService";
import { useEffect, useState } from "react";
import { type TravelResponse } from "../../type/Types";
import TravelCard from "./Travel/TravelCard";

function HrTravel() {

  const queryClient = useQueryClient();
  const [pageNumber,setPageNumber] = useState<number>(1)
  const [pageSize,setPageSize] = useState<number>(5)
  const [travels,setTravels] = useState<TravelResponse[]>([])

  const {
    mutate,
    isPending,
  } = useMutation({
    mutationFn: GetHrTravel, 
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['hr-travel'] });
      console.log(res);
      setTravels(res.data)
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Login failed. Please try again.';
    },
  });

  useEffect(()=>{
    mutate({pageNumber, pageSize})
    return ()=>{
      console.log("unmount");
    }
  },[])

  return (
    <div className="flex justify-center">
      <div className="flex gap-3">
        {
          travels.map((t)=>(
            <TravelCard travel={t} key={t.id} />
          ))
        }
      </div>
    </div>
  )
}

export default HrTravel
