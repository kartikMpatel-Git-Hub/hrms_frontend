import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useEffect } from "react";

function Welcome() {
    const { user } = useAuth()
    const navigator = useNavigate();

    useEffect(()=>{
        if(!user){
            navigator("../")
        }
        return ()=>{
            console.log("Unauthorized!");
        }
    },[])


    return (
        <div>
            Welcome ! {user?.role}
        </div>
    )
}

export default Welcome
