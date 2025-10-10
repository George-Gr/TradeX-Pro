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

interface OrderHistoryTableProps {
  orders: OrderHistory[];
}

export const OrderHistoryTable = ({ orders }: OrderHistoryTableProps) => {
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
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{format(new Date(order.created_at), 'yyyy-MM-dd HH:mm')}</TableCell>
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
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
