import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTradingStore } from '@/stores/tradingStore';
import { useToast } from '@/hooks/use-toast';

const orderFormSchema = z.object({
  orderType: z.enum(['market', 'limit']),
  side: z.enum(['buy', 'sell']),
  quantity: z.number().positive('Quantity must be positive'),
  price: z.number().positive('Price must be positive').optional(),
  stopLoss: z.number().positive('Stop loss must be positive').optional(),
  takeProfit: z.number().positive('Take profit must be positive').optional(),
});

export type OrderFormData = z.infer<typeof orderFormSchema>;

export const useOrderForm = () => {
  const { selectedSymbol, isLoading, placeOrder } = useTradingStore();
  const currentPrice = useTradingStore((state) => state.marketData?.[selectedSymbol]?.price || 0);
  const { toast } = useToast();

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      orderType: 'market',
      side: 'buy',
      quantity: 1,
      price: currentPrice,
    },
  });

  const onSubmit = async (data: OrderFormData) => {
    try {
      await placeOrder({
        symbol: selectedSymbol,
        order_type: data.orderType,
        side: data.side,
        quantity: data.quantity,
        price: data.orderType === 'market' ? currentPrice : data.price,
        stop_loss: data.stopLoss,
        take_profit: data.takeProfit,
      });

      toast({
        title: 'Order placed successfully',
        description: `${data.side.toUpperCase()} ${data.quantity} ${selectedSymbol}`,
      });

      form.reset();
    } catch (error) {
      toast({
        title: 'Failed to place order',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  return {
    form,
    isLoading,
    selectedSymbol,
    currentPrice,
    onSubmit,
  };
};
