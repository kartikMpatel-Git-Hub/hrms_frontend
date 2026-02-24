import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Checkbox } from "../ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { AlertCircle, ArrowLeft, Plus, X } from "lucide-react"
import api from "@/api/Api"
import { CreatePost } from "@/api/PostService"

function PostCreateForm() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        isPublic: true,
        tags: [] as string[],
        post: null as File | null
    })
    const [tagInput, setTagInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

    const isValidImageFile = (file: File): boolean => {
        const hasValidMime = ALLOWED_IMAGE_TYPES.includes(file.type)
        const hasValidExtension = ALLOWED_IMAGE_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext))
        return hasValidMime || hasValidExtension
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null)
        if (e.target.files) {
            const file = e.target.files[0]
            if (!isValidImageFile(file)) {
                setError('Only image files (JPG, PNG, JPEG) are allowed!')
                e.target.value = ''
                setFormData(prev => ({
                    ...prev,
                    post: null
                }))
                return
            }
            setFormData(prev => ({
                ...prev,
                post: file
            }))
        }
    }

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }))
            setTagInput("")
        }
    }

    const handleRemoveTag = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tag)
        }))
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleAddTag()
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccessMessage(null)

        if (!formData.title.trim()) {
            setError("Title is required")
            return
        }

        if (!formData.description.trim()) {
            setError("Description is required")
            return
        }

        if (!formData.post) {
            setError("Image is required")
            return
        }

        setLoading(true)

        try {
            const submitData = new FormData()
            submitData.append("Title", formData.title)
            submitData.append("Description", formData.description)
            submitData.append("IsPublic", String(formData.isPublic))
            
            formData.tags.forEach((tag, index) => {
                submitData.append(`Tags[${index}]`, tag)
            })
            
            if (formData.post) {
                submitData.append("Post", formData.post)
            }

            await CreatePost(submitData)

            setSuccessMessage("Post created successfully!")
            setTimeout(() => {
                navigate("../")
            }, 2000)
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || "Failed to create post"
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6 flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("../")}
                >
                    <ArrowLeft size={18} /> Back
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plus size={24} />
                        Create New Post
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert className="mb-4 bg-red-50 border-red-200">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertTitle className="text-red-800">Error</AlertTitle>
                            <AlertDescription className="text-red-700">{error}</AlertDescription>
                        </Alert>
                    )}

                    {successMessage && (
                        <Alert className="mb-4 bg-green-50 border-green-200">
                            <AlertCircle className="h-4 w-4 text-green-600" />
                            <AlertTitle className="text-green-800">Success</AlertTitle>
                            <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="font-semibold">Title *</Label>
                            <Input
                                id="title"
                                name="title"
                                maxLength={80}
                                type="text"
                                placeholder="Enter post title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="font-semibold">Description *</Label>
                            <Textarea
                                id="description"
                                name="description"
                                maxLength={800}
                                placeholder="Enter post description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={5}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="post" className="font-semibold">Image *</Label>
                            <Input
                                id="post"
                                name="post"
                                type="file"
                                accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                onChange={handleFileChange}
                                required
                            />
                            {formData.post && (
                                <p className="text-sm text-green-600">✓ File selected: {formData.post.name}</p>
                            )}
                            <p className="text-xs text-gray-500">Only image files are allowed (JPG, PNG, JPEG)</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tags" className="font-semibold">Tags (Optional)</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="tags"
                                    type="text"
                                    maxLength={20}
                                    placeholder="Enter a tag and press Enter"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddTag}
                                >
                                    Add
                                </Button>
                            </div>
                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {formData.tags.map((tag) => (
                                        <div
                                            key={tag}
                                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="hover:text-blue-900"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isPublic"
                                checked={formData.isPublic}
                                onCheckedChange={(checked) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        isPublic: checked as boolean
                                    }))
                                }
                            />
                            <Label htmlFor="isPublic" className="font-semibold cursor-pointer">
                                Make this post public
                            </Label>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/post")}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create Post"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default PostCreateForm
