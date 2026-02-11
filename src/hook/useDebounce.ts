import { useEffect, useState } from "react"
import { GetTravelersByName } from "../api/TravelService";
import type { Traveler } from "../type/Types";

function useDebounce(value : string, delay : number) {

    const [travelers, setTravelers] = useState<Traveler[]>([])
    
    useEffect(() => {
        const handler = setTimeout(async () => {
            const res : Traveler[] = await GetTravelersByName(value)
            setTravelers(res)
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return travelers;
}

export default useDebounce;
