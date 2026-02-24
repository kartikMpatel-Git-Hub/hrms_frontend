import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import { TableCell, TableRow } from "@/components/ui/table"
import type { ReferredResponseDto } from "@/type/Types"
import { Edit, Eye, File, UserPlus } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function JobReferralCard({ referral, idx,handleStatusChange }: { referral?: ReferredResponseDto, idx: number, handleStatusChange: (id: number,status: string) => void }) {
    
    const navigator = useNavigate()
    const [status, setStatus] = useState<string>(referral?.status || "Pending")
    
    return (
        <TableRow>
            <TableCell>{idx + 1}</TableCell>
            <TableCell>{referral?.referedPersonName}</TableCell>
            <TableCell>{referral?.referedPersonEmail}</TableCell>
            <TableCell className="hover:cursor-pointer" title="View Referrer" onClick={ () => navigator(`/hr/${referral?.referedBy}`)} >{referral?.referer}</TableCell>
            <TableCell>{referral?.status}</TableCell>
            <TableCell className="flex gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Eye />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle className="flex p-1 gap-1"><UserPlus /> View Referral Details</DialogTitle>
                            <DialogDescription>View the details of this referral.</DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2"><span className="font-bold italic">Name:</span> {referral?.referedPersonName}</div>
                            <div className="flex gap-2"><span className="font-bold italic">Email:</span> {referral?.referedPersonEmail}</div>
                            <div className="flex gap-2"><span className="font-bold italic">Status:</span> {referral?.status}</div>
                            <div className="flex gap-2"><span className="font-bold italic">Note:</span> {referral?.note}</div>
                            <div className="flex gap-2"><span className="font-bold italic">Referred At:</span> {referral?.referedAt?.toString().substring(0, 10)}</div>
                            <div className="flex gap-2"><span className="font-bold italic">Referred By:</span> {referral?.referer}</div>
                            <div className="flex justify-center mt-5">
                                <Button className="w-full" onClick={() => window.open(referral?.cvUrl, "_blank")}>
                                    <File /> View CV
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Edit />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle className="flex p-1 gap-1"><Edit /> Change Referral Status</DialogTitle>
                            <DialogDescription>Change the status of this referral.</DialogDescription>
                        </DialogHeader>
                        <Field>
                            <select className="border-2 w-full p-2 rounded-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="Pending">Pending</option>
                                <option value="Interview">Interview</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Hired">Hired</option>
                            </select>
                            <Button className="mt-2 w-full" onClick={() => referral && handleStatusChange(referral?.id,status)} disabled={true}>Apply Changes</Button>
                        </Field>
                    </DialogContent>
                </Dialog>
            </TableCell>
        </TableRow>
    )
}

export default JobReferralCard
