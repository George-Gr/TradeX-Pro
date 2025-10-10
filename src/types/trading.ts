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
  created_at: string;
}

export interface Position {
  symbol: string;
  quantity: number;
  average_entry: number;
  current_price: number;
  unrealized_pnl: number;
  unrealized_pnl_percentage: number;
  market_value: number;
}

export interface OrderHistory {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  type: 'market' | 'limit';
  status: 'open' | 'closed' | 'cancelled';
  pnl?: number;
  pnl_percentage?: number;
  closed_at?: string;
  created_at: string;
}
