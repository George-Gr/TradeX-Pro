import { DailyPerformance } from '@/hooks/use-analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, subDays } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceChartProps {
  data: DailyPerformance[];
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  // Get last 30 days of data
  const startDate = subDays(new Date(), 30);
  const chartData = data
    .filter((item) => new Date(item.date) >= startDate)
    .map((item) => ({
      ...item,
      date: format(new Date(item.date), 'MMM dd'),
    }));

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>P&L Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="profit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="loss" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fill: '#6B7280' }} tickLine={false} axisLine={false} />
            <YAxis
              tick={{ fill: '#6B7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#D1D5DB' }}
            />
            <Area
              type="monotone"
              dataKey="pnl"
              stroke="#10B981"
              fillOpacity={1}
              fill="url(#profit)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
