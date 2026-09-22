-- ============================================================
-- Daily Timeline Tracker — schema, RLS, trigger, seed data
-- Run this once in Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ── Cleanup: old prayer-tracker / ramadan-reading features (removed) ──
drop table if exists public.prayer_logs cascade;
drop table if exists public.prayer_enrollment cascade;
drop table if exists public.ramadan_progress cascade;

-- ── profiles ──────────────────────────────────────────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  username   text unique not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles are viewable by everyone" on public.profiles;
create policy "profiles are viewable by everyone"
  on public.profiles for select
  using (true);

drop policy if exists "users can insert own profile" on public.profiles;
create policy "users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ── tracker_items (admin-managed catalog that drives the page) ──
create table if not exists public.tracker_items (
  id          bigint generated always as identity primary key,
  key         text not null unique,
  label       text not null,
  column_side text not null check (column_side in ('prayer', 'dhikr')),
  sort_order  numeric not null default 0,
  percentage  numeric not null check (percentage > 0 and percentage <= 100),
  is_critical boolean not null default false,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.tracker_items enable row level security;

drop policy if exists "tracker items are viewable by everyone" on public.tracker_items;
create policy "tracker items are viewable by everyone"
  on public.tracker_items for select
  using (true);

-- Intentionally no insert/update/delete policy for anon/authenticated.
-- Add/edit/reorder rows from the Supabase dashboard (service role bypasses RLS).

-- Trigger: active items may never sum to more than 100%
create or replace function public.check_tracker_items_total()
returns trigger
language plpgsql
as $$
declare
  total numeric;
begin
  select coalesce(sum(percentage), 0) into total
  from public.tracker_items
  where is_active = true
    and id <> coalesce(new.id, -1);

  if new.is_active then
    total := total + new.percentage;
  end if;

  if total > 100 then
    raise exception 'Total percentage of active tracker_items would be %, which exceeds 100', total;
  end if;

  return new;
end;
$$;

drop trigger if exists tracker_items_total_check on public.tracker_items;
create trigger tracker_items_total_check
  before insert or update on public.tracker_items
  for each row execute function public.check_tracker_items_total();

-- ── tracker_logs (per user, per item, per day) ──────────────────
create table if not exists public.tracker_logs (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  item_id    bigint not null references public.tracker_items(id) on delete cascade,
  log_date   date not null,
  completed  boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, item_id, log_date)
);

create index if not exists tracker_logs_user_date_idx
  on public.tracker_logs (user_id, log_date);

alter table public.tracker_logs enable row level security;

drop policy if exists "users manage own logs" on public.tracker_logs;
create policy "users manage own logs"
  on public.tracker_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "friends can view logs" on public.tracker_logs;
create policy "friends can view logs"
  on public.tracker_logs for select
  using (
    exists (
      select 1 from public.friends f
      where f.user_id = auth.uid() and f.friend_id = tracker_logs.user_id
    )
  );

-- ── friends (one-directional "follow", no accept/reject flow) ──
create table if not exists public.friends (
  user_id    uuid not null references auth.users(id) on delete cascade,
  friend_id  uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, friend_id),
  check (user_id <> friend_id)
);

alter table public.friends enable row level security;

drop policy if exists "users manage own friend list" on public.friends;
create policy "users manage own friend list"
  on public.friends for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "users can see who added them" on public.friends;
create policy "users can see who added them"
  on public.friends for select
  using (auth.uid() = friend_id);

-- ── daily_scores view (today's / any day's score per user) ─────
create or replace view public.daily_scores
with (security_invoker = true) as
select
  l.user_id,
  l.log_date,
  round(sum(i.percentage) filter (where l.completed), 2) as score
from public.tracker_logs l
join public.tracker_items i on i.id = l.item_id and i.is_active
group by l.user_id, l.log_date;

-- ── Seed data (12 items, percentages sum to exactly 100) ───────
-- Edit/reorder/reweight anytime from the dashboard — the site reads this live.
insert into public.tracker_items (key, label, column_side, sort_order, percentage, is_critical) values
  ('wake_azkar',    'أذكار الاستيقاظ',              'dhikr',  10, 5,  false),
  ('fajr_sunnah',   'سنة الفجر',                    'dhikr',  20, 5,  false),
  ('fajr_prayer',   'صلاة الفجر',                   'prayer', 20, 15, true),
  ('morning_azkar', 'أذكار الصباح',                 'dhikr',  30, 8,  false),
  ('dhuhr_prayer',  'صلاة الظهر',                   'prayer', 40, 10, false),
  ('asr_prayer',    'صلاة العصر',                   'prayer', 50, 10, false),
  ('evening_azkar', 'أذكار المساء',                 'dhikr',  60, 8,  false),
  ('maghrib_prayer','صلاة المغرب',                  'prayer', 70, 10, false),
  ('isha_prayer',   'صلاة العشاء',                  'prayer', 80, 10, false),
  ('witr_prayer',   'صلاة الوتر',                   'prayer', 90, 7,  false),
  ('sleep_azkar',   'أذكار النوم',                  'dhikr',  100, 5, false),
  ('istighfar_100', 'استغفار + حوقلة (١٠٠ مرة)',    'dhikr',  110, 7, false)
on conflict (key) do nothing;
