alter table public.spin_entries drop constraint if exists completed_spin_has_prize;
alter table public.spin_entries drop constraint if exists spin_entries_status_check;
alter table public.spin_entries add column if not exists current_game text not null default 'wheel';
alter table public.spin_entries add column if not exists game_results jsonb not null default '[]'::jsonb;
alter table public.spin_entries add column if not exists total_value integer not null default 0;
alter table public.spin_entries add constraint spin_entries_status_check check (status in ('pending', 'in_progress', 'completed'));
