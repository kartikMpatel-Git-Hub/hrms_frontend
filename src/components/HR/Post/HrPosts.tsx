import { GetAllPosts, MarkPostInappropriate } from "@/api/PostService"
import type { PagedRequestDto, PostResponseDto } from "@/type/Types"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, AlertCircle, Flag, Plus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { PostTableRow } from "./PostTableRow"

function HrPosts() {
    const [paged] = useState<PagedRequestDto>({
        pageNumber: 1,
        pageSize: 20
    })
    const navigate = useNavigate()
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [search, setSearch] = useState("")
    const [filteredPosts, setFilteredPosts] = useState<PostResponseDto[]>([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [filterOptions, setFilterOptions] = useState({
        visibility: ["Public", "Private"],
        author: [] as string[]
    })
    const [loading, setLoading] = useState(false)
    const [filters, setFilters] = useState({
        visibility: [] as string[],
        author: [] as string[]
    })

    const { data, isLoading } = useQuery({
        queryKey: ["hr-posts", paged],
        queryFn: () => GetAllPosts(paged)
    })

    const [posts, setPosts] = useState<PostResponseDto[]>([])

    useEffect(() => {
        if (data) {
            setPosts(data.data)
            // Extract unique authors
            const authors = Array.from(new Set(data.data.map(p => p.postByUser.fullName)))
            setFilterOptions(prev => ({
                ...prev,
                author: authors
            }))
            // Apply filters and search
            applyFiltersAndSearch(data.data)
        }
    }, [data])

    const applyFiltersAndSearch = (dataToFilter: PostResponseDto[]) => {
        let filtered = dataToFilter

        // Apply search filter
        if (search.trim() !== "") {
            filtered = filtered.filter(post =>
                post.title.toLowerCase().includes(search.toLowerCase()) ||
                post.description.toLowerCase().includes(search.toLowerCase()) ||
                post.postByUser.fullName.toLowerCase().includes(search.toLowerCase())
            )
        }

        // Apply visibility filter
        if (filters.visibility.length > 0) {
            filtered = filtered.filter(post =>
                filters.visibility.includes(post.isPublic ? "Public" : "Private")
            )
        }

        // Apply author filter
        if (filters.author.length > 0) {
            filtered = filtered.filter(post =>
                filters.author.includes(post.postByUser.fullName)
            )
        }

        setFilteredPosts(filtered)
    }

    useEffect(() => {
        setSearchLoading(true)
        const timeout = setTimeout(() => {
            applyFiltersAndSearch(posts)
            setSearchLoading(false)
        }, 500)
        return () => clearTimeout(timeout)
    }, [search, filters, posts])

    const handleViewPost = (postId: number) => {
        navigate(`/hr/post/${postId}`)
    }

    const handleMarkInappropriate = async (postId: number) => {
        setLoading(true)
        try {
            await MarkPostInappropriate(postId)
            setSuccessMessage("Post marked as inappropriate")
            setTimeout(() => setSuccessMessage(null), 3000)
            // Remove the post from the list
            setPosts(posts.filter(p => p.id !== postId))
        } catch (error) {
            console.error("Error marking post as inappropriate:", error)
        }
        finally {
            setLoading(false)
        }
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Posts Management</h1>
                    <p className="text-muted-foreground">View and manage all posts from your organization</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => navigate("./create")}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Create Post
                    </Button>
                    <Button
                        onClick={() => navigate("./mypost")}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        My Posts
                    </Button>
                    <Button
                        onClick={() => navigate("./inappropriate")}
                        className="flex items-center gap-2"
                    >
                        <Flag className="h-4 w-4" />
                        View Inappropriate Posts
                    </Button>
                </div>
            </div>

            {successMessage && (
                <Alert className="mb-4 bg-green-50 border-green-200">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Success</AlertTitle>
                    <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
                </Alert>
            )}

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow p-4 mb-4">
                <InputGroup>
                    <InputGroupInput
                        placeholder="Search posts by title, description, or author..."
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">{filteredPosts?.length || 0} Results</InputGroupAddon>
                </InputGroup>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <Combobox
                            onValueChange={(value) => {
                                const strValue = String(value)
                                setFilters(prev => ({
                                    ...prev,
                                    visibility: prev.visibility.includes(strValue)
                                        ? prev.visibility.filter(v => v !== strValue)
                                        : [...prev.visibility, strValue]
                                }))
                            }}
                        >
                            <ComboboxInput placeholder="Select Visibility" />
                            <ComboboxContent>
                                <ComboboxList>
                                    {filterOptions.visibility.map((item) => (
                                        <ComboboxItem key={item} value={item}>
                                            {item}
                                        </ComboboxItem>
                                    ))}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>
                    <div>
                        <Combobox
                            onValueChange={(value) => {
                                const strValue = String(value)
                                setFilters(prev => ({
                                    ...prev,
                                    author: prev.author.includes(strValue)
                                        ? prev.author.filter(a => a !== strValue)
                                        : [...prev.author, strValue]
                                }))
                            }}
                        >
                            <ComboboxInput placeholder="Select Author" />
                            <ComboboxContent>
                                <ComboboxList>
                                    {filterOptions.author.map((item) => (
                                        <ComboboxItem key={item} value={item}>
                                            {item}
                                        </ComboboxItem>
                                    ))}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50 border-b">
                            <TableHead className="px-6 py-3 font-semibold text-gray-700">Title</TableHead>
                            <TableHead className="px-6 py-3 font-semibold text-gray-700">Author</TableHead>
                            <TableHead className="px-6 py-3 font-semibold text-gray-700">Posted Date</TableHead>
                            <TableHead className="px-6 py-3 font-semibold text-gray-700">Visibility</TableHead>
                            <TableHead className="px-6 py-3 font-semibold text-gray-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    {isLoading || searchLoading ? (
                        <TableBody>
                            {[...Array(5)].map((_, i) => (
                                <TableRow key={i} className="border-b">
                                    <TableCell className="px-6 py-4"><Skeleton className="h-4 w-22" /></TableCell>
                                    <TableCell className="px-6 py-4"><Skeleton className="h-4 w-14" /></TableCell>
                                    <TableCell className="px-6 py-4"><Skeleton className="h-4 w-18" /></TableCell>
                                    <TableCell className="px-6 py-4"><Skeleton className="h-4 w-10" /></TableCell>
                                    <TableCell className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Skeleton className="h-8 w-10" />
                                            <Skeleton className="h-8 w-10" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    ) : (
                        filteredPosts && filteredPosts.length > 0 ? (

                            <TableBody>
                                {filteredPosts.map((post) => (
                                    <PostTableRow
                                        key={post.id}
                                        post={post}
                                        onView={handleViewPost}
                                        onMarkInappropriate={handleMarkInappropriate}
                                        formatDate={formatDate}
                                        loading={loading}
                                    />
                                ))}
                            </TableBody>
                        ) : (
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={7} className="p-8 text-center text-gray-500">
                                        No posts found
                                    </TableCell>
                                </TableRow>
                            </TableBody>        
                        )
                    )}
                </Table>
            </div>
        </div>
    )
}

export default HrPosts
