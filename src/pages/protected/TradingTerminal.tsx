import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TradingChart } from '@/components/trading/TradingChart';
import { OrderForm } from '@/components/trading/OrderForm';
import { PositionTable } from '@/components/trading/PositionTable';
import { OrderHistoryTable } from '@/components/trading/OrderHistoryTable';
import { useTradingTerminal } from '@/hooks/use-trading-terminal';
import { useMarketDataStore } from '@/stores/marketDataStore';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { RefreshCw, AlertCircle } from 'lucide-react';

// Available symbols for trading - can be expanded with more asset classes
const AVAILABLE_SYMBOLS = [
  // Stocks
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'META', name: 'Meta Platforms' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { symbol: 'AMD', name: 'Advanced Micro' },
  // Forex
  { symbol: 'EUR/USD', name: 'EUR/USD' },
  { symbol: 'GBP/USD', name: 'GBP/USD' },
  { symbol: 'USD/JPY', name: 'USD/JPY' },
  { symbol: 'AUD/USD', name: 'AUD/USD' },
  // Crypto
  { symbol: 'BTC/USD', name: 'Bitcoin' },
  { symbol: 'ETH/USD', name: 'Ethereum' },
];

const TradingTerminal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('terminal');

  // Get trading terminal state from our hook
  const {
    selectedSymbol,
    positions,
    orders,
    orderHistory,
    marketData,
    currentPrice,
    isLoading: terminalLoading,
    error: terminalError,
    setSelectedSymbol,
  } = useTradingTerminal(AVAILABLE_SYMBOLS.map((s) => s.symbol));

  // Market data store for watchlist management
  const { addToWatchlist, removeFromWatchlist, watchlist } = useMarketDataStore();

  // Track user's positions for the selected symbol
  const currentSymbolPositions = positions.filter((pos) => pos.symbol === selectedSymbol);

  // Handle adding/removing from watchlist
  const handleWatchlistToggle = async () => {
    if (!user || !selectedSymbol) return;

    const symbolInWatchlist = watchlist.some((item) => item.symbol === selectedSymbol);

    try {
      if (symbolInWatchlist) {
        await removeFromWatchlist({ symbol: selectedSymbol, name: selectedSymbol });
      } else {
        await addToWatchlist({
          symbol: selectedSymbol,
          name: AVAILABLE_SYMBOLS.find((s) => s.symbol === selectedSymbol)?.name || selectedSymbol,
        });
      }
    } catch (error) {
      console.error('Failed to update watchlist:', error);
    }
  };

  const selectedSymbolData = AVAILABLE_SYMBOLS.find((s) => s.symbol === selectedSymbol);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Trading Terminal</h1>
          <p className="text-muted-foreground">Real-time trading interface powered by TradeX-Pro</p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Symbol" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_SYMBOLS.map((symbolData) => (
                <SelectItem key={symbolData.symbol} value={symbolData.symbol}>
                  <div className="flex items-center justify-between w-full">
                    <span>{symbolData.symbol}</span>
                    <span className="text-xs text-muted-foreground ml-2">{symbolData.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={handleWatchlistToggle} disabled={!user}>
            {watchlist.some((item) => item.symbol === selectedSymbol)
              ? 'Remove from Watchlist'
              : 'Add to Watchlist'}
          </Button>

          <Badge variant="secondary" className="hidden lg:flex">
            Live Data
          </Badge>
        </div>
      </div>

      {/* Main Trading Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="terminal">Trading Terminal</TabsTrigger>
          <TabsTrigger value="positions">
            Positions
            {currentSymbolPositions.length > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {currentSymbolPositions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">Order History</TabsTrigger>
        </TabsList>

        <TabsContent value="terminal" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Chart - Takes up most of the space */}
            <Card className="xl:col-span-3">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {selectedSymbolData
                      ? `${selectedSymbolData.name} (${selectedSymbol})`
                      : selectedSymbol}
                    {currentPrice && (
                      <Badge variant="outline" className="ml-3 text-sm">
                        ${currentPrice.toFixed(2)}
                      </Badge>
                    )}
                  </CardTitle>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.reload()}
                      disabled={terminalLoading}
                    >
                      <RefreshCw className={`w-4 h-4 ${terminalLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>

                {terminalError && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <span>Market data temporarily unavailable</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <TradingChart symbol={selectedSymbol} interval="1" containerClassName="h-[500px]" />
              </CardContent>
            </Card>

            {/* Order Form */}
            <div className="xl:col-span-1">
              <OrderForm symbol={selectedSymbol} />

              {/* Current Symbol Positions Summary */}
              {currentSymbolPositions.length > 0 && (
                <Card className="mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Current Positions</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {currentSymbolPositions.map((position) => (
                        <div
                          key={position.id}
                          className="flex justify-between items-center text-sm"
                        >
                          <span>
                            {position.side.toUpperCase()} {position.quantity}
                          </span>
                          <Badge variant={position.side === 'long' ? 'default' : 'secondary'}>
                            ${position.entry_price.toFixed(2)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Orders Table - Compact version for terminal */}
          {orders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Symbol</th>
                        <th className="text-left p-2">Side</th>
                        <th className="text-right p-2">Qty</th>
                        <th className="text-right p-2">Price</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="border-b hover:bg-muted/50">
                          <td className="p-2">{order.symbol}</td>
                          <td className="p-2">
                            <Badge variant={order.side === 'buy' ? 'default' : 'secondary'}>
                              {order.side.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="p-2 text-right">{order.quantity}</td>
                          <td className="p-2 text-right">
                            {order.order_type === 'market' ? 'MARKET' : `$${order.price}`}
                          </td>
                          <td className="p-2">
                            <Badge variant="outline">{order.status}</Badge>
                          </td>
                          <td className="p-2">
                            {order.status === 'pending' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Cancel order functionality can be implemented here
                                  console.log('Cancel order:', order.id);
                                }}
                              >
                                Cancel
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="positions">
          <Card>
            <CardHeader>
              <CardTitle>Open Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <PositionTable positions={positions} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderHistoryTable orders={orderHistory} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingTerminal;
