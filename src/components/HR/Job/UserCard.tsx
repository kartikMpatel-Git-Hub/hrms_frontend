import { Mouse, MousePointer, MousePointer2, MousePointerClick, Plus } from "lucide-react"
import type { UserReponseDto } from "../../../type/Types"

interface UserCardProps{
    user : UserReponseDto,
    fn : ( u : UserReponseDto) => void,
    isPending : boolean
}

function UserCard({user,fn,isPending}:UserCardProps) {
  return (
    <div className="flex gap-3 border-2 m-2 justify-between">
            <div className="p-3"><img src={user.image} className="w-10" /></div>
            <div>
                <div className="font-bold">{user.fullName}</div>
                <div>{user.email}</div>
            </div>
            <div className="p-3">
                <button
                    title="Add Traveler"
                    onClick={() => fn(user)}
                    className="border-2 rounded-2xl h-fit m-auto hover:cursor-pointer hover:bg-slate-800 hover:text-white hover:border-slate-800 disabled:opacity-50"
                    disabled={isPending}
                >
                    <MousePointer2/>
                </button>
            </div>
            
        </div>
  )
}

export default UserCard
