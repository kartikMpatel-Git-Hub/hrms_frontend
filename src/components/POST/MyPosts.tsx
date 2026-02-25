import { GetMyPosts, EditPost } from "@/api/PostService"
import type { PagedRequestDto, PostResponseDto, PostUpdateDto } from "@/type/Types"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { CardContent } from "../ui/card"
import PostCard from "./PostCard"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { Images, Plus, Search, ArrowLeft, Edit, X } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Checkbox } from "../ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { AlertCircle } from "lucide-react"

function MyPosts() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [paged] = useState<PagedRequestDto>({
        pageNumber: 1,
        pageSize: 10
    })
    const [search, setSearch] = useState("")
    const [filteredPosts, setFilteredPosts] = useState<PostResponseDto[]>([])
    const [editingPost, setEditingPost] = useState<PostResponseDto | null>(null)
    const [editFormData, setEditFormData] = useState<PostUpdateDto>({
        Title: "",
        Description: "",
        IsPublic: true
    })
    const [editError, setEditError] = useState<string | null>(null)

    const { data, isLoading } = useQuery({
        queryKey: ["my-posts", paged],
        queryFn: () => GetMyPosts(paged)
    })
    const [posts, setPosts] = useState<PostResponseDto[]>([])

    const editPostMutation = useMutation({
        mutationFn: async () => {
            if (!editingPost) return
            if (!editFormData.Title.trim()) {
                setEditError("Title is required")
                return
            }
            if (!editFormData.Description.trim()) {
                setEditError("Description is required")
                return
            }
            await EditPost(editingPost.id, editFormData)
        },
        onSuccess: () => {
            setEditingPost(null)
            setEditError(null)
            toast.success("Post updated successfully")
            queryClient.invalidateQueries({ queryKey: ["my-posts", paged] })
        },
        onError: (error: any) => {
            const msg = error?.response?.data?.message || error?.message || "Failed to update post"
            toast.error(msg)
            setEditError(msg)
        }
    })

    useEffect(() => {
        if (data) {
            setPosts(data.data)
            applySearch(data.data)
        }
    }, [data])

    const applySearch = (dataToFilter: PostResponseDto[]) => {
        let filtered = dataToFilter
        if (search.trim() !== "") {
            filtered = filtered.filter(post =>
                post.title.toLowerCase().includes(search.toLowerCase()) ||
                post.description.toLowerCase().includes(search.toLowerCase())
            )
        }
        setFilteredPosts(filtered)
    }

    const handleEditPost = (post: PostResponseDto) => {
        setEditingPost(post)
        setEditFormData({
            Title: post.title,
            Description: post.description,
            IsPublic: post.isPublic
        })
        setEditError(null)
    }

    const handleCloseEditDialog = () => {
        setEditingPost(null)
        setEditError(null)
    }

    useEffect(() => {
        applySearch(posts)
    }, [search, posts])

    return (
        <div className="p-5">
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-3">
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={18} /> Back
                    </Button>
                </div>
                {/* <Button onClick={() => navigate("/post/create")}><Plus /> Add Post</Button> */}
            </div>
            <div className="flex justify-center font-bold text-3xl gap-2 mb-8"><Images size={30} /><span>My Posts</span></div>
            
            <div className="mb-6">
                <InputGroup>
                    <InputGroupAddon><Search size={18} /></InputGroupAddon>
                    <InputGroupInput 
                        placeholder="Search your posts..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </InputGroup>
            </div>

            <CardContent>
                {
                    !isLoading ?
                        (
                            filteredPosts && filteredPosts.length > 0
                                ? (
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                                        {filteredPosts.map((post) => (
                                            <div key={post.id} className="relative group">
                                                <PostCard post={post} />
                                                <Button
                                                    onClick={() => handleEditPost(post)}
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    size="sm"
                                                    variant="secondary"
                                                >
                                                    <Edit size={16} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )
                                : (
                                    <div className="text-center py-10">
                                        <p className="text-gray-500">No posts found</p>
                                    </div>
                                )
                        )
                        : (
                            <div className="text-center py-10">
                                <p className="text-gray-500">Loading...</p>
                            </div>
                        )
                }
            </CardContent>

            <Dialog open={!!editingPost} onOpenChange={handleCloseEditDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit size={20} />
                            Edit Post
                        </DialogTitle>
                    </DialogHeader>

                    {editError && (
                        <Alert className="bg-red-50 border-red-200">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertTitle className="text-red-800">Error</AlertTitle>
                            <AlertDescription className="text-red-700">{editError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Title</Label>
                            <Input
                                id="edit-title"
                                value={editFormData.Title}
                                onChange={(e) => {
                                    setEditFormData(prev => ({ ...prev, Title: e.target.value }))
                                    if (editError) setEditError(null)
                                }}
                                placeholder="Enter post title..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={editFormData.Description}
                                onChange={(e) => {
                                    setEditFormData(prev => ({ ...prev, Description: e.target.value }))
                                    if (editError) setEditError(null)
                                }}
                                placeholder="Enter post description..."
                                className="min-h-32"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="edit-public"
                                checked={editFormData.IsPublic}
                                onCheckedChange={(checked) => 
                                    setEditFormData(prev => ({ ...prev, IsPublic: checked as boolean }))
                                }
                            />
                            <Label htmlFor="edit-public" className="text-sm cursor-pointer">
                                Make this post public
                            </Label>
                        </div>

                        <div className="flex gap-3 justify-end pt-4">
                            <Button
                                variant="outline"
                                onClick={handleCloseEditDialog}
                                disabled={editPostMutation.isPending}
                            >
                                <X size={16} className="mr-2" />
                                Cancel
                            </Button>
                            <Button
                                onClick={() => editPostMutation.mutate()}
                                disabled={editPostMutation.isPending}
                            >
                                {editPostMutation.isPending ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default MyPosts
