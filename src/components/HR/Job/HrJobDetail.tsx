import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { GetJobById } from "../../../api/JobService"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import type { JobResponseWithReviewerDto } from "../../../type/Types"
import ContactToCard from "./ContactToCard"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TableBody, TableCell, TableHeader, TableRow, Table } from "@/components/ui/table"
import ReviewerCard from "./ReviewerCard"

function HrJobDetail() {
    const { id } = useParams()
    const [job, setJob] = useState<JobResponseWithReviewerDto>()
    const navigator = useNavigate()

    const { data, error, isLoading } = useQuery({
        queryKey: ["job-detail"],
        queryFn: () => GetJobById(Number(id))
    })

    useEffect(() => {
        if (data) {
            console.log(data);
            setJob(data)
        }
    }, [data])

    if (isLoading) {
        return (
            <div className="flex gap-2">
                <Loader /> Loading...
            </div>
        )
    }

    const handleDownloadJD = () => {
        if (job?.jdUrl) {

        }
    }

    const handleOpenReferral = () => {
        navigator(`./referrals`)
    }

    return (
        <div className="flex justify-center p-5">
            <div className="w-full">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-1 font-bold text-black/90 text-3xl">
                                {job?.title.toUpperCase()} <span className={`text-sm font-normal text-black/50 ${job?.isActive ? "text-green-600" : "text-red-500"}`}>{job?.isActive ? "Active" : "Inactive"}</span>
                            </div>
                            <div className="flex gap-1 text-black/60">
                                <span className="font-semibold text-black">Job Role :</span>
                                {job?.jobRole}
                            </div>
                            <div className="text-black/50 text-sm flex gap-1"><span className="font-semibold text-black">Place :</span> {job?.place}</div>
                            <div className="flex gap-1 text-black/60">
                                <span className="font-semibold text-black">Requirements :</span>
                                {job?.requirements}
                            </div>
                            <div className="flex gap-1 text-black/60">
                                <span className="font-semibold text-black">Activation Status :</span>
                                {job?.isActive ? "Active" : "Inactive"}
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" className="mt-2" onClick={() => window.open(job?.jdUrl, "_blank")}>
                                    View JD
                                </Button>
                                <Button variant="outline" className="mt-2" onClick={handleOpenReferral} disabled={true}>
                                    View Referrals
                                </Button>
                                <Button variant="outline" className="mt-2" onClick={handleDownloadJD} disabled={true}>
                                    Download JD
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="font-bold text-black/90 text-3xl">Contact To</div>
                            {
                                job && <ContactToCard contact={job?.contact} />
                            }
                        </div>

                    </CardHeader>
                    <hr />
                    <CardContent>
                        <div className="w-full flex justify-center font-bold text-2xl">
                            Reviewers
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell className="font-bold">Image</TableCell>
                                    <TableCell className="font-bold">Reviewer Name</TableCell>
                                    <TableCell className="font-bold">Email</TableCell>
                                    <TableCell className="font-bold">Designation</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    job && job?.reviewers.length > 0
                                        ? job?.reviewers.map((r) => <ReviewerCard reviewer={r.reviewer} key={job.id} />)
                                        : <TableRow><TableCell colSpan={4} className="flex justify-center font-bold">Not Reviewers</TableCell></TableRow>
                                }
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default HrJobDetail
