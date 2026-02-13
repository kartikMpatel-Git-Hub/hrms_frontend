import { useEffect, useState } from "react"
import type { Traveler } from "../type/Types";

function useDebounce<T>(value : string, delay : number,fn : (value : string) => any) {

    const [response, setResponse] = useState<T[]>([])
    
    useEffect(() => {
        const handler = setTimeout(async () => {
            const res : T[] = await fn(value)
            setResponse(res)
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return response;
}

export default useDebounce;
