import type { JobResponseDto } from '../../../type/Types'

interface EmployeeJobCardProp{
    job : JobResponseDto,
    isPending : boolean,
    handleReferred : (id : number) => void,
    handleShare : (id : number) => void
}

function EmployeeJobCard({ job , isPending, handleReferred,handleShare}: EmployeeJobCardProp) {

    return (
        <div className="border-2 p-2">
            <div className='bg-slate-800 w-fit px-2 rounded-2xl text-white'>{job.id}</div>
            <div><span>Title : </span>{job.title}</div>
            <div><span>Job Role : </span>{job.title}</div>
            <div><span>Place : </span>{job.place}</div>
            <div><span>Requirements : </span>{job.requirements}</div>
            <div><span>Acvtivation Status : </span>{job.isActive ? "Active" : "Inactive"}</div>
            <div className="flex justify-center border-2 p-2">
                <img
                    src={job.jdUrl}
                    className="w-20"
                />
            </div>
            <div className="flex justify-center gap-3">
                <button className='bg-slate-800 m-2 p-2 text-white rounded-sm hover:cursor-pointer disabled:opacity-50' disabled={isPending} onClick={() => handleReferred(job.id)}>Referred</button>
                <button className='bg-slate-800 m-2 p-2 text-white rounded-sm hover:cursor-pointer disabled:opacity-50' disabled={isPending} onClick={() => handleShare(job.id)}>Share</button>
            </div>
            {/* Put Download button instead of image */}
        </div>
    )
}

export default EmployeeJobCard
