import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";

interface Position {
  id: string;
  symbol: string;
  side: string;
  quantity: number;
  entry_price: number;
  current_price: number;
  unrealized_pnl: number;
  realized_pnl: number;
  stop_loss?: number;
  take_profit?: number;
  opened_at: string;
}

interface Profile {
  balance: number;
  equity: number;
  margin_used: number;
  free_margin: number;
}

const Portfolio = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
        fetchPortfolioData(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchPortfolioData = async (userId: string) => {
    setLoading(true);
    try {
      // Fetch positions
      const { data: positionsData, error: positionsError } = await supabase
        .from('positions')
        .select('*')
        .eq('user_id', userId)
        .order('opened_at', { ascending: false });

      if (positionsError) throw positionsError;
      setPositions(positionsData || []);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('balance, equity, margin_used, free_margin')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

    } catch (error: any) {
      console.error('Error fetching portfolio data:', error);
      toast.error("Failed to load portfolio data");
    } finally {
      setLoading(false);
    }
  };

  const handleClosePosition = async (positionId: string) => {
    if (!window.confirm('Are you sure you want to close this position?')) return;

    try {
      const { error } = await supabase
        .from('positions')
        .delete()
        .eq('id', positionId);

      if (error) throw error;

      toast.success("Position closed successfully");
      if (user) fetchPortfolioData(user.id);
    } catch (error: any) {
      console.error('Error closing position:', error);
      toast.error("Failed to close position");
    }
  };

  const calculateTotalPnL = () => {
    return positions.reduce((sum, pos) => sum + pos.unrealized_pnl, 0);
  };

  if (!user || loading) return null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Portfolio</h1>
            <p className="text-muted-foreground">View and manage your positions</p>
          </div>
        </div>

        {/* Account Summary */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Balance</CardDescription>
              <CardTitle className="text-2xl">${profile?.balance.toFixed(2) || '0.00'}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Equity</CardDescription>
              <CardTitle className="text-2xl">${profile?.equity.toFixed(2) || '0.00'}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Unrealized P&L</CardDescription>
              <CardTitle className={`text-2xl ${calculateTotalPnL() >= 0 ? 'text-success' : 'text-destructive'}`}>
                {calculateTotalPnL() >= 0 ? '+' : ''}${calculateTotalPnL().toFixed(2)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Free Margin</CardDescription>
              <CardTitle className="text-2xl">${profile?.free_margin.toFixed(2) || '0.00'}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Open Positions */}
        <Card>
          <CardHeader>
            <CardTitle>Open Positions</CardTitle>
            <CardDescription>
              {positions.length} active {positions.length === 1 ? 'position' : 'positions'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {positions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No open positions</p>
                <Button onClick={() => navigate("/trading-terminal")}>
                  Start Trading
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Side</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Entry Price</TableHead>
                      <TableHead className="text-right">Current Price</TableHead>
                      <TableHead className="text-right">P&L</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {positions.map((position) => (
                      <TableRow key={position.id}>
                        <TableCell className="font-medium">{position.symbol}</TableCell>
                        <TableCell>
                          <Badge variant={position.side === 'long' ? 'default' : 'destructive'}>
                            {position.side.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{position.quantity}</TableCell>
                        <TableCell className="text-right">${position.entry_price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${position.current_price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div className={`flex items-center justify-end gap-1 ${position.unrealized_pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {position.unrealized_pnl >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            {position.unrealized_pnl >= 0 ? '+' : ''}${position.unrealized_pnl.toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleClosePosition(position.id)}
                          >
                            Close
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Portfolio;