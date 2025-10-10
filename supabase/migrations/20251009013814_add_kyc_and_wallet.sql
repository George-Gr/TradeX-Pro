-- Enable RLS
alter table public.kyc_documents enable row level security;
alter table public.kyc_status enable row level security;
alter table public.wallet_balances enable row level security;
alter table public.wallet_transactions enable row level security;

-- Create tables
create table public.kyc_documents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  document_type text not null check (document_type in ('id_proof', 'address_proof')),
  document_url text not null,
  status text not null check (status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.kyc_status (
  user_id uuid references auth.users on delete cascade primary key,
  is_verified boolean default false,
  id_proof_status text not null default 'not_submitted' check (id_proof_status in ('not_submitted', 'pending', 'approved', 'rejected')),
  address_proof_status text not null default 'not_submitted' check (address_proof_status in ('not_submitted', 'pending', 'approved', 'rejected')),
  last_updated timestamptz default now()
);

create table public.wallet_balances (
  user_id uuid references auth.users on delete cascade primary key,
  available_balance numeric default 0 check (available_balance >= 0),
  pending_deposits numeric default 0 check (pending_deposits >= 0),
  pending_withdrawals numeric default 0 check (pending_withdrawals >= 0),
  total_deposits numeric default 0 check (total_deposits >= 0),
  total_withdrawals numeric default 0 check (total_withdrawals >= 0)
);

create table public.wallet_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  type text not null check (type in ('deposit', 'withdrawal')),
  amount numeric not null check (amount > 0),
  status text not null check (status in ('pending', 'completed', 'rejected')),
  rejection_reason text,
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- Create RLS policies
create policy "Users can view their own KYC documents"
  on public.kyc_documents for select
  using (auth.uid() = user_id);

create policy "Users can insert their own KYC documents"
  on public.kyc_documents for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own KYC status"
  on public.kyc_status for select
  using (auth.uid() = user_id);

create policy "System can update KYC status"
  on public.kyc_status for update
  using (auth.uid() = user_id);

create policy "Users can view their own wallet balance"
  on public.wallet_balances for select
  using (auth.uid() = user_id);

create policy "System can update wallet balances"
  on public.wallet_balances for update
  using (auth.uid() = user_id);

create policy "Users can view their own wallet transactions"
  on public.wallet_transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert wallet transactions"
  on public.wallet_transactions for insert
  with check (auth.uid() = user_id);

-- Create functions and triggers
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.kyc_status (user_id)
  values (new.id);
  
  insert into public.wallet_balances (user_id)
  values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.handle_kyc_approval()
returns trigger as $$
begin
  if new.status = 'approved' then
    update public.kyc_status
    set 
      is_verified = case 
        when id_proof_status = 'approved' and address_proof_status = 'approved' then true
        else false
      end,
      last_updated = now()
    where user_id = new.user_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_kyc_document_update
  after update on public.kyc_documents
  for each row execute procedure public.handle_kyc_approval();