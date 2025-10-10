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

  // Mock data for now until database functions are implemented
  const metrics: TradingMetrics = {
    total_trades: 0,
    winning_trades: 0,
    losing_trades: 0,
    win_rate: 0,
    average_profit: 0,
    average_loss: 0,
    profit_factor: 0,
    total_pnl: 0,
    best_trade: 0,
    worst_trade: 0,
    average_holding_time: 0,
  };

  const dailyPerformance: DailyPerformance[] = [];
  const assetPerformance: AssetPerformance[] = [];

  return {
    metrics,
    dailyPerformance,
    assetPerformance,
    isLoading: false,
  };
};
