import { Plus, PlusIcon } from 'lucide-react'
import type { Traveler } from '../../../type/Types'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'


interface EmployeesCardProps {
    t: Traveler,
    handleAddTraveler: (id: number) => void,
    isPending: boolean
}

function EmployeesCard({ t, handleAddTraveler, isPending }: EmployeesCardProps) {
    return (
        <>
            <Item key={t.fullName} variant="outline" className='my-1'>
                <ItemMedia>
                    <Avatar>
                        <AvatarImage src={t.image} className="grayscale" />
                        <AvatarFallback>{t.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                </ItemMedia>
                <ItemContent className="gap-1">
                    <ItemTitle>{t.fullName}</ItemTitle>
                    <ItemDescription>{t.email}</ItemDescription>
                </ItemContent>
                <ItemActions>
                    <Button onClick={() => handleAddTraveler(t.id)} disabled={isPending} variant="ghost" size="icon" className="rounded-full">
                        <PlusIcon />
                    </Button>
                </ItemActions>
            </Item>
            {/* <Item className="flex gap-3 border-2 m-2 justify-between">
                <div className="p-3"><img src={t.image} className="w-10" /></div>
                <div>
                    <div className="font-bold">{t.fullName}</div>
                    <div>{t.email}</div>
                </div>
                <div className="p-3">
                    <button
                        title="Add Traveler"
                        onClick={() => handleAddTraveler(t.id)}
                        className="border-2 rounded-2xl h-fit m-auto hover:cursor-pointer hover:bg-slate-800 hover:text-white hover:border-slate-800 disabled:opacity-50"
                        disabled={isPending}
                    >
                        <Plus />
                    </button>
                </div>
            </Item> */}
        </>

    )
}

export default EmployeesCard
