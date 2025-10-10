import { KYCReviewTable } from '@/components/admin/KYCReviewTable';
import { MetricsDashboard } from '@/components/admin/MetricsDashboard';
import { TransactionsTable } from '@/components/admin/TransactionsTable';
import { UsersTable } from '@/components/admin/UsersTable';
import { useAdmin } from '@/hooks/use-admin';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const {
    metrics,
    users,
    kycReviews,
    transactions,
    isLoading,
    updateKYCStatus,
    updateTransactionStatus,
    updateUserStatus,
  } = useAdmin();
  const { toast } = useToast();

  const handleKYCStatusUpdate = async (
    documentId: string,
    status: 'approved' | 'rejected',
    reason?: string
  ) => {
    try {
      await updateKYCStatus.mutateAsync({ documentId, status, reason });
      toast({
        title: 'KYC status updated',
        description: `Document has been ${status}`,
      });
    } catch (error) {
      toast({
        title: 'Error updating KYC status',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const handleTransactionStatusUpdate = async (
    transactionId: string,
    status: 'completed' | 'rejected',
    reason?: string
  ) => {
    try {
      await updateTransactionStatus.mutateAsync({ transactionId, status, reason });
      toast({
        title: 'Transaction status updated',
        description: `Transaction has been ${status}`,
      });
    } catch (error) {
      toast({
        title: 'Error updating transaction status',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const handleUserStatusUpdate = async (userId: string, action: 'suspend' | 'activate') => {
    try {
      await updateUserStatus.mutateAsync({ userId, action });
      toast({
        title: 'User status updated',
        description: `User has been ${action}d`,
      });
    } catch (error) {
      toast({
        title: 'Error updating user status',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading admin dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <MetricsDashboard metrics={metrics ?? null} />

      <div className="grid grid-cols-1 gap-6">
        <UsersTable users={users ?? []} onUpdateStatus={handleUserStatusUpdate} />
        <KYCReviewTable reviews={kycReviews ?? []} onUpdateStatus={handleKYCStatusUpdate} />
        <TransactionsTable
          transactions={transactions ?? []}
          onUpdateStatus={handleTransactionStatusUpdate}
        />
      </div>
    </div>
  );
};

export default Admin;
