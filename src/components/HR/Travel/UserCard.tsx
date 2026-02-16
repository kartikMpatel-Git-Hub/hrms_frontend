import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { UserReponseDto } from '../../../type/Types'

function UserCard({ user }: { user: UserReponseDto }) {
    return (
        <Card className="relative mx-auto w-full max-w-sm p-2">
            <CardHeader>
                <CardAction>
                    <div className="bg-slate-900 text-white p-1 rounded-sm font-bold text-sm">{user.role}</div>
                </CardAction>
                <CardTitle>{user.fullName.toUpperCase()}</CardTitle>
                <div className="text-black/50 text-sm">{user.email}</div>
                <CardDescription>
                    <div className="py-2">
                        <div><span className="font-semibold text-black">DOJ :</span> {user.dateOfJoin.toString().substring(0, 10)}</div>
                        <div><span className="font-semibold text-black">DOB :</span> {user.dateOfBirth.toString().substring(0, 10)}</div>
                    </div>
                    <div>
                        <div><span className="font-semibold text-black">Designation :</span> {user.designation}</div>
                    </div>
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <div><span className="font-bold italic">Uploaded By :</span> {user.role == "Hr" ? "Hr" : "Traveler"}</div>
            </CardFooter>
        </Card>
    )
}

export default UserCard