import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {  GetTravelerTravel} from '@/api/TravelService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, IndianRupee } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { PagedRequestDto, TravelResponse } from '@/type/Types';
import { useState } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

function MemberTravels() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const memberId = parseInt(id || '0', 10);

  const [paged, setPaged] = useState<PagedRequestDto>({
    pageNumber: 1,
    pageSize: 5
  })

  const { data: travelsData, isLoading: travelsLoading } = useQuery({
    queryKey: ['travels', memberId, paged],
    queryFn: () => GetTravelerTravel(memberId, paged),
    enabled: memberId > 0,
  });
  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleViewDocuments = (travel: TravelResponse) => {
    navigate(`./${travel.id}/document`);
  };

  const handleViewExpenses = (travel: TravelResponse) => {
    navigate(`./${travel.id}/expense`);

  };

  return (
    <div className="space-y-6 p-6">
      {travelsLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : travelsData?.data?.length! > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Member Travels</CardTitle>
            <CardDescription>View all travels with documents and expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Max Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {travelsData?.data?.map((travel) => (
                    <TableRow key={travel.id}>
                      <TableCell className="font-medium">{travel.title}</TableCell>
                      <TableCell>{travel.location}</TableCell>
                      <TableCell>{formatDate(travel.startDate)}</TableCell>
                      <TableCell>{formatDate(travel.endDate)}</TableCell>
                      <TableCell><IndianRupee className="h-4 w-4 inline mr-1" />{travel.maxAmountLimit}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDocuments(travel)}
                            className="flex gap-2 items-center"
                            title={`Endpoint: /travel/${travel.id}/traveler/${memberId}/document`}
                          >
                            <FileText className="h-4 w-4" />
                            Documents
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewExpenses(travel)}
                            className="flex gap-2 items-center"
                            title={`Endpoint: /travel/${travel.id}/traveler/${memberId}/expense`}
                          >
                            <IndianRupee className="h-4 w-4" />
                            Expenses
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">
              No travels found for this member.
            </p>
          </CardContent>
        </Card>
      )}
      {travelsData && travelsData.totalPages >= 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPaged(prev => ({ ...prev, pageNumber: Math.max(1, prev.pageNumber - 1) }))}
                  disabled={paged.pageNumber === 1}
                />
              </PaginationItem>
              {Array.from({ length: travelsData.totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setPaged(prev => ({ ...prev, pageNumber: page }))}
                    isActive={paged.pageNumber === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPaged(prev => ({ ...prev, pageNumber: Math.min(travelsData.totalPages, prev.pageNumber + 1) }))}
                  disabled={paged.pageNumber === travelsData.totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

export default MemberTravels;