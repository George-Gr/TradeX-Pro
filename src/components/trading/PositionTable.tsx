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

interface PositionTableProps {
  positions: Position[];
}

export const PositionTable = ({ positions }: PositionTableProps) => {
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
            {positions.map((position) => (
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
              </TableRow>
            ))}
            {positions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No open positions
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
