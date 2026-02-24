import type { UserReponseDto } from "@/type/Types"
import { Card, CardContent, CardHeader } from "../ui/card"
import { ItemMedia } from "../ui/item"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useNavigate } from "react-router-dom"

function UserCardForChart({ user }: { user: UserReponseDto }) {

    const navigate = useNavigate()

    return (
        <Card className="hover:cursor-pointer">
            <CardHeader>
                <div className="flex justify-end">
                    <div className="bg-gray-900 w-fit text-white p-2 rounded-sm">{user.designation}</div>
                </div>
                <ItemMedia>
                    <Avatar size="lg">
                        <AvatarImage src={user.image} className="grayscale-50" />
                        <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                </ItemMedia>
            </CardHeader>
            <hr />
            <CardContent>
                <div><span className="font-semibold italic">Name : </span>{user.fullName}</div>
                <div><span className="font-semibold italic">Email : </span>{user.email}</div>
                <div><span className="font-semibold italic">Designation : </span>{user.designation}</div>

            </CardContent>
        </Card>
    )
}

export default UserCardForChart
