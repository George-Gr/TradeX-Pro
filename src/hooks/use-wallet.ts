import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { WalletTransaction, WalletBalance } from '@/types/kyc';
import { useAuth } from '@/context/AuthContext';

export const useWallet = () => {
  const { user } = useAuth();

  const {
    data: balance,
    isLoading: isBalanceLoading,
    refetch: refetchBalance,
  } = useQuery<WalletBalance>({
    queryKey: ['walletBalance', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('wallet_balances')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return data as WalletBalance;
    },
    enabled: !!user,
  });

  const {
    data: transactions,
    isLoading: isTransactionsLoading,
    refetch: refetchTransactions,
  } = useQuery<WalletTransaction[]>({
    queryKey: ['walletTransactions', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data as WalletTransaction[];
    },
    enabled: !!user,
  });

  const initiateDeposit = useMutation({
    mutationFn: async ({ amount }: { amount: number }) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.from('wallet_transactions').insert({
        user_id: user.id,
        type: 'deposit',
        amount,
        status: 'pending',
      });

      if (error) throw error;

      await Promise.all([refetchBalance(), refetchTransactions()]);
    },
  });

  const initiateWithdrawal = useMutation({
    mutationFn: async ({ amount }: { amount: number }) => {
      if (!user) throw new Error('User not authenticated');

      if (!balance) throw new Error('Balance not loaded');

      if (amount > balance.available_balance) {
        throw new Error('Insufficient funds');
      }

      const { error } = await supabase.from('wallet_transactions').insert({
        user_id: user.id,
        type: 'withdrawal',
        amount,
        status: 'pending',
      });

      if (error) throw error;

      await Promise.all([refetchBalance(), refetchTransactions()]);
    },
  });

  return {
    balance,
    transactions,
    initiateDeposit,
    initiateWithdrawal,
    isLoading: isBalanceLoading || isTransactionsLoading,
  };
};
