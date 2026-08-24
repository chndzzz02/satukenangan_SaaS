-- Satukenangan production schema
create table if not exists public.events (
  id text primary key,
  slug text not null unique,
  name text not null,
  host_name text not null,
  host_email text not null,
  experience_type text not null check (experience_type in ('camera', 'guestbook')),
  preset_id text not null,
  event_date timestamptz not null,
  reveal_time_type text not null check (reveal_time_type in ('during', 'immediately', 'custom')),
  reveal_date_time timestamptz not null,
  guest_limit integer not null check (guest_limit > 0),
  photo_limit_per_guest integer not null check (photo_limit_per_guest > 0),
  status text not null default 'active' check (status in ('active', 'draft', 'completed')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'paid', 'free')),
  price integer not null default 0,
  qr_code_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.guests (
  id text primary key,
  event_id text not null references public.events(id) on delete cascade,
  guest_name text not null,
  session_token text not null unique,
  photos_taken_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.photos (
  id text primary key,
  event_id text not null references public.events(id) on delete cascade,
  guest_id text references public.guests(id) on delete set null,
  guest_name text not null,
  photo_url text not null,
  preset_applied text not null,
  frame_number text not null,
  is_revealed boolean not null default false,
  is_hidden_by_host boolean not null default false,
  caption text,
  created_at timestamptz not null default now()
);

create index if not exists events_slug_idx on public.events(slug);
create index if not exists guests_event_id_idx on public.guests(event_id);
create index if not exists photos_event_id_idx on public.photos(event_id);
create index if not exists photos_created_at_idx on public.photos(created_at desc);

alter table public.events enable row level security;
alter table public.guests enable row level security;
alter table public.photos enable row level security;
