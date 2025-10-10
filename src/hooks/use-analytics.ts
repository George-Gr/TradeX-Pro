import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface TradingMetrics {
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  average_profit: number;
  average_loss: number;
  profit_factor: number;
  total_pnl: number;
  best_trade: number;
  worst_trade: number;
  average_holding_time: number;
}

export interface DailyPerformance {
  date: string;
  pnl: number;
  trades: number;
  win_rate: number;
}

export interface AssetPerformance {
  symbol: string;
  total_trades: number;
  win_rate: number;
  total_pnl: number;
  average_pnl: number;
}

export const useAnalytics = (timeframe: 'day' | 'week' | 'month' | 'year' = 'month') => {
  const { user } = useAuth();

  const { data: metrics, isLoading: metricsLoading } = useQuery<TradingMetrics>({
    queryKey: ['tradingMetrics', user?.id, timeframe],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('get_trading_metrics', {
        user_id_param: user.id,
        timeframe_param: timeframe,
      });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: dailyPerformance, isLoading: performanceLoading } = useQuery<DailyPerformance[]>({
    queryKey: ['dailyPerformance', user?.id, timeframe],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('get_daily_performance', {
        user_id_param: user.id,
        timeframe_param: timeframe,
      });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: assetPerformance, isLoading: assetLoading } = useQuery<AssetPerformance[]>({
    queryKey: ['assetPerformance', user?.id, timeframe],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('get_asset_performance', {
        user_id_param: user.id,
        timeframe_param: timeframe,
      });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return {
    metrics,
    dailyPerformance,
    assetPerformance,
    isLoading: metricsLoading || performanceLoading || assetLoading,
  };
};
