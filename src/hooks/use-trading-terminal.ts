import { useEffect } from 'react';
import { useMarketData } from './use-market-data';
import { useTradingStore } from '@/stores/tradingStore';

export const useTradingTerminal = (availableSymbols: string[]) => {
  const {
    selectedSymbol,
    positions,
    orders,
    orderHistory,
    isLoading: tradingLoading,
    error: tradingError,
    setSelectedSymbol,
    placeOrder,
    subscribeToUpdates,
  } = useTradingStore();

  const {
    data: marketData,
    isLoading: marketDataLoading,
    error: marketDataError,
  } = useMarketData(selectedSymbol || '');

  useEffect(() => {
    // Initialize with first symbol if none selected
    if (!selectedSymbol && availableSymbols.length > 0) {
      setSelectedSymbol(availableSymbols[0]);
    }
    // Subscribe to updates
    subscribeToUpdates();
  }, [selectedSymbol, availableSymbols, setSelectedSymbol, subscribeToUpdates]);

  const currentPrice = marketData?.[marketData.length - 1]?.close || 0;

  return {
    // State
    selectedSymbol,
    positions,
    orders,
    orderHistory,
    marketData,
    currentPrice,
    isLoading: tradingLoading || marketDataLoading,
    error: tradingError || marketDataError,

    // Actions
    setSelectedSymbol,
    placeOrder,
  };
};
