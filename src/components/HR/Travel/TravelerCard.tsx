import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Traveler } from "../../../type/Types"
import { Button } from "@/components/ui/button"
import { Badge } from "lucide-react"

interface TravelCardProps {
  traveler: Traveler,
  handleOpenExpense: (id: number) => void,
  handleOpenDocument: (id: number) => void,
}

function TravelerCard({ traveler, handleOpenExpense, handleOpenDocument }: TravelCardProps) {
  return (
    <>
      <Card className="relative mx-auto w-full max-w-sm pt-0 ">
        <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
        <img
          src={traveler.image}
          alt="Event cover"
          className="relative z-20 aspect-video w-full object-cover brightness-100 grayscale dark:brightness-40"
        />
        <CardHeader>
          <CardAction>
            <div className="bg-slate-900 text-white p-1 rounded-sm font-bold text-sm">{traveler.role}</div>
          </CardAction>
          <CardTitle>{traveler.fullName.toUpperCase()}</CardTitle>
          <div className="text-black/50 text-sm">{traveler.email}</div>
          <CardDescription>
            {/* <div>
              {traveler.designation} <span className="bg-slate-900/60 rounded-sm p-1 text-black font-semibold">{traveler.role}</span>
            </div> */}
            <div className="py-2">
              <div><span className="font-semibold text-black">DOJ :</span> {traveler.dateOfJoin.toString().substring(0, 10)}</div>
              <div><span className="font-semibold text-black">DOB :</span> {traveler.dateOfBirth.toString().substring(0, 10)}</div>
            </div>
            <div>
              <div><span className="font-semibold text-black">Designation :</span> {traveler.designation}</div>
            </div>

          </CardDescription>
        </CardHeader>
        <CardFooter>
          <div className="flex justify-between gap-2">
            <Button className="w-fit hover:cursor-pointer" onClick={() => handleOpenExpense(traveler.id)}>Expense</Button>
            <Button className="w-fit hover:cursor-pointer" onClick={() => handleOpenDocument(traveler.id)}>Documents</Button>
          </div>
        </CardFooter>
      </Card>
      {/* <div className="p-3 border-2 rounded-2xl">
        <div className="flex justify-center">
          <img
            src={`${traveler.image}`}
            alt="Not Found"
            className="h-fit rounded-2xl w-50 flex justify-center"
          />
        </div>
        <div className="flex justify-center">
          <div>
            <div><span className="font-bold italic">Name : </span>{traveler.fullName}</div>
            <div><span className="font-bold italic">Email : </span>{traveler.email}</div>
            <div><span className="font-bold italic">DOB : </span>{traveler.dateOfBirth.toString().substring(0, 10)}</div>
            <div><span className="font-bold italic">DOJ : </span>{traveler.dateOfJoin.toString().substring(0, 10)}</div>
            <div className="font-bold"><span className="font-bold italic">Role : </span><span className="bg-slate-800 rounded-sm p-1 text-white">{traveler.role}</span></div>
            <div><span className="font-bold italic">Designation : </span>{traveler.designation}</div>
          </div>
        </div>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleOpenExpense(traveler.id)}
            className="bg-slate-800 text-white p-2 rounded-sm font-bold hover:cursor-pointer"
          >
            View Expense
          </button>
          <button
            onClick={() => handleOpenDocument(traveler.id)}
            className="bg-slate-800 text-white p-2 rounded-sm font-bold hover:cursor-pointer"
          >
            View Documents
          </button>
        </div>
      </div> */}
    </>
  )
}

export default TravelerCard
