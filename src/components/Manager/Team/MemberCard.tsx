import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye } from 'lucide-react';
import type { UserReponseDto } from '@/type/Types';

interface MemberCardProps {
  member: UserReponseDto;
}

function MemberCard({ member }: MemberCardProps) {
  const navigate = useNavigate();

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleViewTravels = () => {
    navigate(`/manager/my-team/${member.id}/travels`);
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={member.image}
                alt={member.fullName}
              />
              <AvatarFallback>{getInitials(member.fullName)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{member.fullName}</CardTitle>
              <CardDescription>{member.email}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600">Role:</span>
            <span className="text-sm">{member.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600">Designation:</span>
            <span className="text-sm">{member.designation || 'N/A'}</span>
          </div>
        </div>
        <Button
          onClick={handleViewTravels}
          className="w-full mt-4"
          variant="default"
        >
          <Eye className="mr-2 h-4 w-4" />
          View Travels
        </Button>
      </CardContent>
    </Card>
  );
}

export default MemberCard;
