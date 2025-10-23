import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { toast } from '@/utils/toast';
import { useState } from 'react';
import { useTradingStore } from '@/stores/tradingStore';
import { supabase } from '@/integrations/supabase/client';
import { validationService } from '@/services/validationService';
import { useAuth } from '@/hooks/use-auth';

const orderFormSchema = z.object({
  orderType: z.enum(['market', 'limit', 'stop', 'stop_limit']),
  side: z.enum(['buy', 'sell']),
  quantity: z.number().positive('Quantity must be positive'),
  price: z.number().positive('Price must be positive').optional(),
  stopLoss: z.number().positive('Stop loss must be positive').optional(),
  takeProfit: z.number().positive('Take profit must be positive').optional(),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

interface OrderFormProps {
  symbol?: string;
}

export const OrderForm: React.FC<OrderFormProps> = ({ symbol: externalSymbol }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedSymbol } = useTradingStore();

  // Use external symbol or selected symbol from store
  const symbol = externalSymbol || selectedSymbol;

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      orderType: 'market',
      side: 'buy',
      quantity: 1,
    },
  });

  const { user } = useAuth();

  const onSubmit = async (data: OrderFormData) => {
    if (!symbol) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No symbol selected. Please select a trading symbol.',
      });
      return;
    }

    if (!user?.id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to place orders.',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Pre-validate the order
      const validationResult = await validationService.validateOrder(
        {
          symbol,
          orderType: data.orderType,
          side: data.side,
          quantity: data.quantity,
          price: data.price,
          stopLoss: data.stopLoss,
          takeProfit: data.takeProfit,
        },
        user.id
      );

      // Show warnings if any
      if (validationResult.warnings.length > 0) {
        const proceed = confirm(
          `Warnings:\n${validationResult.warnings.map((w) => `• ${w}`).join('\n')}\n\nDo you want to proceed with the order?`
        );

        if (!proceed) {
          setIsSubmitting(false);
          return;
        }
      }

      // Check if validation passed
      if (!validationResult.isValid) {
        toast({
          variant: 'destructive',
          title: 'Validation Failed',
          description: validationResult.errors[0], // Show first error as main message
        });

        // Set all validation errors in the form
        if (validationResult.errors.length > 1) {
          setTimeout(() => {
            toast({
              variant: 'destructive',
              title: 'Additional Validation Errors',
              description: validationResult.errors.slice(1).join('\n'),
            });
          }, 1000);
        }

        setIsSubmitting(false);
        return;
      }

      // Call the execute-order Edge Function
      const { data: result, error } = await supabase.functions.invoke('execute-order', {
        body: {
          symbol,
          order_type: data.orderType,
          side: data.side,
          quantity: data.quantity,
          price: data.price,
          stop_loss: data.stopLoss,
          take_profit: data.takeProfit,
        },
      });

      if (error) {
        throw error;
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to place order');
      }

      toast({
        title: 'Order Placed Successfully',
        description: `Order for ${data.side.toUpperCase()} ${data.quantity} ${symbol} has been placed.`,
      });

      // Reset form
      form.reset({
        orderType: 'market',
        side: data.side, // Keep the same side
        quantity: 1,
      });
    } catch (error) {
      console.error('Order placement error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to place order. Please try again.';
      toast({
        variant: 'destructive',
        title: 'Order Failed',
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!symbol) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Place Order</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please select a symbol to place an order.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place Order - {symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="orderType"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Order Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="market" id="market" />
                        <Label htmlFor="market">Market</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="limit" id="limit" />
                        <Label htmlFor="limit">Limit</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="side"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Side</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="buy" id="buy" />
                        <Label htmlFor="buy">Buy</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sell" id="sell" />
                        <Label htmlFor="sell">Sell</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('orderType') === 'limit' && (
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limit Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="stopLoss"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Stop Loss</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="takeProfit"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Take Profit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
