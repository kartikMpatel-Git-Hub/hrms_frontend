import type { PostResponseDto } from "@/type/Types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Avatar } from "../ui/avatar"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Heart, MessageCircle, Globe, Lock, Calendar, Zap, CircleAlert } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ToggleLikePost } from "@/api/PostService"

interface PostCardProps {
    post: PostResponseDto
}

function PostCard({ post }: PostCardProps) {
    const [isLiked, setIsLiked] = useState(post.isLiked)
    const [likeCount, setLikeCount] = useState(post.likeCount)
    const navigator = useNavigate()
    const handleLikeToggle = async () => {
        try {
            await ToggleLikePost(post.id)
            setIsLiked(!isLiked)
            setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
        } catch (error) {
            // console.error("Error toggling like:", error)
        }
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <Card className="hover:shadow-lg transition-shadow duration-300" >
            <CardHeader>
                {
                    post.inAppropriate &&
                    <div className="text-red-600 flex gap-2"><CircleAlert /> Mark as Inappropriate</div>
                }
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 bg-primary/10 flex items-center justify-center">
                            {
                                post.postByUser.image ? (
                                    <img src={post.postByUser.image} alt={post.postByUser.fullName} className="h-full w-full rounded-full object-cover" />
                                ) : (
                                    <span className="text-sm font-semibold text-primary">
                                        {post.postByUser.fullName.charAt(0).toUpperCase()}
                                    </span>
                                )
                            }
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-base">{post.postByUser.fullName}</CardTitle>
                                {post.postByUser.email === 'system@gmail.com' && (
                                    <Badge className="bg-amber-100 text-amber-800 flex gap-1">
                                        <Zap className="h-3 w-3" />
                                        System
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(post.createdAt)}</span>
                                {post.isPublic ? (
                                    <Globe className="h-3 w-3 ml-1" />
                                ) : (
                                    <Lock className="h-3 w-3 ml-1" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-4 hover:cursor-pointer" onClick={() => navigator(`./${post.id}`)}>
                {post.postUrl && (
                    <img
                        src={post.postUrl}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-md"
                        onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Image+Not+Available'
                        }}
                    />
                )}
                <CardTitle className="text-lg mt-3">{post.title}</CardTitle>
                <CardDescription className="mt-2 line-clamp-2">
                    {post.description}
                </CardDescription>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLikeToggle}
                        className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-muted-foreground'
                            } hover:text-red-500 transition-colors`}
                    >
                        <Heart
                            className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`}
                        />
                        <span className="text-sm font-medium">{likeCount}</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">{post.commentCount}</span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

export default PostCard
