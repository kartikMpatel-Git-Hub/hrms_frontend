import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GetMyTeamMembers } from '@/api/UserService';
import { GetHrTravel } from '@/api/TravelService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { PagedRequestDto, TravelResponse } from '@/type/Types';

function MemberTravels() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const memberId = parseInt(id || '0', 10);

  const paged: PagedRequestDto = {
    pageNumber: 1,
    pageSize: 10
  };

  const { data: teamData, isLoading: memberLoading } = useQuery({
    queryKey: ['my-team', paged],
    queryFn: () => GetMyTeamMembers(paged),
    enabled: memberId > 0,
  });

  const { data: travelsData, isLoading: travelsLoading } = useQuery({
    queryKey: ['travels'],
    queryFn: () => GetHrTravel({ pageNumber: 1, pageSize: 100 }),
    enabled: memberId > 0,
  });

  const member = teamData?.data?.find(m => m.id === memberId);
  const memberTravels = travelsData?.data?.filter((travel: TravelResponse) => travel.createdBy === memberId) || [];
  const isLoading = memberLoading || travelsLoading;

  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (memberLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/manager/my-team')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{member?.fullName}'s Travels</h1>
          <p className="text-gray-600">{member?.email}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : memberTravels.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {memberTravels.map((travel) => (
            <Card key={travel.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{travel.title}</CardTitle>
                <CardDescription>{travel.location}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{travel.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">From:</span>
                    <span>{formatDate(travel.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">To:</span>
                    <span>{formatDate(travel.endDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Max Amount:</span>
                    <span>${travel.maxAmountLimit}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">
              No travels found for this member.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default MemberTravels;