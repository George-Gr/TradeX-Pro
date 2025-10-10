import { useEffect, useRef } from 'react';
import { createChart, IChartApi, DeepPartial, ChartOptions } from 'lightweight-charts';

interface TradingChartProps {
  data: {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
  }[];
  options?: DeepPartial<ChartOptions>;
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

export const TradingChart = ({
  data,
  options = {},
  containerClassName = 'h-[400px]',
}: TradingChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi>();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    };

    const chart = createChart(chartContainerRef.current, mergedOptions);
    const candlestickSeries = (chart as any).addCandlestickSeries({
      upColor: '#10B981',
      downColor: '#EF4444',
      borderVisible: false,
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
    });

    candlestickSeries.setData(data);

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current?.clientWidth || 0,
        height: chartContainerRef.current?.clientHeight || 0,
      });
    };

    window.addEventListener('resize', handleResize);
    chartRef.current = chart;

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, options]);

  return (
    <div className={containerClassName}>
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
};
