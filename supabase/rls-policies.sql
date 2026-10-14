-- Satukenangan Row Level Security (RLS) Policies

-- 1. Enable RLS on all tables
alter table public.events enable row level security;
alter table public.guests enable row level security;
alter table public.photos enable row level security;

-- 2. EVENTS POLICIES
-- Anyone can view active/public events by slug or ID
create policy "Allow public read access to active events"
  on public.events for select
  using (status = 'active');

-- Authenticated hosts can insert their own events
create policy "Allow authenticated users to create events"
  on public.events for insert
  to authenticated
  with check (auth.uid() = host_user_id);

-- Host full control over their own events
create policy "Allow hosts full control over their events"
  on public.events for all
  to authenticated
  using (auth.uid() = host_user_id)
  with check (auth.uid() = host_user_id);

-- 3. GUESTS POLICIES
-- Guests can be created by anyone joining an active event
create policy "Allow guest registration"
  on public.guests for insert
  with check (
    exists (
      select 1 from public.events
      where events.id = guests.event_id and events.status = 'active'
    )
  );

-- Guests can read their own session record or hosts can read event guests
create policy "Allow reading guest records"
  on public.guests for select
  using (
    exists (
      select 1 from public.events
      where events.id = guests.event_id
        and (events.status = 'active' or events.host_user_id = auth.uid())
    )
  );

-- Guests or Hosts can update guest photo counts
create policy "Allow updating guest photo counts"
  on public.guests for update
  using (
    exists (
      select 1 from public.events
      where events.id = guests.event_id
    )
  );

-- 4. PHOTOS POLICIES
-- Public can read revealed and non-hidden photos of active events
create policy "Allow public read of revealed photos"
  on public.photos for select
  using (
    exists (
      select 1 from public.events
      where events.id = photos.event_id
        and events.status = 'active'
        and (
          -- Host can see all photos
          events.host_user_id = auth.uid()
          or (
            -- Guests see photos if revealed and not hidden by host
            photos.is_hidden_by_host = false
            and (
              photos.is_revealed = true
              or events.revealed_at is not null
              or now() >= events.reveal_date_time
            )
          )
        )
    )
  );

-- Anyone can insert photos to an active event (validated via server upload endpoint)
create policy "Allow photo upload to active events"
  on public.photos for insert
  with check (
    exists (
      select 1 from public.events
      where events.id = photos.event_id and events.status = 'active'
    )
  );

-- Only host can update (hide/unhide) or delete photos
create policy "Allow host to update photos"
  on public.photos for update
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = photos.event_id and events.host_user_id = auth.uid()
    )
  );

create policy "Allow host to delete photos"
  on public.photos for delete
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = photos.event_id and events.host_user_id = auth.uid()
    )
  );
