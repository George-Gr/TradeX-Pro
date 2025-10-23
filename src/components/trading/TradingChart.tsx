import { useEffect, useRef, useState, useCallback } from 'react';
import {
  createChart,
  IChartApi,
  DeepPartial,
  ChartOptions,
  ColorType,
  ISeriesApi,
  CandlestickData,
} from 'lightweight-charts';
import { useTheme } from 'next-themes';
import { useTradingStore } from '@/stores/tradingStore';
import { marketDataService, MarketOHLCV } from '@/services/marketDataService';

interface TradingChartProps {
  symbol?: string;
  interval?: '1' | '5' | '15' | '30' | '60' | 'D';
  containerClassName?: string;
}

const defaultOptions: DeepPartial<ChartOptions> = {
  layout: {
    background: { color: 'transparent' },
    textColor: '#D1D5DB',
  },
  grid: {
    vertLines: { color: '#2D3748' },
    horzLines: { color: '#2D3748' },
  },
  crosshair: {
    mode: 1,
    vertLine: {
      width: 1,
      color: '#4A5568',
      style: 0,
    },
    horzLine: {
      width: 1,
      color: '#4A5568',
      style: 0,
    },
  },
  timeScale: {
    borderColor: '#4A5568',
  },
  rightPriceScale: {
    borderColor: '#4A5568',
  },
};

export const TradingChart: React.FC<TradingChartProps> = ({
  symbol: propsSymbol,
  interval = '1',
  containerClassName = 'h-[400px]',
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi>();
  const seriesRef = useRef<ISeriesApi<'Candlestick'>>();
  const { theme } = useTheme();

  const { selectedSymbol } = useTradingStore();
  const symbol = propsSymbol || selectedSymbol;

  // State for OHLCV data
  const [ohlcvData, setOhlcvData] = useState<MarketOHLCV | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch OHLCV data
  const fetchOhlcvData = useCallback(async () => {
    if (!symbol) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await marketDataService.getOHLCV(symbol, interval);
      setOhlcvData(data);
    } catch (err) {
      console.error('Failed to fetch OHLCV data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load chart data');
    } finally {
      setIsLoading(false);
    }
  }, [symbol, interval]);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const isDarkTheme = theme === 'dark';

    const mergedOptions: DeepPartial<ChartOptions> = {
      ...defaultOptions,
      layout: {
        background: { type: ColorType.Solid, color: isDarkTheme ? '#1F2937' : '#FFFFFF' },
        textColor: isDarkTheme ? '#D1D5DB' : '#374151',
      },
      grid: {
        vertLines: { color: isDarkTheme ? '#374151' : '#E5E7EB' },
        horzLines: { color: isDarkTheme ? '#374151' : '#E5E7EB' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    };

    const chart = createChart(chartContainerRef.current, mergedOptions);

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10B981',
      downColor: '#EF4444',
      borderVisible: false,
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
    });

    seriesRef.current = candlestickSeries;
    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [theme]);

  // Fetch data when symbol or interval changes
  useEffect(() => {
    fetchOhlcvData();
  }, [fetchOhlcvData]);

  // Update chart data
  useEffect(() => {
    if (!seriesRef.current || !ohlcvData) return;

    const chartData: CandlestickData[] = ohlcvData.data.map((candle) => ({
      time: candle.timestamp / 1000, // Convert timestamp for lightweight-charts
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    seriesRef.current.setData(chartData);
  }, [ohlcvData]);

  if (!symbol) {
    return (
      <div className={containerClassName}>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Select a symbol to view chart</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={containerClassName}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-destructive mb-2">Failed to load chart data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
          <div className="text-sm text-muted-foreground">Loading chart...</div>
        </div>
      )}
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
};
