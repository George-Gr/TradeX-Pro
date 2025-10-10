import { useQuery } from '@tanstack/react-query';

const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

interface MarketData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface StockCandles {
  c: number[];
  h: number[];
  l: number[];
  o: number[];
  s: string;
  t: number[];
  v: number[];
}

export const useMarketData = (
  symbol: string,
  resolution: string = 'D',
  from: number = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000),
  to: number = Math.floor(Date.now() / 1000)
) => {
  return useQuery({
    queryKey: ['marketData', symbol, resolution, from, to],
    queryFn: async (): Promise<MarketData[]> => {
      if (!FINNHUB_API_KEY) {
        throw new Error('Finnhub API key not found');
      }

      const response = await fetch(
        `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }

      const data: StockCandles = await response.json();

      if (data.s !== 'ok') {
        throw new Error('Invalid market data response');
      }

      return data.t.map((timestamp, index) => ({
        time: (timestamp * 1000).toString(),
        open: data.o[index],
        high: data.h[index],
        low: data.l[index],
        close: data.c[index],
        volume: data.v[index],
      }));
    },
    refetchInterval: 60000, // Refetch every minute
  });
};
