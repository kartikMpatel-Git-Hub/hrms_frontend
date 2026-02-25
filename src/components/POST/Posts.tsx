import { GetAllPosts } from "@/api/PostService"
import type { PagedRequestDto, PostResponseDto } from "@/type/Types"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PostCard from "./PostCard"
import { Images, Plus, Search } from "lucide-react"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination"

function Posts() {
    const navigate = useNavigate()

    const [paged, setPaged] = useState<PagedRequestDto>({
        pageNumber: 1,
        pageSize: 6
    })

    const { data, isLoading } = useQuery({
        queryKey: ["posts", paged.pageNumber, paged.pageSize],
        queryFn: () => GetAllPosts(paged)
    })
    const [posts, setPosts] = useState<PostResponseDto[]>()
    const [filteredPosts, setFilteredPosts] = useState<PostResponseDto[]>()
    const [search, setSearch] = useState<string>("")

    useEffect(() => {
        if (data) {
            setPosts(data.data)
        }
    }, [data])

    useEffect(() => {
        if (posts) {
            const filtered = posts.filter(post =>
                post.title.toLowerCase().includes(search.toLowerCase()) ||
                post.description.toLowerCase().includes(search.toLowerCase()) ||
                post.postByUser.email.toLowerCase().includes(search.toLowerCase()) ||
                post.postByUser.fullName.toLowerCase().includes(search.toLowerCase())
            )
            setFilteredPosts(filtered)
        }
    }, [posts, search])

    return (
        <div className="p-5 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h2 className="text-3xl font-bold flex items-center gap-2">
                    <Images size={32} />
                    Posts
                </h2>
                <div className="flex gap-2 mt-4 sm:mt-0">
                    <Button variant="outline" size="sm" onClick={() => navigate("./mypost")}>My Posts</Button>
                    <Button size="sm" onClick={() => navigate("./create")}>
                        <Plus /> Add Post
                    </Button>
                </div>
            </div>

            <div className="mb-6 flex justify-center">
                <InputGroup className="w-full max-w-md">
                    <InputGroupInput
                        placeholder="Search posts by title, description or author..."
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />
                    <InputGroupAddon>
                        <Search className="text-gray-500" />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end" className="text-sm text-gray-600">
                        {filteredPosts ? filteredPosts.length : 0} results
                    </InputGroupAddon>
                </InputGroup>
            </div>

            <div className="min-h-[40vh]">
                {!isLoading ? (
                    filteredPosts && filteredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredPosts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <p className="text-gray-500 text-lg">No posts found</p>
                            <Button onClick={() => navigate("./create")}>
                                <Plus /> Create Your First Post
                            </Button>
                        </div>
                    )
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <div key={idx} className="border rounded-md p-4 shadow animate-pulse">
                                <div>
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-1/2 mb-2" />
                                </div>
                                <Skeleton className="h-40 w-full mb-2" />
                                <Skeleton className="h-3 w-full mb-2" />
                                <Skeleton className="h-3 w-full mb-2" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {data && data.totalPages >= 1 && (
                <div className="mt-8 flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setPaged(prev => ({ ...prev, pageNumber: Math.max(1, prev.pageNumber - 1) }))}
                                    disabled={paged.pageNumber === 1}
                                />
                            </PaginationItem>
                            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        onClick={() => setPaged(prev => ({ ...prev, pageNumber: page }))}
                                        isActive={paged.pageNumber === page}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setPaged(prev => ({ ...prev, pageNumber: Math.min(data.totalPages, prev.pageNumber + 1) }))}
                                    disabled={paged.pageNumber === data.totalPages}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    )
}

export default Posts
