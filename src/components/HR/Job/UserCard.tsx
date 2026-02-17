import { Plus } from "lucide-react"
import type { UserReponseDto } from "../../../type/Types"

interface UserCardProps{
    user : UserReponseDto,
    fn : ( u : UserReponseDto) => void,
    isPending : boolean
}

function UserCard({user,fn,isPending}:UserCardProps) {
  return (
    <div className="flex gap-3 items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
      <div className="flex gap-3 items-center flex-1 min-w-0">
        <img 
          src={user.image} 
          alt={user.fullName}
          className="w-10 h-10 rounded-full object-cover shrink-0" 
        />
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">{user.fullName}</div>
          <div className="text-xs text-muted-foreground truncate">{user.email}</div>
        </div>
      </div>
      <button
        title={`${user.fullName}`}
        onClick={() => fn(user)}
        className="shrink-0 p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-colors text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isPending}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}

export default UserCard
