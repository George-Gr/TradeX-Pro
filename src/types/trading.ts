export interface Order {
  id: string;
  user_id: string;
  symbol: string;
  order_type: 'market' | 'limit';
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  stop_loss?: number;
  take_profit?: number;
  status: 'open' | 'closed' | 'cancelled';
  filled_at?: string;
  filled_quantity?: number;
  average_fill_price?: number;
  commission?: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface Position {
  id: string;
  symbol: string;
  quantity: number;
  average_entry: number;
  current_price: number;
  unrealized_pnl: number;
  unrealized_pnl_percentage: number;
  market_value: number;
  status: 'open' | 'closed';
}

export interface OrderHistory {
  id: string;
  user_id: string;
  order_id?: string;
  symbol: string;
  type: 'market' | 'limit';
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  status: 'open' | 'filled' | 'cancelled';
  commission?: number;
  pnl?: number;
  pnl_percentage?: number;
  createdAt: string;
  executed_at?: string;
}
