import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AdminTransaction } from '@/types/admin';
import { useState } from 'react';

interface TransactionsTableProps {
  transactions: AdminTransaction[];
  onUpdateStatus: (
    transactionId: string,
    status: 'completed' | 'rejected',
    reason?: string
  ) => void;
}

export const TransactionsTable = ({ transactions, onUpdateStatus }: TransactionsTableProps) => {
  const [selectedTransaction, setSelectedTransaction] = useState<AdminTransaction | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const handleApprove = (transaction: AdminTransaction) => {
    onUpdateStatus(transaction.id, 'completed');
  };

  const handleReject = () => {
    if (selectedTransaction) {
      onUpdateStatus(selectedTransaction.id, 'rejected', rejectionReason);
      setShowDialog(false);
      setRejectionReason('');
      setSelectedTransaction(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.user_email ?? '—'}</TableCell>
                <TableCell className="capitalize">{transaction.type ?? '—'}</TableCell>
                <TableCell>${(transaction.amount ?? 0).toFixed(2)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      transaction.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : transaction.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {transaction.status}
                  </span>
                </TableCell>
                <TableCell>
                  {transaction.created_at
                    ? new Date(transaction.created_at).toLocaleDateString()
                    : '—'}
                </TableCell>
                <TableCell className="space-x-2">
                  {transaction.status === 'pending' && (
                    <>
                      <Button
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(transaction)}
                      >
                        Approve
                      </Button>
                      <Dialog open={showDialog} onOpenChange={setShowDialog}>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            onClick={() => setSelectedTransaction(transaction)}
                          >
                            Reject
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reject Transaction</DialogTitle>
                            <DialogDescription>
                              Please provide a reason for rejection
                            </DialogDescription>
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
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No pending transactions
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
