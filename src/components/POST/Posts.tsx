import { GetAllPosts } from "@/api/PostService"
import type { PagedRequestDto, PostResponseDto } from "@/type/Types"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CardContent } from "../ui/card"
import PostCard from "./PostCard"
import { Images, Plus } from "lucide-react"
import { Button } from "../ui/button"

function Posts() {
    const navigate = useNavigate()

    const [paged] = useState<PagedRequestDto>({
        pageNumber: 1,
        pageSize: 10
    })

    const { data, isLoading } = useQuery({
        queryKey: ["posts"],
        queryFn: () => GetAllPosts(paged)
    })
    const [posts, setPosts] = useState<PostResponseDto[]>()

    useEffect(() => {
        if (data) {
            // console.log(data)
            setPosts(data.data)
        }
    }, [data])

    return (
        <div className="p-5">
            {/* <Card> */}
            <div className="flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={() => navigate("./mypost")}
                >
                    My Posts
                </Button>
                <Button onClick={() => navigate("./create")}><Plus /> Add Post</Button>
            </div>
            <div className="flex justify-center font-bold text-3xl gap-2 mb-10"><Images className="" size={30} /><span>Posts</span></div>
            <CardContent>
                {
                    !isLoading ?
                        (
                            posts && posts.length > 0
                                ? (
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                                        {posts.map((post) => (
                                            <PostCard key={post.id} post={post} />
                                        ))
                                        }
                                    </div>
                                )
                                : (<div>No posts found</div>)
                        )
                        : (<div>Loading...</div>)
                }
            </CardContent>
        </div>
    )
}

export default Posts
