import { Briefcase, User } from "lucide-react"
import { NavLink } from "react-router-dom"

function EmployeeNavigation() {
    return (
        <div className="flex gap-3 bg-slate-800 justify-between w-full p-2 text-white fixed">
            <div className="flex gap-2">
                <Briefcase />
                <div>
                    <div>
                        HRMS
                    </div>
                    <div className="text-xs">
                        EMPLOYEE
                    </div>

                </div>
            </div>
            <div className="flex gap-3">
                <NavLink
                    className={({ isActive }) => (isActive ? "underline" : "")}
                    to={"./dashboard"}
                >
                    Dashboard
                </NavLink>
                <NavLink
                    className={({ isActive }) => (isActive ? "underline" : "")}
                    to={"./travel"}
                >
                    Travel
                </NavLink>
            </div>
            <div>
                <User />
            </div>
        </div>
    )
}

export default EmployeeNavigation
