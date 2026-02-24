import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import type { UserProfileResponseDto } from "@/type/Types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Mail, Calendar, Briefcase, Users, Loader } from "lucide-react"
import { UserService } from "@/api/UserService"

function UserProfile() {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<UserProfileResponseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!id) {
        setError("User ID is required")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await UserService.getUserProfile(Number(id))
        setUser(response)
        setError(null)
      } catch (err) {
        setError("Failed to load user profile")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [id])

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="space-y-4">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error || "User not found"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.fullName}
                  className="h-32 w-32 rounded-full object-cover border-4 border-primary"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary">
                  <span className="text-3xl font-semibold text-primary">
                    {user.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.fullName}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="default">{user.role}</Badge>
                  <Badge variant="outline">{user.designation}</Badge>
                  {user.department && (
                    <Badge variant="secondary">{user.department.departmentName}</Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>DOB: {formatDate(user.dateOfBirth)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Joined: {formatDate(user.dateOfJoin)}</span>
                </div>
                {user.designation && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="h-4 w-4" />
                    <span>{user.designation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {user.reported && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Manager
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {user.reported.image ? (
                <img
                  src={user.reported.image}
                  alt={user.reported.fullName}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">
                    {user.reported.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-gray-900">{user.reported.fullName}</h3>
                <p className="text-sm text-gray-600">{user.reported.designation}</p>
                <p className="text-xs text-gray-500">{user.reported.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {user.team && user.team.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members ({user.team.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.team.map((member) => (
                <div key={member.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-center gap-3 mb-3">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.fullName}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {member.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{member.fullName}</h4>
                      <p className="text-xs text-gray-500 truncate">{member.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Role:</span>
                      <Badge variant="outline" className="text-xs">{member.role}</Badge>
                    </div>
                    {member.designation && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Position:</span>
                        <span className="text-gray-900 font-medium">{member.designation}</span>
                      </div>
                    )}
                    {member.department && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Department:</span>
                        <span className="text-gray-900 text-xs">{member.department.departmentName}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default UserProfile
