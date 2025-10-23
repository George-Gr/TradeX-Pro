import { AssetPerformance } from '../../hooks/use-analytics';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface AssetTableProps {
  assets: AssetPerformance[];
}

export const AssetTable = ({ assets }: AssetTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Trades</TableHead>
              <TableHead>Win Rate</TableHead>
              <TableHead>Total P&L</TableHead>
              <TableHead>Avg P&L/Trade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.symbol}>
                <TableCell className="font-medium">{asset.symbol}</TableCell>
                <TableCell>{asset.total_trades}</TableCell>
                <TableCell>{(asset.win_rate * 100).toFixed(1)}%</TableCell>
                <TableCell className={asset.total_pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                  ${asset.total_pnl.toFixed(2)}
                </TableCell>
                <TableCell className={asset.average_pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                  ${asset.average_pnl.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            {assets.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No trading activity found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
