import { Position } from '@/types/trading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTradingStore } from '@/stores/tradingStore';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { toast } from '@/utils/toast';

export const PositionTable = () => {
  const { positions, isLoading, error, closePosition, subscribeToUpdates } = useTradingStore();
  const { toast } = useToast();

  useEffect(() => {
    subscribeToUpdates();
  }, [subscribeToUpdates]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Open Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Entry Price</TableHead>
              <TableHead>Current Price</TableHead>
              <TableHead>Market Value</TableHead>
              <TableHead>Unrealized P&L</TableHead>
              <TableHead>P&L %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
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
            ) : positions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No open positions
                </TableCell>
              </TableRow>
            ) : (
              positions.map((position) => (
                <TableRow key={position.symbol}>
                  <TableCell className="font-medium">{position.symbol}</TableCell>
                  <TableCell>{position.quantity.toFixed(2)}</TableCell>
                  <TableCell>${position.average_entry.toFixed(2)}</TableCell>
                  <TableCell>${position.current_price.toFixed(2)}</TableCell>
                  <TableCell>${position.market_value.toFixed(2)}</TableCell>
                  <TableCell
                    className={position.unrealized_pnl >= 0 ? 'text-green-500' : 'text-red-500'}
                  >
                    ${position.unrealized_pnl.toFixed(2)}
                  </TableCell>
                  <TableCell
                    className={
                      position.unrealized_pnl_percentage >= 0 ? 'text-green-500' : 'text-red-500'
                    }
                  >
                    {position.unrealized_pnl_percentage.toFixed(2)}%
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        try {
                          await closePosition(position.id);
                          toast({
                            title: 'Success',
                            description: `Closed position for ${position.symbol}`,
                          });
                        } catch (error) {
                          toast({
                            title: 'Error',
                            description:
                              error instanceof Error ? error.message : 'Failed to close position',
                            variant: 'destructive',
                          });
                        }
                      }}
                    >
                      Close
                    </Button>
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
