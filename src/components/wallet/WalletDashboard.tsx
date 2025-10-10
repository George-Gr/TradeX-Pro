import { useState } from 'react';
import { useWallet } from '@/hooks/use-wallet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const WalletDashboard = () => {
  const { balance, transactions, initiateDeposit, initiateWithdrawal, isLoading } = useWallet();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [isDeposit, setIsDeposit] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  const handleTransaction = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (isDeposit) {
        await initiateDeposit.mutateAsync({ amount: numAmount });
        toast({
          title: 'Deposit initiated',
          description: 'Your deposit request has been submitted for processing.',
        });
      } else {
        await initiateWithdrawal.mutateAsync({ amount: numAmount });
        toast({
          title: 'Withdrawal initiated',
          description: 'Your withdrawal request has been submitted for processing.',
        });
      }
      setAmount('');
      setShowDialog(false);
    } catch (error: any) {
      toast({
        title: 'Transaction failed',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${balance?.available_balance.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pending Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              ${balance?.pending_deposits.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pending Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              ${balance?.pending_withdrawals.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex space-x-4">
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setIsDeposit(true);
                setAmount('');
              }}
            >
              Deposit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isDeposit ? 'Deposit' : 'Withdraw'} Funds</DialogTitle>
              <DialogDescription>
                Enter the amount you want to {isDeposit ? 'deposit' : 'withdraw'}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Button onClick={handleTransaction} className="w-full">
                Confirm {isDeposit ? 'Deposit' : 'Withdrawal'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeposit(false);
                setAmount('');
              }}
            >
              Withdraw
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {format(new Date(transaction.created_at), 'yyyy-MM-dd HH:mm')}
                  </TableCell>
                  <TableCell className="capitalize">{transaction.type}</TableCell>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell
                    className={`capitalize ${
                      transaction.status === 'completed'
                        ? 'text-green-500'
                        : transaction.status === 'rejected'
                          ? 'text-red-500'
                          : 'text-yellow-500'
                    }`}
                  >
                    {transaction.status}
                  </TableCell>
                </TableRow>
              ))}
              {(!transactions || transactions.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletDashboard;
