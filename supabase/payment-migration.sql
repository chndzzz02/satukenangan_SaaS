-- Payment Transactions Table Migration
create table if not exists public.transactions (
  id text primary key,
  event_id text not null references public.events(id) on delete cascade,
  order_id text not null unique,
  gross_amount integer not null,
  payment_type text,
  transaction_status text not null default 'unpaid' check (transaction_status in ('unpaid', 'pending', 'paid', 'failed', 'expired')),
  snap_token text,
  snap_redirect_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists transactions_order_id_idx on public.transactions(order_id);
create index if not exists transactions_event_id_idx on public.transactions(event_id);

alter table public.transactions enable row level security;

-- Allow read/write for event host or service role
create policy "Allow hosts to view event transactions"
  on public.transactions for select
  using (
    exists (
      select 1 from public.events
      where events.id = transactions.event_id
        and (events.host_user_id = auth.uid() or events.status = 'active')
    )
  );

create policy "Allow transaction updates"
  on public.transactions for all
  using (
    exists (
      select 1 from public.events
      where events.id = transactions.event_id
    )
  );
