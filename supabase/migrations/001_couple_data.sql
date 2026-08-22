-- Couple shared state (destinations, fechas, bingo photos metadata)
-- Run in Supabase SQL editor

create table if not exists public.couple_data (
  slug text primary key,
  payload jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.couple_data enable row level security;

-- API uses service role; block direct anon access
create policy "No public access"
  on public.couple_data
  for all
  to anon, authenticated
  using (false)
  with check (false);

create index if not exists couple_data_updated_at_idx on public.couple_data (updated_at desc);
