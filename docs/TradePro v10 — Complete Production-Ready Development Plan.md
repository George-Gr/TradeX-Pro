# **🚀 TradeXPro v10 — Complete Production-Ready Development Plan**

---

## **📋 Table of Contents**

1. [Complete Database Schema](https://claude.ai/chat/ac74de4f-de8e-4c55-a617-a22f2a94181a#1-complete-database-schema)
2. [TypeScript Type Definitions](https://claude.ai/chat/ac74de4f-de8e-4c55-a617-a22f2a94181a#2-typescript-type-definitions)
3. [Edge Functions Implementation](https://claude.ai/chat/ac74de4f-de8e-4c55-a617-a22f2a94181a#3-edge-functions-implementation)
4. [React Component Architecture](https://claude.ai/chat/ac74de4f-de8e-4c55-a617-a22f2a94181a#4-react-component-architecture)
5. [State Management](https://claude.ai/chat/ac74de4f-de8e-4c55-a617-a22f2a94181a#5-state-management)
6. [Trading Logic & Calculations](https://claude.ai/chat/ac74de4f-de8e-4c55-a617-a22f2a94181a#6-trading-logic--calculations)
7. [Error Handling & Validation](https://claude.ai/chat/ac74de4f-de8e-4c55-a617-a22f2a94181a#7-error-handling--validation)
8. [Security & RLS Policies](https://claude.ai/chat/ac74de4f-de8e-4c55-a617-a22f2a94181a#8-security--rls-policies)
9. [Testing Specifications](https://claude.ai/chat/ac74de4f-de8e-4c55-a617-a22f2a94181a#9-testing-specifications)
10. [Deployment Guide](https://claude.ai/chat/ac74de4f-de8e-4c55-a617-a22f2a94181a#10-deployment-guide)
11. [AI Prompt Pack](https://claude.ai/chat/ac74de4f-de8e-4c55-a617-a22f2a94181a#11-ai-prompt-pack)

---

## **1\. Complete Database Schema**

### **Migration 001: Core Tables**

\-- supabase/migrations/001_core_tables.sql

\-- Enable necessary extensions  
create extension if not exists "uuid-ossp";  
create extension if not exists "pg_cron";

\-- \============================================  
\-- USERS & PROFILES  
\-- \============================================

create table profiles (  
 id uuid primary key references auth.users on delete cascade,  
 email text unique not null,  
 full_name text,  
 date_of_birth date,  
 country text,  
 address text,  
 city text,  
 postal_code text,  
 phone text,

\-- Account financials  
 balance numeric(12,4) default 10000.0000 not null check (balance \>= 0),  
 equity numeric(12,4) default 10000.0000 not null,  
 margin_used numeric(12,4) default 0 not null,  
 free_margin numeric(12,4) default 10000.0000 not null,  
 margin_level numeric(6,2), \-- (equity / margin_used) \* 100

\-- Trading settings  
 leverage numeric(4,2) default 30.00 not null check (leverage \> 0 and leverage \<= 500),  
 currency text default 'USD' not null,  
 timezone text default 'UTC',

\-- KYC status  
 kyc_status text default 'pending_info' check (  
 kyc_status in (  
 'pending_info',  
 'pending_documents',  
 'pending_review',  
 'approved',  
 'rejected',  
 'requires_resubmit'  
 )  
 ),  
 kyc_rejection_reason text,  
 risk_tolerance text check (risk_tolerance in ('conservative', 'moderate', 'aggressive', 'very_aggressive')),

\-- Account status  
 account_status text default 'active' check (account_status in ('active', 'suspended', 'closed')),  
 suspension_reason text,

\-- Metadata  
 ip_at_signup inet,  
 last_login timestamptz,  
 created_at timestamptz default now(),  
 updated_at timestamptz default now()  
);

\-- \============================================  
\-- ORDERS  
\-- \============================================

create table orders (  
 id uuid primary key default gen_random_uuid(),  
 user_id uuid not null references profiles(id) on delete cascade,

\-- Order details  
 symbol text not null,  
 order_type text not null check (order_type in ('market', 'limit', 'stop', 'stop_limit', 'trailing_stop')),  
 side text not null check (side in ('buy', 'sell')),

\-- Quantities  
 quantity numeric(18,8) not null check (quantity \> 0),  
 filled_quantity numeric(18,8) default 0 not null check (filled_quantity \>= 0),

\-- Prices  
 price numeric(18,8), \-- Entry price for limit/stop orders  
 stop_price numeric(18,8), \-- Trigger price for stop orders  
 limit_price numeric(18,8), \-- Limit price for stop-limit  
 stop_loss numeric(18,8),  
 take_profit numeric(18,8),  
 trailing_amount numeric(18,8), \-- For trailing stops

\-- Order management  
 status text default 'pending' check (status in ('pending', 'open', 'filled', 'partially_filled', 'cancelled', 'rejected', 'expired')),  
 time_in_force text default 'GTC' check (time_in_force in ('GTC', 'IOC', 'FOK', 'DAY')),  
 expires_at timestamptz,

\-- OCO (One-Cancels-Other) grouping  
 oco_group uuid,

\-- Execution details  
 fill_price numeric(18,8), \-- Actual execution price  
 commission numeric(12,4) default 0,  
 slippage numeric(12,8) default 0,  
 rejection_reason text,

\-- Idempotency  
 idempotency_key text unique not null,

\-- Timestamps  
 created_at timestamptz default now(),  
 updated_at timestamptz default now(),  
 filled_at timestamptz,  
 cancelled_at timestamptz  
);

create index idx_orders_user_status on orders(user_id, status);  
create index idx_orders_symbol on orders(symbol);  
create index idx_orders_created on orders(created_at desc);  
create index idx_orders_oco on orders(oco_group) where oco_group is not null;

\-- \============================================  
\-- FILLS  
\-- \============================================

create table fills (  
 id uuid primary key default gen_random_uuid(),  
 order_id uuid not null references orders(id) on delete cascade,  
 user_id uuid not null references profiles(id) on delete cascade,

\-- Fill details  
 symbol text not null,  
 side text not null check (side in ('buy', 'sell')),  
 quantity numeric(18,8) not null check (quantity \> 0),  
 price numeric(18,8) not null check (price \> 0),

\-- Costs  
 commission numeric(12,4) default 0,  
 slippage numeric(12,8) default 0,

\-- Metadata  
 fill_type text check (fill_type in ('full', 'partial')),  
 executed_at timestamptz default now()  
);

create index idx_fills_order on fills(order_id);  
create index idx_fills_user on fills(user_id, executed_at desc);

\-- \============================================  
\-- POSITIONS  
\-- \============================================

create table positions (  
 id uuid primary key default gen_random_uuid(),  
 user_id uuid not null references profiles(id) on delete cascade,

\-- Position details  
 symbol text not null,  
 side text not null check (side in ('long', 'short')),  
 quantity numeric(18,8) not null check (quantity \> 0),

\-- Prices  
 entry_price numeric(18,8) not null check (entry_price \> 0),  
 current_price numeric(18,8) not null check (current_price \> 0),

\-- P\&L  
 unrealized_pnl numeric(12,4) default 0,  
 realized_pnl numeric(12,4) default 0,

\-- Margin  
 leverage numeric(4,2) not null,  
 margin_used numeric(12,4) not null check (margin_used \>= 0),  
 contract_size numeric(18,8) default 1,

\-- Fees  
 swap_accumulated numeric(12,4) default 0,  
 total_commission numeric(12,4) default 0,

\-- Risk management  
 stop_loss numeric(18,8),  
 take_profit numeric(18,8),

\-- Status  
 status text default 'open' check (status in ('open', 'closed', 'liquidated')),

\-- Timestamps  
 opened_at timestamptz default now(),  
 closed_at timestamptz,  
 updated_at timestamptz default now()  
);

create index idx_positions_user_open on positions(user_id, status) where status \= 'open';  
create index idx_positions_symbol on positions(symbol);  
create index idx_positions_opened on positions(opened_at desc);

\-- \============================================  
\-- ORDER LOTS (FIFO P\&L Tracking)  
\-- \============================================

create table order_lots (  
 id uuid primary key default gen_random_uuid(),  
 position_id uuid not null references positions(id) on delete cascade,  
 order_id uuid not null references orders(id) on delete cascade,  
 user_id uuid not null references profiles(id) on delete cascade,

\-- Lot details  
 quantity numeric(18,8) not null check (quantity \> 0),  
 remaining_quantity numeric(18,8) not null check (remaining_quantity \>= 0),  
 entry_price numeric(18,8) not null check (entry_price \> 0),  
 close_price numeric(18,8),

\-- P\&L  
 realized_pnl numeric(12,4) default 0,

\-- FIFO tracking  
 close_sequence int, \-- Order in which lots are closed  
 status text default 'open' check (status in ('open', 'partially_closed', 'closed')),

\-- Timestamps  
 opened_at timestamptz default now(),  
 closed_at timestamptz  
);

create index idx_lots_position_fifo on order_lots(position_id, opened_at);  
create index idx_lots_user on order_lots(user_id, status);

\-- \============================================  
\-- LEDGER (Transaction History)  
\-- \============================================

create table ledger (  
 id bigserial primary key,  
 user_id uuid not null references profiles(id) on delete cascade,

\-- Transaction details  
 transaction_type text not null check (  
 transaction_type in (  
 'deposit',  
 'withdrawal',  
 'realized_pnl',  
 'commission',  
 'swap',  
 'adjustment',  
 'bonus',  
 'refund'  
 )  
 ),  
 amount numeric(12,4) not null,  
 balance_before numeric(12,4) not null,  
 balance_after numeric(12,4) not null,

\-- Reference  
 reference_id uuid, \-- Links to order, position, etc.  
 reference_type text, \-- 'order', 'position', 'manual'  
 description text,

\-- Metadata  
 created_at timestamptz default now()  
);

create index idx_ledger_user_date on ledger(user_id, created_at desc);  
create index idx_ledger_type on ledger(transaction_type);  
create index idx_ledger_reference on ledger(reference_id);

\-- \============================================  
\-- SWAP RATES  
\-- \============================================

create table swap_rates (  
 symbol text primary key,  
 asset_class text not null check (asset_class in ('forex', 'stocks', 'indices', 'commodities', 'crypto')),  
 long_rate numeric(8,5) not null, \-- Annual percentage  
 short_rate numeric(8,5) not null,  
 updated_at timestamptz default now()  
);

\-- Populate with initial data  
insert into swap_rates (symbol, asset_class, long_rate, short_rate) values  
('EURUSD', 'forex', \-0.00050, 0.00030),  
('GBPUSD', 'forex', \-0.00045, 0.00025),  
('USDJPY', 'forex', 0.00020, \-0.00040),  
('XAUUSD', 'commodities', \-0.00250, 0.00150),  
('BTCUSD', 'crypto', 0.00000, 0.00000),  
('AAPL', 'stocks', 0.00000, 0.00000);

\-- \============================================  
\-- CORPORATE ACTIONS  
\-- \============================================

create table corporate_actions (  
 id uuid primary key default gen_random_uuid(),  
 symbol text not null,  
 action_type text not null check (action_type in ('split', 'reverse_split', 'dividend', 'symbol_change', 'delisting')),

\-- Split details  
 split_ratio numeric(10,4), \-- e.g., 2.0 for 2-for-1 split

\-- Dividend details  
 dividend_amount numeric(12,4),

\-- Symbol change  
 new_symbol text,

\-- Timing  
 announcement_date date not null,  
 ex_date date not null,  
 effective_date date not null,

\-- Status  
 status text default 'pending' check (status in ('pending', 'applied', 'cancelled')),  
 applied_at timestamptz,

created_at timestamptz default now()  
);

create index idx_corporate_actions_symbol on corporate_actions(symbol, effective_date);

\-- \============================================  
\-- KYC DOCUMENTS  
\-- \============================================

create table kyc_documents (  
 id uuid primary key default gen_random_uuid(),  
 user_id uuid not null references profiles(id) on delete cascade,

\-- Document details  
 document_type text not null check (  
 document_type in (  
 'id_front',  
 'id_back',  
 'passport',  
 'drivers_license',  
 'proof_of_address',  
 'bank_statement',  
 'selfie'  
 )  
 ),  
 file_path text not null, \-- Path in Supabase Storage  
 file_size_kb int,  
 mime_type text,

\-- Review status  
 status text default 'pending' check (status in ('pending', 'approved', 'rejected', 'expired')),  
 reviewed_by uuid references profiles(id),  
 review_notes text,  
 rejection_reason text,

\-- Timestamps  
 uploaded_at timestamptz default now(),  
 reviewed_at timestamptz,  
 expires_at timestamptz  
);

create index idx_kyc_user on kyc_documents(user_id, uploaded_at desc);  
create index idx_kyc_status on kyc_documents(status, uploaded_at);

\-- \============================================  
\-- COPY TRADING  
\-- \============================================

create table copy_relationships (  
 id uuid primary key default gen_random_uuid(),  
 follower_id uuid not null references profiles(id) on delete cascade,  
 leader_id uuid not null references profiles(id) on delete cascade,

\-- Copy settings  
 copy_ratio numeric(3,2) not null check (copy_ratio \> 0 and copy_ratio \<= 1), \-- 0.1 \= 10%  
 max_exposure numeric(12,4) not null, \-- Maximum follower capital to allocate  
 copy_delay_seconds int default 0 check (copy_delay_seconds \>= 0),

\-- Risk management  
 min_leader_balance numeric(12,4) default 5000,  
 max_drawdown_threshold numeric(5,2) default 30.00, \-- Auto-disconnect at 30% drawdown

\-- Status  
 status text default 'active' check (status in ('active', 'paused', 'disconnected')),  
 disconnection_reason text,

\-- Statistics  
 total_copied_trades int default 0,  
 follower_pnl numeric(12,4) default 0,

\-- Timestamps  
 created_at timestamptz default now(),  
 updated_at timestamptz default now(),  
 disconnected_at timestamptz,

\-- Constraints  
 check (follower_id \!= leader_id)  
);

create unique index idx_copy_unique on copy_relationships(follower_id, leader_id) where status \= 'active';  
create index idx_copy_leader on copy_relationships(leader_id, status);  
create index idx_copy_follower on copy_relationships(follower_id, status);

\-- \============================================  
\-- PRICE ALERTS  
\-- \============================================

create table price_alerts (  
 id uuid primary key default gen_random_uuid(),  
 user_id uuid not null references profiles(id) on delete cascade,

\-- Alert details  
 symbol text not null,  
 condition text not null check (condition in ('above', 'below', 'crosses_above', 'crosses_below')),  
 target_price numeric(18,8) not null check (target_price \> 0),

\-- Notification  
 notification_method text default 'in_app' check (notification_method in ('in_app', 'email', 'sms', 'push')),  
 message text,

\-- Status  
 status text default 'active' check (status in ('active', 'triggered', 'expired', 'cancelled')),  
 triggered_at timestamptz,  
 trigger_price numeric(18,8),

\-- Expiry  
 expires_at timestamptz,

created_at timestamptz default now()  
);

create index idx_alerts_user_active on price_alerts(user_id, status) where status \= 'active';  
create index idx_alerts_symbol on price_alerts(symbol, status);

\-- \============================================  
\-- MARKET STATUS  
\-- \============================================

create table market_status (  
 symbol text primary key,  
 asset_class text not null,  
 is_open boolean default true,  
 next_open timestamptz,  
 next_close timestamptz,  
 trading_hours jsonb, \-- {open: "09:30", close: "16:00", timezone: "America/New_York"}  
 updated_at timestamptz default now()  
);

\-- \============================================  
\-- OHLC CACHE (Historical Price Data)  
\-- \============================================

create table ohlc_cache (  
 symbol text not null,  
 timeframe text not null check (timeframe in ('1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w')),  
 timestamp timestamptz not null,

\-- OHLC data  
 open numeric(18,8) not null,  
 high numeric(18,8) not null,  
 low numeric(18,8) not null,  
 close numeric(18,8) not null,  
 volume numeric(18,2) default 0,

\-- Metadata  
 source text, \-- 'finnhub', 'yfinance', 'manual'  
 cached_at timestamptz default now(),

primary key (symbol, timeframe, timestamp)  
);

create index idx_ohlc_symbol_time on ohlc_cache(symbol, timeframe, timestamp desc);

\-- \============================================  
\-- BACKTEST RESULTS  
\-- \============================================

create table backtest_results (  
 id uuid primary key default gen_random_uuid(),  
 user_id uuid not null references profiles(id) on delete cascade,

\-- Strategy details  
 strategy_name text not null,  
 strategy_description text,  
 symbols text\[\] not null,  
 timeframe text not null,

\-- Date range  
 start_date date not null,  
 end_date date not null,

\-- Initial conditions  
 initial_capital numeric(12,4) not null,  
 leverage numeric(4,2) default 1,

\-- Results  
 final_capital numeric(12,4) not null,  
 total_return numeric(8,4) not null, \-- Percentage  
 total_pnl numeric(12,4) not null,

\-- Performance metrics  
 sharpe_ratio numeric(6,4),  
 sortino_ratio numeric(6,4),  
 max_drawdown numeric(6,4),  
 max_drawdown_duration_days int,

\-- Trade statistics  
 total_trades int not null,  
 winning_trades int not null,  
 losing_trades int not null,  
 win_rate numeric(5,4),

avg_win numeric(12,4),  
 avg_loss numeric(12,4),  
 profit_factor numeric(8,4), \-- avg_win / avg_loss

largest_win numeric(12,4),  
 largest_loss numeric(12,4),

avg_trade_duration_hours numeric(10,2),

\-- Strategy parameters  
 parameters jsonb not null, \-- Strategy-specific settings

\-- Trade log  
 trade_log jsonb, \-- Array of individual trades  
 equity_curve jsonb, \-- Array of {date, equity} points

\-- Execution  
 execution_time_seconds numeric(8,2),  
 status text default 'completed' check (status in ('running', 'completed', 'failed', 'cancelled')),  
 error_message text,

created_at timestamptz default now()  
);

create index idx_backtest_user on backtest_results(user_id, created_at desc);  
create index idx_backtest_status on backtest_results(status);

\-- \============================================  
\-- MARGIN CALLS  
\-- \============================================

create table margin_calls (  
 id uuid primary key default gen_random_uuid(),  
 user_id uuid not null references profiles(id) on delete cascade,

\-- Account state at margin call  
 margin_level numeric(6,2) not null,  
 equity numeric(12,4) not null,  
 margin_used numeric(12,4) not null,  
 free_margin numeric(12,4) not null,

\-- Action taken  
 action_taken text not null check (action_taken in ('warning_sent', 'positions_closed', 'account_liquidated')),  
 positions_closed uuid\[\], \-- Array of position IDs  
 total_closed_pnl numeric(12,4),

\-- Notification  
 notification_sent boolean default false,  
 notification_method text,

created_at timestamptz default now()  
);

create index idx_margin_calls_user on margin_calls(user_id, created_at desc);

\-- \============================================  
\-- SESSIONS (Security Tracking)  
\-- \============================================

create table sessions (  
 id uuid primary key default gen_random_uuid(),  
 user_id uuid not null references profiles(id) on delete cascade,

\-- Session details  
 ip_address inet not null,  
 user_agent text,  
 device_type text, \-- 'desktop', 'mobile', 'tablet'  
 browser text,  
 os text,

\-- Location (from IP)  
 country text,  
 city text,

\-- Status  
 is_active boolean default true,  
 last_activity timestamptz default now(),  
 expires_at timestamptz not null,

created_at timestamptz default now()  
);

create index idx_sessions_user on sessions(user_id, is_active);  
create index idx_sessions_expiry on sessions(expires_at) where is_active \= true;

\-- \============================================  
\-- AUDIT LOGS  
\-- \============================================

create table audit_logs (  
 id bigserial primary key,  
 actor_id uuid references profiles(id) on delete set null,

\-- Action details  
 action text not null, \-- 'order_placed', 'kyc_uploaded', 'position_closed', etc.  
 object_type text not null, \-- 'order', 'position', 'kyc_document', 'profile'  
 object_id text not null,

\-- Changes  
 payload jsonb, \-- Full object data  
 changes jsonb, \-- Only changed fields (before/after)

\-- Request context  
 ip_address inet,  
 user_agent text,  
 request_id uuid,

\-- Result  
 status text check (status in ('success', 'failure', 'error')),  
 error_message text,

created_at timestamptz default now()  
);

create index idx_audit_actor on audit_logs(actor_id, created_at desc);  
create index idx_audit_action on audit_logs(action, created_at desc);  
create index idx_audit_object on audit_logs(object_type, object_id);

\-- \============================================  
\-- SYSTEM LOGS & METRICS  
\-- \============================================

create table system_metrics (  
 id bigserial primary key,  
 metric_name text not null,  
 metric_value numeric(18,4) not null,  
 tags jsonb, \-- {environment: "production", region: "us-east"}  
 timestamp timestamptz default now()  
);

create index idx_metrics_name_time on system_metrics(metric_name, timestamp desc);

\-- \============================================  
\-- NOTIFICATIONS  
\-- \============================================

create table notifications (  
 id uuid primary key default gen_random_uuid(),  
 user_id uuid not null references profiles(id) on delete cascade,

\-- Notification details  
 type text not null check (  
 type in (  
 'order_filled',  
 'position_closed',  
 'margin_call',  
 'price_alert',  
 'kyc_status',  
 'system_announcement',  
 'copy_trade'  
 )  
 ),  
 title text not null,  
 message text not null,

\-- Links  
 action_url text,  
 reference_id uuid,

\-- Status  
 read boolean default false,  
 read_at timestamptz,

\-- Priority  
 priority text default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),

created_at timestamptz default now(),  
 expires_at timestamptz  
);

create index idx_notifications_user_unread on notifications(user_id, read, created_at desc);

\-- \============================================  
\-- SCHEMA VERSION TRACKING  
\-- \============================================

create table schema_migrations (  
 version int primary key,  
 name text not null,  
 applied_at timestamptz default now(),  
 applied_by text default current_user,  
 checksum text  
);

insert into schema_migrations (version, name) values  
(1, 'initial_schema');

---

### **Migration 002: Row Level Security**

\-- supabase/migrations/002_rls_policies.sql

\-- \============================================  
\-- ENABLE RLS ON ALL TABLES  
\-- \============================================

alter table profiles enable row level security;  
alter table orders enable row level security;  
alter table fills enable row level security;  
alter table positions enable row level security;  
alter table order_lots enable row level security;  
alter table ledger enable row level security;  
alter table kyc_documents enable row level security;  
alter table copy_relationships enable row level security;  
alter table price_alerts enable row level security;  
alter table backtest_results enable row level security;  
alter table margin_calls enable row level security;  
alter table sessions enable row level security;  
alter table audit_logs enable row level security;  
alter table notifications enable row level security;

\-- \============================================  
\-- HELPER FUNCTIONS  
\-- \============================================

\-- Check if user is admin  
create or replace function is_admin()  
returns boolean as $$  
begin  
 return (auth.jwt() \-\>\> 'role' \= 'admin');  
end;

$$
language plpgsql security definer;

\-- Check if user owns resource
create or replace function is\_owner(resource\_user\_id uuid)
returns boolean as
$$

begin  
 return resource_user_id \= auth.uid();  
end;

$$
language plpgsql security definer;

\-- \============================================
\-- PROFILES POLICIES
\-- \============================================

\-- Users can view their own profile
create policy "users\_view\_own\_profile" on profiles
  for select using (is\_owner(id));

\-- Users can update their own profile
create policy "users\_update\_own\_profile" on profiles
  for update using (is\_owner(id));

\-- Users can view leader profiles (for copy trading)
create policy "users\_view\_leader\_profiles" on profiles
  for select using (
    id in (
      select leader\_id
      from copy\_relationships
      where follower\_id \= auth.uid() and status \= 'active'
    )
  );

\-- Admins can view all profiles
create policy "admins\_view\_all\_profiles" on profiles
  for select using (is\_admin());

\-- Admins can update all profiles
create policy "admins\_update\_all\_profiles" on profiles
  for update using (is\_admin());

\-- \============================================
\-- ORDERS POLICIES
\-- \============================================

create policy "users\_manage\_own\_orders" on orders
  for all using (is\_owner(user\_id));

create policy "admins\_view\_all\_orders" on orders
  for select using (is\_admin());

\-- \============================================
\-- FILLS POLICIES
\-- \============================================

create policy "users\_view\_own\_fills" on fills
  for select using (is\_owner(user\_id));

create policy "admins\_view\_all\_fills" on fills
  for select using (is\_admin());

\-- \============================================
\-- POSITIONS POLICIES
\-- \============================================

create policy "users\_manage\_own\_positions" on positions
  for all using (is\_owner(user\_id));

create policy "admins\_view\_all\_positions" on positions
  for select using (is\_admin());

\-- \============================================
\-- ORDER LOTS POLICIES
\-- \============================================

create policy "users\_view\_own\_lots" on order\_lots
  for select using (is\_owner(user\_id));

create policy "admins\_view\_all\_lots" on order\_lots
  for select using (is\_admin());

\-- \============================================
\-- LEDGER POLICIES
\-- \============================================

create policy "users\_view\_own\_ledger" on ledger
  for select using (is\_owner(user\_id));

create policy "admins\_view\_all\_ledger" on ledger
  for select using (is\_admin());

\-- \============================================
\-- KYC DOCUMENTS POLICIES
\-- \============================================

create policy "users\_manage\_own\_kyc" on kyc\_documents
  for all using (is\_owner(user\_id));

create policy "admins\_manage\_all\_kyc" on kyc\_documents
  for all using (is\_admin());

\-- \============================================
\-- COPY RELATIONSHIPS POLICIES
\-- \============================================

create policy "users\_manage\_own\_copy\_relationships" on copy\_relationships
  for all using (is\_owner(follower\_id));

create policy "leaders\_view\_followers" on copy\_relationships
  for select using (is\_owner(leader\_id));

create policy "admins\_view\_all\_copy\_relationships" on copy\_relationships
  for select using (is\_admin());

\-- \============================================
\-- PRICE ALERTS POLICIES
\-- \============================================

create policy "users\_manage\_own\_alerts" on price\_alerts
  for all using (is\_owner(user\_id));

\-- \============================================
\-- BACKTEST RESULTS POLICIES
\-- \============================================

create policy "users\_manage\_own\_backtests" on backtest\_results
  for all using (is\_owner(user\_id));

create policy "admins\_view\_all\_backtests" on backtest\_results
  for select using (is\_admin());

\-- \============================================
\-- MARGIN CALLS POLICIES
\-- \============================================

create policy "users\_view\_own\_margin\_calls" on margin\_calls
  for select using (is\_owner(user\_id));

create policy "admins\_view\_all\_margin\_calls" on margin\_calls
  for select using (is\_admin());

\-- \============================================
\-- SESSIONS POLICIES
\-- \============================================

create policy "users\_view\_own\_sessions" on sessions
  for select using (is\_owner(user\_id));

create policy "users\_delete\_own\_sessions" on sessions
  for delete using (is\_owner(user\_id));

create policy "admins\_view\_all\_sessions" on sessions
  for select using (is\_admin());

\-- \============================================
\-- AUDIT LOGS POLICIES
\-- \============================================

create policy "users\_view\_own\_audit\_logs" on audit\_logs
  for select using (is\_owner(actor\_id));

create policy "admins\_view\_all\_audit\_logs" on audit\_logs
  for select using (is\_admin());

\-- \============================================
\-- NOTIFICATIONS POLICIES
\-- \============================================

create policy "users\_manage\_own\_notifications" on notifications
  for all using (is\_owner(user\_id));

\-- \============================================
\-- PUBLIC READ POLICIES (Market Data)
\-- \============================================

\-- Everyone can read swap rates
create policy "public\_read\_swap\_rates" on swap\_rates
  for select using (true);

\-- Everyone can read market status
create policy "public\_read\_market\_status" on market\_status
  for select using (true);

\-- Everyone can read OHLC data
create policy "public\_read\_ohlc" on ohlc\_cache
  for select using (true);

\-- Everyone can read corporate actions
create policy "public\_read\_corporate\_actions" on corporate\_actions
  for select using (true);

---

### **Migration 003: Database Triggers**

\-- supabase/migrations/003\_triggers.sql

\-- \============================================
\-- AUTO-UPDATE TIMESTAMPS
\-- \============================================

create or replace function update\_updated\_at\_column()
returns trigger as
$$

begin  
 new.updated_at \= now();  
 return new;  
end;

$$
language plpgsql;

create trigger trg\_profiles\_updated\_at
  before update on profiles
  for each row
  execute function update\_updated\_at\_column();

create trigger trg\_orders\_updated\_at
  before update on orders
  for each row
  execute function update\_updated\_at\_column();

create trigger trg\_positions\_updated\_at
  before update on positions
  for each row
  execute function update\_updated\_at\_column();

create trigger trg\_copy\_relationships\_updated\_at
  before update on copy\_relationships
  for each row
  execute function update\_updated\_at\_column();

\-- \============================================
\-- AUTO-UPDATE USER EQUITY & MARGIN
\-- \============================================

create or replace function update\_user\_equity()
returns trigger as
$$

declare  
 v_user_id uuid;  
 v_unrealized_pnl numeric;  
 v_margin_used numeric;  
 v_balance numeric;  
begin  
 \-- Get user_id from the changed row  
 if TG_OP \= 'DELETE' then  
 v_user_id := OLD.user_id;  
 else  
 v_user_id := NEW.user_id;  
 end if;

\-- Calculate total unrealized P\&L from open positions  
 select coalesce(sum(unrealized_pnl), 0\)  
 into v_unrealized_pnl  
 from positions  
 where user_id \= v_user_id and status \= 'open';

\-- Calculate total margin used  
 select coalesce(sum(margin_used), 0\)  
 into v_margin_used  
 from positions  
 where user_id \= v_user_id and status \= 'open';

\-- Get current balance  
 select balance into v_balance  
 from profiles  
 where id \= v_user_id;

\-- Update profile  
 update profiles  
 set  
 equity \= v_balance \+ v_unrealized_pnl,  
 margin_used \= v_margin_used,  
 free_margin \= (v_balance \+ v_unrealized_pnl) \- v_margin_used,  
 margin_level \= case  
 when v_margin_used \> 0 then ((v_balance \+ v_unrealized_pnl) / v_margin_used) \* 100  
 else null  
 end,  
 updated_at \= now()  
 where id \= v_user_id;

return coalesce(NEW, OLD);  
end;

$$
language plpgsql;

create trigger trg\_positions\_update\_equity
  after insert or update or delete on positions
  for each row
  execute function update\_user\_equity();

\-- \============================================
\-- PREVENT NEGATIVE BALANCE
\-- \============================================

create or replace function check\_balance\_constraint()
returns trigger as
$$

begin  
 if NEW.balance \< 0 then  
 raise exception 'Balance cannot be negative: attempted balance \= %', NEW.balance;  
 end if;  
 return NEW;  
end;

$$
language plpgsql;

create trigger trg\_check\_balance
  before update on profiles
  for each row
  when (NEW.balance is distinct from OLD.balance)
  execute function check\_balance\_constraint();

\-- \============================================
\-- AUTO-CANCEL EXPIRED ORDERS
\-- \============================================

create or replace function cancel\_expired\_orders()
returns void as
$$

begin  
 update orders  
 set  
 status \= 'expired',  
 rejection_reason \= 'Order expired',  
 updated_at \= now()  
 where  
 status in ('pending', 'open')  
 and expires_at is not null  
 and expires_at \< now();  
end;

$$
language plpgsql;

\-- Schedule to run every minute
select cron.schedule(
  'cancel-expired-orders',
  '\* \* \* \* \*',
  'select cancel\_expired\_orders()'
);

\-- \============================================
\-- AUDIT LOG TRIGGER
\-- \============================================

create or replace function log\_sensitive\_action()
returns trigger as
$$

declare  
 v_user_id uuid;  
 v_changes jsonb;  
begin  
 \-- Determine user_id  
 if TG_OP \= 'DELETE' then  
 v_user_id := OLD.user_id;  
 else  
 v_user_id := NEW.user_id;  
 end if;

\-- Calculate changes (for UPDATE operations)  
 if TG_OP \= 'UPDATE' then  
 v_changes := jsonb_build_object(  
 'before', to_jsonb(OLD),  
 'after', to_jsonb(NEW)  
 );  
 else  
 v_changes := null;  
 end if;

\-- Insert audit log  
 insert into audit_logs (  
 actor_id,  
 action,  
 object_type,  
 object_id,  
 payload,  
 changes,  
 status  
 ) values (  
 v_user_id,  
 lower(TG_OP) || '\_' || TG_TABLE_NAME,  
 TG_TABLE_NAME,  
 coalesce(NEW.id::text, OLD.id::text),  
 case  
 when TG_OP \= 'DELETE' then to_jsonb(OLD)  
 else to_jsonb(NEW)  
 end,  
 v_changes,  
 'success'  
 );

return coalesce(NEW, OLD);  
end;

$$
language plpgsql;

\-- Apply audit logging to sensitive tables
create trigger trg\_audit\_orders
  after insert or update or delete on orders
  for each row
  execute function log\_sensitive\_action();

create trigger trg\_audit\_positions
  after insert or update or delete on positions
  for each row
  execute function log\_sensitive\_action();

create trigger trg\_audit\_kyc
  after insert or update or delete on kyc\_documents
  for each row
  execute function log\_sensitive\_action();

create trigger trg\_audit\_profiles
  after update on profiles
  for each row
  when (
    NEW.balance is distinct from OLD.balance or
    NEW.kyc\_status is distinct from OLD.kyc\_status or
    NEW.account\_status is distinct from OLD.account\_status
  )
  execute function log\_sensitive\_action();

\-- \============================================
\-- LEDGER ENTRY ON BALANCE CHANGE
\-- \============================================

create or replace function create\_ledger\_entry()
returns trigger as
$$

begin  
 \-- Only log if balance changed  
 if NEW.balance is distinct from OLD.balance then  
 insert into ledger (  
 user_id,  
 transaction_type,  
 amount,  
 balance_before,  
 balance_after,  
 description  
 ) values (  
 NEW.id,  
 'adjustment',  
 NEW.balance \- OLD.balance,  
 OLD.balance,  
 NEW.balance,  
 'Balance adjustment'  
 );  
 end if;

return NEW;  
end;

$$
language plpgsql;

create trigger trg\_ledger\_on\_balance\_change
  after update on profiles
  for each row
  when (NEW.balance is distinct from OLD.balance)
  execute function create\_ledger\_entry();

\-- \============================================
\-- COPY TRADING REPLICATION
\-- \============================================

create or replace function replicate\_trade()
returns trigger as
$$

declare  
 v_relationship record;  
 v_follower record;  
 v_required_margin numeric;  
 v_copy_quantity numeric;  
begin  
 \-- Only replicate filled orders  
 if NEW.status \!= 'filled' then  
 return NEW;  
 end if;

\-- Loop through active followers  
 for v_relationship in  
 select \*  
 from copy_relationships  
 where leader_id \= NEW.user_id  
 and status \= 'active'  
 loop  
 \-- Get follower profile  
 select \* into v_follower  
 from profiles  
 where id \= v_relationship.follower_id;

    \-- Calculate copy quantity based on ratio
    v\_copy\_quantity := NEW.quantity \* v\_relationship.copy\_ratio;

    \-- Calculate required margin
    v\_required\_margin := (v\_copy\_quantity \* NEW.fill\_price) / v\_follower.leverage;

    \-- Check if follower has sufficient margin
    if v\_follower.free\_margin \< v\_required\_margin then
      \-- Log failure and continue
      insert into notifications (
        user\_id,
        type,
        title,
        message,
        priority
      ) values (
        v\_follower.id,
        'copy\_trade',
        'Copy Trade Failed',
        format('Insufficient margin to copy trade for %s', NEW.symbol),
        'high'
      );
      continue;
    end if;

    \-- Check max exposure
    if (v\_follower.margin\_used \+ v\_required\_margin) \> v\_relationship.max\_exposure then
      continue;
    end if;

    \-- Check leader balance requirement
    if (select balance from profiles where id \= NEW.user\_id) \< v\_relationship.min\_leader\_balance then
      continue;
    end if;

    \-- Simulate delay if configured
    if v\_relationship.copy\_delay\_seconds \> 0 then
      \-- Note: In production, this should use a job queue
      \-- For now, we'll just insert the order immediately
      null;
    end if;

    \-- Create copy order
    insert into orders (
      user\_id,
      symbol,
      order\_type,
      side,
      quantity,
      price,
      stop\_loss,
      take\_profit,
      idempotency\_key,
      status
    ) values (
      v\_relationship.follower\_id,
      NEW.symbol,
      'market',
      NEW.side,
      v\_copy\_quantity,
      NEW.fill\_price,
      NEW.stop\_loss,
      NEW.take\_profit,
      format('copy\_%s\_%s\_%s', NEW.id, v\_relationship.follower\_id, extract(epoch from now())),
      'pending'
    );

    \-- Update statistics
    update copy\_relationships
    set
      total\_copied\_trades \= total\_copied\_trades \+ 1,
      updated\_at \= now()
    where id \= v\_relationship.id;

    \-- Send notification
    insert into notifications (
      user\_id,
      type,
      title,
      message
    ) values (
      v\_relationship.follower\_id,
      'copy\_trade',
      'Trade Copied',
      format('Copied %s %s %s from your leader', NEW.side, v\_copy\_quantity, NEW.symbol)
    );

end loop;

return NEW;  
end;

$$
language plpgsql;

create trigger trg\_replicate\_trade
  after update on orders
  for each row
  when (NEW.status \= 'filled' and OLD.status \!= 'filled')
  execute function replicate\_trade();

\-- \============================================
\-- OCO ORDER CANCELLATION
\-- \============================================

create or replace function cancel\_oco\_orders()
returns trigger as
$$

begin  
 \-- When one order in OCO group is filled, cancel the others  
 if NEW.status \= 'filled' and NEW.oco_group is not null then  
 update orders  
 set  
 status \= 'cancelled',  
 rejection_reason \= 'OCO order filled',  
 cancelled_at \= now(),  
 updated_at \= now()  
 where  
 oco_group \= NEW.oco_group  
 and id \!= NEW.id  
 and status in ('pending', 'open');  
 end if;

return NEW;  
end;

$$
language plpgsql;

create trigger trg\_cancel\_oco
  after update on orders
  for each row
  when (NEW.status \= 'filled' and NEW.oco\_group is not null)
  execute function cancel\_oco\_orders();

\-- \============================================
\-- AUTO-CLOSE ON STOP LOSS / TAKE PROFIT
\-- \============================================

create or replace function check\_stop\_loss\_take\_profit()
returns trigger as
$$

declare  
 v_should_close boolean := false;  
 v_close_reason text;  
begin  
 \-- Check stop loss  
 if NEW.stop_loss is not null then  
 if (NEW.side \= 'long' and NEW.current_price \<= NEW.stop_loss) or  
 (NEW.side \= 'short' and NEW.current_price \>= NEW.stop_loss) then  
 v_should_close := true;  
 v_close_reason := 'Stop loss triggered';  
 end if;  
 end if;

\-- Check take profit  
 if NEW.take_profit is not null then  
 if (NEW.side \= 'long' and NEW.current_price \>= NEW.take_profit) or  
 (NEW.side \= 'short' and NEW.current_price \<= NEW.take_profit) then  
 v_should_close := true;  
 v_close_reason := 'Take profit triggered';  
 end if;  
 end if;

\-- Close position if triggered  
 if v_should_close and NEW.status \= 'open' then  
 \-- Calculate realized P\&L  
 NEW.realized_pnl := NEW.unrealized_pnl;  
 NEW.status := 'closed';  
 NEW.closed_at := now();

    \-- Create ledger entry
    insert into ledger (
      user\_id,
      transaction\_type,
      amount,
      balance\_before,
      balance\_after,
      reference\_id,
      reference\_type,
      description
    )
    select
      NEW.user\_id,
      'realized\_pnl',
      NEW.realized\_pnl,
      p.balance,
      p.balance \+ NEW.realized\_pnl,
      NEW.id,
      'position',
      v\_close\_reason
    from profiles p
    where p.id \= NEW.user\_id;

    \-- Update user balance
    update profiles
    set balance \= balance \+ NEW.realized\_pnl
    where id \= NEW.user\_id;

    \-- Send notification
    insert into notifications (
      user\_id,
      type,
      title,
      message,
      reference\_id
    ) values (
      NEW.user\_id,
      'position\_closed',
      'Position Closed',
      format('%s: %s %s closed at %s', v\_close\_reason, NEW.side, NEW.symbol, NEW.current\_price),
      NEW.id
    );

end if;

return NEW;  
end;

$$
language plpgsql;

create trigger trg\_check\_sl\_tp
  before update on positions
  for each row
  when (NEW.current\_price is distinct from OLD.current\_price and NEW.status \= 'open')
  execute function check\_stop\_loss\_take\_profit();

\-- \============================================
\-- MARGIN CALL DETECTION & AUTO-LIQUIDATION
\-- \============================================

create or replace function check\_margin\_call()
returns void as
$$

declare  
 v_user record;  
 v_position record;  
 v_positions_closed uuid\[\] := '{}';  
 v_total_closed_pnl numeric := 0;  
begin  
 \-- Find users below margin call level (100%)  
 for v_user in  
 select \*  
 from profiles  
 where margin_level \< 100  
 and margin_used \> 0  
 and account_status \= 'active'  
 loop  
 \-- Send margin call warning at 100%  
 if v_user.margin_level \>= 50 and v_user.margin_level \< 100 then  
 insert into margin_calls (  
 user_id,  
 margin_level,  
 equity,  
 margin_used,  
 free_margin,  
 action_taken  
 ) values (  
 v_user.id,  
 v_user.margin_level,  
 v_user.equity,  
 v_user.margin_used,  
 v_user.free_margin,  
 'warning_sent'  
 );

      insert into notifications (
        user\_id,
        type,
        title,
        message,
        priority
      ) values (
        v\_user.id,
        'margin\_call',
        'Margin Call Warning',
        format('Your margin level is %.2f%%. Please add funds or close positions.', v\_user.margin\_level),
        'urgent'
      );
    end if;

    \-- Auto-liquidate at 50% (stop-out level)
    if v\_user.margin\_level \< 50 then
      \-- Close positions FIFO (oldest first)
      for v\_position in
        select \*
        from positions
        where user\_id \= v\_user.id
          and status \= 'open'
        order by opened\_at asc
      loop
        \-- Calculate realized P\&L
        update positions
        set
          status \= 'liquidated',
          closed\_at \= now(),
          realized\_pnl \= unrealized\_pnl
        where id \= v\_position.id
        returning id, realized\_pnl into v\_position.id, v\_position.realized\_pnl;

        \-- Update balance
        update profiles
        set balance \= balance \+ v\_position.realized\_pnl
        where id \= v\_user.id;

        \-- Create ledger entry
        insert into ledger (
          user\_id,
          transaction\_type,
          amount,
          balance\_before,
          balance\_after,
          reference\_id,
          reference\_type,
          description
        )
        select
          v\_user.id,
          'realized\_pnl',
          v\_position.realized\_pnl,
          balance \- v\_position.realized\_pnl,
          balance,
          v\_position.id,
          'position',
          'Auto-liquidated due to insufficient margin'
        from profiles
        where id \= v\_user.id;

        \-- Track closed positions
        v\_positions\_closed := array\_append(v\_positions\_closed, v\_position.id);
        v\_total\_closed\_pnl := v\_total\_closed\_pnl \+ v\_position.realized\_pnl;

        \-- Recalculate margin level
        select margin\_level into v\_user.margin\_level
        from profiles
        where id \= v\_user.id;

        \-- Stop if margin level recovered
        exit when v\_user.margin\_level \>= 50 or v\_user.margin\_used \= 0;
      end loop;

      \-- Log margin call action
      insert into margin\_calls (
        user\_id,
        margin\_level,
        equity,
        margin\_used,
        free\_margin,
        action\_taken,
        positions\_closed,
        total\_closed\_pnl
      ) values (
        v\_user.id,
        v\_user.margin\_level,
        v\_user.equity,
        v\_user.margin\_used,
        v\_user.free\_margin,
        case
          when v\_user.margin\_used \= 0 then 'account\_liquidated'
          else 'positions\_closed'
        end,
        v\_positions\_closed,
        v\_total\_closed\_pnl
      );

      \-- Send notification
      insert into notifications (
        user\_id,
        type,
        title,
        message,
        priority
      ) values (
        v\_user.id,
        'margin\_call',
        'Positions Liquidated',
        format('Your positions were automatically closed due to insufficient margin. Total P\&L: %s', v\_total\_closed\_pnl),
        'urgent'
      );
    end if;

end loop;  
end;

$$
language plpgsql;

\-- Run margin call check every 30 seconds
select cron.schedule(
  'margin-call-check',
  '\*/30 \* \* \* \* \*',
  'select check\_margin\_call()'
);

\-- \============================================
\-- APPLY NIGHTLY SWAP RATES
\-- \============================================

create or replace function apply\_nightly\_swaps()
returns void as
$$

declare  
 v_position record;  
 v_swap_rate numeric;  
 v_daily_swap numeric;  
begin  
 for v_position in  
 select p.\*, sr.long_rate, sr.short_rate  
 from positions p  
 join swap_rates sr on sr.symbol \= p.symbol  
 where p.status \= 'open'  
 loop  
 \-- Determine swap rate based on position side  
 v_swap_rate := case  
 when v_position.side \= 'long' then v_position.long_rate  
 else v_position.short_rate  
 end;

    \-- Calculate daily swap (annual rate / 365\)
    v\_daily\_swap := (v\_position.quantity \* v\_position.current\_price \* v\_position.contract\_size \* v\_swap\_rate) / 365;

    \-- Apply swap to position
    update positions
    set
      swap\_accumulated \= swap\_accumulated \+ v\_daily\_swap,
      unrealized\_pnl \= unrealized\_pnl \- v\_daily\_swap, \-- Swap is a cost
      updated\_at \= now()
    where id \= v\_position.id;

    \-- Create ledger entry
    insert into ledger (
      user\_id,
      transaction\_type,
      amount,
      balance\_before,
      balance\_after,
      reference\_id,
      reference\_type,
      description
    )
    select
      v\_position.user\_id,
      'swap',
      \-v\_daily\_swap,
      balance,
      balance \- v\_daily\_swap,
      v\_position.id,
      'position',
      format('Overnight swap for %s', v\_position.symbol)
    from profiles
    where id \= v\_position.user\_id;

    \-- Update user balance
    update profiles
    set balance \= balance \- v\_daily\_swap
    where id \= v\_position.user\_id;

end loop;  
end;

$$
language plpgsql;

\-- Run at midnight UTC
select cron.schedule(
  'nightly-swaps',
  '0 0 \* \* \*',
  'select apply\_nightly\_swaps()'
);

\-- \============================================
\-- CHECK PRICE ALERTS
\-- \============================================

create or replace function check\_price\_alerts()
returns void as
$$

declare  
 v_alert record;  
 v_current_price numeric;  
 v_triggered boolean;  
begin  
 for v_alert in  
 select \*  
 from price_alerts  
 where status \= 'active'  
 and (expires_at is null or expires_at \> now())  
 loop  
 \-- Get current price from cache  
 select close into v_current_price  
 from ohlc_cache  
 where symbol \= v_alert.symbol  
 and timeframe \= '1m'  
 order by timestamp desc  
 limit 1;

    if v\_current\_price is null then
      continue;
    end if;

    \-- Check alert condition
    v\_triggered := case v\_alert.condition
      when 'above' then v\_current\_price \> v\_alert.target\_price
      when 'below' then v\_current\_price \< v\_alert.target\_price
      when 'crosses\_above' then v\_current\_price \>= v\_alert.target\_price
      when 'crosses\_below' then v\_current\_price \<= v\_alert.target\_price
      else false
    end;

    if v\_triggered then
      \-- Mark alert as triggered
      update price\_alerts
      set
        status \= 'triggered',
        triggered\_at \= now(),
        trigger\_price \= v\_current\_price
      where id \= v\_alert.id;

      \-- Send notification
      insert into notifications (
        user\_id,
        type,
        title,
        message,
        reference\_id
      ) values (
        v\_alert.user\_id,
        'price\_alert',
        'Price Alert Triggered',
        format('%s %s %s (current: %s)',
          v\_alert.symbol,
          v\_alert.condition,
          v\_alert.target\_price,
          v\_current\_price
        ),
        v\_alert.id
      );
    end if;

end loop;  
end;

$$
language plpgsql;

\-- Run every minute
select cron.schedule(
  'check-price-alerts',
  '\* \* \* \* \*',
  'select check\_price\_alerts()'
);

\-- \============================================
\-- CLEAN UP EXPIRED SESSIONS
\-- \============================================

create or replace function cleanup\_expired\_sessions()
returns void as
$$

begin  
 update sessions  
 set is_active \= false  
 where is_active \= true  
 and expires_at \< now();  
end;

$$
language plpgsql;

\-- Run every hour
select cron.schedule(
  'cleanup-sessions',
  '0 \* \* \* \*',
  'select cleanup\_expired\_sessions()'
);

---

## **2\. TypeScript Type Definitions**

// src/types/database.ts

export type Json \=
  | string
  | number
  | boolean
  | null
  | { \[key: string\]: Json | undefined }
  | Json\[\]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full\_name: string | null
          date\_of\_birth: string | null
          country: string | null
          address: string | null
          city: string | null
          postal\_code: string | null
          phone: string | null
          balance: number
          equity: number
          margin\_used: number
          free\_margin: number
          margin\_level: number | null
          leverage: number
          currency: string
          timezone: string
          kyc\_status: KYCStatus
          kyc\_rejection\_reason: string | null
          risk\_tolerance: RiskTolerance | null
          account\_status: AccountStatus
          suspension\_reason: string | null
          ip\_at\_signup: string | null
          last\_login: string | null
          created\_at: string
          updated\_at: string
        }
        Insert: {
          id: string
          email: string
          full\_name?: string | null
          date\_of\_birth?: string | null
          country?: string | null
          address?: string | null
          city?: string | null
          postal\_code?: string | null
          phone?: string | null
          balance?: number
          equity?: number
          margin\_used?: number
          free\_margin?: number
          margin\_level?: number | null
          leverage?: number
          currency?: string
          timezone?: string
          kyc\_status?: KYCStatus
          kyc\_rejection\_reason?: string | null
          risk\_tolerance?: RiskTolerance | null
          account\_status?: AccountStatus
          suspension\_reason?: string | null
          ip\_at\_signup?: string | null
          last\_login?: string | null
          created\_at?: string
          updated\_at?: string
        }
        Update: {
          id?: string
          email?: string
          full\_name?: string | null
          date\_of\_birth?: string | null
          country?: string | null
          address?: string | null
          city?: string | null
          postal\_code?: string | null
          phone?: string | null
          balance?: number
          equity?: number
          margin\_used?: number
          free\_margin?: number
          margin\_level?: number | null
          leverage?: number
          currency?: string
          timezone?: string
          kyc\_status?: KYCStatus
          kyc\_rejection\_reason?: string | null
          risk\_tolerance?: RiskTolerance | null
          account\_status?: AccountStatus
          suspension\_reason?: string | null
          ip\_at\_signup?: string | null
          last\_login?: string | null
          created\_at?: string
          updated\_at?: string
        }
      }
      orders: {
        Row: Order
        Insert: OrderInsert
        Update: OrderUpdate
      }
      positions: {
        Row: Position
        Insert: PositionInsert
        Update: PositionUpdate
      }
      fills: {
        Row: Fill
        Insert: FillInsert
        Update: FillUpdate
      }
      // ... other tables
    }
    Views: {
      \[\_ in never\]: never
    }
    Functions: {
      execute\_order\_atomic: {
        Args: {
          p\_order: OrderInsert
          p\_user\_id: string
        }
        Returns: {
          order\_id: string
          fill\_price: number
          position\_id: string
        }
      }
      // ... other functions
    }
    Enums: {
      kyc\_status: KYCStatus
      account\_status: AccountStatus
      order\_type: OrderType
      order\_status: OrderStatus
      position\_status: PositionStatus
      transaction\_type: TransactionType
    }
  }
}

// \============================================
// ENUMS
// \============================================

export type KYCStatus \=
  | 'pending\_info'
  | 'pending\_documents'
  | 'pending\_review'
  | 'approved'
  | 'rejected'
  | 'requires\_resubmit'

export type AccountStatus \= 'active' | 'suspended' | 'closed'

export type RiskTolerance \= 'conservative' | 'moderate' | 'aggressive' | 'very\_aggressive'

export type OrderType \= 'market' | 'limit' | 'stop' | 'stop\_limit' | 'trailing\_stop'

export type OrderSide \= 'buy' | 'sell'

export type OrderStatus \=
  | 'pending'
  | 'open'
  | 'filled'
  | 'partially\_filled'
  | 'cancelled'
  | 'rejected'
  | 'expired'

export type TimeInForce \= 'GTC' | 'IOC' | 'FOK' | 'DAY'

export type PositionSide \= 'long' | 'short'

export type PositionStatus \= 'open' | 'closed' | 'liquidated'

export type TransactionType \=
  | 'deposit'
  | 'withdrawal'
  | 'realized\_pnl'
  | 'commission'
  | 'swap'
  | 'adjustment'
  | 'bonus'
  | 'refund'

export type AssetClass \= 'forex' | 'stocks' | 'indices' | 'commodities' | 'crypto'

export type NotificationType \=
  | 'order\_filled'
  | 'position\_closed'
  | 'margin\_call'
  | 'price\_alert'
  | 'kyc\_status'
  | 'system\_announcement'
  | 'copy\_trade'

// \============================================
// INTERFACES
// \============================================

export interface Profile {
  id: string
  email: string
  full\_name: string | null
  date\_of\_birth: string | null
  country: string | null
  address: string | null
  city: string | null
  postal\_code: string | null
  phone: string | null
  balance: number
  equity: number
  margin\_used: number
  free\_margin: number
  margin\_level: number | null
  leverage: number
  currency: string
  timezone: string
  kyc\_status: KYCStatus
  kyc\_rejection\_reason: string | null
  risk\_tolerance: RiskTolerance | null
  account\_status: AccountStatus
  suspension\_reason: string | null
  ip\_at\_signup: string | null
  last\_login: string | null
  created\_at: string
  updated\_at: string
}

export interface Order {
  id: string
  user\_id: string
  symbol: string
  order\_type: OrderType
  side: OrderSide
  quantity: number
  filled\_quantity: number
  price: number | null
  stop\_price: number | null
  limit\_price: number | null
  stop\_loss: number | null
  take\_profit: number | null
  trailing\_amount: number | null
  status: OrderStatus
  time\_in\_force: TimeInForce
  expires\_at: string | null
  oco\_group: string | null
  fill\_price: number | null
  commission: number
  slippage: number
  rejection\_reason: string | null
  idempotency\_key: string
  created\_at: string
  updated\_at: string
  filled\_at: string | null
  cancelled\_at: string | null
}

export interface OrderInsert {
  user\_id: string
  symbol: string
  order\_type: OrderType
  side: OrderSide
  quantity: number
  price?: number | null
  stop\_price?: number | null
  limit\_price?: number | null
  stop\_loss?: number | null
  take\_profit?: number | null
  trailing\_amount?: number | null
  time\_in\_force?: TimeInForce
  expires\_at?: string | null
  oco\_group?: string | null
  idempotency\_key: string
}

export interface OrderUpdate {
  status?: OrderStatus
  filled\_quantity?: number
  fill\_price?: number | null
  commission?: number
  slippage?: number
  rejection\_reason?: string | null
  filled\_at?: string | null
  cancelled\_at?: string | null
}

export interface Position {
  id: string
  user\_id: string
  symbol: string
  side: PositionSide
  quantity: number
  entry\_price: number
  current\_price: number
  unrealized\_pnl: number
  realized\_pnl: number
  leverage: number
  margin\_used: number
  contract\_size: number
  swap\_accumulated: number
  total\_commission: number
  stop\_loss: number | null
  take\_profit: number | null
  status: PositionStatus
  opened\_at: string
  closed\_at: string | null
  updated\_at: string
}

export interface PositionInsert {
  user\_id: string
  symbol: string
  side: PositionSide
  quantity: number
  entry\_price: number
  current\_price: number
  leverage: number
  margin\_used: number
  contract\_size?: number
  stop\_loss?: number | null
  take\_profit?: number | null
}

export interface PositionUpdate {
  current\_price?: number
  unrealized\_pnl?: number
  realized\_pnl?: number
  swap\_accumulated?: number
  total\_commission?: number
  stop\_loss?: number | null
  take\_profit?: number | null
  status?: PositionStatus
  closed\_at?: string | null
}

export interface Fill {
  id: string
  order\_id: string
  user\_id: string
  symbol: string
  side: OrderSide
  quantity: number
  price: number
  commission: number
  slippage: number
  fill\_type: 'full' | 'partial'
  executed\_at: string
}

export interface FillInsert {
  order\_id: string
  user\_id: string
  symbol: string
  side: OrderSide
  quantity: number
  price: number
  commission?: number
  slippage?: number
  fill\_type: 'full' | 'partial'
}

export interface FillUpdate {
  // Fills are typically immutable
}

export interface OrderLot {
  id: string
  position\_id: string
  order\_id: string
  user\_id: string
  quantity: number
  remaining\_quantity: number
  entry\_price: number
  close\_price: number | null
  realized\_pnl: number
  close\_sequence: number | null
  status: 'open' | 'partially\_closed' | 'closed'
  opened\_at: string
  closed\_at: string | null
}

export interface LedgerEntry {
  id: number
  user\_id: string
  transaction\_type: TransactionType
  amount: number
  balance\_before: number
  balance\_after: number
  reference\_id: string | null
  reference\_type: string | null
  description: string | null
  created\_at: string
}

export interface SwapRate {
  symbol: string
  asset\_class: AssetClass
  long\_rate: number
  short\_rate: number
  updated\_at: string
}

export interface CorporateAction {
  id: string
  symbol: string
  action\_type: 'split' | 'reverse\_split' | 'dividend' | 'symbol\_change' | 'delisting'
  split\_ratio: number | null
  dividend\_amount: number | null
  new\_symbol: string | null
  announcement\_date: string
  ex\_date: string
  effective\_date: string
  status: 'pending' | 'applied' | 'cancelled'
  applied\_at: string | null
  created\_at: string
}

export interface KYCDocument {
  id: string
  user\_id: string
  document\_type:
    | 'id\_front'
    | 'id\_back'
    | 'passport'
    | 'drivers\_license'
    | 'proof\_of\_address'
    | 'bank\_statement'
    | 'selfie'
  file\_path: string
  file\_size\_kb: number | null
  mime\_type: string | null
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  reviewed\_by: string | null
  review\_notes: string | null
  rejection\_reason: string | null
  uploaded\_at: string
  reviewed\_at: string | null
  expires\_at: string | null
}

export interface CopyRelationship {
  id: string
  follower\_id: string
  leader\_id: string
  copy\_ratio: number
  max\_exposure: number
  copy\_delay\_seconds: number
  min\_leader\_balance: number
  max\_drawdown\_threshold: number
  status: 'active' | 'paused' | 'disconnected'
  disconnection\_reason: string | null
  total\_copied\_trades: number
  follower\_pnl: number
  created\_at: string
  updated\_at: string
  disconnected\_at: string | null
}

export interface PriceAlert {
  id: string
  user\_id: string
  symbol: string
  condition: 'above' | 'below' | 'crosses\_above' | 'crosses\_below'
  target\_price: number
  notification\_method: 'in\_app' | 'email' | 'sms' | 'push'
  message: string | null
  status: 'active' | 'triggered' | 'expired' | 'cancelled'
  triggered\_at: string | null
  trigger\_price: number | null
  expires\_at: string | null
  created\_at: string
}

export interface MarketStatus {
  symbol: string
  asset\_class: AssetClass
  is\_open: boolean
  next\_open: string | null
  next\_close: string | null
  trading\_hours: {
    open: string
    close: string
    timezone: string
  } | null
  updated\_at: string
}

export interface OHLCCandle {
  symbol: string
  timeframe: '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w'
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  source: string | null
  cached\_at: string
}

export interface BacktestResult {
  id: string
  user\_id: string
  strategy\_name: string
  strategy\_description: string | null
  symbols: string\[\]
  timeframe: string
  start\_date: string
  end\_date: string
  initial\_capital: number
  leverage: number
  final\_capital: number
  total\_return: number
  total\_pnl: number
  sharpe\_ratio: number | null
  sortino\_ratio: number | null
  max\_drawdown: number | null
  max\_drawdown\_duration\_days: number | null
  total\_trades: number
  winning\_trades: number
  losing\_trades: number
  win\_rate: number | null
  avg\_win: number | null
  avg\_loss: number | null
  profit\_factor: number | null
  largest\_win: number | null
  largest\_loss: number | null
  avg\_trade\_duration\_hours: number | null
  parameters: Record\<string, any\>
  trade\_log: BacktestTrade\[\] | null
  equity\_curve: EquityPoint\[\] | null
  execution\_time\_seconds: number | null
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  error\_message: string | null
  created\_at: string
}

export interface BacktestTrade {
  symbol: string
  side: OrderSide
  entry\_date: string
  entry\_price: number
  exit\_date: string
  exit\_price: number
  quantity: number
  pnl: number
  pnl\_percent: number
  duration\_hours: number
}

export interface EquityPoint {
  date: string
  equity: number
  drawdown: number
}

export interface MarginCall {
  id: string
  user\_id: string
  margin\_level: number
  equity: number
  margin\_used: number
  free\_margin: number
  action\_taken: 'warning\_sent' | 'positions\_closed' | 'account\_liquidated'
  positions\_closed: string\[\] | null
  total\_closed\_pnl: number | null
  notification\_sent: boolean
  notification\_method: string | null
  created\_at: string
}

export interface Session {
  id: string
  user\_id: string
  ip\_address: string
  user\_agent: string | null
  device\_type: string | null
  browser: string | null
  os: string | null
  country: string | null
  city: string | null
  is\_active: boolean
  last\_activity: string
  expires\_at: string
  created\_at: string
}

export interface AuditLog {
  id: number
  actor\_id: string | null
  action: string
  object\_type: string
  object\_id: string
  payload: Record\<string, any\> | null
  changes: Record\<string, any\> | null
  ip\_address: string | null
  user\_agent: string | null
  request\_id: string | null
  status: 'success' | 'failure' | 'error' | null
  error\_message: string | null
  created\_at: string
}

export interface Notification {
  id: string
  user\_id: string
  type: NotificationType
  title: string
  message: string
  action\_url: string | null
  reference\_id: string | null
  read: boolean
  read\_at: string | null
  priority: 'low' | 'normal' | 'high' | 'urgent'
  created\_at: string
  expires\_at: string | null
}

export interface SystemMetric {
  id: number
  metric\_name: string
  metric\_value: number
  tags: Record\<string, any\> | null
  timestamp: string
}

// \============================================
// API RESPONSE TYPES
// \============================================

export interface APIResponse\<T \= any\> {
  data?: T
  error?: APIError
  meta?: {
    timestamp: string
    request\_id: string
    pagination?: Pagination
  }
}

export interface APIError {
  code: ErrorCode
  message: string
  details?: Record\<string, any\>
  timestamp: string
  request\_id: string
}

export interface Pagination {
  page: number
  per\_page: number
  total: number
  total\_pages: number
}

export enum ErrorCode {
  // Authentication
  UNAUTHORIZED \= 'UNAUTHORIZED',
  FORBIDDEN \= 'FORBIDDEN',
  TOKEN\_EXPIRED \= 'TOKEN\_EXPIRED',

  // Validation
  INVALID\_INPUT \= 'INVALID\_INPUT',
  VALIDATION\_ERROR \= 'VALIDATION\_ERROR',
  MISSING\_REQUIRED\_FIELD \= 'MISSING\_REQUIRED\_FIELD',

  // Trading
  INSUFFICIENT\_MARGIN \= 'INSUFFICIENT\_MARGIN',
  MARKET\_CLOSED \= 'MARKET\_CLOSED',
  INVALID\_SYMBOL \= 'INVALID\_SYMBOL',
  INVALID\_QUANTITY \= 'INVALID\_QUANTITY',
  INVALID\_PRICE \= 'INVALID\_PRICE',
  POSITION\_NOT\_FOUND \= 'POSITION\_NOT\_FOUND',
  ORDER\_NOT\_FOUND \= 'ORDER\_NOT\_FOUND',
  DUPLICATE\_ORDER \= 'DUPLICATE\_ORDER',

  // Account
  KYC\_NOT\_APPROVED \= 'KYC\_NOT\_APPROVED',
  ACCOUNT\_SUSPENDED \= 'ACCOUNT\_SUSPENDED',
  ACCOUNT\_CLOSED \= 'ACCOUNT\_CLOSED',

  // System
  RATE\_LIMIT\_EXCEEDED \= 'RATE\_LIMIT\_EXCEEDED',
  SERVICE\_UNAVAILABLE \= 'SERVICE\_UNAVAILABLE',
  SYSTEM\_ERROR \= 'SYSTEM\_ERROR',
  DATABASE\_ERROR \= 'DATABASE\_ERROR',

  // Geo-restriction
  GEO\_RESTRICTED \= 'GEO\_RESTRICTED',
}

// \============================================
// ASSET CONFIGURATION
// \============================================

export interface AssetConfig {
  symbol: string
  name: string
  asset\_class: AssetClass
  contract\_size: number
  min\_quantity: number
  max\_quantity: number
  tick\_size: number
  pip\_value?: number
  trading\_hours: {
    open: string
    close: string
    timezone: string
  }
  margin\_requirement: number
  max\_leverage: number
  swap\_long: number
  swap\_short: number
  commission\_rate: number
  is\_tradable: boolean
}

// \============================================
// TRADING CALCULATIONS
// \============================================

export interface MarginCalculation {
  notional\_value: number
  margin\_required: number
  margin\_used: number
  equity: number
  free\_margin: number
  margin\_level: number
}

export interface PnLCalculation {
  unrealized\_pnl: number
  realized\_pnl: number
  total\_pnl: number
  commission: number
  swap: number
  net\_pnl: number
}

export interface PositionSummary {
  total\_positions: number
  long\_positions: number
  short\_positions: number
  total\_unrealized\_pnl: number
  total\_realized\_pnl: number
  total\_margin\_used: number
  largest\_position: Position | null
  best\_performer: Position | null
  worst\_performer: Position | null
}

// \============================================
// MARKET DATA
// \============================================

export interface PriceUpdate {
  symbol: string
  bid: number
  ask: number
  last: number
  change: number
  change\_percent: number
  volume: number
  timestamp: string
}

export interface QuoteData {
  symbol: string
  bid: number
  ask: number
  spread: number
  last: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  timestamp: string
}

// \============================================
// CHART DATA
// \============================================

export interface ChartData {
  symbol: string
  timeframe: string
  candles: OHLCCandle\[\]
  indicators?: ChartIndicators
}

export interface ChartIndicators {
  sma?: { period: number; values: number\[\] }\[\]
  ema?: { period: number; values: number\[\] }\[\]
  rsi?: { period: number; values: number\[\] }
  macd?: {
    macd: number\[\]
    signal: number\[\]
    histogram: number\[\]
  }
  bollinger?: {
    upper: number\[\]
    middle: number\[\]
    lower: number\[\]
  }
}

// \============================================
// USER PORTFOLIO
// \============================================

export interface PortfolioSnapshot {
  user\_id: string
  timestamp: string
  balance: number
  equity: number
  margin\_used: number
  free\_margin: number
  margin\_level: number | null
  unrealized\_pnl: number
  realized\_pnl\_today: number
  total\_positions: number
  total\_orders: number
  performance\_today: number
  performance\_week: number
  performance\_month: number
  performance\_all\_time: number
}

// \============================================
// COPY TRADING
// \============================================

export interface LeaderStats {
  leader\_id: string
  profile: Profile
  total\_followers: number
  total\_pnl: number
  win\_rate: number
  total\_trades: number
  avg\_return: number
  max\_drawdown: number
  sharpe\_ratio: number
  risk\_score: number
  is\_verified: boolean
  joined\_date: string
}

export interface FollowerStats {
  follower\_id: string
  total\_copied\_trades: number
  total\_pnl: number
  success\_rate: number
  active\_relationships: number
}

// \============================================
// ANALYTICS
// \============================================

export interface TradingMetrics {
  total\_trades: number
  winning\_trades: number
  losing\_trades: number
  win\_rate: number
  avg\_win: number
  avg\_loss: number
  profit\_factor: number
  sharpe\_ratio: number
  max\_drawdown: number
  total\_pnl: number
  total\_commission: number
  total\_swap: number
  net\_pnl: number
  best\_trade: number
  worst\_trade: number
  avg\_trade\_duration: number
  most\_traded\_symbol: string
}

export interface PerformanceMetrics {
  period: 'day' | 'week' | 'month' | 'year' | 'all'
  start\_date: string
  end\_date: string
  starting\_balance: number
  ending\_balance: number
  total\_return: number
  total\_return\_percent: number
  daily\_returns: DailyReturn\[\]
  equity\_curve: EquityPoint\[\]
  drawdown\_curve: DrawdownPoint\[\]
}

export interface DailyReturn {
  date: string
  return: number
  return\_percent: number
  balance: number
}

export interface DrawdownPoint {
  date: string
  drawdown: number
  drawdown\_percent: number
  peak: number
}

// \============================================
// DASHBOARD DATA
// \============================================

export interface DashboardData {
  portfolio: PortfolioSnapshot
  positions: Position\[\]
  orders: Order\[\]
  recent\_trades: Fill\[\]
  notifications: Notification\[\]
  market\_movers: PriceUpdate\[\]
  performance: PerformanceMetrics
}

---

## **3\. Edge Functions Implementation**

### **supabase/functions/execute-order/index.ts**

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import \* as Sentry from 'https://deno.land/x/sentry/index.ts'

// Initialize Sentry
Sentry.init({
  dsn: Deno.env.get('SENTRY\_DSN'),
  tracesSampleRate: 1.0,
})

interface ExecuteOrderRequest {
  order: {
    symbol: string
    order\_type: string
    side: string
    quantity: number
    price?: number
    stop\_loss?: number
    take\_profit?: number
    time\_in\_force?: string
    idempotency\_key: string
  }
}

interface AssetConfig {
  contract\_size: number
  tick\_size: number
  min\_quantity: number
  max\_quantity: number
  margin\_requirement: number
  asset\_class: string
  is\_tradable: boolean
}

serve(async (req) \=\> {
  const transaction \= Sentry.startTransaction({
    name: 'execute-order',
    op: 'function',
  })

  try {
    // CORS headers
    if (req.method \=== 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '\*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      })
    }

    // Initialize Supabase client
    const supabaseClient \= createClient(
      Deno.env.get('SUPABASE\_URL') ?? '',
      Deno.env.get('SUPABASE\_SERVICE\_ROLE\_KEY') ?? '',
    )

    // Get authenticated user
    const authHeader \= req.headers.get('Authorization')
    if (\!authHeader) {
      return new Response(
        JSON.stringify({ error: { code: 'UNAUTHORIZED', message: 'Missing authorization header' } }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const { data: { user }, error: authError } \= await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || \!user) {
      return new Response(
        JSON.stringify({ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      )
    }

    // Parse request body
    const { order }: ExecuteOrderRequest \= await req.json()

    // Validate required fields
    if (\!order.symbol || \!order.order\_type || \!order.side || \!order.quantity || \!order.idempotency\_key) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'VALIDATION\_ERROR',
            message: 'Missing required fields',
            details: { required: \['symbol', 'order\_type', 'side', 'quantity', 'idempotency\_key'\] },
          },
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      )
    }

    // Check idempotency
    const { data: existingOrder } \= await supabaseClient
      .from('orders')
      .select('id, status, fill\_price')
      .eq('idempotency\_key', order.idempotency\_key)
      .single()

    if (existingOrder) {
      return new Response(
        JSON.stringify({
          data: {
            order\_id: existingOrder.id,
            status: existingOrder.status,
            fill\_price: existingOrder.fill\_price,
            message: 'Order already exists (idempotent)',
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    }

    // Get user profile
    const { data: profile, error: profileError } \= await supabaseClient
      .from('profiles')
      .select('\*')
      .eq('id', user.id)
      .single()

    if (profileError || \!profile) {
      return new Response(
        JSON.stringify({ error: { code: 'USER\_NOT\_FOUND', message: 'User profile not found' } }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      )
    }

    // Check account status
    if (profile.account\_status \!== 'active') {
      return new Response(
        JSON.stringify({
          error: {
            code: 'ACCOUNT\_SUSPENDED',
            message: 'Account is not active',
            details: { status: profile.account\_status, reason: profile.suspension\_reason },
          },
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } },
      )
    }

    // Check KYC status
    if (profile.kyc\_status \!== 'approved') {
      return new Response(
        JSON.stringify({
          error: {
            code: 'KYC\_NOT\_APPROVED',
            message: 'KYC verification required',
            details: { kyc\_status: profile.kyc\_status },
          },
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } },
      )
    }

    // Get asset configuration
    const assetConfig \= await getAssetConfig(order.symbol)
    if (\!assetConfig) {
      return new Response(
        JSON.stringify({ error: { code: 'INVALID\_SYMBOL', message: 'Unknown symbol' } }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      )
    }

    if (\!assetConfig.is\_tradable) {
      return new Response(
        JSON.stringify({ error: { code: 'MARKET\_CLOSED', message: 'Symbol is not tradable' } }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      )
    }

    // Validate quantity
    if (order.quantity \< assetConfig.min\_quantity || order.quantity \> assetConfig.max\_quantity) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'INVALID\_QUANTITY',
            message: 'Invalid quantity',
            details: {
              min: assetConfig.min\_quantity,
              max: assetConfig.max\_quantity,
              provided: order.quantity,
            },
          },
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      )
    }

    // Check market status
    const { data: marketStatus } \= await supabaseClient
      .from('market\_status')
      .select('is\_open')
      .eq('symbol', order.symbol)
      .single()

    if (marketStatus && \!marketStatus.is\_open) {
      return new Response(
        JSON.stringify({ error: { code: 'MARKET\_CLOSED', message: 'Market is closed' } }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      )
    }

    // Get current price
    const currentPrice \= await getCurrentPrice(order.symbol)
    if (\!currentPrice) {
      return new Response(
        JSON.stringify({ error: { code: 'PRICE\_UNAVAILABLE', message: 'Unable to fetch current price' } }),
        { status: 503, headers: { 'Content-Type': 'application/json' } },
      )
    }

    // Determine execution price
    let executionPrice: number
    let slippage \= 0

    if (order.order\_type \=== 'market') {
      // Calculate slippage for market orders
      slippage \= calculateSlippage(order.symbol, order.quantity, assetConfig.asset\_class)
      executionPrice \= currentPrice \* (1 \+ slippage \* (order.side \=== 'buy' ? 1 : \-1))
    } else if (order.order\_type \=== 'limit') {
      if (\!order.price) {
        return new Response(
          JSON.stringify({ error: { code: 'MISSING\_PRICE', message: 'Limit orders require a price' } }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        )
      }
      executionPrice \= order.price
    } else {
      // For other order types, use current price
      executionPrice \= currentPrice
    }

    // Calculate required margin
    const notionalValue \= order.quantity \* executionPrice \* assetConfig.contract\_size
    const requiredMargin \= notionalValue / profile.leverage

    // Check margin availability
    if (profile.free\_margin \< requiredMargin) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'INSUFFICIENT\_MARGIN',
            message: 'Insufficient margin',
            details: {
              required: requiredMargin.toFixed(2),
              available: profile.free\_margin.toFixed(2),
              shortfall: (requiredMargin \- profile.free\_margin).toFixed(2),
            },
          },
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } },
      )
    }

    // Calculate commission
    const commission \= notionalValue \* 0.0001 // 0.01% commission

    // Execute order atomically
    const { data: result, error: executeError } \= await supabaseClient.rpc('execute\_order\_atomic', {
      p\_user\_id: user.id,
      p\_symbol: order.symbol,
      p\_order\_type: order.order\_type,
      p\_side: order.side,
      p\_quantity: order.quantity,
      p\_price: order.price || null,
      p\_stop\_loss: order.stop\_loss || null,
      p\_take\_profit: order.take\_profit || null,
      p\_execution\_price: executionPrice,
      p\_slippage: slippage,
      p\_commission: commission,
      p\_margin\_used: requiredMargin,
      p\_leverage: profile.leverage,
      p\_contract\_size: assetConfig.contract\_size,
      p\_idempotency\_key: order.idempotency\_key,
    })

    if (executeError) {
      Sentry.captureException(executeError)
      return new Response(
        JSON.stringify({
          error: {
            code: 'EXECUTION\_ERROR',
            message: executeError.message,
          },
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      )
    }

    transaction.setStatus('ok')

    return new Response(
      JSON.stringify({
        data: {
          order\_id: result.order\_id,
          position\_id: result.position\_id,
          fill\_price: executionPrice,
          slippage,
          commission,
          status: 'filled',
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '\*',
        },
      },
    )
  } catch (error) {
    Sentry.captureException(error)
    transaction.setStatus('error')

    return new Response(
      JSON.stringify({
        error: {
          code: 'SYSTEM\_ERROR',
          message: error.message || 'An unexpected error occurred',
        },
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  } finally {
    transaction.finish()
  }
})

// \============================================
// HELPER FUNCTIONS
// \============================================

async function getAssetConfig(symbol: string): Promise\<AssetConfig | null\> {
  const configs: Record\<string, AssetConfig\> \= {
    'EURUSD': {
      contract\_size: 100000,
      tick\_size: 0.00001,
      min\_quantity: 0.01,
      max\_quantity: 100,
      margin\_requirement: 0.033,
      asset\_class: 'forex',
      is\_tradable: true,
    },
    'GBPUSD': {
      contract\_size: 100000,
      tick\_size: 0.00001,
      min\_quantity: 0.01,
      max\_quantity: 100,
      margin\_requirement: 0.033,
      asset\_class: 'forex',
      is\_tradable: true,
    },
    'XAUUSD': {
      contract\_size: 100,
      tick\_size: 0.01,
      min\_quantity: 0.01,
      max\_quantity: 50,
      margin\_requirement: 0.05,
      asset\_class: 'commodities',
      is\_tradable: true,
    },
    'BTCUSD': {
      contract\_size: 1,
      tick\_size: 0.01,
      min\_quantity: 0.001,
      max\_quantity: 10,
      margin\_requirement: 0.5,
      asset\_class: 'crypto',
      is\_tradable: true,
    },
    'AAPL': {
      contract\_size: 1,
      tick\_size: 0.01,
      min\_quantity: 1,
      max\_quantity: 10000,
      margin\_requirement: 0.2,
      asset\_class: 'stocks',
      is\_tradable: true,
    },
  }

  return configs\[symbol\] || null
}

async function getCurrentPrice(symbol: string): Promise\<number | null\> {
  try {
    // Try Finnhub first
    const finnhubKey \= Deno.env.get('FINNHUB\_API\_KEY')
    const response \= await fetch(
      \`https://finnhub.io/api/v1/quote?symbol=${symbol}\&token=${finnhubKey}\`,
      { signal: AbortSignal.timeout(5000) }
    )

    if (response.ok) {
      const data \= await response.json()
      return data // Current price
    }

    // Fallback to cached data
    const supabaseClient \= createClient(
      Deno.env.get('SUPABASE\_URL') ?? '',
      Deno.env.get('SUPABASE\_SERVICE\_ROLE\_KEY') ?? ''
    )

    const { data: cachedData } \= await supabaseClient
      .from('ohlc\_cache')
      .select('close')
      .eq('symbol', symbol)
      .eq('timeframe', '1m')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single()

    return cachedData?.close || null
  } catch (error) {
    Sentry.captureException(error)
    return   return null
  }
}

function calculateSlippage(symbol: string, quantity: number, assetClass: string): number {
  const slippageConfig: Record\<string, Record\<string, number\>\> \= {
    forex: {
      major: 0.00001, // 0.1 pips for EURUSD, GBPUSD
      minor: 0.00003, // 0.3 pips for AUDJPY
      exotic: 0.0001, // 1 pip for exotic pairs
    },
    stocks: {
      liquid: 0.0005, // 0.05% for high volume
      illiquid: 0.002, // 0.2% for low volume
    },
    crypto: {
      btc: 0.001, // 0.1%
      altcoin: 0.005, // 0.5%
    },
    commodities: {
      gold: 0.0002, // 0.02%
      oil: 0.0005, // 0.05%
    },
    indices: {
      major: 0.0003, // 0.03%
    },
  }

  // Determine base slippage
  let baseSlippage \= 0.0001 // Default

  if (assetClass \=== 'forex') {
    if (\['EURUSD', 'GBPUSD', 'USDJPY'\].includes(symbol)) {
      baseSlippage \= slippageConfig.forex.major
    } else {
      baseSlippage \= slippageConfig.forex.minor
    }
  } else if (assetClass \=== 'stocks') {
    baseSlippage \= slippageConfig.stocks.liquid
  } else if (assetClass \=== 'crypto') {
    baseSlippage \= symbol.startsWith('BTC') ? slippageConfig.crypto.btc : slippageConfig.crypto.altcoin
  } else if (assetClass \=== 'commodities') {
    baseSlippage \= symbol.includes('XAU') ? slippageConfig.commodities.gold : slippageConfig.commodities.oil
  }

  // Increase slippage for larger orders
  const sizeFactor \= Math.min(quantity / 10, 2\) // Max 2x slippage
  return baseSlippage \* (1 \+ sizeFactor \* 0.5)
}

---

### **supabase/functions/close-position/index.ts**

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import \* as Sentry from 'https://deno.land/x/sentry/index.ts'

Sentry.init({
  dsn: Deno.env.get('SENTRY\_DSN'),
  tracesSampleRate: 1.0,
})

interface ClosePositionRequest {
  position\_id: string
  quantity?: number // Optional: for partial close
}

serve(async (req) \=\> {
  try {
    if (req.method \=== 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '\*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      })
    }

    const supabaseClient \= createClient(
      Deno.env.get('SUPABASE\_URL') ?? '',
      Deno.env.get('SUPABASE\_SERVICE\_ROLE\_KEY') ?? ''
    )

    const authHeader \= req.headers.get('Authorization')
    const { data: { user }, error: authError } \= await supabaseClient.auth.getUser(
      authHeader?.replace('Bearer ', '') ?? ''
    )

    if (authError || \!user) {
      return new Response(
        JSON.stringify({ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { position\_id, quantity }: ClosePositionRequest \= await req.json()

    // Get position
    const { data: position, error: positionError } \= await supabaseClient
      .from('positions')
      .select('\*')
      .eq('id', position\_id)
      .eq('user\_id', user.id)
      .eq('status', 'open')
      .single()

    if (positionError || \!position) {
      return new Response(
        JSON.stringify({ error: { code: 'POSITION\_NOT\_FOUND', message: 'Position not found' } }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Determine close quantity (full or partial)
    const closeQuantity \= quantity || position.quantity

    if (closeQuantity \> position.quantity) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'INVALID\_QUANTITY',
            message: 'Close quantity exceeds position size',
            details: { position\_quantity: position.quantity, requested: closeQuantity },
          },
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get current price
    const currentPrice \= await getCurrentPrice(position.symbol)
    if (\!currentPrice) {
      return new Response(
        JSON.stringify({ error: { code: 'PRICE\_UNAVAILABLE', message: 'Cannot fetch current price' } }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Calculate P\&L using FIFO
    const { data: lots } \= await supabaseClient
      .from('order\_lots')
      .select('\*')
      .eq('position\_id', position\_id)
      .eq('status', 'open')
      .order('opened\_at', { ascending: true })

    let remainingToClose \= closeQuantity
    let totalRealizedPnL \= 0
    const closedLots: string\[\] \= \[\]

    if (lots) {
      for (const lot of lots) {
        if (remainingToClose \<= 0\) break

        const closeAmount \= Math.min(lot.remaining\_quantity, remainingToClose)
        const lotPnL \= calculateLotPnL(
          lot.entry\_price,
          currentPrice,
          closeAmount,
          position.side,
          position.contract\_size
        )

        totalRealizedPnL \+= lotPnL
        remainingToClose \-= closeAmount

        // Update lot
        await supabaseClient
          .from('order\_lots')
          .update({
            remaining\_quantity: lot.remaining\_quantity \- closeAmount,
            close\_price: currentPrice,
            realized\_pnl: (lot.realized\_pnl || 0\) \+ lotPnL,
            status: lot.remaining\_quantity \- closeAmount \=== 0 ? 'closed' : 'partially\_closed',
            closed\_at: lot.remaining\_quantity \- closeAmount \=== 0 ? new Date().toISOString() : null,
          })
          .eq('id', lot.id)

        if (lot.remaining\_quantity \- closeAmount \=== 0\) {
          closedLots.push(lot.id)
        }
      }
    }

    // Calculate commission
    const commission \= closeQuantity \* currentPrice \* position.contract\_size \* 0.0001

    // Update position
    const isFullClose \= closeQuantity \=== position.quantity
    const newQuantity \= position.quantity \- closeQuantity

    if (isFullClose) {
      // Close position completely
      await supabaseClient
        .from('positions')
        .update({
          status: 'closed',
          realized\_pnl: totalRealizedPnL \- commission,
          closed\_at: new Date().toISOString(),
          current\_price: currentPrice,
        })
        .eq('id', position\_id)
    } else {
      // Partial close: update quantity
      await supabaseClient
        .from('positions')
        .update({
          quantity: newQuantity,
          realized\_pnl: (position.realized\_pnl || 0\) \+ totalRealizedPnL \- commission,
          current\_price: currentPrice,
        })
        .eq('id', position\_id)
    }

    // Update user balance
    const netPnL \= totalRealizedPnL \- commission

    await supabaseClient.rpc('update\_balance', {
      p\_user\_id: user.id,
      p\_amount: netPnL,
      p\_transaction\_type: 'realized\_pnl',
      p\_reference\_id: position\_id,
      p\_description: \`Position closed: ${position.symbol}\`,
    })

    // Create ledger entries
    await supabaseClient.from('ledger').insert(\[
      {
        user\_id: user.id,
        transaction\_type: 'realized\_pnl',
        amount: totalRealizedPnL,
        reference\_id: position\_id,
        reference\_type: 'position',
        description: \`Realized P\&L from closing ${position.symbol}\`,
      },
      {
        user\_id: user.id,
        transaction\_type: 'commission',
        amount: \-commission,
        reference\_id: position\_id,
        reference\_type: 'position',
        description: \`Commission for closing ${position.symbol}\`,
      },
    \])

    // Send notification
    await supabaseClient.from('notifications').insert({
      user\_id: user.id,
      type: 'position\_closed',
      title: 'Position Closed',
      message: \`${position.side} ${closeQuantity} ${position.symbol} closed at ${currentPrice}. P\&L: ${netPnL.toFixed(2)}\`,
      reference\_id: position\_id,
      priority: 'normal',
    })

    return new Response(
      JSON.stringify({
        data: {
          position\_id,
          status: isFullClose ? 'closed' : 'partially\_closed',
          closed\_quantity: closeQuantity,
          remaining\_quantity: isFullClose ? 0 : newQuantity,
          close\_price: currentPrice,
          realized\_pnl: totalRealizedPnL,
          commission,
          net\_pnl: netPnL,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '\*',
        },
      }
    )
  } catch (error) {
    Sentry.captureException(error)

    return new Response(
      JSON.stringify({
        error: {
          code: 'SYSTEM\_ERROR',
          message: error.message || 'An unexpected error occurred',
        },
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

function calculateLotPnL(
  entryPrice: number,
  currentPrice: number,
  quantity: number,
  side: string,
  contractSize: number
): number {
  const priceDiff \= currentPrice \- entryPrice
  const direction \= side \=== 'long' ? 1 : \-1
  return priceDiff \* quantity \* contractSize \* direction
}

async function getCurrentPrice(symbol: string): Promise\<number | null\> {
  try {
    const finnhubKey \= Deno.env.get('FINNHUB\_API\_KEY')
    const response \= await fetch(
      \`https://finnhub.io/api/v1/quote?symbol=${symbol}\&token=${finnhubKey}\`,
      { signal: AbortSignal.timeout(5000) }
    )

    if (response.ok) {
      const data \= await response.json()
      return data.c
    }

    return null
  } catch {
    return null
  }
}

---

### **supabase/functions/market-data/index.ts**

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface MarketDataRequest {
  symbols: string\[\]
  timeframe?: string
}

serve(async (req) \=\> {
  try {
    if (req.method \=== 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '\*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      })
    }

    const supabaseClient \= createClient(
      Deno.env.get('SUPABASE\_URL') ?? '',
      Deno.env.get('SUPABASE\_SERVICE\_ROLE\_KEY') ?? ''
    )

    const { symbols, timeframe \= '1m' }: MarketDataRequest \= await req.json()

    if (\!symbols || symbols.length \=== 0\) {
      return new Response(
        JSON.stringify({ error: { code: 'MISSING\_SYMBOLS', message: 'No symbols provided' } }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const priceData: Record\<string, any\> \= {}
    const finnhubKey \= Deno.env.get('FINNHUB\_API\_KEY')

    for (const symbol of symbols) {
      try {
        // Try Finnhub first
        const response \= await fetch(
          \`https://finnhub.io/api/v1/quote?symbol=${symbol}\&token=${finnhubKey}\`,
          { signal: AbortSignal.timeout(3000) }
        )

        if (response.ok) {
          const data \= await response.json()

          priceData\[symbol\] \= {
            symbol,
            bid: data.c \- 0.00001, // Simulate bid/ask spread
            ask: data.c \+ 0.00001,
            last: data.c,
            open: data.o,
            high: data.h,
            low: data.l,
            close: data.pc,
            change: data.d,
            change\_percent: data.dp,
            timestamp: new Date().toISOString(),
            source: 'finnhub',
          }

          // Cache to database
          await supabaseClient.from('ohlc\_cache').upsert({
            symbol,
            timeframe,
            timestamp: new Date().toISOString(),
            open: data.o,
            high: data.h,
            low: data.l,
            close: data.c,
            volume: 0,
            source: 'finnhub',
          })
        } else {
          // Fallback to cache
          const { data: cachedData } \= await supabaseClient
            .from('ohlc\_cache')
            .select('\*')
            .eq('symbol', symbol)
            .eq('timeframe', timeframe)
            .order('timestamp', { ascending: false })
            .limit(1)
            .single()

          if (cachedData) {
            priceData\[symbol\] \= {
              symbol,
              bid: cachedData.close \- 0.00001,
              ask: cachedData.close \+ 0.00001,
              last: cachedData.close,
              open: cachedData.open,
              high: cachedData.high,
              low: cachedData.low,
              close: cachedData.close,
              timestamp: cachedData.timestamp,
              source: 'cache',
            }
          }
        }
      } catch (error) {
        console.error(\`Error fetching ${symbol}:\`, error)

        // Try cache as last resort
        const { data: cachedData } \= await supabaseClient
          .from('ohlc\_cache')
          .select('\*')
          .eq('symbol', symbol)
          .eq('timeframe', timeframe)
          .order('timestamp', { ascending: false })
          .limit(1)
          .single()

        if (cachedData) {
          priceData\[symbol\] \= {
            symbol,
            last: cachedData.close,
            timestamp: cachedData.timestamp,
            source: 'cache',
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ data: priceData }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '\*',
        },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: {
          code: 'SYSTEM\_ERROR',
          message: error.message,
        },
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

---

### **supabase/functions/update-positions/index.ts**

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// This function runs periodically to update position P\&L based on current prices
serve(async (req) \=\> {
  try {
    const supabaseClient \= createClient(
      Deno.env.get('SUPABASE\_URL') ?? '',
      Deno.env.get('SUPABASE\_SERVICE\_ROLE\_KEY') ?? ''
    )

    // Get all open positions
    const { data: positions, error: positionsError } \= await supabaseClient
      .from('positions')
      .select('\*')
      .eq('status', 'open')

    if (positionsError) throw positionsError

    if (\!positions || positions.length \=== 0\) {
      return new Response(
        JSON.stringify({ message: 'No open positions to update' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get unique symbols
    const symbols \= \[...new Set(positions.map((p) \=\> p.symbol))\]

    // Fetch current prices
    const priceMap: Record\<string, number\> \= {}
    const finnhubKey \= Deno.env.get('FINNHUB\_API\_KEY')

    for (const symbol of symbols) {
      try {
        const response \= await fetch(
          \`https://finnhub.io/api/v1/quote?symbol=${symbol}\&token=${finnhubKey}\`,
          { signal: AbortSignal.timeout(3000) }
        )

        if (response.ok) {
          const data \= await response.json()
          priceMap\[symbol\] \= data.c
        }
      } catch (error) {
        console.error(\`Error fetching price for ${symbol}:\`, error)
      }
    }

    // Update each position
    for (const position of positions) {
      const currentPrice \= priceMap\[position.symbol\]
      if (\!currentPrice) continue

      // Calculate unrealized P\&L
      const priceDiff \= currentPrice \- position.entry\_price
      const direction \= position.side \=== 'long' ? 1 : \-1
      const unrealizedPnL \= priceDiff \* position.quantity \* position.contract\_size \* direction

      // Update position
      await supabaseClient
        .from('positions')
        .update({
          current\_price: currentPrice,
          unrealized\_pnl: unrealizedPnL,
          updated\_at: new Date().toISOString(),
        })
        .eq('id', position.id)
    }

    return new Response(
      JSON.stringify({
        message: 'Positions updated successfully',
        updated\_count: positions.length,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: {
          code: 'SYSTEM\_ERROR',
          message: error.message,
        },
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

---

### **supabase/functions/\_shared/database.sql**

\-- Stored procedure for atomic order execution
create or replace function execute\_order\_atomic(
  p\_user\_id uuid,
  p\_symbol text,
  p\_order\_type text,
  p\_side text,
  p\_quantity numeric,
  p\_price numeric,
  p\_stop\_loss numeric,
  p\_take\_profit numeric,
  p\_execution\_price numeric,
  p\_slippage numeric,
  p\_commission numeric,
  p\_margin\_used numeric,
  p\_leverage numeric,
  p\_contract\_size numeric,
  p\_idempotency\_key text
)
returns jsonb as
$$

declare  
 v_order_id uuid;  
 v_position_id uuid;  
 v_fill_id uuid;  
 v_balance_before numeric;  
 v_balance_after numeric;  
begin  
 \-- Start transaction (implicit in function)

\-- Create order  
 insert into orders (  
 user_id,  
 symbol,  
 order_type,  
 side,  
 quantity,  
 price,  
 stop_loss,  
 take_profit,  
 status,  
 fill_price,  
 filled_quantity,  
 commission,  
 slippage,  
 idempotency_key,  
 filled_at  
 ) values (  
 p_user_id,  
 p_symbol,  
 p_order_type,  
 p_side,  
 p_quantity,  
 p_price,  
 p_stop_loss,  
 p_take_profit,  
 'filled',  
 p_execution_price,  
 p_quantity,  
 p_commission,  
 p_slippage,  
 p_idempotency_key,  
 now()  
 )  
 returning id into v_order_id;

\-- Create fill  
 insert into fills (  
 order_id,  
 user_id,  
 symbol,  
 side,  
 quantity,  
 price,  
 commission,  
 slippage,  
 fill_type  
 ) values (  
 v_order_id,  
 p_user_id,  
 p_symbol,  
 p_side,  
 p_quantity,  
 p_execution_price,  
 p_commission,  
 p_slippage,  
 'full'  
 )  
 returning id into v_fill_id;

\-- Check if position exists for this symbol  
 select id into v_position_id  
 from positions  
 where user_id \= p_user_id  
 and symbol \= p_symbol  
 and status \= 'open'  
 and side \= case when p_side \= 'buy' then 'long' else 'short' end  
 limit 1;

if v_position_id is null then  
 \-- Create new position  
 insert into positions (  
 user_id,  
 symbol,  
 side,  
 quantity,  
 entry_price,  
 current_price,  
 leverage,  
 margin_used,  
 contract_size,  
 stop_loss,  
 take_profit,  
 total_commission  
 ) values (  
 p_user_id,  
 p_symbol,  
 case when p_side \= 'buy' then 'long' else 'short' end,  
 p_quantity,  
 p_execution_price,  
 p_execution_price,  
 p_leverage,  
 p_margin_used,  
 p_contract_size,  
 p_stop_loss,  
 p_take_profit,  
 p_commission  
 )  
 returning id into v_position_id;  
 else  
 \-- Update existing position (average price)  
 update positions  
 set  
 quantity \= quantity \+ p_quantity,  
 entry_price \= ((entry_price \* quantity) \+ (p_execution_price \* p_quantity)) / (quantity \+ p_quantity),  
 margin_used \= margin_used \+ p_margin_used,  
 total_commission \= total_commission \+ p_commission,  
 updated_at \= now()  
 where id \= v_position_id;  
 end if;

\-- Create order lot for FIFO tracking  
 insert into order_lots (  
 position_id,  
 order_id,  
 user_id,  
 quantity,  
 remaining_quantity,  
 entry_price  
 ) values (  
 v_position_id,  
 v_order_id,  
 p_user_id,  
 p_quantity,  
 p_quantity,  
 p_execution_price  
 );

\-- Deduct commission from balance  
 select balance into v_balance_before  
 from profiles  
 where id \= p_user_id;

update profiles  
 set balance \= balance \- p_commission  
 where id \= p_user_id  
 returning balance into v_balance_after;

\-- Create ledger entry for commission  
 insert into ledger (  
 user_id,  
 transaction_type,  
 amount,  
 balance_before,  
 balance_after,  
 reference_id,  
 reference_type,  
 description  
 ) values (  
 p_user_id,  
 'commission',  
 \-p_commission,  
 v_balance_before,  
 v_balance_after,  
 v_order_id,  
 'order',  
 format('Commission for %s %s %s', p_side, p_quantity, p_symbol)  
 );

\-- Return result  
 return jsonb_build_object(  
 'order_id', v_order_id,  
 'position_id', v_position_id,  
 'fill_id', v_fill_id  
 );  
end;

$$
language plpgsql;

\-- Stored procedure for updating balance
create or replace function update\_balance(
  p\_user\_id uuid,
  p\_amount numeric,
  p\_transaction\_type text,
  p\_reference\_id uuid,
  p\_description text
)
returns void as
$$

declare  
 v_balance_before numeric;  
 v_balance_after numeric;  
begin  
 select balance into v_balance_before  
 from profiles  
 where id \= p_user_id  
 for update; \-- Lock row

update profiles  
 set balance \= balance \+ p_amount  
 where id \= p_user_id  
 returning balance into v_balance_after;

insert into ledger (  
 user_id,  
 transaction_type,  
 amount,  
 balance_before,  
 balance_after,  
 reference_id,  
 reference_type,  
 description  
 ) values (  
 p_user_id,  
 p_transaction_type,  
 p_amount,  
 v_balance_before,  
 v_balance_after,  
 p_reference_id,  
 'position',  
 p_description  
 );  
end;

$$
language plpgsql;

---

## **4\. React Component Architecture**

### **Component Tree Structure**

src/
├── App.tsx
├── main.tsx
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── AppLayout.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── ForgotPassword.tsx
│   │   └── ProtectedRoute.tsx
│   ├── trading/
│   │   ├── TradingChart.tsx
│   │   ├── OrderPanel.tsx
│   │   ├── MarketWatch.tsx
│   │   ├── PositionsTable.tsx
│   │   ├── OrdersTable.tsx
│   │   ├── OrderForm.tsx
│   │   └── QuickTrade.tsx
│   ├── portfolio/
│   │   ├── PortfolioSummary.tsx
│   │   ├── BalanceCard.tsx
│   │   ├── EquityChart.tsx
│   │   ├── PerformanceMetrics.tsx
│   │   └── AssetAllocation.tsx
│   ├── kyc/
│   │   ├── KYCWizard.tsx
│   │   ├── PersonalInfoStep.tsx
│   │   ├── DocumentUploadStep.tsx
│   │   ├── SelfieStep.tsx
│   │   ├── RiskQuizStep.tsx
│   │   └── KYCStatus.tsx
│   ├── copy-trading/
│   │   ├── LeaderboardTable.tsx
│   │   ├── LeaderCard.tsx
│   │   ├── CopySettings.tsx
│   │   └── FollowingList.tsx
│   ├── analytics/
│   │   ├── PerformanceChart.tsx
│   │   ├── TradeHistory.tsx
│   │   ├── MetricCard.tsx
│   │   └── AnalyticsDashboard.tsx
│   ├── admin/
│   │   ├── KYCReviewPanel.tsx
│   │   ├── UserManagement.tsx
│   │   ├── SystemMetrics.tsx
│   │   └── AuditLog.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       ├── Table.tsx
│       ├── Modal.tsx
│       ├── Toast.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── Spinner.tsx
│       └── ... (ShadCN UI components)
└── pages/
    ├── public/
    │   ├── LandingPage.tsx
    │   ├── FeaturesPage.tsx
    │   ├── AssetsPage.tsx
    │   ├── EducationPage.tsx
    │   ├── AboutPage.tsx
    │   └── LegalPage.tsx
    └── app/
        ├── DashboardPage.tsx
        ├── TradePage.tsx
        ├── PortfolioPage.tsx
        ├── AnalyticsPage.tsx
        ├── CopyTradingPage.tsx
        ├── BacktesterPage.tsx
        ├── SettingsPage.tsx
        ├── KYCPage.tsx
        ├── NotificationsPage.tsx
        └── AdminPage.tsx

---

### **Key Component Examples**

#### **src/components/trading/TradingChart.tsx**

import { useEffect, useRef, useState } from 'react'
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts'
import { useMarketDataStore } from '@/stores/marketDataStore'
import { OHLCCandle } from '@/types/database'

interface TradingChartProps {
  symbol: string
  timeframe: string
  height?: number
}

export const TradingChart: React.FC\<TradingChartProps\> \= ({
  symbol,
  timeframe,
  height \= 500,
}) \=\> {
  const chartContainerRef \= useRef\<HTMLDivElement\>(null)
  const chartRef \= useRef\<IChartApi | null\>(null)
  const candlestickSeriesRef \= useRef\<ISeriesApi\<'Candlestick'\> | null\>(null)

  const { subscribeToPrices, getPrice } \= useMarketDataStore()
  const \[loading, setLoading\] \= useState(true)

  useEffect(() \=\> {
    if (\!chartContainerRef.current) return

    // Create chart
    const chart \= createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: {
        background: { color: '\#1a1a1a' },
        textColor: '\#d1d4dc',
      },
      grid: {
        vertLines: { color: '\#2a2a2a' },
        horzLines: { color: '\#2a2a2a' },
      },
      crosshair: {
        mode: 1,
      },
      timeScale: {
        borderColor: '\#485c7b',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '\#485c7b',
      },
    })

    chartRef.current \= chart

    // Add candlestick series
    const candlestickSeries \= chart.addCandlestickSeries({
      upColor: '\#26a69a',
      downColor: '\#ef5350',
      borderVisible: false,
      wickUpColor: '\#26a69a',
      wickDownColor: '\#ef5350',
    })

    candlestickSeriesRef.current \= candlestickSeries

    // Fetch historical data
    fetchHistoricalData()

    // Subscribe to real-time updates
    subscribeToPrices(\[symbol\])

    // Handle resize
    const handleResize \= () \=\> {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () \=\> {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, \[symbol, timeframe\])

  // Update chart with real-time data
  useEffect(() \=\> {
    const interval \= setInterval(() \=\> {
      const price \= getPrice(symbol)
      if (price && candlestickSeriesRef.current) {
        const lastCandle \= {
          time: Math.floor(Date.now() / 1000\) as any,
          open: price.last,
          high: price.last,
          low: price.last,
          close: price.last,
        }
        candlestickSeriesRef.current.update(lastCandle)
      }
    }, 1000\)

    return () \=\> clearInterval(interval)
  }, \[symbol, getPrice\])

  const fetchHistoricalData \= async () \=\> {
    try {
      setLoading(true)
      const response \= await fetch(\`/api/historical-data?symbol=${symbol}\&timeframe=${timeframe}\`)
      const data: OHLCCandle\[\] \= await response.json()

      if (candlestickSeriesRef.current && data.length \> 0\) {
        const formattedData \= data.map((candle) \=\> ({
          time: Math.floor(new Date(candle.timestamp).getTime() / 1000\) as any,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        }))

        candlestickSeriesRef.current.setData(formattedData)
        chartRef.current?.timeScale().fitContent()
      }
    } catch (error) {
      console.error('Error fetching historical data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    \<div className="relative w-full"\>
      {loading && (
        \<div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10"\>
          \<div className="text-white"\>Loading chart...\</div\>
        \</div\>
      )}
      \<div ref={chartContainerRef} className="w-full" /\>
    \</div\>
  )
}

---

#### **src/components/trading/OrderPanel.tsx**

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import \* as z from 'zod'
import { useTradingStore } from '@/stores/tradingStore'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Label } from '@/components/ui/Label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { toast } from 'sonner'
import type { OrderType, OrderSide } from '@/types/database'

const orderSchema \= z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  order\_type: z.enum(\['market', 'limit', 'stop', 'stop\_limit', 'trailing\_stop'\]),
  side: z.enum(\['buy', 'sell'\]),
  quantity: z.number().positive('Quantity must be positive'),
  price: z.number().positive().optional(),
  stop\_loss: z.number().positive().optional(),
  take\_profit: z.number().positive().optional(),
})

type OrderFormData \= z.infer\<typeof orderSchema\>

export const OrderPanel: React.FC \= () \=\> {
  const { selectedSymbol, placeOrder, loading } \= useTradingStore()
  const { user } \= useAuthStore()
  const \[side, setSide\] \= useState\<OrderSide\>('buy')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } \= useForm\<OrderFormData\>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      symbol: selectedSymbol,
      order\_type: 'market',
      side: 'buy',
      quantity: 1,
    },
  })

  const orderType \= watch('order\_type')

  const onSubmit \= async (data: OrderFormData) \=\> {
    try {
      const idempotency\_key \= \`${user?.id}\_${Date.now()}\_${Math.random()}\`

      await placeOrder({
        ...data,
        idempotency\_key,
      })

      toast.success('Order placed successfully')
      reset()
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order')
    }
  }

  return (
    \<div className="bg-gray-900 rounded-lg p-4 border border-gray-800"\>
      \<h2 className="text-xl font-semibold text-white mb-4"\>Place Order\</h2\>

      \<Tabs defaultValue="market" className="w-full"\>
        \<TabsList className="grid w-full grid-cols-3"\>
          \<TabsTrigger value="market"\>Market\</TabsTrigger\>
          \<TabsTrigger value="limit"\>Limit\</TabsTrigger\>
          \<TabsTrigger value="stop"\>Stop\</TabsTrigger\>
        \</TabsList\>

        \<form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4"\>
          {/\* Symbol \*/}
          \<div\>
            \<Label htmlFor="symbol"\>Symbol\</Label\>
            \<Input
              id="symbol"
              {...register('symbol')}
              placeholder="EURUSD"
              className="mt-1"
              disabled
            /\>
            {errors.symbol && (
              \<p className="text-sm text-red-500 mt-1"\>{errors.symbol.message}\</p\>
            )}
          \</div\>

          {/\* Order Type \*/}
          \<div\>
            \<Label htmlFor="order\_type"\>Order Type\</Label\>
            \<Select {...register('order\_type')} className="mt-1"\>
              \<option value="market"\>Market\</option\>
              \<option value="limit"\>Limit\</option\>
              \<option value="stop"\>Stop\</option\>
              \<option value="stop\_limit"\>Stop Limit\</option\>
              \<option value="trailing\_stop"\>Trailing Stop\</option\>
            \</Select\>
          \</div\>

          {/\* Buy/Sell Toggle \*/}
          \<div className="flex gap-2"\>
            \<Button
              type="button"
              onClick={() \=\> setSide('buy')}
              className={\`flex-1 ${
                side \=== 'buy'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-700 hover:bg-gray-600'
              }\`}
            \>
              Buy
            \</Button\>
            \<Button
              type="button"
              onClick={() \=\> setSide('sell')}
              className={\`flex-1 ${
                side \=== 'sell'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-700 hover:bg-gray-600'
              }\`}
            \>
              Sell
            \</Button\>
          \</div\>

          {/\* Quantity \*/}
          \<div\>
            \<Label htmlFor="quantity"\>Quantity\</Label\>
            \<Input
              id="quantity"
              type="number"
              step="0.01"
              {...register('quantity', { valueAsNumber: true })}
              placeholder="1.00"
              className="mt-1"
            /\>
            {errors.quantity && (
              \<p className="text-sm text-red-500 mt-1"\>{errors.quantity.message}\</p\>
            )}
          \</div\>

          {/\* Price (for limit/stop orders) \*/}
          {(orderType \=== 'limit' || orderType \=== 'stop' || orderType \=== 'stop\_limit') && (
            \<div\>
              \<Label htmlFor="price"\>Price\</Label\>
              \<Input
                id="price"
                type="number"
                step="0.00001"
                {...register('price', { valueAsNumber: true })}
                placeholder="1.10000"
                className="mt-1"
              /\>
              {errors.price && (
                \<p className="text-sm text-red-500 mt-1"\>{errors.price.message}\</p\>
              )}
            \</div\>
          )}

          {/\* Stop Loss \*/}
          \<div\>
            \<Label htmlFor="stop\_loss"\>Stop Loss (Optional)\</Label\>
            \<Input
              id="stop\_loss"
              type="number"
              step="0.00001"
              {...register('stop\_loss', { valueAsNumber: true })}
              placeholder="1.09000"
              className="mt-1"
            /\>
          \</div\>

          {/\* Take Profit \*/}
          \<div\>
            \<Label htmlFor="take\_profit"\>Take Profit (Optional)\</Label\>
            \<Input
              id="take\_profit"
              type="number"
              step="0.00001"
              {...register('take\_profit', { valueAsNumber: true })}
              placeholder="1.12000"
              className="mt-1"
            /\>
          \</div\>

          {/\* Submit Button \*/}
          \<Button
            type="submit"
            disabled={loading}
            className={\`w-full ${
              side \=== 'buy'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }\`}
          \>
            {loading ? 'Placing Order...' : \`Place ${side.toUpperCase()} Order\`}
          \</Button\>
        \</form\>
      \</Tabs\>
    \</div\>
  )
}

---

#### **src/components/portfolio/PortfolioSummary.tsx**

import { useEffect } from 'react'
import { usePortfolioStore } from '@/stores/portfolioStore'
import { Card } from '@/components/ui/Card'
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

export const PortfolioSummary: React.FC \= () \=\> {
  const {
    balance,
    equity,
    margin\_used,
    free\_margin,
    margin\_level,
    unrealized\_pnl,
    fetchPortfolio,
    subscribeToUpdates,
  } \= usePortfolioStore()

  useEffect(() \=\> {
    fetchPortfolio()
    subscribeToUpdates()
  }, \[fetchPortfolio, subscribeToUpdates\])

  const formatCurrency \= (value: number) \=\> {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const formatPercent \= (value: number) \=\> {
    return \`${value.toFixed(2)}%\`
  }

  const getMarginLevelColor \= (level: number | null) \=\> {
    if (\!level) return 'text-gray-400'
    if (level \< 50\) return 'text-red-500'
    if (level \< 100\) return 'text-yellow-500'
    return 'text-green-500'
  }

  return (
    \<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"\>
      {/\* Balance \*/}
      \<Card className="p-4 bg-gray-900 border-gray-800"\>
        \<div className="text-sm text-gray-400 mb-1"\>Balance\</div\>
        \<div className="text-2xl font-bold text-white"\>{formatCurrency(balance)}\</div\>
      \</Card\>

      {/\* Equity \*/}
      \<Card className="p-4 bg-gray-900 border-gray-800"\>
        \<div className="text-sm text-gray-400 mb-1"\>Equity\</div\>
        \<div className="text-2xl font-bold text-white"\>{formatCurrency(equity)}\</div\>
        \<div className="flex items-center gap-1 mt-1"\>
          {unrealized\_pnl \>= 0 ? (
            \<\>
              \<ArrowUpIcon className="w-4 h-4 text-green-500" /\>
              \<span className="text-sm text-green-500"\>
                {formatCurrency(unrealized\_pnl)}
              \</span\>
            \</\>
          ) : (
            \<\>
              \<ArrowDownIcon className="w-4 h-4 text-red-500" /\>
              \<span className="text-sm text-red-500"\>
                {formatCurrency(Math.abs(unrealized\_pnl))}
              \</span\>
            \</\>
          )}
        \</div\>
      \</Card\>

      {/\* Margin Used \*/}
      \<Card className="p-4 bg-gray-900 border-gray-800"\>
        \<div className="text-sm text-gray-400 mb-1"\>Margin Used\</div\>
        \<div className="text-2xl font-bold text-white"\>{formatCurrency(margin\_used)}\</div\>
        \<div className="text-sm text-gray-400 mt-1"\>
          Free: {formatCurrency(free\_margin)}
        \</div\>
      \</Card\>

      {/\* Margin Level \*/}
      \<Card className="p-4 bg-gray-900 border-gray-800"\>
        \<div className="text-sm text-gray-400 mb-1"\>Margin Level\</div\>
        \<div className={\`text-2xl font-bold ${getMarginLevelColor(margin\_level)}\`}\>
          {margin\_level ? formatPercent(margin\_level) : 'N/A'}
        \</div\>
        {margin\_level && margin\_level \< 100 && (
          \<div className="text-sm text-red-500 mt-1"\>⚠️ Margin Call Warning\</div\>
        )}
      \</Card\>
    \</div\>
  )
}

---

#### **src/components/kyc/KYCWizard.tsx**

import { useState } from 'react'
import { PersonalInfoStep } from './PersonalInfoStep'
import { DocumentUploadStep } from './DocumentUploadStep'
import { SelfieStep } from './SelfieStep'
import { RiskQuizStep } from './RiskQuizStep'
import { Card } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'

const STEPS \= \[
  { id: 1, name: 'Personal Information', component: PersonalInfoStep },
  { id: 2, name: 'Document Upload', component: DocumentUploadStep },
  { id: 3, name: 'Selfie Verification', component: SelfieStep },
  { id: 4, name: 'Risk Assessment', component: RiskQuizStep },
\]

export const KYCWizard: React.FC \= () \=\> {
  const \[currentStep, setCurrentStep\] \= useState(1)

  const nextStep \= () \=\> {
    if (currentStep \< STEPS.length) {
      setCurrentStep(currentStep \+ 1\)
    }
  }

  const prevStep \= () \=\> {
    if (currentStep \> 1\) {
      setCurrentStep(currentStep \- 1\)
    }
  }

  const CurrentStepComponent \= STEPS\[currentStep \- 1\].component
  const progress \= (currentStep / STEPS.length) \* 100

  return (
    \<div className="max-w-3xl mx-auto py-8"\>
      \<Card className="p-6 bg-gray-900 border-gray-800"\>
        {/\* Progress Bar \*/}
        \<div className="mb-8"\>
          \<div className="flex justify-between mb-2"\>
            {STEPS.map((step) \=\> (
              \<div
                key={step.id}
                className={\`text-sm ${
                  step.id \=== currentStep
                    ? 'text-blue-500 font-semibold'
                    : step.id \< currentStep
                    ? 'text-green-500'
                    : 'text-gray-500'
                }\`}
              \>
                {step.id}. {step.name}
              \</div\>
            ))}
          \</div\>
          \<Progress value={progress} className="h-2" /\>
        \</div\>

        {/\* Step Content \*/}
        \<div className="min-h-\[400px\]"\>
          \<CurrentStepComponent onNext={nextStep} onPrev={prevStep} /\>
        \</div\>
      \</Card\>
    \</div\>
  )
}

---

#### **src/components/kyc/PersonalInfoStep.tsx**

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import \* as z from 'zod'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Select } from '@/components/ui/Select'
import { toast } from 'sonner'

const personalInfoSchema \= z.object({
  full\_name: z.string().min(2, 'Full name is required'),
  date\_of\_birth: z.string().refine((date) \=\> {
    const age \= new Date().getFullYear() \- new Date(date).getFullYear()
    return age \>= 18
  }, 'You must be at least 18 years old'),
  country: z.string().min(1, 'Country is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postal\_code: z.string().min(3, 'Postal code is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
})

type PersonalInfoFormData \= z.infer\<typeof personalInfoSchema\>

interface PersonalInfoStepProps {
  onNext: () \=\> void
  onPrev: () \=\> void
}

export const PersonalInfoStep: React.FC\<PersonalInfoStepProps\> \= ({ onNext }) \=\> {
  const { user } \= useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } \= useForm\<PersonalInfoFormData\>({
    resolver: zodResolver(personalInfoSchema),
  })

  const onSubmit \= async (data: PersonalInfoFormData) \=\> {
    try {
      const { error } \= await supabase
        .from('profiles')
        .update({
          full\_name: data.full\_name,
          date\_of\_birth: data.date\_of\_birth,
          country: data.country,
          address: data.address,
          city: data.city,
          postal\_code: data.postal\_code,
          phone: data.phone,
          kyc\_status: 'pending\_documents',
        })
        .eq('id', user?.id)

      if (error) throw error

      toast.success('Personal information saved')
      onNext()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save information')
    }
  }

  return (
    \<form onSubmit={handleSubmit(onSubmit)} className="space-y-4"\>
      \<div\>
        \<Label htmlFor="full\_name"\>Full Name\</Label\>
        \<Input
          id="full\_name"
          {...register('full\_name')}
          placeholder="John Doe"
          className="mt-1"
        /\>
        {errors.full\_name && (
          \<p className="text-sm text-red-500 mt-1"\>{errors.full\_name.message}\</p\>
        )}
      \</div\>

      \<div\>
        \<Label htmlFor="date\_of\_birth"\>Date of Birth\</Label\>
        \<Input
          id="date\_of\_birth"
          type="date"
          {...register('date\_of\_birth')}
          className="mt-1"
        /\>
        {errors.date\_of\_birth && (
          \<p className="text-sm text-red-500 mt-1"\>{errors.date\_of\_birth.message}\</p\>
        )}
      \</div\>

      \<div\>
        \<Label htmlFor="country"\>Country\</Label\>
        \<Select {...register('country')} className="mt-1"\>
          \<option value=""\>Select country\</option\>
          \<option value="GB"\>United Kingdom\</option\>
          \<option value="DE"\>Germany\</option\>
          \<option value="FR"\>France\</option\>
          \<option value="ES"\>Spain\</option\>
          \<option value="IT"\>Italy\</option\>
          {/\* Add more countries \*/}
        \</Select\>
        {errors.country && (
          \<p className="text-sm text-red-500 mt-1"\>{errors.country.message}\</p\>
        )}
      \</div\>

      \<div\>
        \<Label htmlFor="address"\>Address\</Label\>
        \<Input
          id="address"
          {...register('address')}
          placeholder="123 Main St"
          className="mt-1"
        /\>
        {errors.address && (
          \<p className="text-sm text-red-500 mt-1"\>{errors.address.message}\</p\>
        )}
      \</div\>

      \<div className="grid grid-cols-2 gap-4"\>
        \<div\>
          \<Label htmlFor="city"\>City\</Label\>
          \<Input id="city" {...register('city')} placeholder="London" className="mt-1" /\>
          {errors.city && (
            \<p className="text-sm text-red-500 mt-1"\>{errors.city.message}\</p\>
          )}
        \</div\>

        \<div\>
          \<Label htmlFor="postal\_code"\>Postal Code\</Label\>
          \<Input
            id="postal\_code"
            {...register('postal\_code')}
            placeholder="SW1A 1AA"
            className="mt-1"
          /\>
          {errors.postal\_code && (
            \<p className="text-sm text-red-500 mt-1"\>{errors.postal\_code.message}\</p\>
          )}
        \</div\>
      \</div\>

      \<div\>
        \<Label htmlFor="phone"\>Phone Number\</Label\>
        \<Input
          id="phone"
          type="tel"
          {...register('phone')}
          placeholder="+44 20 1234 5678"
          className="mt-1"
        /\>
        {errors.phone && (
          \<p className="text-sm text-red-500 mt-1"\>{errors.phone.message}\</p\>
        )}
      \</div\>

      \<Button type="submit" disabled={isSubmitting} className="w-full"\>
        {isSubmitting ? 'Saving...' : 'Continue'}
      \</Button\>
    \</form\>
  )
}

---

## **5\. State Management**

### **src/stores/authStore.ts**

import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile } from '@/types/database'

interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean

  // Actions
  initialize: () \=\> Promise\<void\>
  signIn: (email: string, password: string) \=\> Promise\<void\>
  signUp: (email: string, password: string) \=\> Promise\<void\>
  signOut: () \=\> Promise\<void\>
  fetchProfile: () \=\> Promise\<void\>
  updateProfile: (updates: Partial\<Profile\>) \=\> Promise\<void\>
}

export const useAuthStore \= create\<AuthState\>((set, get) \=\> ({
  user: null,
  session: null,
  profile: null,
  loading: true,

  initialize: async () \=\> {
    try {
      // Get initial session
      const { data: { session } } \= await supabase.auth.getSession()

      set({ session, user: session?.user ?? null })

      if (session?.user) {
        await get().fetchProfile()
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) \=\> {
        set({ session, user: session?.user ?? null })

        if (session?.user) {
          await get().fetchProfile()
        } else {
          set({ profile: null })
        }
      })
    } finally {
      set({ loading: false })
    }
  },

  signIn: async (email, password) \=\> {
    const { data, error } \= await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    set({ user: data.user, session: data.session })
    await get().fetchProfile()

    // Update last login
    await supabase
      .from('profiles')
      .update({ last\_login: new Date().toISOString() })
      .eq('id', data.user.id)
  },

  signUp: async (email, password) \=\> {
    const { data, error } \= await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    set({ user: data.user, session: data.session })
  },

  signOut: async () \=\> {
    await supabase.auth.signOut()
    set({ user: null, session: null, profile: null })
  },

  fetchProfile: async () \=\> {
    const { user } \= get()
    if (\!user) return

    const { data, error } \= await supabase
      .from('profiles')
      .select('\*')
      .eq('id', user.id)
      .single()

    if (error) throw error

    set({ profile: data })
  },

  updateProfile: async (updates) \=\> {
    const { user } \= get()
    if (\!user) throw new Error('Not authenticated')

    const { data, error } \= await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error

    set({ profile: data })
  },
}))

---

### **src/stores/tradingStore.ts**

import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Order, Position, OrderInsert } from '@/types/database'

interface TradingState {
  selectedSymbol: string
  positions: Position\[\]
  orders: Order\[\]
  loading: boolean

  // Actions
  setSymbol: (symbol: string) \=\> void
  placeOrder: (order: OrderInsert) \=\> Promise\<void\>
  closePosition: (positionId: string, quantity?: number) \=\> Promise\<void\>
  cancelOrder: (orderId: string) \=\> Promise\<void\>
  fetchPositions: () \=\> Promise\<void\>
  fetchOrders: () \=\> Promise\<void\>
  subscribeToUpdates: () \=\> void
}

export const useTradingStore \= create\<TradingState\>((set, get) \=\> ({
  selectedSymbol: 'EURUSD',
  positions: \[\],
  orders: \[\],
  loading: false,

  setSymbol: (symbol) \=\> set({ selectedSymbol: symbol }),

  placeOrder: async (order) \=\> {
    set({ loading: true })

    try {
      const { data, error } \= await supabase.functions.invoke('execute-order', {
        body: { order },
      })

      if (error) throw error

      await Promise.all(\[get().fetchPositions(), get().fetchOrders()\])

      return data
    } finally {
      set({ loading: false })
    }
  },

  closePosition: async (positionId, quantity) \=\> {
    set({ loading: true })

    try {
      const { data, error } \= await supabase.functions.invoke('close-position', {
        body: { position\_id: positionId, quantity },
      })

      if (error) throw error

      await get().fetchPositions()

      return data
    } finally {
      set({ loading: false })
    }
  },

  cancelOrder: async (orderId) \=\> {
    const { error } \= await supabase
      .from('orders')
      .update({
        status: 'cancelled',
        cancelled\_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    if (error) throw error

    await get().fetchOrders()
  },

  fetchPositions: async () \=\> {
    const { data: { user } } \= await supabase.auth.getUser()
    if (\!user) return

    const { data, error } \= await supabase
      .from('positions')
      .select('\*')
      .eq('user\_id', user.id)
      .eq('status', 'open')
      .order('opened\_at', { ascending: false })

    if (error) throw error

    set({ positions: data || \[\] })
  },

  fetchOrders: async () \=\> {
    const { data: { user } } \= await supabase.auth.getUser()
    if (\!user) return

    const { data, error } \= await supabase
      .from('orders')
      .select('\*')
      .eq('user\_id', user.id)
      .in('status', \['pending', 'open'\])
      .order('created\_at', { ascending: false })

    if (error) throw error

    set({ orders: data || \[\] })
  },

  subscribeToUpdates: () \=\> {
    const { data: { user } } \= supabase.auth.getUser()

    user.then(({ user }) \=\> {
      if (\!user) return

      // Subscribe to position changes
      supabase
        .channel(\`positions:${user.id}\`)
        .on(
          'postgres\_changes',
          {
            event: '\*',
            schema: 'public',
            table: 'positions',
            filter: \`user\_id=eq.${user.id}\`,
          },
          () \=\> {
            get().fetchPositions()
          }
        )
        .subscribe()

      // Subscribe to order changes
      supabase
        .channel(\`orders:${user.id}\`)
        .on(
          'postgres\_changes',
          {
            event: '\*',
            schema: 'public',
            table: 'orders',
            filter: \`user\_id=eq.${user.id}\`,
          },
          () \=\> {
            get().fetchOrders()
          }
        )
        .subscribe()
    })
  },
}))

---

## **6\. Trading Logic & Calculations**

### **src/lib/trading/calculations.ts**

import type { AssetClass, PositionSide } from '@/types/database'
import Decimal from 'decimal.js'

// Configure Decimal.js for precise financial calculations
Decimal.set({ precision: 20, rounding: Decimal.ROUND\_HALF\_UP })

// \============================================
// ASSET CONFIGURATION
// \============================================

export interface AssetConfig {
  symbol: string
  name: string
  asset\_class: AssetClass
  contract\_size: number
  min\_quantity: number
  max\_quantity: number
  tick\_size: number
  pip\_value?: number
  trading\_hours: {
    open: string
    close: string
    timezone: string
    is\_24\_7?: boolean
  }
  margin\_requirement: number
  max\_leverage: number
  swap\_long: number
  swap\_short: number
  commission\_rate: number
  is\_tradable: boolean
}

export const ASSET\_CONFIGS: Record\<string, AssetConfig\> \= {
  // Forex
  EURUSD: {
    symbol: 'EURUSD',
    name: 'Euro / US Dollar',
    asset\_class: 'forex',
    contract\_size: 100000,
    min\_quantity: 0.01,
    max\_quantity: 100,
    tick\_size: 0.00001,
    pip\_value: 10,
    trading\_hours: {
      open: '22:00',
      close: '22:00',
      timezone: 'America/New\_York',
      is\_24\_7: false,
    },
    margin\_requirement: 0.033, // 3.3% (30:1 leverage)
    max\_leverage: 30,
    swap\_long: \-0.0005,
    swap\_short: 0.0003,
    commission\_rate: 0.0001,
    is\_tradable: true,
  },
  GBPUSD: {
    symbol: 'GBPUSD',
    name: 'British Pound / US Dollar',
    asset\_class: 'forex',
    contract\_size: 100000,
    min\_quantity: 0.01,
    max\_quantity: 100,
    tick\_size: 0.00001,
    pip\_value: 10,
    trading\_hours: {
      open: '22:00',
      close: '22:00',
      timezone: 'America/New\_York',
      is\_24\_7: false,
    },
    margin\_requirement: 0.033,
    max\_leverage: 30,
    swap\_long: \-0.00045,
    swap\_short: 0.00025,
    commission\_rate: 0.0001,
    is\_tradable: true,
  },
  USDJPY: {
    symbol: 'USDJPY',
    name: 'US Dollar / Japanese Yen',
    asset\_class: 'forex',
    contract\_size: 100000,
    min\_quantity: 0.01,
    max\_quantity: 100,
    tick\_size: 0.001,
    pip\_value: 9.5,
    trading\_hours: {
      open: '22:00',
      close: '22:00',
      timezone: 'America/New\_York',
      is\_24\_7: false,
    },
    margin\_requirement: 0.033,
    max\_leverage: 30,
    swap\_long: 0.0002,
    swap\_short: \-0.0004,
    commission\_rate: 0.0001,
    is\_tradable: true,
  },

  // Commodities
  XAUUSD: {
    symbol: 'XAUUSD',
    name: 'Gold / US Dollar',
    asset\_class: 'commodities',
    contract\_size: 100,
    min\_quantity: 0.01,
    max\_quantity: 50,
    tick\_size: 0.01,
    trading\_hours: {
      open: '23:00',
      close: '22:00',
      timezone: 'America/New\_York',
      is\_24\_7: false,
    },
    margin\_requirement: 0.05, // 5% (20:1 leverage)
    max\_leverage: 20,
    swap\_long: \-0.0025,
    swap\_short: 0.0015,
    commission\_rate: 0.0002,
    is\_tradable: true,
  },
  XAGUSD: {
    symbol: 'XAGUSD',
    name: 'Silver / US Dollar',
    asset\_class: 'commodities',
    contract\_size: 5000,
    min\_quantity: 0.01,
    max\_quantity: 30,
    tick\_size: 0.001,
    trading\_hours: {
      open: '23:00',
      close: '22:00',
      timezone: 'America/New\_York',
      is\_24\_7: false,
    },
    margin\_requirement: 0.05,
    max\_leverage: 20,
    swap\_long: \-0.003,
    swap\_short: 0.002,
    commission\_rate: 0.0002,
    is\_tradable: true,
  },

  // Crypto
  BTCUSD: {
    symbol: 'BTCUSD',
    name: 'Bitcoin / US Dollar',
    asset\_class: 'crypto',
    contract\_size: 1,
    min\_quantity: 0.001,
    max\_quantity: 10,
    tick\_size: 0.01,
    trading\_hours: {
      open: '00:00',
      close: '23:59',
      timezone: 'UTC',
      is\_24\_7: true,
    },
    margin\_requirement: 0.5, // 50% (2:1 leverage)
    max\_leverage: 2,
    swap\_long: 0,
    swap\_short: 0,
    commission\_rate: 0.001,
    is\_tradable: true,
  },
  ETHUSD: {
    symbol: 'ETHUSD',
    name: 'Ethereum / US Dollar',
    asset\_class: 'crypto',
    contract\_size: 1,
    min\_quantity: 0.01,
    max\_quantity: 100,
    tick\_size: 0.01,
    trading\_hours: {
      open: '00:00',
      close: '23:59',
      timezone: 'UTC',
      is\_24\_7: true,
    },
    margin\_requirement: 0.5,
    max\_leverage: 2,
    swap\_long: 0,
    swap\_short: 0,
    commission\_rate: 0.001,
    is\_tradable: true,
  },

  // Stocks
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    asset\_class: 'stocks',
    contract\_size: 1,
    min\_quantity: 1,
    max\_quantity: 10000,
    tick\_size: 0.01,
    trading\_hours: {
      open: '09:30',
      close: '16:00',
      timezone: 'America/New\_York',
      is\_24\_7: false,
    },
    margin\_requirement: 0.2, // 20% (5:1 leverage)
    max\_leverage: 5,
    swap\_long: 0,
    swap\_short: 0,
    commission\_rate: 0.0005,
    is\_tradable: true,
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    asset\_class: 'stocks',
    contract\_size: 1,
    min\_quantity: 1,
    max\_quantity: 5000,
    tick\_size: 0.01,
    trading\_hours: {
      open: '09:30',
      close: '16:00',
      timezone: 'America/New\_York',
      is\_24\_7: false,
    },
    margin\_requirement: 0.2,
    max\_leverage: 5,
    swap\_long: 0,
    swap\_short: 0,
    commission\_rate: 0.0005,
    is\_tradable: true,
  },

  // Indices
  US30: {
    symbol: 'US30',
    name: 'Dow Jones Industrial Average',
    asset\_class: 'indices',
    contract\_size: 1,
    min\_quantity: 0.1,
    max\_quantity: 100,
    tick\_size: 0.01,
    trading\_hours: {
      open: '23:00',
      close: '22:00',
      timezone: 'America/New\_York',
      is\_24\_7: false,
    },
    margin\_requirement: 0.01, // 1% (100:1 leverage)
    max\_leverage: 100,
    swap\_long: \-0.001,
    swap\_short: 0.0005,
    commission\_rate: 0.0001,
    is\_tradable: true,
  },
}

// \============================================
// MARGIN CALCULATIONS
// \============================================

export interface MarginCalculation {
  notional\_value: number
  margin\_required: number
  margin\_used: number
  equity: number
  free\_margin: number
  margin\_level: number | null
}

export function calculateMargin(
  symbol: string,
  quantity: number,
  price: number,
  userLeverage: number
): number {
  const config \= ASSET\_CONFIGS\[symbol\]
  if (\!config) throw new Error(\`Unknown symbol: ${symbol}\`)

  const notional \= new Decimal(quantity)
    .times(price)
    .times(config.contract\_size)

  // Use the more restrictive of: asset requirement or user leverage
  const effectiveLeverage \= Math.min(1 / config.margin\_requirement, userLeverage)

  return notional.div(effectiveLeverage).toNumber()
}

export function calculatePortfolioMargin(
  balance: number,
  unrealizedPnL: number,
  marginUsed: number
): MarginCalculation {
  const equity \= new Decimal(balance).plus(unrealizedPnL)
  const freeMargin \= equity.minus(marginUsed)

  let marginLevel: number | null \= null
  if (marginUsed \> 0\) {
    marginLevel \= equity.div(marginUsed).times(100).toNumber()
  }

  return {
    notional\_value: 0, // Calculate separately per position
    margin\_required: marginUsed,
    margin\_used: marginUsed,
    equity: equity.toNumber(),
    free\_margin: freeMargin.toNumber(),
    margin\_level: marginLevel,
  }
}

// \============================================
// P\&L CALCULATIONS
// \============================================

export function calculateUnrealizedPnL(
  symbol: string,
  entryPrice: number,
  currentPrice: number,
  quantity: number,
  side: PositionSide
): number {
  const config \= ASSET\_CONFIGS\[symbol\]
  if (\!config) throw new Error(\`Unknown symbol: ${symbol}\`)

  const priceDiff \= new Decimal(currentPrice).minus(entryPrice)
  const direction \= side \=== 'long' ? 1 : \-1
  const contractValue \= new Decimal(quantity).times(config.contract\_size)

  return priceDiff.times(contractValue).times(direction).toNumber()
}

export function calculateRealizedPnL(
  symbol: string,
  entryPrice: number,
  exitPrice: number,
  quantity: number,
  side: PositionSide
): number {
  return calculateUnrealizedPnL(symbol, entryPrice, exitPrice, quantity, side)
}

export function calculatePnLInPips(
  symbol: string,
  entryPrice: number,
  currentPrice: number
): number {
  const config \= ASSET\_CONFIGS\[symbol\]
  if (\!config) throw new Error(\`Unknown symbol: ${symbol}\`)

  const priceDiff \= new Decimal(currentPrice).minus(entryPrice)
  const pips \= priceDiff.div(config.tick\_size)

  return pips.toNumber()
}

// \============================================
// COMMISSION & FEES
// \============================================

export function calculateCommission(
  symbol: string,
  quantity: number,
  price: number
): number {
  const config \= ASSET\_CONFIGS\[symbol\]
  if (\!config) throw new Error(\`Unknown symbol: ${symbol}\`)

  const notional \= new Decimal(quantity)
    .times(price)
    .times(config.contract\_size)

  return notional.times(config.commission\_rate).toNumber()
}

export function calculateSwap(
  symbol: string,
  quantity: number,
  price: number,
  side: PositionSide,
  daysHeld: number \= 1
): number {
  const config \= ASSET\_CONFIGS\[symbol\]
  if (\!config) throw new Error(\`Unknown symbol: ${symbol}\`)

  const swapRate \= side \=== 'long' ? config.swap\_long : config.swap\_short
  const notional \= new Decimal(quantity)
    .times(price)
    .times(config.contract\_size)

  // Annual swap rate / 365 \* days held
  const dailySwap \= notional.times(swapRate).div(365).times(daysHeld)

  return dailySwap.toNumber()
}

// \============================================
// SLIPPAGE CALCULATIONS
// \============================================

export function calculateSlippage(
  symbol: string,
  quantity: number,
  orderSide: 'buy' | 'sell'
): number {
  const config \= ASSET\_CONFIGS\[symbol\]
  if (\!config) throw new Error(\`Unknown symbol: ${symbol}\`)

  let baseSlippage \= 0.00001 // Default

  // Asset class specific slippage
  switch (config.asset\_class) {
    case 'forex':
      if (\['EURUSD', 'GBPUSD', 'USDJPY'\].includes(symbol)) {
        baseSlippage \= 0.00001 // 0.1 pips for major pairs
      } else {
        baseSlippage \= 0.00003 // 0.3 pips for minor pairs
      }
      break
    case 'stocks':
      baseSlippage \= 0.0005 // 0.05%
      break
    case 'crypto':
      baseSlippage \= symbol.startsWith('BTC') ? 0.001 : 0.005 // 0.1% for BTC, 0.5% for alts
      break
    case 'commodities':
      baseSlippage \= 0.0002 // 0.02%
      break
    case 'indices':
      baseSlippage \= 0.0003 // 0.03%
      break
  }

  // Increase slippage for larger orders
  const sizeFactor \= Math.min(quantity / 10, 2\) // Max 2x slippage
  const totalSlippage \= baseSlippage \* (1 \+ sizeFactor \* 0.5)

  // Apply direction
  return totalSlippage \* (orderSide \=== 'buy' ? 1 : \-1)
}

// \============================================
// POSITION SIZING
// \============================================

export interface PositionSizeResult {
  quantity: number
  notional\_value: number
  margin\_required: number
  risk\_amount: number
  reward\_amount: number
  risk\_reward\_ratio: number
}

export function calculatePositionSize(
  symbol: string,
  accountBalance: number,
  riskPercent: number, // e.g., 2 for 2%
  entryPrice: number,
  stopLoss: number,
  takeProfit: number | null,
  userLeverage: number
): PositionSizeResult {
  const config \= ASSET\_CONFIGS\[symbol\]
  if (\!config) throw new Error(\`Unknown symbol: ${symbol}\`)

  const riskAmount \= new Decimal(accountBalance).times(riskPercent).div(100)
  const stopDistance \= new Decimal(entryPrice).minus(stopLoss).abs()

  // Calculate quantity based on risk
  const quantity \= riskAmount
    .div(stopDistance)
    .div(config.contract\_size)
    .toDecimalPlaces(2, Decimal.ROUND\_DOWN)
    .toNumber()

  // Clamp to min/max
  const finalQuantity \= Math.max(
    config.min\_quantity,
    Math.min(quantity, config.max\_quantity)
  )

  const notionalValue \= new Decimal(finalQuantity)
    .times(entryPrice)
    .times(config.contract\_size)
    .toNumber()

  const marginRequired \= calculateMargin(symbol, finalQuantity, entryPrice, userLeverage)

  const riskAmountFinal \= new Decimal(finalQuantity)
    .times(stopDistance)
    .times(config.contract\_size)
    .toNumber()

  let rewardAmount \= 0
  let riskRewardRatio \= 0

  if (takeProfit) {
    const profitDistance \= new Decimal(takeProfit).minus(entryPrice).abs()
    rewardAmount \= new Decimal(finalQuantity)
      .times(profitDistance)
      .times(config.contract\_size)
      .toNumber()

    riskRewardRatio \= new Decimal(rewardAmount)
      .div(riskAmountFinal)
      .toNumber()
  }

  return {
    quantity: finalQuantity,
    notional\_value: notionalValue,
    margin\_required: marginRequired,
    risk\_amount: riskAmountFinal,
    reward\_amount: rewardAmount,
    risk\_reward\_ratio: riskRewardRatio,
  }
}

// \============================================
// RISK MANAGEMENT
// \============================================

export interface RiskMetrics {
  max\_position\_size: number
  max\_risk\_per\_trade: number
  daily\_loss\_limit: number
  max\_drawdown\_allowed: number
  positions\_limit: number
}

export function calculateRiskMetrics(
  accountBalance: number,
  riskTolerance: 'conservative' | 'moderate' | 'aggressive' | 'very\_aggressive'
): RiskMetrics {
  const riskProfiles \= {
    conservative: {
      max\_risk\_per\_trade: 1, // 1%
      daily\_loss\_limit: 2, // 2%
      max\_drawdown: 10, // 10%
      positions\_limit: 3,
    },
    moderate: {
      max\_risk\_per\_trade: 2, // 2%
      daily\_loss\_limit: 4, // 4%
      max\_drawdown: 15, // 15%
      positions\_limit: 5,
    },
    aggressive: {
      max\_risk\_per\_trade: 3, // 3%
      daily\_loss\_limit: 6, // 6%
      max\_drawdown: 20, // 20%
      positions\_limit: 8,
    },
    very\_aggressive: {
      max\_risk\_per\_trade: 5, // 5%
      daily\_loss\_limit: 10, // 10%
      max\_drawdown: 30, // 30%
      positions\_limit: 10,
    },
  }

  const profile \= riskProfiles\[riskTolerance\]

  return {
    max\_position\_size: new Decimal(accountBalance)
      .times(profile.max\_risk\_per\_trade)
      .div(100)
      .toNumber(),
    max\_risk\_per\_trade: new Decimal(accountBalance)
      .times(profile.max\_risk\_per\_trade)
      .div(100)
      .toNumber(),
    daily\_loss\_limit: new Decimal(accountBalance)
      .times(profile.daily\_loss\_limit)
      .div(100)
      .toNumber(),
    max\_drawdown\_allowed: new Decimal(accountBalance)
      .times(profile.max\_drawdown)
      .div(100)
      .toNumber(),
    positions\_limit: profile.positions\_limit,
  }
}

// \============================================
// VALIDATION HELPERS
// \============================================

export function validateOrder(
  symbol: string,
  quantity: number,
  price: number | null,
  orderType: string
): { valid: boolean; errors: string\[\] } {
  const errors: string\[\] \= \[\]
  const config \= ASSET\_CONFIGS\[symbol\]

  if (\!config) {
    errors.push(\`Unknown symbol: ${symbol}\`)
    return { valid: false, errors }
  }

  if (\!config.is\_tradable) {
    errors.push(\`Symbol ${symbol} is not tradable\`)
  }

  if (quantity \< config.min\_quantity) {
    errors.push(\`Minimum quantity is ${config.min\_quantity}\`)
  }

  if (quantity \> config.max\_quantity) {
    errors.push(\`Maximum quantity is ${config.max\_quantity}\`)
  }

  if (price \!== null) {
    const remainder \= new Decimal(price).mod(config.tick\_size).toNumber()
    if (remainder \!== 0\) {
      errors.push(\`Price must be a multiple of ${config.tick\_size}\`)
    }
  }

  return {
    valid: errors.length \=== 0,
    errors,
  }
}

export function isMarketOpen(symbol: string): boolean {
  const config \= ASSET\_CONFIGS\[symbol\]
  if (\!config) return false

  // 24/7 markets (crypto)
  if (config.trading\_hours.is\_24\_7) return true

  const now \= new Date()
  const day \= now.getUTCDay()

  // Weekend check for forex/commodities
  if (config.asset\_class \=== 'forex' || config.asset\_class \=== 'commodities') {
    // Closed on Saturday and Sunday morning
    if (day \=== 6 || (day \=== 0 && now.getUTCHours() \< 22)) {
      return false
    }
  }

  // Stock market hours check
  if (config.asset\_class \=== 'stocks') {
    // Closed on weekends
    if (day \=== 0 || day \=== 6\) return false

    // Check trading hours (simplified \- doesn't account for holidays)
    const hour \= now.getUTCHours()
    // US market: 13:30 \- 20:00 UTC (9:30 AM \- 4:00 PM EST)
    if (hour \< 13 || hour \>= 20\) return false
  }

  return true
}

// \============================================
// PERFORMANCE CALCULATIONS
// \============================================

export interface PerformanceMetrics {
  total\_trades: number
  winning\_trades: number
  losing\_trades: number
  win\_rate: number
  avg\_win: number
  avg\_loss: number
  profit\_factor: number
  sharpe\_ratio: number
  max\_drawdown: number
  max\_drawdown\_percent: number
  total\_pnl: number
  net\_pnl: number
}

export function calculatePerformanceMetrics(
  trades: Array\<{
    pnl: number
    commission: number
    swap: number
  }\>,
  initialBalance: number
): PerformanceMetrics {
  const totalTrades \= trades.length
  const winningTrades \= trades.filter((t) \=\> t.pnl \> 0\)
  const losingTrades \= trades.filter((t) \=\> t.pnl \< 0\)

  const totalWin \= winningTrades.reduce((sum, t) \=\> sum \+ t.pnl, 0\)
  const totalLoss \= Math.abs(losingTrades.reduce((sum, t) \=\> sum \+ t.pnl, 0))

  const avgWin \= winningTrades.length \> 0 ? totalWin / winningTrades.length : 0
  const avgLoss \= losingTrades.length \> 0 ? totalLoss / losingTrades.length : 0

  const profitFactor \= totalLoss \> 0 ? totalWin / totalLoss : 0

  const totalPnL \= trades.reduce((sum, t) \=\> sum \+ t.pnl, 0\)
  const totalCommission \= trades.reduce((sum, t) \=\> sum \+ t.commission, 0\)
  const totalSwap \= trades.reduce((sum, t) \=\> sum \+ t.swap, 0\)
  const netPnL \= totalPnL \- totalCommission \- totalSwap

  // Calculate drawdown
  let peak \= initialBalance
  let maxDrawdown \= 0
  let runningBalance \= initialBalance

  for (const trade of trades) {
    runningBalance \+= trade.pnl \- trade.commission \- trade.swap
    if (runningBalance \> peak) {
      peak \= runningBalance
    }
    const drawdown \= peak \- runningBalance
    if (drawdown \> maxDrawdown) {
      maxDrawdown \= drawdown
    }
  }

  const maxDrawdownPercent \= (maxDrawdown / peak) \* 100

  // Calculate Sharpe Ratio (simplified \- assumes daily returns)
  const returns \= \[\]
  let balance \= initialBalance
  for (const trade of trades) {
    const returnPct \= ((trade.pnl \- trade.commission \- trade.swap) / balance) \* 100
    returns.push(returnPct)
    balance \+= trade.pnl \- trade.commission \- trade.swap
  }

  const avgReturn \= returns.reduce((sum, r) \=\> sum \+ r, 0\) / returns.length
  const stdDev \= Math.sqrt(
    returns.reduce((sum, r) \=\> sum \+ Math.pow(r \- avgReturn, 2), 0\) / returns.length
  )

  const sharpeRatio \= stdDev \> 0 ? avgReturn / stdDev : 0

  return {
    total\_trades: totalTrades,
    winning\_trades: winningTrades.length,
    losing\_trades: losingTrades.length,
    win\_rate: totalTrades \> 0 ? (winningTrades.length / totalTrades) \* 100 : 0,
    avg\_win: avgWin,
    avg\_loss: avgLoss,
    profit\_factor: profitFactor,
    sharpe\_ratio: sharpeRatio,
    max\_drawdown: maxDrawdown,
    max\_drawdown\_percent: maxDrawdownPercent,
    total\_pnl: totalPnL,
    net\_pnl: netPnL,
  }
}

---

## **7\. Error Handling & Validation**

### **src/lib/errors.ts**

export enum ErrorCode {
  // Authentication
  UNAUTHORIZED \= 'UNAUTHORIZED',
  FORBIDDEN \= 'FORBIDDEN',
  TOKEN\_EXPIRED \= 'TOKEN\_EXPIRED',
  INVALID\_CREDENTIALS \= 'INVALID\_CREDENTIALS',

  // Validation
  INVALID\_INPUT \= 'INVALID\_INPUT',
  VALIDATION\_ERROR \= 'VALIDATION\_ERROR',
  MISSING\_REQUIRED\_FIELD \= 'MISSING\_REQUIRED\_FIELD',

  // Trading
  INSUFFICIENT\_MARGIN \= 'INSUFFICIENT\_MARGIN',
  MARKET\_CLOSED \= 'MARKET\_CLOSED',
  INVALID\_SYMBOL \= 'INVALID\_SYMBOL',
  INVALID\_QUANTITY \= 'INVALID\_QUANTITY',
  INVALID\_PRICE \= 'INVALID\_PRICE',
  POSITION\_NOT\_FOUND \= 'POSITION\_NOT\_FOUND',
  ORDER\_NOT\_FOUND \= 'ORDER\_NOT\_FOUND',
  DUPLICATE\_ORDER \= 'DUPLICATE\_ORDER',
  RISK\_LIMIT\_EXCEEDED \= 'RISK\_LIMIT\_EXCEEDED',
  DAILY\_LOSS\_LIMIT\_EXCEEDED \= 'DAILY\_LOSS\_LIMIT\_EXCEEDED',

  // Account
  KYC\_NOT\_APPROVED \= 'KYC\_NOT\_APPROVED',
  ACCOUNT\_SUSPENDED \= 'ACCOUNT\_SUSPENDED',
  ACCOUNT\_CLOSED \= 'ACCOUNT\_CLOSED',
  INSUFFICIENT\_BALANCE \= 'INSUFFICIENT\_BALANCE',

  // System
  RATE\_LIMIT\_EXCEEDED \= 'RATE\_LIMIT\_EXCEEDED',
  SERVICE\_UNAVAILABLE \= 'SERVICE\_UNAVAILABLE',
  SYSTEM\_ERROR \= 'SYSTEM\_ERROR',
  DATABASE\_ERROR \= 'DATABASE\_ERROR',
  NETWORK\_ERROR \= 'NETWORK\_ERROR',

  // Geo-restriction
  GEO\_RESTRICTED \= 'GEO\_RESTRICTED',

  // File upload
  FILE\_TOO\_LARGE \= 'FILE\_TOO\_LARGE',
  INVALID\_FILE\_TYPE \= 'INVALID\_FILE\_TYPE',
  UPLOAD\_FAILED \= 'UPLOAD\_FAILED',
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: Record\<string, any\>,
    public statusCode: number \= 500
  ) {
    super(message)
    this.name \= 'AppError'
    Object.setPrototypeOf(this, AppError.prototype)
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: new Date().toISOString(),
    }
  }
}

// Specific error classes
export class ValidationError extends AppError {
  constructor(message: string, details?: Record\<string, any\>) {
    super(ErrorCode.VALIDATION\_ERROR, message, details, 400\)
    this.name \= 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string \= 'Authentication required') {
    super(ErrorCode.UNAUTHORIZED, message, undefined, 401\)
    this.name \= 'AuthenticationError'
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string \= 'Insufficient permissions') {
    super(ErrorCode.FORBIDDEN, message, undefined, 403\)
    this.name \= 'AuthorizationError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(ErrorCode.ORDER\_NOT\_FOUND, \`${resource} not found\`, undefined, 404\)
    this.name \= 'NotFoundError'
  }
}

export class TradingError extends AppError {
  constructor(code: ErrorCode, message: string, details?: Record\<string, any\>) {
    super(code, message, details, 400\)
    this.name \= 'TradingError'
  }
}

export class RateLimitError extends AppError {
  constructor(message: string \= 'Rate limit exceeded') {
    super(ErrorCode.RATE\_LIMIT\_EXCEEDED, message, undefined, 429\)
    this.name \= 'RateLimitError'
  }
}

// Error handler utility
export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    return new AppError(ErrorCode.SYSTEM\_ERROR, error.message)
  }

  return new AppError(ErrorCode.SYSTEM\_ERROR, 'An unknown error occurred')
}

// User-friendly error messages
export const ERROR\_MESSAGES: Record\<ErrorCode, string\> \= {
  \[ErrorCode.UNAUTHORIZED\]: 'Please log in to continue',
  \[ErrorCode.FORBIDDEN\]: 'You do not have permission to perform this action',
  \[ErrorCode.TOKEN\_EXPIRED\]: 'Your session has expired. Please log in again',
  \[ErrorCode.INVALID\_CREDENTIALS\]: 'Invalid email or password',
  \[ErrorCode.INVALID\_INPUT\]: 'Please check your input and try again',
  \[ErrorCode.VALIDATION\_ERROR\]: 'Validation failed. Please review your input',
  \[ErrorCode.MISSING\_REQUIRED\_FIELD\]: 'Required field is missing',
  \[ErrorCode.INSUFFICIENT\_MARGIN\]: 'Insufficient margin to open this position',
  \[ErrorCode.MARKET\_CLOSED\]: 'Market is currently closed',
  \[ErrorCode.INVALID\_SYMBOL\]: 'Invalid trading symbol',
  \[ErrorCode.INVALID\_QUANTITY\]: 'Invalid order quantity',
  \[ErrorCode.INVALID\_PRICE\]: 'Invalid order price',
  \[ErrorCode.POSITION\_NOT\_FOUND\]: 'Position not found',
  \[ErrorCode.ORDER\_NOT\_FOUND\]: 'Order not found',
  \[ErrorCode.DUPLICATE\_ORDER\]: 'Duplicate order detected',
  \[ErrorCode.RISK\_LIMIT\_EXCEEDED\]: 'Risk limit exceeded for this trade',
  \[ErrorCode.DAILY\_LOSS\_LIMIT\_EXCEEDED\]: 'Daily loss limit reached',
  \[ErrorCode.KYC\_NOT\_APPROVED\]: 'Please complete KYC verification to trade',
  \[ErrorCode.ACCOUNT\_SUSPENDED\]: 'Your account has been suspended',
  \[ErrorCode.ACCOUNT\_CLOSED\]: 'Your account has been closed',
  \[ErrorCode.INSUFFICIENT\_BALANCE\]: 'Insufficient account balance',
  \[ErrorCode.RATE\_LIMIT\_EXCEEDED\]: 'Too many requests. Please try again later',
  \[ErrorCode.SERVICE\_UNAVAILABLE\]: 'Service temporarily unavailable',
  \[ErrorCode.SYSTEM\_ERROR\]: 'An unexpected error occurred',
  \[ErrorCode.DATABASE\_ERROR\]: 'Database error. Please try again',
  \[ErrorCode.NETWORK\_ERROR\]: 'Network error. Please check your connection',
  \[ErrorCode.GEO\_RESTRICTED\]: 'Service not available in your region',
  \[ErrorCode.FILE\_TOO\_LARGE\]: 'File size exceeds maximum limit',
  \[ErrorCode.INVALID\_FILE\_TYPE\]: 'Invalid file type',
  \[ErrorCode.UPLOAD\_FAILED\]: 'File upload failed',
}

export function getUserFriendlyErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return ERROR\_MESSAGES\[error.code\] || error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}

---

### **src/lib/validation.ts**

import { z } from 'zod'
import { ASSET\_CONFIGS } from './trading/calculations'

// \============================================
// COMMON VALIDATION SCHEMAS
// \============================================

export const emailSchema \= z
  .string()
  .email('Invalid email address')
  .min(1, 'Email is required')

export const passwordSchema \= z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/\[A-Z\]/, 'Password must contain at least one uppercase letter')
  .regex(/\[a-z\]/, 'Password must contain at least one lowercase letter')
  .regex(/\[0-9\]/, 'Password must contain at least one number')
  .regex(/\[^A-Za-z0-9\]/, 'Password must contain at least one special character')

export const symbolSchema \= z
  .string()
  .min(1)
  .refine((symbol) \=\> symbol in ASSET\_CONFIGS, {
    message: 'Invalid trading symbol',
  })

export const quantitySchema \= (symbol: string) \=\>
  z
    .number()
    .positive('Quantity must be positive')
    .refine(
      (qty) \=\> {
        const config \= ASSET\_CONFIGS\[symbol\]
        return config ? qty \>= config.min\_quantity : true
      },
      (qty) \=\> {
        const config \= ASSET\_CONFIGS\[symbol\]
        return { message: \`Minimum quantity is ${config?.min\_quantity}\` }
      }
    )
    .refine(
      (qty) \=\> {
        const config \= ASSET\_CONFIGS\[symbol\]
        return config ? qty \<= config.max\_quantity : true
      },
      (qty) \=\> {
        const config \= ASSET\_CONFIGS\[symbol\]
        return { message: \`Maximum quantity is ${config?.max\_quantity}\` }
      }
    )

export const priceSchema \= (symbol: string) \=\>
  z
    .number()
    .positive('Price must be positive')
    .refine(
      (price) \=\> {
        const config \= ASSET\_CONFIGS\[symbol\]
        if (\!config) return true
        const remainder \= price % config.tick\_size
        return Math.abs(remainder) \< 0.00000001 // Floating point tolerance
      },
      (price) \=\> {
        const config \= ASSET\_CONFIGS\[symbol\]
        return { message: \`Price must be a multiple of ${config?.tick\_size}\` }
      }
    )

// \============================================
// ORDER VALIDATION SCHEMAS
// \============================================

export const marketOrderSchema \= z.object({
  symbol: symbolSchema,
  side: z.enum(\['buy', 'sell'\]),
  quantity: z.number().positive(),
  stop\_loss: z.number().positive().optional(),
  take\_profit: z.number().positive().optional(),
  idempotency\_key: z.string().min(1),
})

export const limitOrderSchema \= z.object({
  symbol: symbolSchema,
  side: z.enum(\['buy', 'sell'\]),
  quantity: z.number().positive(),
  price: z.number().positive(),
  stop\_loss: z.number().positive().optional(),
  take\_profit: z.number().positive().optional(),
  time\_in\_force: z.enum(\['GTC', 'IOC', 'FOK', 'DAY'\]).optional(),
  expires\_at: z.string().optional(),
  idempotency\_key: z.string().min(1),
})

export const stopOrderSchema \= z.object({
  symbol: symbolSchema,
  side: z.enum(\['buy', 'sell'\]),
  quantity: z.number().positive(),
  stop\_price: z.number().positive(),
  stop\_loss: z.number().positive().optional(),
  take\_profit: z.number().positive().optional(),
  idempotency\_key: z.string().min(1),
})

// \============================================
// KYC VALIDATION SCHEMAS
// \============================================

export const personalInfoSchema \= z.object({
  full\_name: z.string().min(2, 'Full name must be at least 2 characters'),
  date\_of\_birth: z
    .string()
    .refine(
      (date) \=\> {
        const age \= new Date().getFullYear() \- new Date(date).getFullYear()
        return age \>= 18
      },
      { message: 'You must be at least 18 years old' }
    ),
  country: z.string().min(2, 'Country is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  postal\_code: z.string().min(3, 'Postal code must be at least 3 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
})

export const documentUploadSchema \= z.object({
  document\_type: z.enum(\[
    'id\_front',
    'id\_back',
    'passport',
    'drivers\_license',
    'proof\_of\_address',
    'bank\_statement',
    'selfie',
  \]),
  file: z
    .instanceof(File)
    .refine((file) \=\> file.size \<= 5 \* 1024 \* 1024, {
      message: 'File size must be less than 5MB',
    })
    .refine(
      (file) \=\> \['image/jpeg', 'image/png', 'application/pdf'\].includes(file.type),
      {
        message: 'File must be JPEG, PNG, or PDF',
      }
    ),
})

// \============================================
// PROFILE VALIDATION SCHEMAS
// \============================================

export const updateProfileSchema \= z.object({
  full\_name: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  timezone: z.string().optional(),
  leverage: z.number().min(1).max(500).optional(),
})

export const changePasswordSchema \= z.object({
  current\_password: z.string().min(1, 'Current password is required'),
  new\_password: passwordSchema,
  confirm\_password: z.string(),
}).refine((data) \=\> data.new\_password \=== data.confirm\_password, {
  message: "Passwords don't match",
  path: \['confirm\_password'\],
})

// \============================================
// COPY TRADING VALIDATION SCHEMAS
// \============================================

export const copyRelationshipSchema \= z.object({
  leader\_id: z.string().uuid('Invalid leader ID'),
  copy\_ratio: z
    .number()
    .min(0.01, 'Copy ratio must be at least 0.01 (1%)')
    .max(1, 'Copy ratio cannot exceed 1 (100%)'),
  max\_exposure: z.number().positive('Max exposure must be positive'),
  copy\_delay\_seconds: z.number().min(0).max(300).optional(),
  max\_drawdown\_threshold: z
    .number()
    .min(5)
    .max(50, 'Max drawdown threshold cannot exceed 50%')
    .optional(),
})

// \============================================
// BACKTEST VALIDATION SCHEMAS
// \============================================

export const backtestSchema \= z.object({
  strategy\_name: z.string().min(1, 'Strategy name is required'),
  symbols: z.array(symbolSchema).min(1, 'At least one symbol is required'),
  timeframe: z.enum(\['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'\]),
  start\_date: z.string().refine((date) \=\> \!isNaN(Date.parse(date)), {
    message: 'Invalid start date',
  }),
  end\_date: z.string().refine((date) \=\> \!isNaN(Date.parse(date)), {
    message: 'Invalid end date',
  }),
  initial\_capital: z.number().positive('Initial capital must be positive'),
  leverage: z.number().min(1).max(100).optional(),
  parameters: z.record(z.any()),
})

// \============================================
// VALIDATION HELPERS
// \============================================

export function validateWithSchema\<T\>(
  schema: z.ZodSchema\<T\>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string\[\] } {
  try {
    const validated \= schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors \= error.errors.map((err) \=\> err.message)
      return { success: false, errors }
    }
    return { success: false, errors: \['Validation failed'\] }
  }
}

export function sanitizeInput(input: string): string {
  // Remove potential XSS vectors
  return input
    .replace(/\[\<\>\]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\\w+=/gi, '') // Remove event handlers
    .trim()
}

export function sanitizeNumber(value: unknown): number | null {
  if (typeof value \=== 'number' && \!isNaN(value) && isFinite(value)) {
    return value
  }
  if (typeof value \=== 'string') {
    const parsed \= parseFloat(value)
    if (\!isNaN(parsed) && isFinite(parsed)) {
      return parsed
    }
  }
  return null
}

---

## **8\. Testing Specifications**

### **tests/unit/calculations.test.ts**

import { describe, it, expect } from 'vitest'
import {
  calculateMargin,
  calculateUnrealizedPnL,
  calculateCommission,
  calculateSlippage,
  calculatePositionSize,
  calculatePerformanceMetrics,
  validateOrder,
  isMarketOpen,
} from '@/lib/trading/calculations'

describe('Margin Calculations', () \=\> {
  it('should calculate correct margin for forex trade', () \=\> {
    const margin \= calculateMargin('EURUSD', 1, 1.1, 30\)
    expect(margin).toBeCloseTo(3666.67, 2\)
  })

  it('should calculate correct margin for gold trade', () \=\> {
    const margin \= calculateMargin('XAUUSD', 1, 2000, 20\)
    expect(margin).toBeCloseTo(10000, 2\)
  })

  it('should use more restrictive leverage', () \=\> {
    // Asset allows 30x, user has 50x \-\> should use 30x
    const margin1 \= calculateMargin('EURUSD', 1, 1.1, 50\)
    const margin2 \= calculateMargin('EURUSD', 1, 1.1, 30\)
    expect(margin1).toBe(margin2)
  })
})

describe('P\&L Calculations', () \=\> {
  it('should calculate correct unrealized P\&L for long forex position', () \=\> {
    const pnl \= calculateUnrealizedPnL('EURUSD', 1.1, 1.11, 1, 'long')
    expect(pnl).toBeCloseTo(1000, 2\) // 0.01 \* 100,000 \= 1000
  })

  it('should calculate correct unrealized P\&L for short forex position', () \=\> {
    const pnl \= calculateUnrealizedPnL('EURUSD', 1.1, 1.11, 1, 'short')
    expect(pnl).toBeCloseTo(-1000, 2\)
  })

  it('should calculate correct P\&L for gold position', () \=\> {
    const pnl \= calculateUnrealizedPnL('XAUUSD', 2000, 2010, 1, 'long')
    expect(pnl).toBeCloseTo(1000, 2\) // 10 \* 100 \= 1000
  })

  it('should calculate correct P\&L for stock position', () \=\> {
    const pnl \= calculateUnrealizedPnL('AAPL', 150, 160, 10, 'long')
    expect(pnl).toBeCloseTo(100, 2\) // 10 \* 10 \= 100
  })
})

describe('Commission Calculations', () \=\> {
  it('should calculate correct commission for forex trade', () \=\> {
    const commission \= calculateCommission('EURUSD', 1, 1.1)
    expect(commission).toBeCloseTo(11, 2\) // 110,000 \* 0.0001 \= 11
  })

  it('should calculate correct commission for stock trade', () \=\> {
    const commission \= calculateCommission('AAPL', 10, 150\)
    expect(commission).toBeCloseTo(0.75, 2\) // 1500 \* 0.0005 \= 0.75
  })
})

describe('Slippage Calculations', () \=\> {
  it('should calculate higher slippage for crypto than forex', () \=\> {
    const forexSlippage \= calculateSlippage('EURUSD', 1, 'buy')
    const cryptoSlippage \= calculateSlippage('BTCUSD', 1, 'buy')
    expect(Math.abs(cryptoSlippage)).toBeGreaterThan(Math.abs(forexSlippage))
  })

  it('should increase slippage with order size', () \=\> {
    const smallOrderSlippage \= calculateSlippage('EURUSD', 1, 'buy')
    const largeOrderSlippage \= calculateSlippage('EURUSD', 100, 'buy')
    expect(Math.abs(largeOrderSlippage)).toBeGreaterThan(Math.abs(smallOrderSlippage))
  })

  it('should apply correct direction to slippage', () \=\> {
    const buySlippage \= calculateSlippage('EURUSD', 1, 'buy')
    const sellSlippage \= calculateSlippage('EURUSD', 1, 'sell')
    expect(buySlippage).toBeGreaterThan(0)
    expect(sellSlippage).toBeLessThan(0)
  })
})

describe('Position Sizing', () \=\> {
  it('should calculate position size based on risk', () \=\> {
    const result \= calculatePositionSize(
      'EURUSD',
      10000, // balance
      2, // 2% risk
      1.1, // entry
      1.09, // stop loss
      1.12, // take profit
      30 // leverage
    )

    expect(result.risk\_amount).toBeCloseTo(200, 0\) // 2% of 10,000
    expect(result.quantity).toBeGreaterThan(0)
    expect(result.risk\_reward\_ratio).toBeCloseTo(2, 1\) // TP is 2x SL distance
  })

  it('should respect minimum quantity limits', () \=\> {
    const result \= calculatePositionSize(
      'EURUSD',
      100, // small balance
      2,
      1.1,
      1.09,
      1.12,
      30
    )

    expect(result.quantity).toBeGreaterThanOrEqual(0.01) // Min quantity for EURUSD
  })

  it('should respect maximum quantity limits', () \=\> {
    const result \= calculatePositionSize(
      'EURUSD',
      1000000, // large balance
      10, // high risk
      1.1,
      1.099, // very tight stop
      1.12,
      30
    )

    expect(result.quantity).toBeLessThanOrEqual(100) // Max quantity for EURUSD
  })
})

describe('Performance Metrics', () \=\> {
  it('should calculate correct win rate', () \=\> {
    const trades \= \[
      { pnl: 100, commission: 1, swap: 0 },
      { pnl: \-50, commission: 1, swap: 0 },
      { pnl: 200, commission: 1, swap: 0 },
      { pnl: \-30, commission: 1, swap: 0 },
    \]

    const metrics \= calculatePerformanceMetrics(trades, 10000\)
    expect(metrics.win\_rate).toBe(50)
    expect(metrics.winning\_trades).toBe(2)
    expect(metrics.losing\_trades).toBe(2)
  })

  it('should calculate correct profit factor', () \=\> {
    const trades \= \[
      { pnl: 100, commission: 0, swap: 0 },
      { pnl: 100, commission: 0, swap: 0 },
      { pnl: \-50, commission: 0, swap: 0 },
    \]

    const metrics \= calculatePerformanceMetrics(trades, 10000\)
    expect(metrics.profit\_factor).toBeCloseTo(4, 1\) // 200 / 50 \= 4
  })

  it('should calculate correct drawdown', () \=\> {
    const trades \= \[
      { pnl: 100, commission: 0, swap: 0 },
      { pnl: \-200, commission: 0, swap: 0 },
      { pnl: \-100, commission: 0, swap: 0 },
      { pnl: 300, commission: 0, swap: 0 },
    \]

    const metrics \= calculatePerformanceMetrics(trades, 10000\)
    expect(metrics.max\_drawdown).toBeCloseTo(300, 0\)
  })
})

describe('Order Validation', () \=\> {
  it('should validate correct order', () \=\> {
    const result \= validateOrder('EURUSD', 1, 1.1, 'market')
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should reject order with invalid symbol', () \=\> {
    const result \= validateOrder('INVALID', 1, 1.1, 'market')
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Unknown symbol: INVALID')
  })

  it('should reject order below minimum quantity', () \=\> {
    const result \= validateOrder('EURUSD', 0.001, 1.1, 'market')
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) \=\> e.includes('Minimum quantity'))).toBe(true)
  })

  it('should reject order above maximum quantity', () \=\> {
    const result \= validateOrder('EURUSD', 1000, 1.1, 'market')
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) \=\> e.includes('Maximum quantity'))).toBe(true)
  })

  it('should reject price not multiple of tick size', () \=\> {
    const result \= validateOrder('EURUSD', 1, 1.10001, 'limit')
    expect(result.valid).toBe(false)
    expect(result.errors.some((e) \=\> e.includes('multiple of'))).toBe(true)
  })
})

describe('Market Status', () \=\> {
  it('should return true for crypto markets (24/7)', () \=\> {
    expect(isMarketOpen('BTCUSD')).toBe(true)
  })

  it('should handle forex market hours', () \=\> {
    const isOpen \= isMarketOpen('EURUSD')
    expect(typeof isOpen).toBe('boolean')
  })
})

---

### **tests/integration/order-execution.test.ts**

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createClient } from '@supabase/supabase-js'

const supabase \= createClient(
  process.env.SUPABASE\_URL\!,
  process.env.SUPABASE\_SERVICE\_ROLE\_KEY\!
)

describe('Order Execution Integration', () \=\> {
  let testUserId: string

  beforeEach(async () \=\> {
    // Create test user
    const { data, error } \= await supabase.auth.admin.createUser({
      email: \`test-${Date.now()}@example.com\`,
      password: 'Test123\!@\#',
      email\_confirm: true,
    })

    if (error) throw error
    testUserId \= data.user.id

    // Set up test profile
    await supabase.from('profiles').insert({
      id: testUserId,
      email: data.user.email\!,
      balance: 10000,
      equity: 10000,
      free\_margin: 10000,
      kyc\_status: 'approved',
      account\_status: 'active',
    })
  })

  afterEach(async () \=\> {
    // Clean up test data
    await supabase.from('profiles').delete().eq('id', testUserId)
    await supabase.auth.admin.deleteUser(testUserId)
  })

  it('should execute market order successfully', async () \=\> {
    const { data, error } \= await supabase.functions.invoke('execute-order', {
      body: {
        order: {
          symbol: 'EURUSD',
          order\_type: 'market',
          side: 'buy',
          quantity: 1,
          idempotency\_key: \`test\_${Date.now()}\`,
        },
      },
      headers: {
        Authorization: \`Bearer ${process.env.SUPABASE\_SERVICE\_ROLE\_KEY}\`,
      },
    })

    expect(error).toBeNull()
    expect(data).toHaveProperty('order\_id')
    expect(data).toHaveProperty('position\_id')
    expect(data).toHaveProperty('fill\_price')
  })

  it('should reject order with insufficient margin', async () \=\> {
    // Set very low balance
    await supabase
      .from('profiles')
      .update({ balance: 10, equity: 10, free\_margin: 10 })
      .eq('id', testUserId)

    const { data, error } \= await supabase.functions.invoke('execute-order', {
      body: {
        order: {
          symbol: 'EURUSD',
          order\_type: 'market',
          side: 'buy',
          quantity: 100, // Large quantity
          idempotency\_key: \`test\_${Date.now()}\`,
        },
      },
    })

    expect(error).not.toBeNull()
    expect(error?.message).toContain('Insufficient margin')
  })

  it('should prevent duplicate orders with same idempotency key', async () \=\> {
    const idempotencyKey \= \`test\_${Date.now()}\`

    // First order
    await supabase.functions.invoke('execute-order', {
      body: {
        order: {
          symbol: 'EURUSD',
          order\_type: 'market',
          side: 'buy',
          quantity: 1,
          idempotency\_key: idempotencyKey,
        },
      },
    })

    // Second order with same key
    const { data } \= await supabase.functions.invoke('execute-order', {
      body: {
        order: {
          symbol: 'EURUSD',
          order\_type: 'market',
          side: 'buy',
          quantity: 1,
          idempotency\_key: idempotencyKey,
        },
      },
    })

    expect(data.message).toContain('already exists')
  })

  it('should update user equity after opening position', async () \=\> {
    await supabase.functions.invoke('execute-order', {
      body: {
        order: {
          symbol: 'EURUSD',
          order\_type: 'market',
          side: 'buy',
          quantity: 1,
          idempotency\_key: \`test\_${Date.now()}\`,
        },
      },
    })

    const { data: profile } \= await supabase
      .from('profiles')
      .select('margin\_used, free\_margin')
      .eq('id', testUserId)
      .single()

    expect(profile?.margin\_used).toBeGreaterThan(0)
    expect(profile?.free\_margin).toBeLessThan(10000)
  })

  it('should create ledger entry for commission', async () \=\> {
    await supabase.functions.invoke('execute-order', {
      body: {
        order: {
          symbol: 'EURUSD',
          order\_type: 'market',
          side: 'buy',
          quantity: 1,
          idempotency\_key: \`test\_${Date.now()}\`,
        },
      },
    })

    const { data: ledgerEntries } \= await supabase
      .from('ledger')
      .select('\*')
      .eq('user\_id', testUserId)
      .eq('transaction\_type', 'commission')

    expect(ledgerEntries).toHaveLength(1)
    expect(ledgerEntries\!\[0\].amount).toBeLessThan(0)
  })
})

---

### **tests/e2e/trading-flow.spec.ts**

import { test, expect } from '@playwright/test'

test.describe('Complete Trading Flow', () \=\> {
  test.beforeEach(async ({ page }) \=\> {
    await page.goto('http://localhost:5173')
  })

  test('user can sign up, complete KYC, and place trade', async ({ page }) \=\> {
    const email \= \`test-${Date.now()}@example.com\`
    const password \= 'Test123\!@\#'

    // Step 1: Sign up
    await page.click('text=Sign Up')
    await page.fill('input\[name="email"\]', email)
    await page.fill('input\[name="password"\]', password)
    await page.fill('input\[name="confirmPassword"\]', password)
    await page.click('button\[type="submit"\]')

    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/.\*dashboard/)

    // Step 2: Complete KYC \- Personal Info
    await page.click('text=Complete KYC')
    await page.fill('input\[name="full\_name"\]', 'Test User')
    await page.fill('input\[name="date\_of\_birth"\]', '1990-01-01')
    await page.selectOption('select\[name="country"\]', 'GB')
    await page.fill('input\[name="address"\]', '123 Test Street')
    await page.fill('input\[name="city"\]', 'London')
    await page.fill('input\[name="postal\_code"\]', 'SW1A 1AA')
    await page.fill('input\[name="phone"\]', '+44 20 1234 5678')
    await page.click('button:has-text("Continue")')

    // Step 3: Document Upload (skip for E2E test)
    // In real test, would upload actual files
    await page.click('text=Skip for now')

    // Step 4: Navigate to trading page
    await page.click('text=Trade')
    await expect(page).toHaveURL(/.\*trade/)

    // Step 5: Place a market order
    await page.selectOption('select\[name="symbol"\]', 'EURUSD')
    await page.fill('input\[name="quantity"\]', '1')
    await page.click('button:has-text("Buy")')

    // Wait for success notification
    await expect(page.locator('.toast')).toContainText('Order placed successfully')

    // Step 6: Verify position appears
    await expect(page.locator('table')).toContainText('EURUSD')
    await expect(page.locator('table')).toContainText('1')
  })

  test('user cannot trade without KYC approval', async ({ page }) \=\> {
    // Log in with user that doesn't have KYC approved
    await page.click('text=Log In')
    await page.fill('input\[name="email"\]', 'nokyc@example.com')
    await page.fill('input\[name="password"\]', 'Test123\!@\#')
    await page.click('button\[type="submit"\]')

    // Try to access trading page
    await page.goto('/trade')

    // Should be redirected to KYC page
    await expect(page).toHaveURL(/.\*kyc/)
    await expect(page).toContainText('Complete verification')
  })

  test('user can close position', async ({ page }) \=\> {
    // Assuming user is logged in with open position
    await page.goto('/portfolio')

    // Find and click close button
    await page.click('button:has-text("Close Position")').first()

    // Confirm close
    await page.click('button:has-text("Confirm")')

    // Wait for success
    await expect(page.locator('.toast')).toContainText('Position closed')

    // Verify position removed from table
    await expect(page.locator('table')).not.toContainText('Open')
  })
})

---

### **tests/load/k6-order-load.js**

import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'

const errorRate \= new Rate('errors')

export const options \= {
  stages: \[
    { duration: '1m', target: 10 }, // Ramp up to 10 users
    { duration: '3m', target: 50 }, // Stay at 50 users
    { duration: '1m', target: 100 }, // Spike to 100
    { duration: '2m', target: 50 }, // Back to 50
    { duration: '1m', target: 0 }, // Ramp down
  \],
  thresholds: {
    http\_req\_duration: \['p(95)\<500'\], // 95% of requests under 500ms
    http\_req\_failed: \['rate\<0.01'\], // Error rate under 1%
    errors: \['rate\<0.01'\],
  },
}

const BASE\_URL \= \_\_ENV.BASE\_URL || 'http://localhost:54321/functions/v1'
const API\_KEY \= \_\_ENV.SUPABASE\_ANON\_KEY

export default function () const headers \= {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer ${API\_KEY}\`,
    'apikey': API\_KEY,
  }

  // Test 1: Place market order
  const orderPayload \= JSON.stringify({
    order: {
      symbol: 'EURUSD',
      order\_type: 'market',
      side: 'buy',
      quantity: 1,
      idempotency\_key: \`load\_test\_${\_\_VU}\_${\_\_ITER}\_${Date.now()}\`,
    },
  })

  const orderResponse \= http.post(
    \`${BASE\_URL}/execute-order\`,
    orderPayload,
    { headers }
  )

  check(orderResponse, {
    'order status is 200': (r) \=\> r.status \=== 200,
    'order response time \< 500ms': (r) \=\> r.timings.duration \< 500,
    'order has order\_id': (r) \=\> {
      try {
        const body \= JSON.parse(r.body)
        return body.data && body.data.order\_id
      } catch {
        return false
      }
    },
  }) || errorRate.add(1)

  sleep(1)

  // Test 2: Fetch positions
  const positionsResponse \= http.get(
    \`${BASE\_URL}/get-positions\`,
    { headers }
  )

  check(positionsResponse, {
    'positions status is 200': (r) \=\> r.status \=== 200,
    'positions response time \< 200ms': (r) \=\> r.timings.duration \< 200,
  }) || errorRate.add(1)

  sleep(1)

  // Test 3: Get market data
  const marketDataPayload \= JSON.stringify({
    symbols: \['EURUSD', 'GBPUSD', 'XAUUSD'\],
  })

  const marketDataResponse \= http.post(
    \`${BASE\_URL}/market-data\`,
    marketDataPayload,
    { headers }
  )

  check(marketDataResponse, {
    'market data status is 200': (r) \=\> r.status \=== 200,
    'market data response time \< 300ms': (r) \=\> r.timings.duration \< 300,
    'market data has prices': (r) \=\> {
      try {
        const body \= JSON.parse(r.body)
        return body.data && Object.keys(body.data).length \> 0
      } catch {
        return false
      }
    },
  }) || errorRate.add(1)

  sleep(2)
}

export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  }
}

---

## **9\. Deployment Guide**

### **deployment/vercel.json**

{
  "version": 2,
  "env": {
    "VITE\_SUPABASE\_URL": "@supabase-url",
    "VITE\_SUPABASE\_ANON\_KEY": "@supabase-anon-key",
    "VITE\_SENTRY\_DSN": "@sentry-dsn",
    "VITE\_FINNHUB\_API\_KEY": "@finnhub-api-key"
  },
  "build": {
    "env": {
      "NODE\_VERSION": "18"
    }
  },
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "headers": \[
    {
      "source": "/api/(.\*)",
      "headers": \[
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://tradepro.vercel.app"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      \]
    }
  \],
  "rewrites": \[
    {
      "source": "/api/:path\*",
      "destination": "https://YOUR\_PROJECT.supabase.co/functions/v1/:path\*"
    }
  \]
}

---

### **deployment/.env.example**

\# Supabase
SUPABASE\_URL=https://xxxxx.supabase.co
SUPABASE\_ANON\_KEY=eyJhbGc...
SUPABASE\_SERVICE\_ROLE\_KEY=eyJhbGc...

\# Market Data
FINNHUB\_API\_KEY=your\_finnhub\_key

\# Sentry
SENTRY\_DSN=https://xxxxx@sentry.io/xxxxx

\# App
VITE\_APP\_URL=https://tradepro.vercel.app
VITE\_APP\_ENV=production

\# Admin
ADMIN\_EMAIL=admin@tradepro.com

---

### **deployment/supabase-deploy.sh**

\#\!/bin/bash

\# TradePro Supabase Deployment Script

set \-e

echo "🚀 Starting TradePro Supabase Deployment..."

\# Check if Supabase CLI is installed
if \! command \-v supabase &\> /dev/null; then
    echo "❌ Supabase CLI not found. Install it first:"
    echo "   npm install \-g supabase"
    exit 1
fi

\# Check if logged in
if \! supabase projects list &\> /dev/null; then
    echo "❌ Not logged in to Supabase. Run: supabase login"
    exit 1
fi

\# Link to project
echo "📎 Linking to Supabase project..."
supabase link \--project-ref $SUPABASE\_PROJECT\_REF

\# Run migrations
echo "🗄️  Running database migrations..."
supabase db push

\# Deploy Edge Functions
echo "⚡ Deploying Edge Functions..."

FUNCTIONS=(
  "execute-order"
  "close-position"
  "market-data"
  "update-positions"
)

for func in "${FUNCTIONS\[@\]}"; do
  echo "  Deploying $func..."
  supabase functions deploy $func \--no-verify-jwt
done

\# Set function secrets
echo "🔐 Setting function secrets..."
supabase secrets set \\
  FINNHUB\_API\_KEY=$FINNHUB\_API\_KEY \\
  SENTRY\_DSN=$SENTRY\_DSN

\# Enable Realtime
echo "📡 Enabling Realtime for tables..."
supabase db remote \--db-url "$DATABASE\_URL" \<\<EOF
alter publication supabase\_realtime add table positions;
alter publication supabase\_realtime add table orders;
alter publication supabase\_realtime add table notifications;
EOF

\# Setup storage buckets
echo "🗂️  Setting up storage buckets..."
supabase storage create-bucket kyc-documents \--public false

\# Set storage policies
supabase db remote \--db-url "$DATABASE\_URL" \<\<EOF
create policy "Users can upload own KYC documents"
on storage.objects for insert
with check (
  bucket\_id \= 'kyc-documents' and
  auth.uid()::text \= (storage.foldername(name))\[1\]
);

create policy "Users can view own KYC documents"
on storage.objects for select
using (
  bucket\_id \= 'kyc-documents' and
  auth.uid()::text \= (storage.foldername(name))\[1\]
);

create policy "Admins can view all KYC documents"
on storage.objects for select
using (
  bucket\_id \= 'kyc-documents' and
  auth.jwt() \-\>\> 'role' \= 'admin'
);
EOF

\# Schedule cron jobs
echo "⏰ Setting up cron jobs..."
supabase db remote \--db-url "$DATABASE\_URL" \<\<EOF
select cron.schedule('update-positions', '\*/10 \* \* \* \* \*', 'select update\_positions()');
select cron.schedule('cancel-expired-orders', '\* \* \* \* \*', 'select cancel\_expired\_orders()');
select cron.schedule('margin-call-check', '\*/30 \* \* \* \* \*', 'select check\_margin\_call()');
select cron.schedule('nightly-swaps', '0 0 \* \* \*', 'select apply\_nightly\_swaps()');
select cron.schedule('check-price-alerts', '\* \* \* \* \*', 'select check\_price\_alerts()');
select cron.schedule('cleanup-sessions', '0 \* \* \* \*', 'select cleanup\_expired\_sessions()');
EOF

echo "✅ Supabase deployment complete\!"
echo ""
echo "📋 Next steps:"
echo "  1\. Update Vercel environment variables"
echo "  2\. Deploy frontend: npm run deploy"
echo "  3\. Run smoke tests: npm run test:e2e"
echo "  4\. Monitor logs: supabase functions logs"

---

### **deployment/vercel-deploy.sh**

\#\!/bin/bash

\# TradePro Vercel Deployment Script

set \-e

echo "🚀 Starting TradePro Vercel Deployment..."

\# Check if Vercel CLI is installed
if \! command \-v vercel &\> /dev/null; then
    echo "❌ Vercel CLI not found. Install it first:"
    echo "   npm install \-g vercel"
    exit 1
fi

\# Build the project
echo "🔨 Building project..."
npm run build

\# Run tests
echo "🧪 Running tests..."
npm run test:unit

\# Deploy to Vercel
echo "📤 Deploying to Vercel..."
if \[ "$1" \== "production" \]; then
    echo "  Deploying to PRODUCTION..."
    vercel \--prod
else
    echo "  Deploying to PREVIEW..."
    vercel
fi

echo "✅ Vercel deployment complete\!"

---

### **deployment/pre-launch-checklist.md**

\# TradePro Pre-Launch Checklist

\#\# 🔐 Security

\- \[ \] All RLS policies enabled and tested
\- \[ \] Service role key secured (not exposed in frontend)
\- \[ \] CORS configured correctly
\- \[ \] Rate limiting enabled
\- \[ \] SQL injection prevention verified
\- \[ \] XSS prevention verified
\- \[ \] CSRF protection enabled
\- \[ \] Secure password requirements enforced
\- \[ \] Session timeout configured (24 hours)
\- \[ \] JWT expiry configured (1 hour)
\- \[ \] Admin role properly restricted
\- \[ \] KYC documents encrypted at rest
\- \[ \] Signed URLs expiring correctly (15 min)

\#\# 📊 Database

\- \[ \] All migrations applied successfully
\- \[ \] Indexes created for performance
\- \[ \] Triggers tested and working
\- \[ \] Backup schedule configured (daily)
\- \[ \] Point-in-time recovery enabled
\- \[ \] Connection pooling configured
\- \[ \] Database size monitoring enabled
\- \[ \] Slow query monitoring enabled

\#\# ⚙️ Edge Functions

\- \[ \] All functions deployed
\- \[ \] Function secrets configured
\- \[ \] Error handling tested
\- \[ \] Timeout handling tested
\- \[ \] Idempotency verified
\- \[ \] Sentry integration working
\- \[ \] Function logs accessible
\- \[ \] Cold start performance acceptable

\#\# 🎨 Frontend

\- \[ \] Environment variables set
\- \[ \] Build optimization verified
\- \[ \] Bundle size acceptable (\<500KB)
\- \[ \] Lighthouse score \>90
\- \[ \] Mobile responsive
\- \[ \] Cross-browser tested (Chrome, Firefox, Safari, Edge)
\- \[ \] Error boundaries implemented
\- \[ \] Loading states implemented
\- \[ \] Accessibility tested (WCAG 2.1 AA)
\- \[ \] SEO meta tags configured

\#\# 💰 Trading Logic

\- \[ \] Margin calculations verified
\- \[ \] P\&L calculations verified
\- \[ \] Commission calculations verified
\- \[ \] Slippage simulation verified
\- \[ \] Stop loss/take profit working
\- \[ \] Margin call trigger tested
\- \[ \] Auto-liquidation tested
\- \[ \] FIFO lot tracking working
\- \[ \] Swap rate application verified
\- \[ \] OCO orders working
\- \[ \] Order rejection cases handled

\#\# 📡 Real-time Updates

\- \[ \] Position updates broadcasting
\- \[ \] Order updates broadcasting
\- \[ \] Price feed updates working
\- \[ \] Notification delivery working
\- \[ \] Connection recovery working
\- \[ \] Maximum connections tested

\#\# 🧪 Testing

\- \[ \] Unit tests passing (100%)
\- \[ \] Integration tests passing
\- \[ \] E2E tests passing
\- \[ \] Load tests passing (p95 \<500ms)
\- \[ \] Stress tests completed
\- \[ \] Security tests completed
\- \[ \] Penetration testing completed

\#\# 📈 Monitoring

\- \[ \] Sentry error tracking configured
\- \[ \] Performance monitoring enabled
\- \[ \] Database monitoring enabled
\- \[ \] Function monitoring enabled
\- \[ \] Uptime monitoring configured
\- \[ \] Alert rules configured
\- \[ \] Dashboard created
\- \[ \] Log retention configured (30 days)

\#\# 🔄 DevOps

\- \[ \] Staging environment working
\- \[ \] Production environment configured
\- \[ \] CI/CD pipeline working
\- \[ \] Automated deployments tested
\- \[ \] Rollback procedure tested
\- \[ \] Health check endpoint working
\- \[ \] Status page configured

\#\# 📱 Features

\- \[ \] User registration working
\- \[ \] Email verification working
\- \[ \] Password reset working
\- \[ \] KYC flow complete
\- \[ \] Order placement working
\- \[ \] Position management working
\- \[ \] Portfolio view accurate
\- \[ \] Analytics dashboard working
\- \[ \] Copy trading working
\- \[ \] Backtester working
\- \[ \] Notifications working
\- \[ \] Admin panel working

\#\# 📄 Legal & Compliance

\- \[ \] Terms of Service published
\- \[ \] Privacy Policy published
\- \[ \] Risk Disclosure published
\- \[ \] AML Policy published
\- \[ \] Cookie consent banner
\- \[ \] GDPR compliance verified
\- \[ \] Geo-restrictions configured
\- \[ \] Age verification (18+)
\- \[ \] Data retention policy documented

\#\# 📞 Support

\- \[ \] Help documentation published
\- \[ \] FAQ page created
\- \[ \] Contact form working
\- \[ \] Support email configured
\- \[ \] Response time SLA defined

\#\# 🚀 Launch

\- \[ \] DNS configured
\- \[ \] SSL certificate active
\- \[ \] CDN configured
\- \[ \] Domain redirects working
\- \[ \] Analytics configured (Google Analytics)
\- \[ \] Marketing pixels installed
\- \[ \] Social media accounts created
\- \[ \] Launch announcement prepared
\- \[ \] Press release prepared
\- \[ \] Support team trained

---

### **deployment/monitoring-setup.md**

\# TradePro Monitoring Setup

\#\# Sentry Configuration

\#\#\# Frontend Setup
\`\`\`typescript
// src/lib/sentry.ts
import \* as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

Sentry.init({
  dsn: import.meta.env.VITE\_SENTRY\_DSN,
  integrations: \[
    new BrowserTracing(),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  \],
  tracesSampleRate: 0.1, // 10% in production
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  environment: import.meta.env.VITE\_APP\_ENV,
  beforeSend(event, hint) {
    // Don't send PII
    if (event.user) {
      delete event.user.email
      delete event.user.ip\_address
    }
    return event
  },
})

### **Alert Rules**

**Critical Alerts** (Slack \+ Email \+ PagerDuty)

* Error rate \> 1% (5 min window)
* API p95 latency \> 1000ms
* Database connection failures
* Edge Function failures \> 5%
* Margin call system failure
* Order execution failures \> 1%

**Warning Alerts** (Slack \+ Email)

* Error rate \> 0.5%
* API p95 latency \> 500ms
* Realtime disconnections \> 10%
* Slow database queries (\>1s)
* KYC upload failures
* Copy trading sync failures

## **Supabase Monitoring**

### **Key Metrics to Track**

* Database size (alert at 80% quota)
* Active connections
* Query performance
* API request rate
* Storage usage
* Realtime connections

### **Log Retention**

* Production: 30 days
* Staging: 7 days

## **Custom Metrics**

### **Trading Metrics Dashboard**

\-- Daily active traders
select count(distinct user\_id)
from orders
where created\_at \> now() \- interval '1 day';

\-- Total volume today
select
  sum(quantity \* fill\_price) as volume
from fills
where executed\_at \> current\_date;

\-- Average order execution time
select
  avg(filled\_at \- created\_at) as avg\_execution\_time
from orders
where filled\_at is not null
  and created\_at \> now() \- interval '1 hour';

\-- Active positions
select count(\*)
from positions
where status \= 'open';

\-- Users near margin call
select count(\*)
from profiles
where margin\_level \< 100
  and margin\_level \> 0;

### **System Health Checks**

**Endpoint:** `/api/health`

{
  status: 'healthy' | 'degraded' | 'unhealthy',
  checks: {
    database: boolean,
    storage: boolean,
    edge\_functions: boolean,
    market\_data\_api: boolean,
    realtime: boolean
  },
  timestamp: string
}

**Monitoring Frequency:** Every 60 seconds

## **Incident Response**

### **Severity Levels**

**P0 \- Critical** (Immediate response)

* Complete system outage
* Data breach
* Order execution completely broken
* Mass margin calls incorrectly triggered

**P1 \- High** (Response within 1 hour)

* Partial system outage
* Order execution delayed \>5 min
* Market data feed down
* KYC system broken

**P2 \- Medium** (Response within 4 hours)

* Performance degradation
* Non-critical feature broken
* Elevated error rates

**P3 \- Low** (Response within 24 hours)

* Minor bugs
* UI issues
* Documentation errors

### **Incident Response Procedure**

1. Acknowledge alert
2. Assess severity
3. Notify team (Slack \#incidents)
4. Investigate root cause
5. Implement fix or rollback
6. Verify resolution
7. Post-mortem (P0/P1 only)
8. Update runbook

\---

\#\# 10\. AI Prompt Pack

\#\#\# \*\*Complete Feature Generation Prompts\*\*

\#\#\#\# \*\*Prompt 1: Database Schema Generation\*\*

Generate the complete Supabase PostgreSQL database schema for TradePro, a multi-asset CFD paper trading platform. Include:

1. All core tables: profiles, orders, positions, fills, order\_lots, ledger, swap\_rates, corporate\_actions, kyc\_documents, copy\_relationships, price\_alerts, market\_status, ohlc\_cache, backtest\_results, margin\_calls, sessions, audit\_logs, notifications

2. For each table:

   * All columns with correct data types (use numeric for money/prices)
   * Primary keys and foreign keys
   * Check constraints for data validation
   * Default values where appropriate
   * NOT NULL constraints
3. Indexes for:

   * Foreign keys
   * Frequently queried columns (user\_id, status, timestamps)
   * Composite indexes for common query patterns
4. Row Level Security (RLS):

   * Enable RLS on all sensitive tables
   * Policies for user access (users can only see their own data)
   * Policies for admin access (admins can see all data)
   * Policies for copy trading (followers can see leader stats)
5. Database triggers:

   * Auto-update timestamps
   * Calculate user equity on position changes
   * Prevent negative balances
   * Audit logging for sensitive operations
   * OCO order cancellation
   * Stop loss/take profit automation
6. Stored procedures:

   * execute\_order\_atomic (atomic order execution with transaction)
   * update\_balance (update balance with ledger entry)

Use the TradePro v10 specification as reference. Output as SQL migration files.

\---

\#\#\#\# \*\*Prompt 2: Edge Functions \- Order Execution\*\*

Generate a complete Supabase Edge Function in TypeScript for executing trading orders with these requirements:

Function: execute-order

Features:

1. Request validation (symbol, quantity, price, order\_type, side)
2. User authentication check
3. KYC status verification (must be 'approved')
4. Account status check (must be 'active')
5. Idempotency check (prevent duplicate orders)
6. Asset configuration lookup (contract size, tick size, min/max quantities)
7. Market status verification (check if market is open)
8. Current price fetching (Finnhub API with fallback to yfinance and cache)
9. Slippage calculation for market orders
10. Margin requirement calculation
11. Margin availability check
12. Commission calculation
13. Atomic transaction execution via stored procedure
14. Error handling with specific error codes
15. Sentry integration for error tracking
16. CORS headers

Error scenarios to handle:

* Unauthorized
* KYC not approved
* Account suspended
* Invalid symbol
* Market closed
* Insufficient margin
* Duplicate order (idempotency)
* Invalid quantity/price
* API failures (graceful degradation)

Return format: { data: { order\_id: string position\_id: string fill\_price: number slippage: number commission: number status: string } }

Use the asset configurations from TradePro v10. Include comprehensive error handling.

\---

\#\#\#\# \*\*Prompt 3: React Trading Dashboard\*\*

Generate a complete React TypeScript trading dashboard component with these features:

Component Structure:

* TradingDashboard (main container)
  * TradingChart (TradingView Lightweight Charts)
  * MarketWatch (symbol list with prices)
  * OrderPanel (order entry form)
  * PositionsTable (open positions)
  * OrdersTable (pending/open orders)

Requirements:

1. Use ShadCN UI components for all UI elements
2. Use Zustand for state management
3. Real-time price updates via Supabase Realtime
4. Form validation with React Hook Form \+ Zod
5. Error handling with toast notifications (sonner)
6. Loading states for all async operations
7. Responsive design (mobile-friendly)
8. Dark theme
9. TypeScript strict mode

Features:

* Symbol selector with search
* Order type tabs (Market, Limit, Stop)
* Buy/Sell toggle buttons (green/red)
* Quantity input with validation
* Price input (for limit/stop orders)
* Stop loss and take profit inputs
* Real-time P\&L updates
* Position close button
* Order cancel button

State Management:

* selectedSymbol
* positions (array)
* orders (array)
* loading states
* error states

API Integration:

* placeOrder function
* closePosition function
* cancelOrder function
* Real-time subscriptions

Include all TypeScript types and proper error handling. Use TailwindCSS for styling.

\---

\#\#\#\# \*\*Prompt 4: Trading Calculations Library\*\*

Generate a comprehensive TypeScript trading calculations library with these functions:

File: src/lib/trading/calculations.ts

Requirements:

1. Use Decimal.js for all financial calculations (no floating point errors)
2. TypeScript strict mode
3. Comprehensive JSDoc comments
4. Unit testable (pure functions)

Asset Configuration: Create ASSET\_CONFIGS object with configs for:

* EURUSD, GBPUSD, USDJPY (forex)
* XAUUSD, XAGUSD (commodities)
* BTCUSD, ETHUSD (crypto)
* AAPL, TSLA (stocks)
* US30 (index)

Each config includes:

* symbol, name, asset\_class
* contract\_size, min\_quantity, max\_quantity, tick\_size
* trading\_hours (open, close, timezone, is\_24\_7)
* margin\_requirement, max\_leverage
* swap\_long, swap\_short, commission\_rate
* is\_tradable

Functions to implement:

1. calculateMargin(symbol, quantity, price, userLeverage): number
2. calculateUnrealizedPnL(symbol, entryPrice, currentPrice, quantity, side): number
3. calculateRealizedPnL(symbol, entryPrice, exitPrice, quantity, side): number
4. calculateCommission(symbol, quantity, price): number
5. calculateSwap(symbol, quantity, price, side, daysHeld): number
6. calculateSlippage(symbol, quantity, orderSide): number
7. calculatePositionSize(symbol, balance, riskPercent, entry, stopLoss, takeProfit, leverage): PositionSizeResult
8. calculatePerformanceMetrics(trades, initialBalance): PerformanceMetrics
9. validateOrder(symbol, quantity, price, orderType): ValidationResult
10. isMarketOpen(symbol): boolean

Include proper error handling and validation. Use the formulas from TradePro v10 specification.

\---

\#\#\#\# \*\*Prompt 5: KYC Multi-Step Wizard\*\*

Generate a complete KYC verification wizard component in React TypeScript with these requirements:

Component: KYCWizard

Steps:

1. Personal Information
2. Document Upload
3. Selfie Verification
4. Risk Assessment Quiz

Requirements:

1. Use React Hook Form for form management
2. Zod schemas for validation
3. Progress bar showing current step
4. Step navigation (next/previous)
5. Data persistence between steps
6. ShadCN UI components
7. File upload with drag-and-drop
8. Webcam integration for selfie
9. Supabase Storage for document uploads
10. Signed URLs for security (15 min expiry)

Step 1 \- Personal Information: Fields: full\_name, date\_of\_birth (18+ validation), country (select), address, city, postal\_code, phone Validation: All required, proper formats On submit: Update profiles table, set kyc\_status \= 'pending\_documents'

Step 2 \- Document Upload: Types: ID front, ID back, Proof of address Validation:

* Max 5MB per file
* Accept: JPEG, PNG, PDF
* Virus scanning (ClamAV if possible) Storage: Upload to Supabase Storage bucket 'kyc-documents' Security: User-specific folders, RLS policies

Step 3 \- Selfie Verification:

* Webcam access
* Photo capture
* Upload to storage
* Compare with ID (manual review)

Step 4 \- Risk Assessment: Questions:

1. Trading experience (None, 1-2 years, 3-5 years, 5+ years)
2. Loss tolerance (0-5%, 5-10%, 10-20%, 20%+)
3. Investment goal (Preservation, Income, Growth, Speculation)

Calculate risk profile: conservative, moderate, aggressive, very\_aggressive On complete: Update profiles, set kyc\_status \= 'pending\_review', show success message

Include proper error handling and loading states. Use TypeScript interfaces for all data types.

\---

\#\#\#\# \*\*Prompt 6: Admin Dashboard \- KYC Review Panel\*\*

Generate an admin dashboard KYC review panel component in React TypeScript:

Component: AdminKYCReview

Features:

1. List of pending KYC applications
2. Filter by status (pending, approved, rejected)
3. Sort by submission date
4. View application details
5. View uploaded documents (with signed URLs)
6. Approve/reject actions
7. Add review notes
8. Request more information
9. Real-time updates
10. Audit trail

Layout:

* Sidebar: Application list with user info
* Main panel: Selected application details
* Document viewer: Display uploaded files
* Action buttons: Approve, Reject, Request More Info

Data Structure:

interface KYCApplication {
  user\_id: string
  profile: Profile
  documents: KYCDocument\[\]
  status: KYCStatus
  submitted\_at: string
}

API Functions:

* fetchPendingApplications(): Promise\<KYCApplication\[\]\>
* approveKYC(userId: string): Promise\<void\>
* rejectKYC(userId: string, reason: string): Promise\<void\>
* requestMoreInfo(userId: string, message: string): Promise\<void\>

Actions: Approve:

1. Update profiles.kyc\_status \= 'approved'
2. Update all kyc\_documents.status \= 'approved'
3. Send email notification
4. Create audit log entry

Reject:

1. Update profiles.kyc\_status \= 'rejected'
2. Set profiles.kyc\_rejection\_reason
3. Send email with reason
4. Create audit log entry

Security:

* Only accessible to admins (check auth.jwt() \-\>\> 'role' \= 'admin')
* All actions logged to audit\_logs table
* RLS policies enforce admin access

Include proper error handling, loading states, and confirmation dialogs. Use ShadCN UI components and TailwindCSS.

\---

\#\#\#\# \*\*Prompt 7: Error Handling System\*\*

Generate a comprehensive error handling system for TradePro in TypeScript:

File: src/lib/errors.ts

Requirements:

1. Error code enum with all possible errors
2. Custom error classes
3. User-friendly error messages
4. Error transformation utilities
5. Sentry integration

Error Categories:

* Authentication (UNAUTHORIZED, FORBIDDEN, TOKEN\_EXPIRED, INVALID\_CREDENTIALS)
* Validation (INVALID\_INPUT, VALIDATION\_ERROR, MISSING\_REQUIRED\_FIELD)
* Trading (INSUFFICIENT\_MARGIN, MARKET\_CLOSED, INVALID\_SYMBOL, POSITION\_NOT\_FOUND, etc.)
* Account (KYC\_NOT\_APPROVED, ACCOUNT\_SUSPENDED, INSUFFICIENT\_BALANCE)
* System (RATE\_LIMIT\_EXCEEDED, SERVICE\_UNAVAILABLE, SYSTEM\_ERROR, DATABASE\_ERROR)
* Geo-restriction (GEO\_RESTRICTED)

Classes to create:

1. AppError (base class with code, message, details, statusCode)
2. ValidationError (400)
3. AuthenticationError (401)
4. AuthorizationError (403)
5. NotFoundError (404)
6. TradingError (400)
7. RateLimitError (429)

Utilities:

1. handleError(error: unknown): AppError
2. getUserFriendlyErrorMessage(error: unknown): string
3. ERROR\_MESSAGES map (ErrorCode \-\> user-friendly message)

Integration:

* Sentry.captureException for all errors
* Context enrichment (user\_id, request\_id)
* PII filtering (remove email, IP)

Example usage:

try {
  await placeOrder(order)
} catch (error) {
  const appError \= handleError(error)
  toast.error(getUserFriendlyErrorMessage(appError))
  Sentry.captureException(appError)
}

Include TypeScript types for all error structures.

\---

\#\#\#\# \*\*Prompt 8: Testing Suite Setup\*\*

Generate a complete testing suite for TradePro with:

1. **Unit Tests** (Vitest) File: tests/unit/calculations.test.ts

Test cases for:

* calculateMargin (various assets, leverage scenarios)
* calculateUnrealizedPnL (long/short, profit/loss)
* calculateCommission (different asset classes)
* calculateSlippage (order size impact)
* calculatePositionSize (risk-based sizing)
* calculatePerformanceMetrics (win rate, profit factor, drawdown)
* validateOrder (validation rules)
* isMarketOpen (market hours)

Use describe/it blocks, expect assertions, test edge cases.

2. **Integration Tests** (Vitest \+ Supabase) File: tests/integration/order-execution.test.ts

Test scenarios:

* Execute market order successfully
* Reject order with insufficient margin
* Prevent duplicate orders (idempotency)
* Update user equity after order
* Create ledger entries
* Trigger margin call

Setup/teardown: Create test user, cleanup after tests

3. **E2E Tests** (Playwright) File: tests/e2e/trading-flow.spec.ts

User flows:

* Complete registration and KYC

\- Place market order and verify execution

\- Close position and verify P\&L

\- Cancel pending order

\- Verify margin call warning

\- Test copy trading flow

4\. \*\*Load Tests\*\* (k6)

File: tests/load/k6-order-load.js

Scenarios:

\- Ramp up to 100 concurrent users

\- Place orders at high rate

\- Fetch positions repeatedly

\- Get market data

\- Measure response times (p95 \< 500ms)

\- Error rate \< 1%

Configuration:

\`\`\`typescript

export const options \= {

  stages: \[

    { duration: '1m', target: 10 },

    { duration: '3m', target: 50 },

    { duration: '1m', target: 100 },

    { duration: '2m', target: 50 },

    { duration: '1m', target: 0 },

  \],

  thresholds: {

    http\_req\_duration: \['p(95)\<500'\],

    http\_req\_failed: \['rate\<0.01'\],

  },

}

5. **Test Configuration** File: vitest.config.ts

import { defineConfig } from 'vitest/config'

export default defineConfig({

  test: {

    globals: true,

    environment: 'jsdom',

    setupFiles: \['./tests/setup.ts'\],

    coverage: {

      provider: 'v8',

      reporter: \['text', 'json', 'html'\],

      exclude: \['node\_modules/', 'tests/'\],

    },

  },

})

6. **CI/CD Integration** File: .github/workflows/test.yml

name: Test Suite

on: \[push, pull\_request\]

jobs:

  test:

    runs-on: ubuntu-latest

    steps:

      \- uses: actions/checkout@v3

      \- uses: actions/setup-node@v3

        with:

          node-version: '18'

      \- run: npm ci

      \- run: npm run test:unit

      \- run: npm run test:integration

      \- run: npm run build

      \- name: E2E Tests

        uses: playwright-community/action@v1

        with:

          command: npm run test:e2e

Include all necessary test utilities, mocks, and fixtures. Use TypeScript for type safety.

\---

\#\#\#\# \*\*Prompt 9: Complete Deployment Setup\*\*

Generate complete deployment configuration for TradePro including:

1. **Vercel Configuration** File: vercel.json
* Environment variables setup
* Build configuration (Node 18\)
* Headers (CORS, security headers)
* Rewrites for API routes
* Framework: Vite
2. **Supabase Deployment Script** File: deployment/supabase-deploy.sh Steps:
* Check Supabase CLI installed
* Link to project
* Run database migrations
* Deploy all Edge Functions (execute-order, close-position, market-data, update-positions)
* Set function secrets (FINNHUB\_API\_KEY, SENTRY\_DSN)
* Enable Realtime for tables (positions, orders, notifications)
* Create storage buckets (kyc-documents)
* Set storage policies (RLS)
* Schedule cron jobs (update-positions every 10s, cancel-expired-orders every 1m, margin-call-check every 30s, nightly-swaps daily, check-price-alerts every 1m, cleanup-sessions hourly)
3. **Environment Variables** File: .env.example List all required environment variables:
* SUPABASE\_URL, SUPABASE\_ANON\_KEY, SUPABASE\_SERVICE\_ROLE\_KEY
* FINNHUB\_API\_KEY
* SENTRY\_DSN
* VITE\_APP\_URL, VITE\_APP\_ENV
* ADMIN\_EMAIL
4. **Pre-Launch Checklist** File: deployment/pre-launch-checklist.md Categories:
* Security (RLS, secrets, rate limiting, CORS)
* Database (migrations, indexes, backups)
* Edge Functions (deployed, tested, monitored)
* Frontend (build, optimization, accessibility)
* Trading Logic (calculations verified, margin calls tested)
* Real-time (subscriptions working)
* Testing (all tests passing)
* Monitoring (Sentry, alerts, dashboards)
* Legal (ToS, Privacy Policy, Risk Disclosure)
* Support (documentation, contact form)
5. **Monitoring Setup** File: deployment/monitoring-setup.md
* Sentry configuration (frontend \+ Edge Functions)
* Alert rules (critical vs warning)
* Custom metrics (trading volume, active users)
* Health check endpoint
* Incident response procedure
6. **Rollback Procedure** File: deployment/rollback.md Steps to rollback:

7. Identify issue

8. Stop deployments

9. Revert Vercel deployment: `vercel rollback`

10. Revert database migrations: `supabase db reset --db-url`

11. Verify rollback successful

12. Communicate to users

13. Post-mortem

14. **Database Backup** File: deployment/backup.sh

* Daily automated backups to Supabase storage
* Retention: 30 days
* Test restore procedure monthly

Include all bash scripts with error handling (set \-e), logging, and validation checks.

\---

\#\#\#\# \*\*Prompt 10: State Management with Zustand\*\*

Generate complete Zustand store implementations for TradePro:

1. **Auth Store** File: src/stores/authStore.ts

State:

* user: User | null
* session: Session | null
* profile: Profile | null
* loading: boolean

Actions:

* initialize(): Initialize auth state, set up listener
* signIn(email, password): Sign in user
* signUp(email, password): Sign up new user
* signOut(): Sign out user
* fetchProfile(): Fetch user profile
* updateProfile(updates): Update profile

Features:

* Supabase auth integration
* Auto-refresh token
* Persist session
* Update last\_login timestamp
2. **Trading Store** File: src/stores/tradingStore.ts

State:

* selectedSymbol: string
* positions: Position\[\]
* orders: Order\[\]
* loading: boolean

Actions:

* setSymbol(symbol): Change selected symbol
* placeOrder(order): Place new order via Edge Function
* closePosition(positionId, quantity?): Close position (full or partial)
* cancelOrder(orderId): Cancel pending order
* fetchPositions(): Fetch user positions
* fetchOrders(): Fetch user orders
* subscribeToUpdates(): Subscribe to Realtime updates

Features:

* Real-time position updates
* Real-time order updates
* Optimistic updates
* Error handling
3. **Portfolio Store** File: src/stores/portfolioStore.ts

State:

* balance: number
* equity: number
* margin\_used: number
* free\_margin: number
* margin\_level: number | null
* unrealized\_pnl: number
* realized\_pnl: number

Actions:

* fetchPortfolio(): Fetch portfolio data
* subscribeToUpdates(): Subscribe to profile changes

Features:

* Real-time balance updates
* Auto-calculate equity
* Margin level monitoring
4. **Market Data Store** File: src/stores/marketDataStore.ts

State:

* prices: Map\<string, PriceData\>
* subscribedSymbols: Set\<string\>

Actions:

* subscribe(symbol): Subscribe to price updates
* unsubscribe(symbol): Unsubscribe from symbol
* getPrice(symbol): Get current price

Features:

* Realtime price feed via Supabase broadcast
* Automatic cleanup on unmount
* Price caching
5. **Notification Store** File: src/stores/notificationStore.ts

State:

* notifications: Notification\[\]
* unreadCount: number

Actions:

* fetchNotifications(): Fetch user notifications
* markAsRead(id): Mark notification as read
* markAllAsRead(): Mark all as read
* deleteNotification(id): Delete notification
* subscribeToUpdates(): Subscribe to new notifications

Features:

* Real-time notification delivery
* Unread count badge
* Auto-dismiss after timeout

Requirements:

* TypeScript strict mode
* Use immer for immutable updates (via Zustand middleware)
* Persist important state to localStorage (auth, selected symbol)
* Error handling with try-catch
* Loading states for all async operations
* Proper cleanup (unsubscribe on unmount)

Example usage:

const { placeOrder, loading } \= useTradingStore()

const { user } \= useAuthStore()

const handleSubmit \= async (order: OrderInput) \=\> {

  try {

    await placeOrder(order)

    toast.success('Order placed')

  } catch (error) {

    toast.error(error.message)

  }

}

Include all TypeScript types and proper Zustand patterns (separate state and actions).

\---

\#\#\#\# \*\*Prompt 11: Analytics Dashboard\*\*

Generate a comprehensive analytics dashboard for TradePro in React TypeScript:

Component: AnalyticsDashboard

Sections:

1. Performance Overview (cards)
2. Equity Curve Chart
3. Trade History Table
4. Metrics Breakdown
5. Asset Allocation Pie Chart
6. Monthly Performance Calendar

Requirements:

1. Use Recharts for all charts
2. ShadCN UI components
3. Responsive grid layout
4. Date range selector (7D, 1M, 3M, 6M, 1Y, All)
5. Export to CSV/PDF functionality
6. Real-time data updates

Performance Metrics:

* Total Trades
* Win Rate (%)
* Profit Factor
* Sharpe Ratio
* Max Drawdown (% and $)
* Average Win
* Average Loss
* Best Trade
* Worst Trade
* Total P\&L
* Net P\&L (after fees)

Equity Curve Chart:

* X-axis: Date/Time
* Y-axis: Account Equity
* Include balance line
* Mark drawdown periods in red
* Tooltip with date, equity, drawdown

Trade History Table: Columns: Date, Symbol, Side, Quantity, Entry Price, Exit Price, P\&L, Duration Features:

* Sort by any column
* Filter by symbol, side, profitable/loss
* Pagination (50 per page)
* Export selected rows

Asset Allocation:

* Pie chart showing % allocation per asset class
* Labels with percentages
* Color-coded by asset class

Monthly Performance:

* Calendar heatmap
* Green for profitable days
* Red for loss days
* Tooltip with daily P\&L

API Integration:

interface AnalyticsData {

  equity\_curve: EquityPoint\[\]

  trades: Trade\[\]

  metrics: PerformanceMetrics

  asset\_allocation: { asset\_class: string; percentage: number }\[\]

  daily\_pnl: { date: string; pnl: number }\[\]

}

async function fetchAnalytics(

  userId: string,

  startDate: string,

  endDate: string

): Promise\<AnalyticsData\>

Calculations:

* Fetch all fills \+ positions for date range
* Calculate performance metrics using calculatePerformanceMetrics()
* Group by asset class for allocation
* Aggregate by day for calendar

Include proper loading states, error handling, and empty states. Use TypeScript for all data types.

\---

\#\#\#\# \*\*Prompt 12: Copy Trading System\*\*

Generate a complete copy trading system for TradePro:

Components:

1. LeaderboardTable
2. LeaderCard
3. CopySettingsModal
4. FollowingList

Features:

1. Browse top traders (leaderboard)
2. View trader profiles with stats
3. Follow/unfollow traders
4. Configure copy settings
5. Monitor copied trades
6. Auto-disconnect on drawdown threshold

Leaderboard: Columns:

* Rank
* Trader Name (anonymized: "Trader \#1234")
* Total Followers
* Total Return (%)
* Win Rate (%)
* Sharpe Ratio
* Max Drawdown (%)
* Total Trades
* Follow Button

Filters:

* Time period (1M, 3M, 6M, 1Y)
* Minimum trades (filter out new traders)
* Asset class preference

Sorting: By any column

Leader Stats Calculation:

interface LeaderStats {

  leader\_id: string

  total\_followers: number

  total\_pnl: number

  total\_return: number // %

  win\_rate: number

  total\_trades: number

  avg\_return: number

  max\_drawdown: number

  sharpe\_ratio: number

  risk\_score: number // 1-10

  is\_verified: boolean

  joined\_date: string

}

Copy Settings Modal: Fields:

* Copy Ratio (0.01 to 1.00) \- slider
* Max Exposure ($) \- input
* Copy Delay (0-300 seconds) \- select
* Max Drawdown Threshold (%) \- slider
* Auto-disconnect \- toggle

Validation:

* Check follower has sufficient balance
* Verify copy ratio \* leader trade fits in max exposure
* Ensure margin available

Database Operations: Insert to copy\_relationships:

insert into copy\_relationships (

  follower\_id,

  leader\_id,

  copy\_ratio,

  max\_exposure,

  copy\_delay\_seconds,

  max\_drawdown\_threshold,

  status

) values (...)

Copy Trade Execution: Trigger on orders table:

create trigger trg\_replicate\_trade

  after update on orders

  for each row

  when (NEW.status \= 'filled')

  execute function replicate\_trade();

Function logic:

1. Find all active followers
2. For each follower:
   * Check margin available
   * Check max exposure not exceeded
   * Check leader balance \> min threshold
   * Calculate copy quantity (leader\_qty \* copy\_ratio)
   * Insert order with idempotency\_key \= 'copy\_{order\_id}\_{follower\_id}'
   * Send notification

Following List Component: Display:

* Leader name
* Copy settings
* Total copied trades
* Follower P\&L from this leader
* Current status (active/paused/disconnected)
* Actions: Edit settings, Pause, Disconnect

Real-time Updates:

* Subscribe to copy\_relationships changes
* Show toast when trade is copied
* Alert when auto-disconnected (drawdown threshold)

Risk Management:

* Check leader hasn't breached min\_balance requirement
* Monitor leader drawdown
* Auto-disconnect if threshold exceeded
* Notify follower of disconnect reason

Include all TypeScript types, Zod validation schemas, and proper error handling.

\---

\#\#\#\# \*\*Prompt 13: Backtester Engine\*\*

Generate a complete backtesting engine for TradePro in TypeScript:

Component: BacktesterPage

Features:

1. Strategy configuration form
2. Parameter inputs
3. Execute backtest (async)
4. Results visualization
5. Trade log viewer
6. Export results

Strategy Configuration:

interface BacktestConfig {

  strategy\_name: string

  symbols: string\[\]

  timeframe: '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w'

  start\_date: string

  end\_date: string

  initial\_capital: number

  leverage: number

  parameters: Record\<string, any\>

}

Built-in Strategies:

1. **SMA Crossover** Parameters: fast\_period (default: 10), slow\_period (default: 20\) Logic: Buy when fast SMA crosses above slow, sell when crosses below

2. **RSI Oversold/Overbought** Parameters: period (default: 14), oversold (default: 30), overbought (default: 70\) Logic: Buy when RSI \< oversold, sell when RSI \> overbought

3. **MACD Strategy** Parameters: fast (12), slow (26), signal (9) Logic: Buy on MACD cross above signal, sell on cross below

4. **Bollinger Bands** Parameters: period (20), std\_dev (2) Logic: Buy at lower band, sell at upper band

Backtest Execution:

async function runBacktest(config: BacktestConfig): Promise\<BacktestResult\> {

  // 1\. Fetch historical OHLC data

  const data \= await fetchHistoricalData(

    config.symbols,

    config.timeframe,

    config.start\_date,

    config.end\_date

  )

  // 2\. Initialize portfolio

  let capital \= config.initial\_capital

  let positions: Position\[\] \= \[\]

  const trades: BacktestTrade\[\] \= \[\]

  const equityCurve: EquityPoint\[\] \= \[\]

  // 3\. Loop through each candle

  for (const candle of data) {

    // Apply strategy logic

    const signal \= applyStrategy(config.strategy\_name, candle, config.parameters)

    if (signal \=== 'buy' && capital \> 0\) {

      // Open position

      const quantity \= calculatePositionSize(capital, candle.close)

      positions.push({

        symbol: candle.symbol,

        entry\_price: candle.close,

        quantity,

        opened\_at: candle.timestamp,

      })

      capital \-= quantity \* candle.close

    }

    if (signal \=== 'sell' && positions.length \> 0\) {

      // Close position (FIFO)

      const position \= positions.shift()

      const pnl \= (candle.close \- position.entry\_price) \* position.quantity

      capital \+= position.quantity \* candle.close

      trades.push({

        symbol: position.symbol,

        entry\_date: position.opened\_at,

        entry\_price: position.entry\_price,

        exit\_date: candle.timestamp,

        exit\_price: candle.close,

        quantity: position.quantity,

        pnl,

        pnl\_percent: (pnl / (position.entry\_price \* position.quantity)) \* 100,

        duration\_hours: calculateDuration(position.opened\_at, candle.timestamp),

      })

    }

    // Record equity

    equityCurve.push({

      date: candle.timestamp,

      equity: capital \+ positions.reduce((sum, p) \=\> sum \+ p.quantity \* candle.close, 0),

      drawdown: 0, // Calculate later

    })

  }

  // 4\. Calculate performance metrics

  const metrics \= calculatePerformanceMetrics(trades, config.initial\_capital)

  // 5\. Calculate drawdown curve

  calculateDrawdown(equityCurve)

  return {

    ...config,

    final\_capital: capital,

    total\_return: ((capital \- config.initial\_capital) / config.initial\_capital) \* 100,

    ...metrics,

    trade\_log: trades,

    equity\_curve: equityCurve,

  }

}

Results Visualization:

1. **Summary Cards**

   * Total Return (%)
   * Sharpe Ratio
   * Max Drawdown (%)
   * Win Rate (%)
   * Profit Factor
   * Total Trades
2. **Equity Curve Chart**

   * Line chart with equity over time
   * Drawdown area (red)
   * Zoom/pan controls
3. **Trade Log Table**

   * All trades with entry/exit details
   * Sort by P\&L, duration, date
   * Filter by profitable/loss
   * Export to CSV
4. **Monthly Returns Heatmap**

   * Calendar view
   * Color-coded by return %
5. **Trade Distribution**

   * Histogram of P\&L distribution
   * Win/loss bars

Async Execution:

* Run backtest in Web Worker (don't block UI)
* Show progress bar (% complete)
* Allow cancellation
* Store results in database (backtest\_results table)
* Show history of past backtests

Edge Function Integration: For long backtests, use Edge Function with job queue:

// supabase/functions/run-backtest/index.ts

serve(async (req) \=\> {

  const { config } \= await req.json()


  // Create job

  const jobId \= await createBacktestJob(config)


  // Run async (use setTimeout or queue)

  runBacktestAsync(jobId, config)


  return new Response(JSON.stringify({ job\_id: jobId, status: 'running' }))

})

Poll for results:

const checkStatus \= async (jobId: string) \=\> {

  const { data } \= await supabase

    .from('backtest\_results')

    .select('\*')

    .eq('id', jobId)

    .single()


  return data?.status // 'running' | 'completed' | 'failed'

}

Include all TypeScript types, validation, error handling, and proper UI states (loading, error, success).

\---

\#\#\# \*\*Quick Reference Commands\*\*

\`\`\`bash

\# Project Setup

npm create vite@latest tradepro \-- \--template react-ts

cd tradepro

npm install

\# Install Dependencies

npm install @supabase/supabase-js zustand react-hook-form @hookform/resolvers zod

npm install sonner lucide-react recharts lightweight-charts

npm install decimal.js

npm install \-D @types/node

\# Install ShadCN

npx shadcn-ui@latest init

npx shadcn-ui@latest add button input select card table tabs

\# Supabase Setup

npm install \-g supabase

supabase login

supabase init

supabase start

\# Run Migrations

supabase db push

\# Deploy Edge Functions

supabase functions deploy execute-order

supabase functions deploy close-position

supabase functions deploy market-data

\# Testing Setup

npm install \-D vitest @vitest/ui @testing-library/react jsdom

npm install \-D playwright @playwright/test

npm install \-D k6

\# Run Tests

npm run test:unit

npm run test:integration

npm run test:e2e

npm run test:load

\# Development

npm run dev

\# Build

npm run build

\# Deploy

vercel deploy \--prod

\# Monitoring

npm install @sentry/react @sentry/tracing

---

## **✅ TradePro v10 Complete**

This is the **final, production-ready specification** for TradePro. It includes:

1. ✅ **Complete Database Schema** \- All 18+ tables with RLS, triggers, and stored procedures
2. ✅ **TypeScript Type Definitions** \- Full type safety for all data structures
3. ✅ **Edge Functions** \- Complete implementations for order execution, closing positions, and market data
4. ✅ **React Components** \- Trading dashboard, KYC wizard, admin panel, analytics
5. ✅ **State Management** \- Zustand stores for auth, trading, portfolio, market data
6. ✅ **Trading Calculations** \- Margin, P\&L, commission, slippage, position sizing, performance metrics
7. ✅ **Error Handling** \- Comprehensive error system with user-friendly messages
8. ✅ **Testing Suite** \- Unit, integration, E2E, and load tests
9. ✅ **Deployment Guide** \- Complete setup for Vercel and Supabase with checklists
10. ✅ **AI Prompt Pack** \- 13 detailed prompts for generating every feature

---

### **🚀 Ready to Build**

You can now:

1. Use the AI prompts to generate each component
2. Copy-paste the code directly into your project
3. Follow the deployment guide to launch
4. Use the testing specs to ensure quality
5. Monitor with the provided setup

**Estimated Development Time:** 4 weeks with AI assistance

**Next Steps:**

1. Generate database schema (Prompt 1\)
2. Generate Edge Functions (Prompts 2-3)
3. Generate React components (Prompts 3, 5, 11, 12, 13\)
4. Generate state management (Prompt 10\)
5. Generate calculations library (Prompt 4\)
6. Deploy and test


$$
