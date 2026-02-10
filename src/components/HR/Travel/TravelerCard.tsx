import type { Traveler } from "../../../type/Types"

function TravelerCard({traveler} : {traveler : Traveler}) {
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
        <div className="font-bold"><span className="font-bold italic">Role : </span>{traveler.role}</div>
    </div>
  )
}

export default TravelerCard
