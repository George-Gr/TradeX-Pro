export interface KYCDocument {
  id: string;
  user_id: string;
  document_type: 'id_proof' | 'address_proof';
  document_url: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface KYCStatus {
  is_verified: boolean;
  id_proof_status: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  address_proof_status: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  last_updated: string;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  rejection_reason?: string;
  created_at: string;
  completed_at?: string;
}

export interface WalletBalance {
  available_balance: number;
  pending_deposits: number;
  pending_withdrawals: number;
  total_deposits: number;
  total_withdrawals: number;
}
