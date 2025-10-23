import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Activity,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useTradingTerminal } from '@/hooks/use-trading-terminal';
import { supabase } from '@/integrations/supabase/client';
import { PositionTable } from '@/components/trading/PositionTable';
import { OrderHistoryTable } from '@/components/trading/OrderHistoryTable';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  balance: number;
  bonus_balance: number;
  equity: number;
  margin_used: number;
  free_margin: number;
  account_status: string;
}

interface PortfolioStats {
  totalValue: number;
  totalPnl: number;
  totalPnlPercent: number;
  openPositions: number;
  dayChange: number;
  dayChangePercent: number;
  winRate: number;
  totalTrades: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { positions, orderHistory } = useTradingTerminal([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        // Load user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Calculate portfolio statistics
        const stats: PortfolioStats = {
          totalValue: profileData.equity,
          totalPnl: profileData.equity - profileData.balance,
          totalPnlPercent:
            profileData.balance > 0
              ? ((profileData.equity - profileData.balance) / profileData.balance) * 100
              : 0,
          openPositions: positions.length,
          dayChange: 0, // Would need historical data for this
          dayChangePercent: 0,
          winRate: 0,
          totalTrades: orderHistory.filter((order) => order.status === 'filled').length,
        };

        // Calculate win rate
        const filledTrades = orderHistory.filter(
          (order) => order.status === 'filled' && order.pnl !== null
        );
        const winningTrades = filledTrades.filter((order) => order.pnl! > 0);
        stats.winRate =
          filledTrades.length > 0 ? (winningTrades.length / filledTrades.length) * 100 : 0;

        setPortfolioStats(stats);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user, positions, orderHistory]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Dashboard Error</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || user?.email?.split('@')[0]}!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={profile?.account_status === 'active' ? 'default' : 'secondary'}>
            Account: {profile?.account_status?.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(portfolioStats?.totalValue || 0)}
            </div>
            <div className="flex items-center gap-2">
              {portfolioStats?.totalPnlPercent !== undefined &&
              portfolioStats.totalPnlPercent >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-xs ${portfolioStats?.totalPnlPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}
              >
                {formatPercent(portfolioStats?.totalPnlPercent || 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(profile?.balance || 0)}</div>
            <p className="text-xs text-muted-foreground">Cash available for trading</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Margin</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(profile?.free_margin || 0)}</div>
            <div className="text-xs text-muted-foreground">
              Margin used: {formatCurrency(profile?.margin_used || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {portfolioStats?.winRate ? formatPercent(portfolioStats.winRate) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {portfolioStats?.totalTrades || 0} total trades
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
          <TabsTrigger value="positions">
            Open Positions
            {portfolioStats?.openPositions && portfolioStats.openPositions > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {portfolioStats.openPositions}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">
            Recent Trades
            {portfolioStats?.totalTrades && portfolioStats.totalTrades > 0 && (
              <Badge variant="outline" className="ml-2 text-xs">
                {portfolioStats.totalTrades}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Account Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
                  <p className="text-lg font-semibold">{formatCurrency(profile?.balance || 0)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bonus Balance</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(profile?.bonus_balance || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Equity</p>
                  <p className="text-lg font-semibold">{formatCurrency(profile?.equity || 0)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Margin Used</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(profile?.margin_used || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(portfolioStats?.totalPnl || 0)}
                </div>
                <div className="flex items-center justify-center gap-2">
                  {portfolioStats?.totalPnlPercent !== undefined &&
                  portfolioStats.totalPnlPercent >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                  <span
                    className={`text-lg font-medium ${portfolioStats?.totalPnlPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {formatPercent(Math.abs(portfolioStats?.totalPnlPercent || 0))}
                    {portfolioStats?.totalPnlPercent >= 0 ? ' gain' : ' loss'}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">Based on all trading activity</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions">
          <Card>
            <CardHeader>
              <CardTitle>Open Positions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Track your current trading positions and unrealized P&L
              </p>
            </CardHeader>
            <CardContent>
              <PositionTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Trading History</CardTitle>
              <p className="text-sm text-muted-foreground">
                View your most recent executed trades and performance
              </p>
            </CardHeader>
            <CardContent>
              <OrderHistoryTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
