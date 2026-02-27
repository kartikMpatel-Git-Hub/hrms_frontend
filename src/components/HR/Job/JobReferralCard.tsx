import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"
import type { ReferredResponseDto } from "@/type/Types"
import { Calendar, Edit, ExternalLink, Eye, Mail, MessageSquareText, User, UserPlus } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function JobReferralCard({ referral, idx, handleStatusChange, isPending }: { referral?: ReferredResponseDto, idx: number, handleStatusChange: (id: number, status: string) => void, isPending: boolean }) {

    const navigator = useNavigate()
    const [status, setStatus] = useState<string>(referral?.status || "Pending")
    const { user } = useAuth()

    return (
        <TableRow>
            <TableCell>{idx + 1}</TableCell>
            <TableCell>{referral?.referedPersonName}</TableCell>
            <TableCell>{referral?.referedPersonEmail}</TableCell>
            <TableCell className="hover:cursor-pointer" title="View Referrer" onClick={() => navigator(`/hr/${referral?.referedBy}`)} >{referral?.referer}</TableCell>
            <TableCell>{referral?.status}</TableCell>
            <TableCell className="flex gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button disabled={isPending}>
                            <Eye />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-xl">
                        {/* Header */}
                        <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent px-6 pt-6 pb-4">
                            <DialogHeader className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <DialogTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/15">
                                            <UserPlus className="w-4 h-4 text-primary" />
                                        </div>
                                        Referral Details
                                    </DialogTitle>
                                    <Badge
                                        variant={
                                            referral?.status === "Hired" ? "success"
                                            : referral?.status === "Rejected" ? "destructive"
                                            : referral?.status === "Interview" || referral?.status === "Shortlisted" ? "warning"
                                            : "secondary"
                                        }
                                        className="text-xs px-2.5 py-1 rounded-full"
                                    >
                                        {referral?.status}
                                    </Badge>
                                </div>
                                <DialogDescription className="text-muted-foreground text-sm">
                                    Complete information about this referral
                                </DialogDescription>
                            </DialogHeader>
                        </div>

                        <Separator />

                        {/* Body */}
                        <div className="px-6 pb-6 pt-2 space-y-4">
                            {/* Name & Email Row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary/10 shrink-0 mt-0.5">
                                        <User className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</p>
                                        <p className="text-sm font-semibold mt-0.5 wrap-break-word">{referral?.referedPersonName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-accent shrink-0 mt-0.5">
                                        <Mail className="w-4 h-4 text-accent-foreground" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</p>
                                        <p className="text-sm font-semibold mt-0.5 wrap-break-word">{referral?.referedPersonEmail}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Referred By & Date Row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-secondary shrink-0 mt-0.5">
                                        <UserPlus className="w-4 h-4 text-secondary-foreground" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Referred By</p>
                                        <p className="text-sm font-semibold mt-0.5 wrap-break-word">{referral?.referer}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-muted shrink-0 mt-0.5">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Referred At</p>
                                        <p className="text-sm font-semibold mt-0.5">{referral?.referedAt?.toString().substring(0, 10)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Note */}
                            <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-muted shrink-0">
                                        <MessageSquareText className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Note</p>
                                </div>
                                <p className="text-sm leading-relaxed text-foreground/80 pl-11 wrap-break-word">{referral?.note}</p>
                            </div>

                            {/* View CV Button */}
                            <Button
                                className="w-full gap-2"
                                onClick={() => window.open(referral?.cvUrl, "_blank")}
                            >
                                <ExternalLink className="w-4 h-4" />
                                View CV
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
                {
                    (referral?.status == "Pending" || user?.role.toLowerCase() == 'hr') &&
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button disabled={isPending}>
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
                                    <option disabled={user?.role.toLowerCase() != "hr"} value="Interview">Interview</option>
                                    <option disabled={user?.role.toLowerCase() != "hr"} value="Hired">Hired</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Shortlisted">Shortlisted</option>
                                </select>
                                <Button className="mt-2 w-full" onClick={() => referral && handleStatusChange(referral?.id, status)} disabled={status == "Pending" || referral?.status == "Rejected"}>Apply Changes</Button>
                            </Field>
                        </DialogContent>
                    </Dialog>
                }
            </TableCell>
        </TableRow>
    )
}

export default JobReferralCard
