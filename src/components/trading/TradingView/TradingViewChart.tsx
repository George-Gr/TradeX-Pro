import React, { useEffect, useRef, useCallback } from 'react';
import { Card } from '@/design-system/components/Card/Card';

interface TradingViewWidget {
  widget: new (options: TradingViewWidgetOptions) => TradingViewWidgetInstance;
}

interface TradingViewWidgetInstance {
  onChartReady: (callback: () => void) => void;
  chart: () => TradingViewChartAPI;
  remove: () => void;
}

interface TradingViewChartAPI {
  createStudy: (
    name: string,
    isOverlay?: boolean,
    isLocked?: boolean,
    settings?: Record<string, unknown>
  ) => void;
}

interface TradingViewWidgetOptions {
  symbol: string;
  interval: string;
  container: HTMLElement;
  datafeed: unknown;
  library_path: string;
  locale: string;
  disabled_features: string[];
  enabled_features: string[];
  charts_storage_url: string;
  charts_storage_api_version: string;
  client_id: string;
  user_id: string;
  fullscreen: boolean;
  autosize: boolean;
  studies_overrides: Record<string, unknown>;
  theme: string;
  timezone: string;
  overrides: Record<string, string>;
}

declare global {
  interface Window {
    TradingView: TradingViewWidget;
  }
}

export interface IndicatorConfig {
  name: string;
  settings?: Record<string, unknown>;
}

export interface ChartProps {
  symbol: string;
  interval: string;
  theme: 'light' | 'dark';
  indicators?: IndicatorConfig[];
  height?: string | number;
  autosize?: boolean;
  studies?: string[];
  timezone?: string;
  locale?: string;
  onChartReady?: () => void;
}

export const TradingViewChart: React.FC<ChartProps> = ({
  symbol,
  interval,
  theme = 'dark',
  indicators = [],
  height = '500px',
  autosize = true,
  studies = [],
  timezone = 'Etc/UTC',
  locale = 'en',
  onChartReady,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<TradingViewWidgetInstance | null>(null);

  const initializeChart = useCallback(() => {
    if (containerRef.current && window.TradingView) {
      const widgetOptions = {
        symbol,
        interval,
        container: containerRef.current,
        datafeed: {
          // Configure your custom datafeed here
          // This is where you'll integrate your market data provider
        },
        library_path: '/charting_library/',
        locale,
        disabled_features: ['use_localstorage_for_settings', 'volume_force_overlay'],
        enabled_features: ['study_templates', 'trading_account_manager'],
        charts_storage_url: 'https://saveload.tradingview.com',
        charts_storage_api_version: '1.1',
        client_id: 'tradingview.com',
        user_id: 'public_user_id',
        fullscreen: false,
        autosize,
        studies_overrides: {},
        theme,
        timezone,
        overrides: {
          'mainSeriesProperties.candleStyle.upColor': '#26a69a',
          'mainSeriesProperties.candleStyle.downColor': '#ef5350',
          'mainSeriesProperties.candleStyle.wickUpColor': '#26a69a',
          'mainSeriesProperties.candleStyle.wickDownColor': '#ef5350',
        },
      };

      chartInstanceRef.current = new window.TradingView.widget(widgetOptions);

      // Add indicators once chart is ready
      chartInstanceRef.current.onChartReady(() => {
        indicators.forEach((indicator) => {
          chartInstanceRef.current
            ?.chart()
            .createStudy(indicator.name, false, false, indicator.settings);
        });

        studies.forEach((study) => {
          chartInstanceRef.current?.chart().createStudy(study);
        });

        onChartReady?.();
      });
    }
  }, [symbol, interval, locale, autosize, theme, timezone, indicators, studies, onChartReady]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = initializeChart;
    document.head.appendChild(script);

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
      }
    };
  }, [initializeChart]);

  return (
    <Card className="w-full">
      <div ref={containerRef} style={{ height }} />
    </Card>
  );
};
