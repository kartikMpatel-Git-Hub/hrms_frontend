import { ALargeSmall, Briefcase, Eye, MapPin } from "lucide-react"
import type { JobResponseDto } from "../../../type/Types"
import { useNavigate } from "react-router-dom"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function HrJobCard({ job }: { job: JobResponseDto }) {

    const navigator = useNavigate()
    const handleOpenJob = () => {
        navigator(`./${job.id}`)
    }

    return (
        <>
            <Card className="relative mx-auto w-full max-w-sm p-3 ">
                <CardHeader>
                    <CardAction>
                        <div className={`${job.isActive ? "bg-green-700" : "bg-red-500"} p-1 rounded-sm font-bold text-sm text-white`}>{job.isActive ? "Active" : "Inactive"}</div>
                    </CardAction>
                    <CardTitle>
                        <div className="flex gap-1 font-bold text-black/90">
                            <Briefcase className="w-4 h-4 inline " />
                            {job.title}
                        </div>
                    </CardTitle>
                    <div className="text-black/50 text-sm flex gap-1"><MapPin className="w-4 h-4 mt-0.5" /> {job.place}</div>
                    <CardDescription>
                        <div className="flex gap-1 text-black/60">
                            <ALargeSmall className="w-4 h-4 inline " />
                            {job.requirements}
                        </div>
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full" onClick={() => handleOpenJob()}><Eye /> View</Button>
                </CardFooter>
            </Card>
            
        </>
    )
}

export default HrJobCard
