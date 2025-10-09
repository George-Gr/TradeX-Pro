import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, ArrowLeft } from "lucide-react";

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  high?: number;
  low?: number;
  volume?: number;
  bid?: number;
  ask?: number;
}

const TradingTerminal = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  
  // Order form state
  const [symbol, setSymbol] = useState("AAPL");
  const [orderType, setOrderType] = useState("market");
  const [side, setSide] = useState("buy");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
        fetchMarketData(symbol);
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

  const fetchMarketData = async (tickerSymbol: string) => {
    try {
      const { data, error } = await supabase
        .from('market_data_cache')
        .select('*')
        .eq('symbol', tickerSymbol)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching market data:', error);
        // Mock data for development
        setMarketData({
          symbol: tickerSymbol,
          price: 150.25,
          change: 2.5,
          change_percent: 1.69,
          high: 152.0,
          low: 148.5,
          volume: 1000000,
          bid: 150.20,
          ask: 150.30
        });
      } else if (data) {
        setMarketData(data as MarketData);
      } else {
        // Mock data if no cached data
        setMarketData({
          symbol: tickerSymbol,
          price: 150.25,
          change: 2.5,
          change_percent: 1.69,
          high: 152.0,
          low: 148.5,
          volume: 1000000,
          bid: 150.20,
          ask: 150.30
        });
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol);
    fetchMarketData(newSymbol);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const orderData = {
        user_id: user.id,
        symbol,
        order_type: orderType,
        side,
        quantity: parseFloat(quantity),
        price: price ? parseFloat(price) : null,
        stop_price: null,
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;

      toast.success(`${side.toUpperCase()} order placed successfully!`, {
        description: `${quantity} shares of ${symbol}`
      });

      // Reset form
      setQuantity("");
      setPrice("");
      setStopLoss("");
      setTakeProfit("");

    } catch (error: any) {
      console.error('Error placing order:', error);
      toast.error("Failed to place order", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Trading Terminal</h1>
            <p className="text-muted-foreground">Execute trades and manage positions</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Market Data Panel */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{marketData?.symbol || symbol}</CardTitle>
                  <CardDescription>Real-time market data</CardDescription>
                </div>
                <Select value={symbol} onValueChange={handleSymbolChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AAPL">AAPL</SelectItem>
                    <SelectItem value="GOOGL">GOOGL</SelectItem>
                    <SelectItem value="MSFT">MSFT</SelectItem>
                    <SelectItem value="TSLA">TSLA</SelectItem>
                    <SelectItem value="AMZN">AMZN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {marketData && (
                <div className="space-y-6">
                  <div className="flex items-end gap-4">
                    <div className="text-4xl font-bold">${marketData.price.toFixed(2)}</div>
                    <div className={`flex items-center gap-1 text-lg ${marketData.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {marketData.change >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                      {marketData.change >= 0 ? '+' : ''}{marketData.change.toFixed(2)} ({marketData.change_percent.toFixed(2)}%)
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">High</p>
                      <p className="text-lg font-semibold">${marketData.high?.toFixed(2) || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Low</p>
                      <p className="text-lg font-semibold">${marketData.low?.toFixed(2) || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bid</p>
                      <p className="text-lg font-semibold">${marketData.bid?.toFixed(2) || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ask</p>
                      <p className="text-lg font-semibold">${marketData.ask?.toFixed(2) || '-'}</p>
                    </div>
                  </div>

                  {/* Chart Placeholder */}
                  <div className="h-80 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">TradingView Chart Integration</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Entry Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Place Order</CardTitle>
              <CardDescription>Enter order details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <Tabs value={side} onValueChange={setSide}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="buy" className="data-[state=active]:bg-success data-[state=active]:text-success-foreground">
                      Buy
                    </TabsTrigger>
                    <TabsTrigger value="sell" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">
                      Sell
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-2">
                  <Label htmlFor="orderType">Order Type</Label>
                  <Select value={orderType} onValueChange={setOrderType}>
                    <SelectTrigger id="orderType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market</SelectItem>
                      <SelectItem value="limit">Limit</SelectItem>
                      <SelectItem value="stop">Stop</SelectItem>
                      <SelectItem value="stop_limit">Stop Limit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>

                {(orderType === 'limit' || orderType === 'stop_limit') && (
                  <div className="space-y-2">
                    <Label htmlFor="price">Limit Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required={orderType === 'limit' || orderType === 'stop_limit'}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="stopLoss">Stop Loss (Optional)</Label>
                  <Input
                    id="stopLoss"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="takeProfit">Take Profit (Optional)</Label>
                  <Input
                    id="takeProfit"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                  />
                </div>

                {marketData && quantity && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Estimated Total</p>
                    <p className="text-xl font-bold">
                      ${(parseFloat(quantity) * marketData.price).toFixed(2)}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !quantity}
                  variant={side === 'buy' ? 'default' : 'destructive'}
                >
                  {loading ? 'Placing Order...' : `${side === 'buy' ? 'Buy' : 'Sell'} ${symbol}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TradingTerminal;