import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { GetTravelTravelerDocuments } from "@/api/TravelService";
import { useEffect, useState } from "react";
import type { PagedRequestDto, TravelDocumentDto } from "@/type/Types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { File, Search, Eye, Download } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"


function TravelDocument() {
  const { travelId, id } = useParams<{ travelId: string; id: string }>();
  const [documents, setDocuments] = useState<TravelDocumentDto[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<TravelDocumentDto[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [paged,setPaged] = useState<PagedRequestDto>({
    pageNumber : 1,
    pageSize : 1
  })

  const tId = parseInt(travelId || "0", 10);
  const travId = parseInt(id || "0", 10);

  const { data, isLoading } = useQuery({
    queryKey: ["travel-documents", tId, travId,paged],
    queryFn: () => GetTravelTravelerDocuments(tId, travId,paged),
    enabled: tId > 0 && travId > 0,
  });

  useEffect(() => {
    if (data) {
      setDocuments(data.data);
      setFilteredDocuments(data.data);
    }
  }, [data]);

  useEffect(() => {
    setIsSearching(true);
    const timeout = setTimeout(() => {
      if (search.trim() === "") {
        setFilteredDocuments(documents);
      } else {
        const filtered = documents.filter(
          (doc) =>
            doc.documentName.toLowerCase().includes(search.toLowerCase()) ||
            doc.documentType.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredDocuments(filtered);
      }
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, documents]);

  const formatDate = (date: string | Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewDocument = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <File className="h-5 w-5" />
            Travel Documents
          </CardTitle>
          <CardDescription>
            Documents for Travel ID: {travelId}, Traveler ID: {id}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 items-center">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by document name or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <span className="text-sm text-gray-500">
              {filteredDocuments.length} of {documents.length} results
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <File className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No documents found for this travel and traveler</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Uploaded At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isSearching ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-28" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-16" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                        No documents match your search
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-semibold">{doc.documentName}</TableCell>
                        <TableCell>{doc.documentType}</TableCell>
                        <TableCell>{doc.uploader?.email || "N/A"}</TableCell>
                        <TableCell>{formatDate(doc.uploadedAt)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDocument(doc.documentUrl)}
                              className="flex gap-2 items-center"
                              title="View document"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={true}
                              className="flex gap-2 items-center"
                              title="Download document"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </div>
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

export default TravelDocument;
