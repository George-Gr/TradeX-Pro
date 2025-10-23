-- Enable pgcrypto for uuid generation
create extension if not exists "pgcrypto";

-- Create functions for analytics
create or replace function get_trading_metrics(
  user_id_param uuid,
  timeframe_param text
)
returns table (
  total_trades bigint,
  winning_trades bigint,
  losing_trades bigint,
  win_rate numeric,
  average_profit numeric,
  average_loss numeric,
  profit_factor numeric,
  total_pnl numeric,
  best_trade numeric,
  worst_trade numeric,
  average_holding_time numeric
)
language plpgsql
security definer
as $$
declare
  start_date timestamptz;
begin
  -- Set the start date based on timeframe
  start_date := case timeframe_param
    when 'day' then now() - interval '1 day'
    when 'week' then now() - interval '7 days'
    when 'month' then now() - interval '30 days'
    when 'year' then now() - interval '1 year'
    else now() - interval '30 days'
  end;

  return query
  select
    count(*)::bigint as total_trades,
    count(*) filter (where pnl > 0)::bigint as winning_trades,
    count(*) filter (where pnl < 0)::bigint as losing_trades,
    (count(*) filter (where pnl > 0)::numeric / nullif(count(*)::numeric, 0)) as win_rate,
    coalesce(avg(pnl) filter (where pnl > 0), 0) as average_profit,
    coalesce(avg(pnl) filter (where pnl < 0), 0) as average_loss,
    coalesce(
      abs(sum(pnl) filter (where pnl > 0)) /
      nullif(abs(sum(pnl) filter (where pnl < 0)), 0),
      0
    ) as profit_factor,
    coalesce(sum(pnl), 0) as total_pnl,
    coalesce(max(pnl), 0) as best_trade,
    coalesce(min(pnl), 0) as worst_trade,
    coalesce(
      avg(extract(epoch from (filled_at - created_at)) / 3600),
      0
    ) as average_holding_time
  from orders
  where user_id = user_id_param
    and status = 'filled'
    and filled_at >= start_date;
end;
$$;

create or replace function get_daily_performance(
  user_id_param uuid,
  timeframe_param text
)
returns table (
  date date,
  pnl numeric,
  trades bigint,
  win_rate numeric
)
language plpgsql
security definer
as $$
declare
  start_date timestamptz;
begin
  -- Set the start date based on timeframe
  start_date := case timeframe_param
    when 'day' then now() - interval '1 day'
    when 'week' then now() - interval '7 days'
    when 'month' then now() - interval '30 days'
    when 'year' then now() - interval '1 year'
    else now() - interval '30 days'
  end;

  return query
  select
    date(filled_at) as date,
    sum(pnl) as pnl,
    count(*)::bigint as trades,
    count(*) filter (where pnl > 0)::numeric / count(*)::numeric as win_rate
  from orders
  where user_id = user_id_param
    and status = 'filled'
    and filled_at >= start_date
  group by date(filled_at)
  order by date;
end;
$$;

create or replace function get_asset_performance(
  user_id_param uuid,
  timeframe_param text
)
returns table (
  symbol text,
  total_trades bigint,
  win_rate numeric,
  total_pnl numeric,
  average_pnl numeric
)
language plpgsql
security definer
as $$
declare
  start_date timestamptz;
begin
  -- Set the start date based on timeframe
  start_date := case timeframe_param
    when 'day' then now() - interval '1 day'
    when 'week' then now() - interval '7 days'
    when 'month' then now() - interval '30 days'
    when 'year' then now() - interval '1 year'
    else now() - interval '30 days'
  end;

  return query
  select
    symbol,
    count(*)::bigint as total_trades,
    count(*) filter (where pnl > 0)::numeric / count(*)::numeric as win_rate,
    sum(pnl) as total_pnl,
    avg(pnl) as average_pnl
  from orders
  where user_id = user_id_param
    and status = 'filled'
    and filled_at >= start_date
  group by symbol
  order by total_pnl desc;
end;
$$;
