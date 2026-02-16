import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { UserReponseDto } from '../../../type/Types'

function ContactToCard({ contact }: { contact: UserReponseDto }) {
    return (
        <Card className="relative mx-auto w-full max-w-sm pt-0 ">
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <img
                src={contact.image}
                alt="Event cover"
                className="relative z-20 aspect-video w-full object-cover brightness-100 grayscale dark:brightness-40"
            />
            <CardHeader>
                <CardAction>
                    <div className="bg-slate-900 text-white p-1 rounded-sm font-bold text-sm">{contact.role}</div>
                </CardAction>
                <CardTitle>{contact.fullName.toUpperCase()}</CardTitle>
                <div className="text-black/50 text-sm">{contact.email}</div>
                <CardDescription>
                    <div className="py-2">
                        <div><span className="font-semibold text-black">DOJ :</span> {contact.dateOfJoin.toString().substring(0, 10)}</div>
                        <div><span className="font-semibold text-black">DOB :</span> {contact.dateOfBirth.toString().substring(0, 10)}</div>
                    </div>
                    <div>
                        <div><span className="font-semibold text-black">Designation :</span> {contact.designation}</div>
                    </div>
                </CardDescription>
            </CardHeader>
        </Card>
    )
}

export default ContactToCard
