import type { ExpenseCategoryResponseDto } from '../../../type/Types'

function ExpenseCategoryCard({category}:{category:ExpenseCategoryResponseDto}) {
    return (
        <tr>
            <td className='border-2 p-3'>{category.id}</td>
            <td className='border-2 p-3'>{category.category}</td>
        </tr>
    )
}

export default ExpenseCategoryCard
