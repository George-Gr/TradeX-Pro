import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminMetrics } from '@/types/admin';

interface MetricsDashboardProps {
  metrics: AdminMetrics | null;
}

export const MetricsDashboard = ({ metrics }: MetricsDashboardProps) => {
  const fmt = (val: number | undefined | null) => (typeof val === 'number' ? val.toFixed(2) : '—');

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.total_users ?? '—'}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.active_users ?? '—'}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">KYC Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-500">{metrics?.kyc_pending ?? '—'}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Trading Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${fmt(metrics?.total_volume ?? null)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Total Deposits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            ${fmt(metrics?.total_deposits ?? null)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Total Withdrawals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">
            ${fmt(metrics?.total_withdrawals ?? null)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Commission Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">
            ${fmt(metrics?.total_commission ?? null)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
