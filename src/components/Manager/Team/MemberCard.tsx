import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, UserRoundSearch } from 'lucide-react';
import type { UserReponseDto } from '@/type/Types';
import { TableCell, TableRow } from '@/components/ui/table';

interface MemberCardProps {
  index : number,
  member: UserReponseDto,
}

function MemberCard({ member,index }: MemberCardProps) {
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

  function handleViewProfile(): void {
    navigate(`../${member.id}`)
  }

  return (
    <TableRow key={member.id} className="hover:bg-muted/50">
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={member.image} alt={member.fullName} />
            <AvatarFallback className="bg-blue-500 text-white">
              {getInitials(member.fullName)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{member.fullName}</span>
        </div>
      </TableCell>
      <TableCell className="text-sm text-gray-600">
        {member.email}
      </TableCell>
      <TableCell>
        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
          {member.role}
        </span>
      </TableCell>
      <TableCell>{member.designation || "-"}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewTravels}
            title="View Travels"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={handleViewProfile}
            title="View Profile"
          >
            <UserRoundSearch className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default MemberCard;
