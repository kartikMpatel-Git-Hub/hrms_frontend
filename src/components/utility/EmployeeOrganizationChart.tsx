import { GetUserByKey } from "@/api/JobService"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import useDebounce from "@/hook/useDebounce"
import type { UserReponseDto } from "@/type/Types"
import { AtSign, Briefcase, Building2, Image, Search, User } from "lucide-react"
import { useEffect, useState } from "react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { Skeleton } from "../ui/skeleton"
import { ItemMedia } from "../ui/item"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useNavigate } from "react-router-dom"

function EmployeeOrganizationChart() {

    const [users, setUsers] = useState<UserReponseDto[] | null>(null)
    const [search, setSearch] = useState<string>("")
    const fetchedUsers = useDebounce<UserReponseDto>(search, 1000, GetUserByKey);
    const navigator = useNavigate()

    useEffect(() => {
        if (fetchedUsers != null) {
            console.log(fetchedUsers);
            
            setUsers(fetchedUsers)
        }
    }, [fetchedUsers])

    useEffect(() => {
        setUsers(null)
    }, [search])

    const handleOpenOrganizationChart = (id : number) => {
        console.log(id);
        navigator(`./${id}`)
    }

    return (
        <div className="m-3">
            <InputGroup className="">
                <InputGroupInput placeholder="Search Employee..." onChange={(e) => setSearch(e.target.value)} value={search} />
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">{users?.length || 0} Results</InputGroupAddon>
            </InputGroup>
            <Table>
                <TableCaption>Employee Of ROIMA</TableCaption>
                <TableHeader>
                    <TableRow className="">
                        <TableHead><div className="flex p-2 gap-1 text-sm"><Image className="w-3 h-3 mt-1" />Image</div></TableHead>
                        <TableHead><div className="flex p-2 gap-1 text-sm"><User className="w-3 h-3 mt-1" />Name</div></TableHead>
                        <TableHead><div className="flex p-2 gap-1 text-sm"><AtSign className="w-3 h-3 mt-1" />Email</div></TableHead>
                        <TableHead><div className="flex p-2 gap-1 text-sm"><Building2 className="w-3 h-3 mt-1" />Department</div></TableHead>
                        <TableHead><div className="flex p-2 gap-1 text-sm"><Briefcase className="w-3 h-3 mt-1" />Designation</div></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        !users ?
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow>
                                    <TableCell><div className="ml-5"><Skeleton className="h-8 w-8 rounded-full" /></div></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 flex-1" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                </TableRow>
                            ))
                            : users?.length > 0
                                ?
                                users.map((u) => (
                                    <TableRow className="font-semibold hover:cursor-pointer" onClick={() => handleOpenOrganizationChart(u.id)} key={u.id}>
                                        <TableCell>
                                            <ItemMedia>
                                                <Avatar>
                                                    <AvatarImage src={u.image} className="grayscale-50" />
                                                    <AvatarFallback>{u.fullName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            </ItemMedia>
                                        </TableCell>
                                        <TableCell>{u.fullName}</TableCell>
                                        <TableCell>{u.email}</TableCell>
                                        <TableCell>{u.department?.departmentName || "N/A"}</TableCell>
                                        <TableCell>{u.designation}</TableCell>
                                    </TableRow>
                                ))
                                :
                                <TableRow>
                                    <TableCell colSpan={5} >
                                        <div className="flex justify-center font-bold">
                                            No User Found !
                                        </div>
                                    </TableCell>
                                </TableRow>
                    }

                </TableBody>
                {/* <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-right">$2,500.00</TableCell>
                    </TableRow>
                </TableFooter> */}
            </Table>
        </div>

    )
}

export default EmployeeOrganizationChart
