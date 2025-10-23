-- =======================================================================================
-- TRADEX-PRO UNIFIED DATABASE SCHEMA
-- Consolidated Schema Document - v1.0.0
-- =======================================================================================
-- This document defines the complete, consolidated database schema for TradeX-Pro
-- All tables, relationships, policies, and functions are defined here for reference
-- =======================================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =======================================================================================
-- ENUM TYPES
-- =======================================================================================

CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.account_status AS ENUM ('pending', 'active', 'suspended', 'closed');
CREATE TYPE public.kyc_status AS ENUM ('not_started', 'pending', 'approved', 'rejected');
CREATE TYPE public.order_status AS ENUM ('pending', 'filled', 'partially_filled', 'cancelled', 'rejected');
CREATE TYPE public.order_side AS ENUM ('buy', 'sell');
CREATE TYPE public.order_type AS ENUM ('market', 'limit', 'stop', 'stop_limit');
CREATE TYPE public.position_side AS ENUM ('long', 'short');
CREATE TYPE public.document_type AS ENUM ('id_proof', 'address_proof');
CREATE TYPE public.transaction_type AS ENUM ('deposit', 'withdrawal');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'rejected');

-- =======================================================================================
-- CORE TABLES
-- =======================================================================================

-- User profiles with financial information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  country TEXT,
  date_of_birth DATE,
  balance DECIMAL(15, 2) DEFAULT 0 NOT NULL,
  bonus_balance DECIMAL(15, 2) DEFAULT 0 NOT NULL,
  equity DECIMAL(15, 2) DEFAULT 0 NOT NULL,
  margin_used DECIMAL(15, 2) DEFAULT 0 NOT NULL,
  free_margin DECIMAL(15, 2) DEFAULT 0 NOT NULL,
  account_status account_status DEFAULT 'pending' NOT NULL,
  risk_tolerance TEXT,
  trading_experience TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- User roles for RBAC
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- =======================================================================================
-- KYC TABLES
-- =======================================================================================

-- KYC documents submitted by users
CREATE TABLE public.kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  document_type document_type NOT NULL,
  document_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KYC verification status
CREATE TABLE public.kyc_status (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  is_verified BOOLEAN DEFAULT false,
  id_proof_status TEXT NOT NULL DEFAULT 'not_submitted' CHECK (id_proof_status IN ('not_submitted', 'pending', 'approved', 'rejected')),
  address_proof_status TEXT NOT NULL DEFAULT 'not_submitted' CHECK (address_proof_status IN ('not_submitted', 'pending', 'approved', 'rejected')),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =======================================================================================
-- WALLET AND FINANCIAL TABLES
-- =======================================================================================

-- Wallet balances for users
CREATE TABLE public.wallet_balances (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  available_balance DECIMAL(15, 2) DEFAULT 0 CHECK (available_balance >= 0),
  pending_deposits DECIMAL(15, 2) DEFAULT 0 CHECK (pending_deposits >= 0),
  pending_withdrawals DECIMAL(15, 2) DEFAULT 0 CHECK (pending_withdrawals >= 0),
  total_deposits DECIMAL(15, 2) DEFAULT 0 CHECK (total_deposits >= 0),
  total_withdrawals DECIMAL(15, 2) DEFAULT 0 CHECK (total_withdrawals >= 0)
);

-- Financial transactions
CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type transaction_type NOT NULL,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  status transaction_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- =======================================================================================
-- TRADING TABLES
-- =======================================================================================

-- Trading orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  symbol TEXT NOT NULL,
  order_type order_type NOT NULL,
  side order_side NOT NULL,
  quantity DECIMAL(15, 2) NOT NULL CHECK (quantity > 0),
  price DECIMAL(15, 5) CHECK (price IS NULL OR price > 0),
  stop_price DECIMAL(15, 5) CHECK (stop_price IS NULL OR stop_price > 0),
  status order_status NOT NULL DEFAULT 'pending',
  filled_quantity DECIMAL(15, 2) DEFAULT 0 CHECK (filled_quantity >= 0),
  average_fill_price DECIMAL(15, 5) CHECK (average_fill_price IS NULL OR average_fill_price > 0),
  commission DECIMAL(15, 2) DEFAULT 0 CHECK (commission >= 0),
  pnl DECIMAL(15, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  filled_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Trading positions
CREATE TABLE public.positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  symbol TEXT NOT NULL,
  side position_side NOT NULL,
  quantity DECIMAL(15, 2) NOT NULL CHECK (quantity > 0),
  entry_price DECIMAL(15, 5) NOT NULL CHECK (entry_price > 0),
  current_price DECIMAL(15, 5) NOT NULL CHECK (current_price > 0),
  unrealized_pnl DECIMAL(15, 2) DEFAULT 0,
  realized_pnl DECIMAL(15, 2) DEFAULT 0,
  stop_loss DECIMAL(15, 5) CHECK (stop_loss IS NULL OR stop_loss > 0),
  take_profit DECIMAL(15, 5) CHECK (take_profit IS NULL OR take_profit > 0),
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, symbol, side)
);

-- Trade history for executed trades
CREATE TABLE public.trade_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  order_id UUID REFERENCES orders(id),
  symbol TEXT NOT NULL,
  side order_side NOT NULL,
  quantity DECIMAL(15, 2) NOT NULL CHECK (quantity > 0),
  price DECIMAL(15, 5) NOT NULL CHECK (price > 0),
  commission DECIMAL(15, 2) DEFAULT 0 CHECK (commission >= 0),
  pnl DECIMAL(15, 2) DEFAULT 0,
  executed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Market data cache
