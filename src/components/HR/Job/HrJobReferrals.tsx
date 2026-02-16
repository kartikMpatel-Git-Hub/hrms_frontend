import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

function HrJobReferrals() {
    const { id } = useParams()
    const [referrals, setReferrals] = useState()
    const navigator = useNavigate()
    return (
        <div>
            Referrals will display here
        </div>
    )
}

export default HrJobReferrals
