import type { JobResponseDto } from '@/type/Types'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TableCell, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Briefcase, ClipboardList, ExternalLink, Eye,MapPin, User, ScrollText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'


function JobToReviewCard({ j, idx }: { j: JobResponseDto, idx: number }) {

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
                        <Button variant="outline" title='View Job Details'>
                            <Eye />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-xl">
                        <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent px-6 pt-6 pb-4">
                            <DialogHeader className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <DialogTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/15">
                                            <Briefcase className="w-4 h-4 text-primary" />
                                        </div>
                                        Job Details
                                    </DialogTitle>
                                    <Badge variant={j.isActive ? "success" : "destructive"} className="text-xs px-2.5 py-1 rounded-full">
                                        {j.isActive ? "Active" : "Closed"}
                                    </Badge>
                                </div>
                                <DialogDescription className="text-muted-foreground text-sm">
                                    Complete information about this job position
                                </DialogDescription>
                            </DialogHeader>
                        </div>
                        <Separator />
                        <div className="px-6 pb-6 pt-2 space-y-4">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                                <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary/10 shrink-0 mt-0.5">
                                    <ClipboardList className="w-4 h-4 text-primary" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</p>
                                    <p className="text-sm font-semibold mt-0.5 wrap-break-word">{j.title}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-accent shrink-0 mt-0.5">
                                        <User className="w-4 h-4 text-accent-foreground" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</p>
                                        <p className="text-sm font-semibold mt-0.5 wrap-break-word">{j.jobRole}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-secondary shrink-0 mt-0.5">
                                        <MapPin className="w-4 h-4 text-secondary-foreground" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</p>
                                        <p className="text-sm font-semibold mt-0.5 wrap-break-word">{j.place}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-muted shrink-0">
                                        <ScrollText className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Requirements</p>
                                </div>
                                <p className="text-sm leading-relaxed text-foreground/80 pl-11 wrap-break-word">{j.requirements}</p>
                            </div>

                            <Button
                                className="w-full gap-2"
                                onClick={() => window.open(j.jdUrl, "_blank")}
                            >
                                <ExternalLink className="w-4 h-4" />
                                View Job Description
                            </Button>
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
