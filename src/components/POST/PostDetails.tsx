import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { GetPostById, GetPostComments, CreateComment, ToggleLikePost, DeletePost, deleteComment, editComment } from "@/api/PostService"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Avatar } from "../ui/avatar"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Skeleton } from "../ui/skeleton"
import { Heart, Globe, Lock, Calendar, Trash2, Edit, X, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import type { CommentResponseDto, PostDetailedResponseDto } from "@/type/Types"

function PostDetails() {
  const { id } = useParams<{ id: string }>()
  const postId = parseInt(id || "0", 10)
  const navigate = useNavigate()
  const { user } = useAuth()
  const [commentText, setCommentText] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editingCommentText, setEditingCommentText] = useState("")
  const queryClient = useQueryClient()

  const { data: post, isLoading: isPostLoading } = useQuery<PostDetailedResponseDto>({
    queryKey: ["post", postId],
    queryFn: () => GetPostById(postId),
    enabled: postId > 0
  })

  useEffect(() => {
    if (post) {
      setIsLiked(post.isLiked)
      setLikeCount(post.likeCount)
    }
  }, [post])

  const { data: commentsData, isLoading: isCommentsLoading } = useQuery({
    queryKey: ["postComments", postId, 1],
    queryFn: () => GetPostComments(postId, { pageNumber: 1, pageSize: 10 }),
    enabled: postId > 0
  })

  const createCommentMutation = useMutation({
    mutationFn: async () => {
      if (!commentText.trim()) {
        setErrors({ comment: "Comment cannot be empty" })
        return
      }
      return CreateComment(postId, commentText)
    },
    onSuccess: () => {
      setCommentText("")
      setErrors({})
      queryClient.invalidateQueries({ queryKey: ["postComments", postId, 1] })
    },
    onError: (error: any) => {
      setErrors({ submit: error.message || "Failed to create comment" })
    }
  })

  const likePostMutation = useMutation({
    mutationFn: async () => {
      await ToggleLikePost(postId)
    },
    onSuccess: () => {
      setIsLiked(!isLiked)
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    },
    onError: (error: any) => {
      console.error("Error toggling like:", error)
    }
  })

  const deletePostMutation = useMutation({
    mutationFn: async () => {
      await DeletePost(postId)
    },
    onSuccess: () => {
      navigate("../")
    },
    onError: (error: any) => {
      setErrors({ post: error.message || "Failed to delete post" })
    }
  })

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      await deleteComment(postId, commentId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postComments", postId, 1] })
    },
    onError: (error: any) => {
      console.error("Error deleting comment:", error)
    }
  })

  const editCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      await editComment(postId, commentId, editingCommentText)
    },
    onSuccess: () => {
      setEditingCommentId(null)
      setEditingCommentText("")
      queryClient.invalidateQueries({ queryKey: ["postComments", postId, 1] })
    },
    onError: (error: any) => {
      console.error("Error editing comment:", error)
    }
  })

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isPostLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Post not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-primary/10 flex items-center justify-center shrink-0">
                {post.postByUser.image ? (
                  <img src={post.postByUser.image} alt={post.postByUser.fullName} className="h-full w-full rounded-full object-cover" />
                ) : (
                  <span className="text-sm font-semibold text-primary">
                    {post.postByUser.fullName.charAt(0).toUpperCase()}
                  </span>
                )}
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-base">{post.postByUser.fullName}</CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(post.createdAt)}</span>
                  {post.isPublic ? (
                    <Globe className="h-3 w-3" />
                  ) : (
                    <Lock className="h-3 w-3" />
                  )}
                </div>
              </div>
            </div>
            {user?.id === post.postByUser.id && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deletePostMutation.mutate()}
                disabled={deletePostMutation.isPending}
                className="text-red-500 hover:text-red-700 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {post.postUrl && (
            <img
              src={post.postUrl}
              alt={post.title}
              className="w-full h-64 object-cover rounded-md"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available'
              }}
            />
          )}
          <div>
            <CardTitle className="text-xl">{post.title}</CardTitle>
            <CardDescription className="mt-3">{post.description}</CardDescription>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map(tag => (
                <span key={tag.id} className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                  #{tag.tagName}
                </span>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex items-center gap-6 border-t pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => likePostMutation.mutate()}
            disabled={likePostMutation.isPending}
            className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500 transition-colors`}
          >
            <Heart
              className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`}
            />
            <span className="text-sm font-medium">{likeCount}</span>
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{post.commentCount} comments</span>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => {
                setCommentText(e.target.value)
                if (errors.comment) {
                  setErrors({ ...errors, comment: "" })
                }
              }}
              className="min-h-20"
            />
            {errors.comment && (
              <p className="text-sm text-red-500">{errors.comment}</p>
            )}
            {errors.submit && (
              <p className="text-sm text-red-500">{errors.submit}</p>
            )}
            <Button
              onClick={() => createCommentMutation.mutate()}
              disabled={createCommentMutation.isPending}
              className="w-full"
            >
              {createCommentMutation.isPending ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isCommentsLoading ? (
        <Card>
          <CardContent className="pt-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : commentsData && commentsData.data.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {commentsData.totalRecords} {commentsData.totalRecords === 1 ? "comment" : "comments"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {commentsData.data.map((comment: CommentResponseDto) => (
              <div key={comment.id} className="flex gap-3 pb-4 border-b last:border-b-0 last:pb-0">
                <Avatar className="h-8 w-8 bg-primary/10 flex items-center justify-center shrink-0">
                  {comment.commentBy.image ? (
                    <img src={comment.commentBy.image} alt={comment.commentBy.fullName} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <span className="text-xs font-semibold text-primary">
                      {comment.commentBy.fullName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{comment.commentBy.fullName}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
                      {user?.id === comment.commentBy.id && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingCommentId(comment.id)
                              setEditingCommentText(comment.comment)
                            }}
                            className="h-6 w-6 p-0 hover:bg-blue-100"
                          >
                            <Edit className="h-3 w-3 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCommentMutation.mutate(comment.id)}
                            disabled={deleteCommentMutation.isPending}
                            className="h-6 w-6 p-0 hover:bg-red-100"
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  {editingCommentId === comment.id ? (
                    <div className="mt-2 space-y-2">
                      <Textarea
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                        className="min-h-16 text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => editCommentMutation.mutate(comment.id)}
                          disabled={editCommentMutation.isPending || !editingCommentText.trim()}
                          className="h-7 px-2"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingCommentId(null)
                            setEditingCommentText("")
                          }}
                          className="h-7 px-2"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm mt-1 text-foreground wrap-break-word">{comment.comment}</p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No comments yet. Be the first to comment!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PostDetails
