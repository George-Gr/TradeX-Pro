import { User } from './index';

// Legacy/old types - keep for backward compatibility
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  tradingVolume: number;
  revenue: number;
}

export interface UserManagementAction {
  type: 'suspend' | 'activate' | 'delete';
  userId: string;
  reason?: string;
}

export interface AdminDashboardData {
  stats: AdminStats;
  recentUsers: User[];
  recentTrades: {
    id: string;
    userId: string;
    amount: number;
    type: string;
    timestamp: string;
  }[];
}

// New RPC-backed admin types
export interface AdminMetrics {
  total_users: number;
  active_users: number;
  kyc_pending: number;
  total_deposits: number;
  total_withdrawals: number;
  total_volume: number;
  total_commission: number;
}

export interface AdminUserProfile {
  id: string;
  email: string;
  full_name?: string | null;
  phone?: string | null;
  country?: string | null;
  kyc_status?: {
    is_verified?: boolean | null;
    id_proof_status?: string | null;
    address_proof_status?: string | null;
  } | null;
  wallet_balance?: {
    available_balance?: number | null;
    pending_deposits?: number | null;
    pending_withdrawals?: number | null;
  } | null;
  created_at?: string | null;
  last_sign_in?: string | null;
}

export interface AdminKYCReview {
  id: string;
  user_id: string;
  user_email: string;
  document_type: string;
  document_url: string;
  status: string;
  created_at: string;
}

export interface AdminTransaction {
  id: string;
  user_id: string;
  user_email: string;
  type: 'deposit' | 'withdrawal' | string;
  amount: number;
  status: string;
  created_at: string;
}

export type { AdminMetrics as AdminMetricsLegacy };
