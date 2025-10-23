import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAnalytics } from '@/hooks/use-analytics';
import { MetricsGrid } from '@/components/analytics/MetricsGrid';
import { PerformanceChart } from '@/components/analytics/PerformanceChart';
import { AssetTable } from '@/components/analytics/AssetTable';

const AnalyticsDashboard = () => {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const { metrics, dailyPerformance, assetPerformance, isLoading } = useAnalytics(timeframe);

  if (isLoading || !metrics || !dailyPerformance || !assetPerformance) {
    return <div className="container mx-auto p-4">Loading analytics...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <Select
          value={timeframe}
          onValueChange={(value: 'day' | 'week' | 'month' | 'year') => setTimeframe(value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">24 Hours</SelectItem>
            <SelectItem value="week">7 Days</SelectItem>
            <SelectItem value="month">30 Days</SelectItem>
            <SelectItem value="year">1 Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <MetricsGrid metrics={metrics} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart data={dailyPerformance} />
        <AssetTable assets={assetPerformance} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
