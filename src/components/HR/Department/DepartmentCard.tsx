import { ArrowUpRight, Building2, Eye, InboxIcon, Trash } from 'lucide-react'
import type { DepartmentResponseDto } from '../../../type/Types'
import { useNavigate } from 'react-router-dom'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import { Button } from '@/components/ui/button'
function DepartmentCard({ department }: { department: DepartmentResponseDto }) {

    const navigator = useNavigate()

    const handleOpenDepartment = () => {
        navigator(`./${department.id}`)
    }
    return (
        <Item variant="outline">
            <ItemMedia variant="icon">
                <Building2 />
            </ItemMedia>
            <ItemContent>
                <ItemTitle>{department.departmentName}</ItemTitle>
            </ItemContent>
        </Item>
    )
}

export default DepartmentCard
