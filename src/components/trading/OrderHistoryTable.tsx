import { OrderHistory } from '@/types/trading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { useTradingStore } from '@/stores/tradingStore';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const OrderHistoryTable = () => {
  const { orderHistory, isLoading, error, fetchOrderHistory } = useTradingStore();

  useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Side</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>P&L</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-destructive">
                  {error}
                </TableCell>
              </TableRow>
            ) : orderHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orderHistory.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm')}</TableCell>
                  <TableCell className="font-medium">{order.symbol}</TableCell>
                  <TableCell className="capitalize">{order.type}</TableCell>
                  <TableCell className={order.side === 'buy' ? 'text-green-500' : 'text-red-500'}>
                    {order.side.toUpperCase()}
                  </TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>${order.price.toFixed(2)}</TableCell>
                  <TableCell className="capitalize">{order.status}</TableCell>
                  <TableCell
                    className={order.pnl && order.pnl > 0 ? 'text-green-500' : 'text-red-500'}
                  >
                    {order.pnl ? (
                      <>
                        ${order.pnl.toFixed(2)}
                        <span className="text-xs ml-1">({order.pnl_percentage?.toFixed(2)}%)</span>
                      </>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
