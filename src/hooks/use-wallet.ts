import { useMutation } from '@tanstack/react-query';
import { WalletTransaction, WalletBalance } from '@/types/kyc';
import { useAuth } from '@/context/AuthContext';

export const useWallet = () => {
  const { user } = useAuth();

  // Mock data for now
  const balance: WalletBalance | undefined = undefined;
  const transactions: WalletTransaction[] = [];

  const initiateDeposit = useMutation({
    mutationFn: async ({ amount }: { amount: number }) => {
      if (!user) throw new Error('User not authenticated');
      // Implementation will be added later
      return amount;
    },
  });

  const initiateWithdrawal = useMutation({
    mutationFn: async ({ amount }: { amount: number }) => {
      if (!user) throw new Error('User not authenticated');
      // Implementation will be added later
      return amount;
    },
  });

  return {
    balance,
    transactions,
    initiateDeposit,
    initiateWithdrawal,
    isLoading: false,
  };
};
