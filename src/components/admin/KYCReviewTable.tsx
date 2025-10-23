import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { AdminKYCReview } from '../../types/admin';
import { useState } from 'react';

interface KYCReviewTableProps {
  reviews: AdminKYCReview[];
  onUpdateStatus: (documentId: string, status: 'approved' | 'rejected', reason?: string) => void;
}

export const KYCReviewTable = ({ reviews, onUpdateStatus }: KYCReviewTableProps) => {
  const [selectedReview, setSelectedReview] = useState<AdminKYCReview | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const handleApprove = (review: AdminKYCReview) => {
    onUpdateStatus(review.id, 'approved');
  };

  const handleReject = () => {
    if (selectedReview) {
      onUpdateStatus(selectedReview.id, 'rejected', rejectionReason);
      setShowDialog(false);
      setRejectionReason('');
      setSelectedReview(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>KYC Verification Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Document Type</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <div className="font-medium">{review.user_email}</div>
                </TableCell>
                <TableCell className="capitalize">
                  {review.document_type ? review.document_type.replace('_', ' ') : '—'}
                </TableCell>
                <TableCell>
                  {review.created_at ? new Date(review.created_at).toLocaleDateString() : '—'}
                </TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => window.open(review.document_url, '_blank')}
                  >
                    View
                  </Button>
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(review)}
                  >
                    Approve
                  </Button>
                  <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" onClick={() => setSelectedReview(review)}>
                        Reject
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reject KYC Document</DialogTitle>
                        <DialogDescription>Please provide a reason for rejection</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Enter rejection reason"
                        />
                        <Button
                          variant="destructive"
                          onClick={handleReject}
                          disabled={!rejectionReason}
                        >
                          Confirm Rejection
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
            {reviews.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No pending KYC reviews
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
