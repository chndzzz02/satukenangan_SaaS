-- Manual reveal support
alter table public.events
add column if not exists revealed_at timestamptz;