CREATE TABLE public.market_data_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL UNIQUE,
  price DECIMAL(15, 5) NOT NULL CHECK (price > 0),
  change DECIMAL(15, 5),
  change_percent DECIMAL(7, 2),
  volume BIGINT CHECK (volume IS NULL OR volume >= 0),
  high DECIMAL(15, 5) CHECK (high IS NULL OR high > 0),
  low DECIMAL(15, 5) CHECK (low IS NULL OR low > 0),
  open DECIMAL(15, 5) CHECK (open IS NULL OR open > 0),
  bid DECIMAL(15, 5) CHECK (bid IS NULL OR bid > 0),
  ask DECIMAL(15, 5) CHECK (ask IS NULL OR ask > 0),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Watchlists for users
CREATE TABLE public.watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, symbol)
);

-- =======================================================================================
-- LEAD MANAGEMENT TABLES
-- =======================================================================================

-- Lead tracking
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'new' NOT NULL,
  assigned_to UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- =======================================================================================
-- AUDIT TABLES
-- =======================================================================================

-- Audit logs for system events
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- =======================================================================================
-- INDEXES FOR PERFORMANCE
-- =======================================================================================

CREATE INDEX idx_profiles_user_id ON public.profiles(id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_orders_symbol ON public.orders(symbol);
CREATE INDEX idx_positions_user_id ON public.positions(user_id);
CREATE INDEX idx_positions_symbol ON public.positions(symbol);
CREATE INDEX idx_trade_history_user_id ON public.trade_history(user_id);
CREATE INDEX idx_trade_history_executed_at ON public.trade_history(executed_at DESC);
CREATE INDEX idx_trade_history_symbol ON public.trade_history(symbol);
CREATE INDEX idx_market_data_symbol ON public.market_data_cache(symbol);
CREATE INDEX idx_watchlists_user_id ON public.watchlists(user_id);
CREATE INDEX idx_leads_user_id ON public.leads(user_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);

-- =======================================================================================
-- ENABLE ROW LEVEL SECURITY
-- =======================================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_data_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- =======================================================================================
-- ROW LEVEL SECURITY POLICIES
-- =======================================================================================

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies (recursive reference requires special handling)
CREATE POLICY "Users and admins can view roles" ON public.user_roles FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- KYC policies
CREATE POLICY "Users can view own KYC documents" ON public.kyc_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own KYC documents" ON public.kyc_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own KYC status" ON public.kyc_status FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can update KYC status" ON public.kyc_status FOR UPDATE USING (auth.uid() = user_id);

-- Wallet policies
CREATE POLICY "Users can view own wallet balance" ON public.wallet_balances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can update wallet balances" ON public.wallet_balances FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own wallet transactions" ON public.wallet_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert wallet transactions" ON public.wallet_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trading policies
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON public.orders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own positions" ON public.positions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own positions" ON public.positions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own positions" ON public.positions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own trade history" ON public.trade_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own trade history" ON public.trade_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own watchlist" ON public.watchlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own watchlist" ON public.watchlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view market data" ON public.market_data_cache FOR SELECT USING (true);

-- Admin policies
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all positions" ON public.positions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all trade history" ON public.trade_history FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Lead policies
CREATE POLICY "Admins can manage all leads" ON public.leads FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Audit policies
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- =======================================================================================
-- FUNCTIONS
-- =======================================================================================

-- Role checking function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Generate lead ID
CREATE OR REPLACE FUNCTION public.generate_lead_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_id TEXT;
  done BOOLEAN := FALSE;
BEGIN
  WHILE NOT done LOOP
    new_id := 'LEAD-' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    IF NOT EXISTS (SELECT 1 FROM public.leads WHERE lead_id = new_id) THEN
      done := TRUE;
    END IF;
  END LOOP;
  RETURN new_id;
END;
$$;

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- =======================================================================================
-- TRIGGERS
-- =======================================================================================

-- Auto-update triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_positions_updated_at BEFORE UPDATE ON public.positions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_kyc_documents_updated_at BEFORE UPDATE ON public.kyc_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- User creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_lead_id TEXT;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );

  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  -- Initialize KYC status
  INSERT INTO public.kyc_status (user_id)
  VALUES (NEW.id);

  -- Initialize wallet balance
  INSERT INTO public.wallet_balances (user_id)
  VALUES (NEW.id);

  -- Generate lead ID and create lead
  new_lead_id := public.generate_lead_id();
  INSERT INTO public.leads (lead_id, user_id, status)
  VALUES (new_lead_id, NEW.id, 'new');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- KYC approval trigger
CREATE OR REPLACE FUNCTION public.handle_kyc_approval()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'approved' THEN
    UPDATE public.kyc_status
    SET
      is_verified = CASE
        WHEN id_proof_status = 'approved' AND address_proof_status = 'approved' THEN true
        ELSE false
      END,
      last_updated = NOW()
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_kyc_document_update
  AFTER UPDATE ON public.kyc_documents
  FOR EACH ROW EXECUTE FUNCTION public.handle_kyc_approval();

-- =======================================================================================
-- EDGE FUNCTIONS PLACEHOLDER (TO BE IMPLEMENTED)
-- =======================================================================================

-- These will be implemented as Supabase Edge Functions
-- execute-order: Atomic order execution with validation
-- close-position: Position closure with P&L calculation
-- update-positions: Real-time position updates
-- process-margin-call: Margin monitoring and liquidation
-- market-data: Real-time market data streaming
