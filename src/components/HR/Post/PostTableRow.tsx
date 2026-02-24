import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { Eye, AlertCircle } from "lucide-react"
import type { PostResponseDto } from "@/type/Types"

interface PostTableRowProps {
    post: PostResponseDto
    onView: (postId: number) => void
    onMarkInappropriate: (postId: number) => void
    formatDate: (date: Date) => string,
    loading : boolean
}

export function PostTableRow({ post, onView, onMarkInappropriate, formatDate ,loading}: PostTableRowProps) {
    return (
        <TableRow className="border-b hover:bg-gray-50 transition">
            <TableCell className="px-6 py-4">
                <p className="font-medium text-gray-900 truncate max-w-xs">{post.title}</p>
            </TableCell>
            <TableCell className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        {post.postByUser.image ? (
                            <img src={post.postByUser.image} alt={post.postByUser.fullName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <span className="text-xs font-semibold text-primary">
                                {post.postByUser.fullName.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <span className="text-sm text-gray-700">{post.postByUser.fullName}</span>
                </div>
            </TableCell>
            <TableCell className="px-6 py-4">
                <span className="text-sm text-gray-600">{post.createdAt.toString().substring(0,10)}</span>
            </TableCell>
            <TableCell className="px-6 py-4">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    post.isPublic 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                }`}>
                    {post.isPublic ? 'Public' : 'Private'}
                </span>
            </TableCell>
            <TableCell className="px-6 py-4">
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onView(post.id)}
                        className="flex items-center gap-1"
                        disabled={loading}
                    >
                        <Eye className="h-4 w-4" />
                        View
                    </Button>
                    <Button 
                        disabled={loading}
                        variant="destructive" 
                        size="sm"
                        onClick={() => onMarkInappropriate(post.id)}
                        className="flex items-center gap-1"
                    >
                        <AlertCircle className="h-4 w-4" />
                        Mark Inappropriate
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    )
}
