import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order, Position, OrderHistory } from '@/types/trading';
import { useAuth } from '@/hooks/use-auth';

export const usePortfolio = () => {
  const { user } = useAuth();

  // Get all unique symbols from positions to fetch market data
  const { data: positions, isLoading: positionsLoading } = useQuery<Position[]>({
    queryKey: ['positions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'open');

      if (error) throw error;

      // Group orders by symbol and calculate positions
      const positionsBySymbol = (orders as Order[]).reduce<Record<string, Position>>(
        (acc, order) => {
          const { symbol, side, quantity, price } = order;
          const qty = side === 'buy' ? quantity : -quantity;

          if (!acc[symbol]) {
            acc[symbol] = {
              symbol,
              quantity: 0,
              average_entry: 0,
              current_price: 0,
              unrealized_pnl: 0,
              unrealized_pnl_percentage: 0,
              market_value: 0,
            };
          }

          const position = acc[symbol];
          const oldValue = position.quantity * position.average_entry;
          const newValue = qty * price;
          const newQuantity = position.quantity + qty;

          position.quantity = newQuantity;
          position.average_entry = newQuantity !== 0 ? (oldValue + newValue) / newQuantity : 0;

          return acc;
        },
        {}
      );

      return Object.values(positionsBySymbol);
    },
    enabled: !!user,
  });

  // Fetch order history
  const { data: orderHistory, isLoading: historyLoading } = useQuery<OrderHistory[]>({
    queryKey: ['orderHistory', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((order) => ({
        ...order,
        type: order.order_type,
      })) as OrderHistory[];
    },
    enabled: !!user,
  });

  // For now, return positions without real-time P&L calculation
  // This avoids the React Hook rules violation
  // In a production app, you'd want to fetch market data separately
  const positionsWithPnL = positions?.map((position) => ({
    ...position,
    current_price: position.current_price || position.average_entry,
    market_value: position.quantity * (position.current_price || position.average_entry),
    unrealized_pnl: position.unrealized_pnl || 0,
    unrealized_pnl_percentage: position.unrealized_pnl_percentage || 0,
  }));

  return {
    positions: positionsWithPnL,
    orderHistory,
    isLoading: positionsLoading || historyLoading,
  };
};
