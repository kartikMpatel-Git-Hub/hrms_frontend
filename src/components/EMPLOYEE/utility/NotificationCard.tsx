import { TableCell, TableRow } from "@/components/ui/table"
import type { NotificationResponseDto } from "../../../type/Types"

function NotificationCard({ notification, idx }: { notification: NotificationResponseDto, idx: number }) {
  return (
    <TableRow>
      <TableCell>{idx + 1}.</TableCell>
      <TableCell>{notification.title}</TableCell>
      <TableCell className="max-w-[250px] whitespace-normal break-words">
        {notification.description}
      </TableCell>
      <TableCell>
        {notification.notificationDate.toString().substring(0, 10)}
      </TableCell>
    </TableRow>
  )
}

export default NotificationCard
