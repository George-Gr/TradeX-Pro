import { supabase } from '@/integrations/supabase/client';
import { AdminKYCReview, AdminMetrics, AdminTransaction, AdminUserProfile } from '@/types/admin';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useAdmin = () => {
  const queryClient = useQueryClient();
  // Supabase generated types don't include our custom admin RPCs. Use a small
  // helper to call RPCs and disable the explicit-any lint rule locally.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rpc: any = (supabase as any).rpc.bind(supabase);
  const { data: metrics, isLoading: metricsLoading } = useQuery<AdminMetrics | null>({
    queryKey: ['adminMetrics'],
    queryFn: async () => {
      const { data, error } = await rpc('get_admin_metrics');
      if (error) throw error;
      // Supabase RPC that returns a TABLE often comes back as an array of rows.
      // Normalize to a single object (or null) for convenience in the UI.
      if (Array.isArray(data)) return data[0] ?? null;
      return data ?? null;
    },
  });

  const { data: users, isLoading: usersLoading } = useQuery<AdminUserProfile[]>({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const { data, error } = await rpc('get_admin_users');
      if (error) throw error;
      return data;
    },
  });

  const { data: kycReviews, isLoading: kycLoading } = useQuery<AdminKYCReview[]>({
    queryKey: ['adminKYC'],
    queryFn: async () => {
      const { data, error } = await rpc('get_admin_kyc_reviews');
      if (error) throw error;
      return data;
    },
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery<AdminTransaction[]>({
    queryKey: ['adminTransactions'],
    queryFn: async () => {
      const { data, error } = await rpc('get_admin_transactions');
      if (error) throw error;
      return data;
    },
  });

  const updateKYCStatus = useMutation({
    mutationFn: async ({
      documentId,
      status,
      reason,
    }: {
      documentId: string;
      status: 'approved' | 'rejected';
      reason?: string;
    }) => {
      const { error } = await rpc('update_kyc_status', {
        document_id: documentId,
        new_status: status,
        rejection_reason: reason,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      // Refresh KYC list and overview metrics after status update
      queryClient.invalidateQueries({ queryKey: ['adminKYC'] });
      queryClient.invalidateQueries({ queryKey: ['adminMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });

  const updateTransactionStatus = useMutation({
    mutationFn: async ({
      transactionId,
      status,
      reason,
    }: {
      transactionId: string;
      status: 'completed' | 'rejected';
      reason?: string;
    }) => {
      const { error } = await rpc('update_transaction_status', {
        transaction_id: transactionId,
        new_status: status,
        rejection_reason: reason,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      // Refresh transactions and metrics after processing a transaction
      queryClient.invalidateQueries({ queryKey: ['adminTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['adminMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });

  const updateUserStatus = useMutation({
    mutationFn: async ({ userId, action }: { userId: string; action: 'suspend' | 'activate' }) => {
      const { error } = await rpc('update_user_status', {
        user_id: userId,
        action,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      // Refresh users and metrics
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminMetrics'] });
    },
  });

  return {
    metrics,
    users,
    kycReviews,
    transactions,
    isLoading: metricsLoading || usersLoading || kycLoading || transactionsLoading,
    updateKYCStatus,
    updateTransactionStatus,
    updateUserStatus,
  };
};
