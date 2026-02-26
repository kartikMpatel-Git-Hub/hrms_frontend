import type { JobResponseDto } from '@/type/Types'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TableCell, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Briefcase, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


function JobToReviewCard({j,idx}:{j : JobResponseDto,idx : number}) {

    const navigator = useNavigate()
    return (
        <TableRow key={j.id}>
            <TableCell>{idx + 1}</TableCell>
            <TableCell>{j.title}</TableCell>
            <TableCell>{j.jobRole}</TableCell>
            <TableCell>{j.place}</TableCell>
            <TableCell>{j.isActive ? "Active" : "Closed"}</TableCell>
            <TableCell className="flex gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon" title="View Details">
                            <Eye />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-1">
                                <Briefcase className="w-4 h-5" /> JOB DETAILS
                                <span className="text-sm">
                                    {j.isActive ? "(Active)" : "(Closed)"}
                                </span>
                            </DialogTitle>
                            <DialogDescription>
                                Full information on the selected job.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-2">
                            <div>
                                <span className="font-bold mr-1 italic">Title:</span>
                                {j.title.toUpperCase()}
                            </div>
                            <div>
                                <span className="font-bold mr-1 italic">Role :</span>
                                {j.jobRole.toUpperCase()}
                            </div>
                            <div>
                                <span className="font-bold mr-1 italic">Place:</span>
                                {j.place.toUpperCase()}
                            </div>
                            <div>
                                <span className="font-bold mr-1 italic">
                                    Requirements:
                                </span>
                                {j.requirements}
                            </div>
                            <Button onClick={() => window.open(j.jdUrl, "_blank")}>View JD</Button>
                        </div>
                    </DialogContent>
                </Dialog>
                <Button
                    variant="default"
                    onClick={() => navigator(`./${j.id}`)}
                >
                    Referrals
                </Button>
            </TableCell>
        </TableRow>
    )
}

export default JobToReviewCard
