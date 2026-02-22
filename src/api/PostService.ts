import type { CommentResponseDto, PagedResponse, PostDetailedResponseDto, PostResponseDto, PostUpdateDto } from "@/type/Types";
import api from "./Api";

export const GetAllPosts = async ({ pageNumber = 1, pageSize = 10 }): Promise<PagedResponse<PostResponseDto>> => {
    const response = await api.get<PagedResponse<PostResponseDto>>(`/post/feed?PageSize=${pageSize}&PageNumber=${pageNumber}`)
    return response.data
}

export const CreatePost = async (formData: FormData): Promise<void> => {
    await api.post("/post", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

export const GetMyPosts = async ({ pageNumber = 1, pageSize = 10 }): Promise<PagedResponse<PostResponseDto>> => {
    const response = await api.get<PagedResponse<PostResponseDto>>(`/post?PageSize=${pageSize}&PageNumber=${pageNumber}`)
    return response.data
}

export const ToggleLikePost = async (postId: number): Promise<void> => {
    await api.patch(`/post/${postId}/like`)
}

export const MarkPostInappropriate = async (postId: number): Promise<void> => {
    await api.patch(`/post/${postId}/inappropriate`)
}

export const GetInappropriatePosts = async ({ pageNumber = 1, pageSize = 10 }): Promise<PagedResponse<PostResponseDto>> => {
    const response = await api.get<PagedResponse<PostResponseDto>>(`/post/inappropriate?PageSize=${pageSize}&PageNumber=${pageNumber}`)
    return response.data
}

export const GetPostById = async (postId: number): Promise<PostDetailedResponseDto> => {
    const response = await api.get<PostDetailedResponseDto>(`/post/${postId}`)
    return response.data
}

export const GetPostComments = async (postId: number, { pageNumber = 1, pageSize = 10 }): Promise<PagedResponse<CommentResponseDto>> => {
    const response = await api.get<PagedResponse<CommentResponseDto>>(`/post/${postId}/comments?PageSize=${pageSize}&PageNumber=${pageNumber}`)
    return response.data
}

export const CreateComment = async (postId: number, comment: string): Promise<void> => {
    await api.post(`/post/${postId}/comments`, { comment })
}

export const DeletePost = async (postId: number): Promise<void> => {
    await api.delete(`/post/${postId}`)
}

export const EditPost = async (postId: number, dto: PostUpdateDto): Promise<void> => {
    await api.put(`/post/${postId}`, dto)
}

export const deleteComment = async (postId: number, commentId: number): Promise<void> => {
    await api.delete(`/post/${postId}/comments/${commentId}`)
}

export const editComment = async (postId: number, commentId: number, comment: string): Promise<void> => {
    await api.put(`/post/${postId}/comments/${commentId}`, { comment })
}