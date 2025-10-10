import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TradingChart } from '@/components/trading/TradingChart';
import { OrderForm } from '@/components/trading/OrderForm';
import { useMarketData } from '@/hooks/use-market-data';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

// Common stock symbols - replace with your platform's available symbols
const AVAILABLE_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META', 'TSLA', 'NVDA', 'AMD'];

const TradingTerminal = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const { data: marketData, isLoading, error } = useMarketData(selectedSymbol);
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOrderSubmit = async (orderData: any) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Save order to Supabase
      const { error: orderError } = await supabase.from('orders').insert({
        user_id: user.id,
        symbol: selectedSymbol,
        order_type: orderData.orderType,
        side: orderData.side,
        quantity: orderData.quantity,
        price:
          orderData.orderType === 'market'
            ? marketData?.[marketData.length - 1]?.close
            : orderData.price,
        stop_loss: orderData.stopLoss,
        take_profit: orderData.takeProfit,
        status: 'open',
      });

      if (orderError) throw orderError;

      toast({
        title: 'Order placed successfully',
        description: `${orderData.side.toUpperCase()} ${orderData.quantity} ${selectedSymbol} @ ${
          orderData.orderType === 'market' ? 'MARKET' : orderData.price
        }`,
      });
    } catch (err) {
      console.error('Error placing order:', err);
      toast({
        title: 'Error placing order',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    toast({
      title: 'Error loading market data',
      description: 'Please try again later.',
      variant: 'destructive',
    });
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trading Terminal</h1>
        <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Symbol" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_SYMBOLS.map((symbol) => (
              <SelectItem key={symbol} value={symbol}>
                {symbol}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{selectedSymbol} Chart</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center">Loading chart...</div>
            ) : (
              <TradingChart data={marketData || []} containerClassName="h-[400px]" />
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <OrderForm
            symbol={selectedSymbol}
            currentPrice={marketData?.[marketData.length - 1]?.close || 0}
            onSubmit={handleOrderSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default TradingTerminal;
