import { usePortfolio } from '@/hooks/use-portfolio';
import { PositionTable } from '@/components/trading/PositionTable';
import { OrderHistoryTable } from '@/components/trading/OrderHistoryTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Portfolio = () => {
  const { positions, orderHistory, isLoading } = usePortfolio();

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  const totalPortfolioValue = positions?.reduce((sum, pos) => sum + pos.market_value, 0) || 0;
  const totalUnrealizedPnL = positions?.reduce((sum, pos) => sum + pos.unrealized_pnl, 0) || 0;
  const averagePnLPercentage = positions?.length
    ? positions.reduce((sum, pos) => sum + pos.unrealized_pnl_percentage, 0) / positions.length
    : 0;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Portfolio</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPortfolioValue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Unrealized P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${totalUnrealizedPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              ${totalUnrealizedPnL.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average P&L %</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${averagePnLPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              {averagePnLPercentage.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <PositionTable positions={positions || []} />
      <OrderHistoryTable orders={orderHistory || []} />
    </div>
  );
};

export default Portfolio;
