import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { GetTravelTravelerExpense } from "@/api/ExpenseService";
import { useEffect, useState } from "react";
import type { PagedRequestDto, TravelerExpenseDto } from "@/type/Types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, AlertCircle, IndianRupee } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

function TravelExpense() {
  const { travelId, id } = useParams<{ travelId: string; id: string }>();
  const [expenses, setExpenses] = useState<TravelerExpenseDto[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<TravelerExpenseDto[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedExpense, setSelectedExpense] = useState<TravelerExpenseDto | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const tId = parseInt(travelId || "0", 10);
  const travId = parseInt(id || "0", 10);
  const [paged, setPaged] = useState<PagedRequestDto>({
    pageNumber: 1,
    pageSize: 5
  })

  const { data, isLoading } = useQuery({
    queryKey: ["travel-expenses", tId, travId, paged],
    queryFn: () => GetTravelTravelerExpense(tId, travId, paged),
    enabled: tId > 0 && travId > 0,
  });

  useEffect(() => {
    if (data) {
      setExpenses(data.data);
      setFilteredExpenses(data.data);
    }
  }, [data]);

  useEffect(() => {
    setIsSearching(true);
    const timeout = setTimeout(() => {
      if (search.trim() === "") {
        setFilteredExpenses(expenses);
      } else {
        const filtered = expenses.filter(
          (expense) =>
            expense.details.toLowerCase().includes(search.toLowerCase()) ||
            expense.category?.category?.toLowerCase().includes(search.toLowerCase()) ||
            expense.status.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredExpenses(filtered);
      }
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, expenses]);

  const formatDate = (date: string | Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "text-green-600 bg-green-50";
      case "REJECTED":
        return "text-red-600 bg-red-50";
      case "PENDING":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const handleViewExpense = (expense: TravelerExpenseDto) => {
    setSelectedExpense(expense);
    setShowDetailsDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDetailsDialog(false);
    setSelectedExpense(null);
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <IndianRupee className="h-5 w-5" />
            Travel Expenses
          </CardTitle>
          <CardDescription>
            Expenses for Travel ID: {travelId}, Traveler ID: {id}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 items-center">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by details, category, or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <span className="text-sm text-gray-500">
              {filteredExpenses.length} of {expenses.length} results
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <IndianRupee className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No expenses found for this travel and traveler</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sr. No</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Expense Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isSearching ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-6" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-16" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredExpenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500 py-4">
                        <AlertCircle className="h-5 w-5 mx-auto mb-2 opacity-50" />
                        No expenses match your search
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExpenses.map((expense, idx) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-semibold">{idx + 1}</TableCell>
                        <TableCell>{expense.details}</TableCell>
                        <TableCell>{expense.category?.category || "N/A"}</TableCell>
                        <TableCell className="font-semibold"><IndianRupee className="h-4 w-4 inline mr-1" />{expense.amount.toFixed(2)}</TableCell>
                        <TableCell>{formatDate(expense.expenseDate)}</TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(expense.status)}`}>
                            {expense.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewExpense(expense)}
                            className="flex gap-2 items-center"
                            title="View expense details"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDetailsDialog} onOpenChange={() => handleCloseDialog()}>
        <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
            <DialogDescription>
              Details for expense from Travel ID: {travelId}
              <br />
            </DialogDescription>
          </DialogHeader>

          {selectedExpense && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Details</p>
                  <p className="font-semibold">{selectedExpense.details}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-semibold">{selectedExpense.category?.category || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-semibold text-lg"><IndianRupee className="h-4 w-4 inline mr-1" />{selectedExpense.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedExpense.status)}`}>
                    {selectedExpense.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expense Date</p>
                  <p className="font-semibold">{formatDate(selectedExpense.expenseDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Travel ID</p>
                  <p className="font-semibold">{selectedExpense.travelId}</p>
                </div>
              </div>

              {selectedExpense.remarks && (
                <div>
                  <p className="text-sm text-gray-500">Remarks</p>
                  <p className="font-semibold bg-gray-50 p-3 rounded">{selectedExpense.remarks}</p>
                </div>
              )}

              {selectedExpense.proofs && selectedExpense.proofs.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Proofs ({selectedExpense.proofs.length})</p>
                  <div className="space-y-2">
                    {selectedExpense.proofs.map((proof, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <span className="text-sm">{proof.documentType || `Proof ${idx + 1}`}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(proof.proofDocumentUrl, "_blank")}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      {data && data.totalPages >= 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPaged(prev => ({ ...prev, pageNumber: Math.max(1, prev.pageNumber - 1) }))}
                  disabled={paged.pageNumber === 1}
                />
              </PaginationItem>
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => (
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
                  onClick={() => setPaged(prev => ({ ...prev, pageNumber: Math.min(data.totalPages, prev.pageNumber + 1) }))}
                  disabled={paged.pageNumber === data.totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

export default TravelExpense;
