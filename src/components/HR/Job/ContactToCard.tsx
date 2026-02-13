import type { UserReponseDto } from '../../../type/Types'

function ContactToCard({ contact }: { contact: UserReponseDto }) {
    return (
        <div className="p-3 border-2 rounded-2xl">
            <div>
                <img
                    src={`${contact.image}`}
                    alt="Not Found"
                    className="h-fit rounded-2xl w-50 flex justify-center"
                />
            </div>
            <div><span className="font-bold italic">Name : </span>{contact.fullName}</div>
            <div><span className="font-bold italic">Email : </span>{contact.email}</div>
            <div><span className="font-bold italic">DOB : </span>{contact.dateOfBirth.toString().substring(0, 10)}</div>
            <div><span className="font-bold italic">DOJ : </span>{contact.dateOfJoin.toString().substring(0, 10)}</div>
            <div className="font-bold"><span className="font-bold italic">Role : </span><span className="bg-slate-800 rounded-sm p-1 text-white">{contact.role}</span></div>
            <div><span className="font-bold italic">Designation : </span>{contact.designation}</div>
        </div>
    )
}

export default ContactToCard
