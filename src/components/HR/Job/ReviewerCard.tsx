import React from 'react'
import type { UserReponseDto } from '../../../type/Types'

function ReviewerCard({reviewer} : {reviewer : UserReponseDto}) {
    return (<div className="p-3 border-2 rounded-2xl">
        <div>
            <img
                src={`${reviewer.image}`}
                alt="Not Found"
                className="h-fit rounded-2xl w-50 flex justify-center"
            />
        </div>
        <div><span className="font-bold italic">Name : </span>{reviewer.fullName}</div>
        <div><span className="font-bold italic">Email : </span>{reviewer.email}</div>
        <div><span className="font-bold italic">DOB : </span>{reviewer.dateOfBirth.toString().substring(0, 10)}</div>
        <div><span className="font-bold italic">DOJ : </span>{reviewer.dateOfJoin.toString().substring(0, 10)}</div>
        <div className="font-bold"><span className="font-bold italic">Role : </span><span className="bg-slate-800 rounded-sm p-1 text-white">{reviewer.role}</span></div>
        <div><span className="font-bold italic">Designation : </span>{reviewer.designation}</div>
    </div>
    )
}

export default ReviewerCard
