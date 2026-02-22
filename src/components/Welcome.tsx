import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"

function Welcome() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate("../")
    }

    const handleLoginAs = (role: string) => {
        navigate("/login")
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, Admin</h1>
                    <p className="text-gray-600">Logged in as: <span className="font-semibold">{user?.email}</span></p>
                </div>

                {user && (
                    <div className="bg-gray-50 p-6 rounded-lg mb-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Role</p>
                                <p className="text-lg font-semibold text-gray-800">{user.role}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">User ID</p>
                                <p className="text-lg font-semibold text-gray-800">{user.id}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <div className="border-t pt-6">
                        <p className="text-sm text-gray-600 mb-4">Login as a different role:</p>
                        <div className="grid grid-cols-3 gap-3">
                            <div >
                                HR
                            </div>
                            <div>
                                Employee
                            </div>
                            <div>
                                Manager
                            </div> 
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t">
                        <Button 
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Welcome
