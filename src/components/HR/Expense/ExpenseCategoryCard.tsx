import type { ExpenseCategoryResponseDto } from '../../../type/Types'
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item'
import { Building2, List } from 'lucide-react'


function ExpenseCategoryCard({ category }: { category: ExpenseCategoryResponseDto }) {
    return (
        <Item variant="outline">
            <ItemMedia variant="icon">
                <List />
            </ItemMedia>
            <ItemContent>
                <ItemTitle>{category.category}</ItemTitle>
            </ItemContent>
        </Item>
    )
}

export default ExpenseCategoryCard
