-- Create functions for admin operations
create or replace function get_admin_metrics()
returns table (
  total_users bigint,
  active_users bigint,
  kyc_pending bigint,
  total_deposits numeric,
  total_withdrawals numeric,
  total_volume numeric,
  total_commission numeric
)
language plpgsql
security definer
as $$
begin
  return query
  select
    (select count(*) from auth.users) as total_users,
    (select count(*) from auth.users where last_sign_in_at >= now() - interval '30 days') as active_users,
    (select count(*) from kyc_documents where status = 'pending') as kyc_pending,
    coalesce((select sum(amount) from wallet_transactions where type = 'deposit' and status = 'completed'), 0) as total_deposits,
    coalesce((select sum(amount) from wallet_transactions where type = 'withdrawal' and status = 'completed'), 0) as total_withdrawals,
    coalesce((select sum(price * quantity) from orders where status = 'closed'), 0) as total_volume,
    coalesce((select sum(price * quantity * 0.001) from orders where status = 'closed'), 0) as total_commission;
end;
$$;

create or replace function get_admin_users()
returns table (
  id uuid,
  email text,
  full_name text,
  phone text,
  country text,
  kyc_status json,
  wallet_balance json,
  created_at timestamptz,
  last_sign_in timestamptz
)
language plpgsql
security definer
as $$
begin
  return query
  select
    au.id,
    au.email,
    au.raw_user_meta_data->>'full_name' as full_name,
    au.raw_user_meta_data->>'phone' as phone,
    au.raw_user_meta_data->>'country' as country,
    (
      select json_build_object(
        'is_verified', ks.is_verified,
        'id_proof_status', ks.id_proof_status,
        'address_proof_status', ks.address_proof_status
      )
      from kyc_status ks
      where ks.user_id = au.id
    ) as kyc_status,
    (
      select json_build_object(
        'available_balance', wb.available_balance,
        'pending_deposits', wb.pending_deposits,
        'pending_withdrawals', wb.pending_withdrawals
      )
      from wallet_balances wb
      where wb.user_id = au.id
    ) as wallet_balance,
    au.created_at,
    au.last_sign_in_at
  from auth.users au;
end;
$$;

create or replace function get_admin_kyc_reviews()
returns table (
  id uuid,
  user_id uuid,
  user_email text,
  document_type text,
  document_url text,
  status text,
  created_at timestamptz
)
language plpgsql
security definer
as $$
begin
  return query
  select
    kd.id,
    kd.user_id,
    au.email as user_email,
    kd.document_type,
    kd.document_url,
    kd.status,
    kd.created_at
  from kyc_documents kd
  join auth.users au on au.id = kd.user_id
  where kd.status = 'pending'
  order by kd.created_at desc;
end;
$$;

create or replace function get_admin_transactions()
returns table (
  id uuid,
  user_id uuid,
  user_email text,
  type text,
  amount numeric,
  status text,
  created_at timestamptz
)
language plpgsql
security definer
as $$
begin
  return query
  select
    wt.id,
    wt.user_id,
    au.email as user_email,
    wt.type,
    wt.amount,
    wt.status,
    wt.created_at
  from wallet_transactions wt
  join auth.users au on au.id = wt.user_id
  where wt.status = 'pending'
  order by wt.created_at desc;
end;
$$;

create or replace function update_kyc_status(
  document_id uuid,
  new_status text,
  rejection_reason text default null
)
returns void
language plpgsql
security definer
as $$
begin
  update kyc_documents
  set
    status = new_status,
    rejection_reason = CASE WHEN new_status = 'rejected' THEN rejection_reason ELSE null END
  where id = document_id;
end;
$$;

create or replace function update_transaction_status(
  transaction_id uuid,
  new_status text,
  rejection_reason text default null
)
returns void
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
  v_amount numeric;
  v_type text;
begin
  select user_id, amount, type
  into v_user_id, v_amount, v_type
  from wallet_transactions
  where id = transaction_id;

  update wallet_transactions
  set
    status = new_status,
    rejection_reason = CASE WHEN new_status = 'rejected' THEN rejection_reason ELSE null END,
    completed_at = CASE WHEN new_status = 'completed' THEN now() ELSE null END
  where id = transaction_id;

  if new_status = 'completed' then
    if v_type = 'deposit' then
      update wallet_balances
      set
        available_balance = available_balance + v_amount,
        pending_deposits = pending_deposits - v_amount,
        total_deposits = total_deposits + v_amount
      where user_id = v_user_id;
    else -- withdrawal
      update wallet_balances
      set
        available_balance = available_balance - v_amount,
        pending_withdrawals = pending_withdrawals - v_amount,
        total_withdrawals = total_withdrawals + v_amount
      where user_id = v_user_id;
    end if;
  end if;
end;
$$;

create or replace function update_user_status(
  user_id uuid,
  action text
)
returns void
language plpgsql
security definer
as $$
begin
  if action = 'suspend' then
    update auth.users
    set raw_user_meta_data = raw_user_meta_data || jsonb_build_object('is_suspended', true)
    where id = user_id;
  else -- activate
    update auth.users
    set raw_user_meta_data = raw_user_meta_data - 'is_suspended'
    where id = user_id;
  end if;
end;
$$;