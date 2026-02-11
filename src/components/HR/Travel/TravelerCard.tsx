import type { Traveler } from "../../../type/Types"

interface TravelCardProps{
  traveler : Traveler,
  handleOpenExpense : (id : number) => void
}

function TravelerCard({traveler,handleOpenExpense} : TravelCardProps) {
  return (
    <div className="p-3 border-2 rounded-2xl">
        <div>
            <img
                src={`${traveler.image}`}
                alt="Not Found"
                className="h-fit rounded-2xl w-50 flex justify-center"
                />
        </div>
        <div><span className="font-bold italic">Name : </span>{traveler.fullName}</div>
        <div><span className="font-bold italic">Email : </span>{traveler.email}</div>
        <div><span className="font-bold italic">DOB : </span>{traveler.dateOfBirth.toString().substring(0,10)}</div>
        <div><span className="font-bold italic">DOJ : </span>{traveler.dateOfJoin.toString().substring(0,10)}</div>
        <div className="font-bold"><span className="font-bold italic">Role : </span><span className="bg-slate-800 rounded-sm p-1 text-white">{traveler.role}</span></div>
        <div><span className="font-bold italic">Designation : </span>{traveler.designation}</div>
        <div className="flex justify-center">
          <button
            onClick={() => handleOpenExpense(traveler.id)}
            className="bg-slate-800 text-white p-2 rounded-sm font-bold hover:cursor-pointer" 
          >
            View Expense
          </button>
        </div>
    </div>
  )
}

export default TravelerCard
