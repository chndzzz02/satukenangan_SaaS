-- Host ownership migration
alter table public.events
add column if not exists host_user_id uuid references auth.users(id) on delete cascade;

create index if not exists events_host_user_id_idx on public.events(host_user_id);

-- Existing demo events remain accessible until assigned to a host.
