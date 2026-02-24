import { GetAllPosts } from "@/api/PostService"
import type { PagedRequestDto, PostResponseDto } from "@/type/Types"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "../ui/card"
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
        pageSize: 5
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
        <div className="p-5">
            <div className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={() => navigate("./mypost")}
                >
                    My Posts
                </Button>
                <Button onClick={() => navigate("./create")}><Plus /> Add Post</Button>
            </div>
            <Card className="p-5 m-10">
                <div className="flex justify-center font-bold text-3xl gap-2 mb-10"><Images className="" size={30} /><span>Posts</span></div>
                <InputGroup className="">
                    <InputGroupInput placeholder="Search post..." onChange={(e) => setSearch(e.target.value)} value={search} />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">{filteredPosts?.length || 0} Results</InputGroupAddon>
                </InputGroup>
                <CardContent>
                    {
                        !isLoading ?
                            (
                                filteredPosts && filteredPosts.length > 0
                                    ? (
                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                                            {filteredPosts.map((post) => (
                                                <PostCard key={post.id} post={post} />
                                            ))
                                            }
                                        </div>
                                    )
                                    : (<div>
                                        <div className="flex flex-col items-center gap-2">
                                            <p className="text-gray-500">No posts found</p>
                                            <Button onClick={() => navigate("./create")}><Plus /> Create First Post</Button>
                                        </div>
                                    </div>)
                            )
                            : (<div>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                                    {
                                        Array.from({ length: 8 }).map((_, idx) => (
                                            <div key={idx} className="border rounded-md p-4 shadow animate-pulse">
                                                <div>
                                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                                    <Skeleton className="h-4 w-1/2 mb-2" />
                                                </div>
                                                <Skeleton className="h-40 w-full mb-2" />
                                                <Skeleton className="h-3 w-full mb-2" />
                                                <Skeleton className="h-3 w-full mb-2" />
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>)
                    }
                </CardContent>
                {data && data.totalPages >= 1 && (
                    <div className="mt-6">
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
            </Card>

        </div>
    )
}

export default Posts
