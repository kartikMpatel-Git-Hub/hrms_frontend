import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GetMyTeamMembers } from '@/api/UserService';
import { GetHrTravel, GetTravelerTravel, GetTravelTravelerDocuments } from '@/api/TravelService';
import { GetTravelTravelerExpense } from '@/api/ExpenseService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, FileText, DollarSign, Eye, IndianRupee } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { PagedRequestDto, TravelResponse } from '@/type/Types';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

function MemberTravels() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const memberId = parseInt(id || '0', 10);
  const [selectedTravel, setSelectedTravel] = useState<TravelResponse | null>(null);
  const [viewMode, setViewMode] = useState<'documents' | 'expenses' | null>(null);

  const paged: PagedRequestDto = {
    pageNumber: 1,
    pageSize: 10
  };

  const { data: travelsData, isLoading: travelsLoading } = useQuery({
    queryKey: ['travels', memberId, paged],
    queryFn: () => GetTravelerTravel(memberId, paged),
    enabled: memberId > 0,
  });

  const { data: documentsData = [] } = useQuery({
    queryKey: ['documents', selectedTravel?.id, memberId],
    queryFn: () => GetTravelTravelerDocuments({ travelId: selectedTravel?.id, travelerId: memberId }),
    enabled: !!selectedTravel && viewMode === 'documents',
  });

  const { data: expensesData = [] } = useQuery({
    queryKey: ['expenses', selectedTravel?.id, memberId],
    queryFn: () => GetTravelTravelerExpense({ travelId: selectedTravel?.id, travelerId: memberId }),
    enabled: !!selectedTravel && viewMode === 'expenses',
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
    setSelectedTravel(travel);
    setViewMode('documents');
    navigate(`./${travel.id}/document`);
  };

  const handleViewExpenses = (travel: TravelResponse) => {
    setSelectedTravel(travel);
    setViewMode('expenses');
    navigate(`./${travel.id}/expense`);

  };

  const handleCloseDialog = () => {
    setViewMode(null);
    setSelectedTravel(null);
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

      <Dialog open={viewMode !== null} onOpenChange={() => handleCloseDialog()}>
        <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {viewMode === 'documents' ? 'Travel Documents' : 'Travel Expenses'}
            </DialogTitle>
            <DialogDescription>
              {selectedTravel?.title} - {selectedTravel?.location}
              <br />
            </DialogDescription>
          </DialogHeader>

          {viewMode === 'documents' && (
            <div>
              {documentsData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentsData.map((doc, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{doc.documentName}</TableCell>
                        <TableCell>{doc.documentType}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-gray-600 py-4">No documents found</p>
              )}
            </div>
          )}

          {viewMode === 'expenses' && (
            <div>
              {expensesData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expensesData.map((expense, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{expense.category.category || 'N/A'}</TableCell>
                        <TableCell className="font-medium"><IndianRupee className="h-4 w-4 inline mr-1" />{expense.amount || '0'}</TableCell>
                        <TableCell>{expense.status || 'Pending'}</TableCell>
                        <TableCell>{formatDate(expense.expenseDate || new Date())}</TableCell>
                        <TableCell><Button variant="outline" size="sm" onClick={() => navigate(`./${selectedTravel?.id}/expense`)}>View</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-gray-600 py-4">No expenses found</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MemberTravels;