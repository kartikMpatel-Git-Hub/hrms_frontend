import type { NotificationResponseDto } from "../../../type/Types"

function NotificationCard({notification} : {notification : NotificationResponseDto}) {
  return (
    <div className="flex gap-3 p-2 rounded-sm shadow-2xl m-2 border-2">
      <div className="p-3 font-bold">{notification.id}.</div>
      <div className="">
        <div className="italic">{notification.title}</div>
        <div className="italic text-slate-500">{notification.description}</div>
      </div>
      <div className="p-3 font-semibold">{notification.notificationDate.toString().substring(0,10)}</div>
    </div>
  )
}

export default NotificationCard
