import type { UserReponseDto } from '../../../type/Types'

function UserCard({ user }: { user: UserReponseDto }) {
    return (
        <div className="p-3 border-2 rounded-2xl">
            {/* <div className="flex justify-center">
                <img
                    src={`${user?.image}`}
                    alt="Not Found"
                    className="h-fit rounded-2xl w-50 flex justify-center"
                />
            </div> */}
            <div className='flex justify-center p-2 font-bold border-b-2'>
                Uploaded By
            </div>
            <div className="flex justify-center">
                <div>
                    <div><span className="font-bold italic">Name : </span>{user?.fullName}</div>
                    <div><span className="font-bold italic">Email : </span>{user?.email}</div>
                    <div><span className="font-bold italic">DOB : </span>{user?.dateOfBirth.toString().substring(0, 10)}</div>
                    <div><span className="font-bold italic">DOJ : </span>{user?.dateOfJoin.toString().substring(0, 10)}</div>
                    <div className="font-bold"><span className="font-bold italic">Role : </span><span className="bg-slate-800 rounded-sm p-1 text-white">{user?.role}</span></div>
                    <div><span className="font-bold italic">Designation : </span>{user?.designation}</div>
                </div>
            </div>
        </div>
    )
}

export default UserCard