import { Position, Order, Symbol } from '../types/trading';
import { User, Session } from '@supabase/supabase-js';
import { Portfolio, Balance } from '../types/index';
import { MarketData } from '../types/trading';

export interface Profile {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
  kyc_status?: 'pending' | 'approved' | 'rejected';
  kyc_submitted_at?: string;
}

export interface TradingStore {
  selectedSymbol: Symbol | null;
  positions: Position[];
  orders: Order[];
  orderHistory: OrderHistory[];
  isLoading: boolean;
  error: string | null;
  setSelectedSymbol: (symbol: Symbol) => void;
  updatePositions: (positions: Position[]) => void;
  updateOrders: (orders: Order[]) => void;
  placeOrder: (order: Omit<Order, 'id'>) => Promise<Order>;
  closePosition: (positionId: string, quantity?: number) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  modifyOrder: (orderId: string, updates: Partial<Order>) => Promise<Order>;
  fetchOrderHistory: () => Promise<void>;
  subscribeToUpdates: () => void;
}

export interface AuthStore {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailVerified: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  refreshSession: () => Promise<void>;
}

export interface PortfolioStore {
  portfolio: Portfolio | null;
  portfolioHistory: PortfolioSnapshot[];
  balances: Balance[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  updatePortfolio: (portfolio: Portfolio) => void;
  updateBalances: (balances: Balance[]) => void;
  fetchPortfolio: () => Promise<void>;
  fetchBalances: () => Promise<void>;
  cleanup: () => void;
}

export interface PortfolioSnapshot extends Portfolio {
  timestamp: string;
}

export interface MarketDataStore {
  marketData: Record<string, MarketData & { lastUpdated: string }>;
  watchlist: Symbol[];
  isLoading: boolean;
  error: string | null;
  updateMarketData: (symbol: string, data: MarketData) => void;
  addToWatchlist: (symbol: Symbol) => Promise<void>;
  removeFromWatchlist: (symbol: Symbol) => Promise<void>;
  subscribeToMarketData: (symbol: string) => void;
  unsubscribeFromMarketData: (symbol: string) => void;
}

export interface NotificationStore {
  notifications: Notification[];
  hasUnread: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAll: () => void;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface OrderHistory {
  id: string;
  user_id: string;
  order_id?: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  commission?: number;
  pnl?: number;
  executed_at: string;
}
