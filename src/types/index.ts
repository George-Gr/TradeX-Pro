export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface TradingAsset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
}

export interface TradeOrder {
  id: string;
  userId: string;
  symbol: string;
  type: 'market' | 'limit';
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  status: 'open' | 'closed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Portfolio {
  userId: string;
  assets: {
    symbol: string;
    quantity: number;
    averagePrice: number;
    currentPrice: number;
  }[];
  totalValue: number;
  profitLoss: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export type ErrorResponse = {
  code: string;
  message: string;
  details?: Record<string, string[]>;
};
