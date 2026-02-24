import { useQuery } from "@tanstack/react-query"
import { GetUserForHr } from "@/api/UserService"
import { useEffect, useState } from "react"
import { type UserReponseDto } from "@/type/Types"
import { Search, Plus, UserSearch } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useNavigate } from "react-router"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

function HrUsers() {
    const navigate = useNavigate()
    const [users, setUsers] = useState<UserReponseDto[]>([])
    const [filteredUsers, setFilteredUsers] = useState<UserReponseDto[]>([])
    const [searchQuery, setSearchQuery] = useState("")

    const { isLoading, data, error } = useQuery({
        queryKey: ["hr-users"],
        queryFn: GetUserForHr,
    })

    useEffect(() => {
        if (data?.data) {
            setUsers(data.data)
            setFilteredUsers(data.data)
        }
    }, [data])

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredUsers(users)
            return
        }

        const query = searchQuery.toLowerCase()
        const filtered = users.filter(
            (user) =>
                user.fullName.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.designation?.toLowerCase().includes(query) ||
                user.department?.departmentName.toLowerCase().includes(query) ||
                user.role.toLowerCase().includes(query)
        )
        setFilteredUsers(filtered)
    }, [searchQuery, users])

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-96 text-red-500">
                Error loading users
            </div>
        )
    }

    function handleOpenProfile(id: number): void {
        navigate(`./${id}`)
    }

    return (
        <div className="w-full p-4">
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Users</h1>
                    <Button onClick={() => navigate("./add")}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                    </Button>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by name, email, designation, department, or role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Designation</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Date of Join</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(isLoading) ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index} className="hover:bg-transparent">
                                    <TableCell>
                                        <Skeleton className="h-6 w-6" />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-48" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-32" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-20" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-8" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map((user, index) => (
                                <TableRow key={user.id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user.image} alt={user.fullName} />
                                                <AvatarFallback className="bg-blue-500 text-white">
                                                    {getInitials(user.fullName)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{user.fullName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {user.email}
                                    </TableCell>
                                    <TableCell>
                                        {user.department ? (
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                                {user.department.departmentName}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{user.designation || "-"}</TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                                            {user.role}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {new Date(user.dateOfJoin).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        <Button onClick={() => handleOpenProfile(user.id)}><UserSearch /></Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    No users found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {!isLoading && filteredUsers.length > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                    Showing {filteredUsers.length} of {users.length} users
                </div>
            )}
        </div>
    )
}

export default HrUsers
