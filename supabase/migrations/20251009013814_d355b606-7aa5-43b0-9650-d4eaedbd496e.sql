-- Create orders table
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  symbol text NOT NULL,
  order_type text NOT NULL CHECK (order_type IN ('market', 'limit', 'stop', 'stop_limit')),
  side text NOT NULL CHECK (side IN ('buy', 'sell')),
  quantity numeric NOT NULL CHECK (quantity > 0),
  price numeric CHECK (price IS NULL OR price > 0),
  stop_price numeric CHECK (stop_price IS NULL OR stop_price > 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'filled', 'partially_filled', 'cancelled', 'rejected')),
  filled_quantity numeric DEFAULT 0 CHECK (filled_quantity >= 0),
  average_fill_price numeric CHECK (average_fill_price IS NULL OR average_fill_price > 0),
  commission numeric DEFAULT 0 CHECK (commission >= 0),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  filled_at timestamptz
);

-- Create positions table
CREATE TABLE public.positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  symbol text NOT NULL,
  side text NOT NULL CHECK (side IN ('long', 'short')),
  quantity numeric NOT NULL CHECK (quantity > 0),
  entry_price numeric NOT NULL CHECK (entry_price > 0),
  current_price numeric NOT NULL CHECK (current_price > 0),
  unrealized_pnl numeric DEFAULT 0,
  realized_pnl numeric DEFAULT 0,
  stop_loss numeric CHECK (stop_loss IS NULL OR stop_loss > 0),
  take_profit numeric CHECK (take_profit IS NULL OR take_profit > 0),
  opened_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, symbol, side)
);

-- Create trade_history table
CREATE TABLE public.trade_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  order_id uuid REFERENCES orders(id),
  symbol text NOT NULL,
  side text NOT NULL CHECK (side IN ('buy', 'sell')),
  quantity numeric NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL CHECK (price > 0),
  commission numeric DEFAULT 0 CHECK (commission >= 0),
  pnl numeric DEFAULT 0,
  executed_at timestamptz NOT NULL DEFAULT now()
);

-- Create market_data_cache table
CREATE TABLE public.market_data_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL UNIQUE,
  price numeric NOT NULL CHECK (price > 0),
  change numeric,
  change_percent numeric,
  volume bigint CHECK (volume IS NULL OR volume >= 0),
  high numeric CHECK (high IS NULL OR high > 0),
  low numeric CHECK (low IS NULL OR low > 0),
  open numeric CHECK (open IS NULL OR open > 0),
  bid numeric CHECK (bid IS NULL OR bid > 0),
  ask numeric CHECK (ask IS NULL OR ask > 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_data_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for positions
CREATE POLICY "Users can view own positions"
  ON public.positions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own positions"
  ON public.positions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own positions"
  ON public.positions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all positions"
  ON public.positions FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for trade_history
CREATE POLICY "Users can view own trade history"
  ON public.trade_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trade history"
  ON public.trade_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all trade history"
  ON public.trade_history FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for market_data_cache (public read)
CREATE POLICY "Anyone can view market data"
  ON public.market_data_cache FOR SELECT
  USING (true);

-- Create trigger for updating updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_positions_updated_at
  BEFORE UPDATE ON public.positions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_positions_user_id ON public.positions(user_id);
CREATE INDEX idx_trade_history_user_id ON public.trade_history(user_id);
CREATE INDEX idx_trade_history_executed_at ON public.trade_history(executed_at DESC);
CREATE INDEX idx_market_data_symbol ON public.market_data_cache(symbol);