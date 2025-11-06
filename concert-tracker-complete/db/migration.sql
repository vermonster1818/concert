-- Base schema
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  city text,
  state text,
  lat double precision,
  lng double precision,
  created_at timestamptz default now()
);

create table if not exists public.shows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  artist text not null,
  start_at timestamptz not null,
  end_at timestamptz,
  venue_id uuid references public.venues(id),
  venue_name text,
  city text,
  source_url text,
  status text not null check (status in ('Planned','Attended','Skipped')) default 'Planned',
  rating int check (rating between 1 and 5),
  notes text,
  dedupe_key text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists shows_user_start_idx on public.shows(user_id, start_at);
create index if not exists shows_status_start_idx on public.shows(status, start_at);
create index if not exists shows_user_dedupe_idx on public.shows(user_id, dedupe_key);

-- Trigger helper (available on Supabase)
-- 1) Create a local trigger function that updates updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- 2) (Re)create the trigger on your table(s)
drop trigger if exists set_updated_at on public.shows;

create trigger set_updated_at
before update on public.shows
for each row
execute function public.set_updated_at();


-- ICS tokens (per-user private feed)
create table if not exists public.ics_tokens (
  user_id uuid primary key references auth.users(id) on delete cascade,
  token text not null,
  created_at timestamptz default now()
);

-- Google Calendar sync tables
create table if not exists public.google_credentials (
  user_id uuid primary key references auth.users(id) on delete cascade,
  refresh_token text not null,
  calendar_id text,
  sync_token text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.show_google_events (
  show_id uuid primary key references public.shows(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  calendar_id text not null,
  event_id text not null,
  created_at timestamptz default now()
);

-- Stats views
create or replace view public.stats_shows_by_month as
  select user_id, date_trunc('month', start_at) as month, count(*) as shows
  from public.shows where status='Attended'
  group by 1,2 order by 2;

create or replace view public.stats_top_artists as
  select user_id, artist, count(*) as cnt
  from public.shows where status='Attended'
  group by 1,2 order by cnt desc;

create or replace view public.stats_top_venues as
  select user_id, coalesce(venue_name,'(Unknown)') as venue, count(*) as cnt
  from public.shows where status='Attended'
  group by 1,2 order by cnt desc;
