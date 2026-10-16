create extension if not exists pgcrypto;

create table if not exists public.spin_entries (
  id uuid primary key default gen_random_uuid(),
  participant_name text not null check (char_length(participant_name) between 2 and 120),
  bank_name text not null,
  account_number text not null check (account_number ~ '^[0-9]{6,19}$'),
  status text not null default 'pending' check (status in ('pending', 'completed')),
  prize_id text,
  prize_label text,
  prize_value integer,
  client_session_id uuid not null,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint completed_spin_has_prize check (
    (status = 'pending' and prize_id is null and prize_label is null and prize_value is null)
    or (status = 'completed' and prize_id is not null and prize_label is not null and prize_value is not null)
  )
);

alter table public.spin_entries enable row level security;

-- The anonymous browser can create and finish a spin but cannot query anyone's data.
-- This deliberately supports a demo/public campaign only; see README for limitations.
create policy "anonymous users can create spin entries"
  on public.spin_entries for insert to anon with check (true);

create policy "anonymous users can complete spin entries"
  on public.spin_entries for update to anon using (true) with check (true);

create index if not exists spin_entries_created_at_idx on public.spin_entries (created_at desc);
