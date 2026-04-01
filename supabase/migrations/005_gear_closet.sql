-- Gear closet: personal master inventory across all lists

create table if not exists public.gear_closet_items (
  id           uuid           primary key default gen_random_uuid(),
  user_id      uuid           not null references auth.users(id) on delete cascade,
  name         text           not null,
  brand        text,
  description  text,
  category     text           not null default 'Uncategorized',
  weight_grams numeric(10,2)  not null default 0,
  cost_cents   integer        not null default 0,
  url          text,
  created_at   timestamptz    not null default now(),
  updated_at   timestamptz    not null default now()
);

create index if not exists gear_closet_user_id_idx on public.gear_closet_items (user_id);

alter table public.gear_closet_items enable row level security;

create policy "closet: select own" on public.gear_closet_items for select using (auth.uid() = user_id);
create policy "closet: insert own" on public.gear_closet_items for insert with check (auth.uid() = user_id);
create policy "closet: update own" on public.gear_closet_items for update using (auth.uid() = user_id);
create policy "closet: delete own" on public.gear_closet_items for delete using (auth.uid() = user_id);

create trigger set_updated_at
  before update on public.gear_closet_items
  for each row execute function public.set_updated_at();

-- Weight target for a list (nullable — not set by default)
alter table public.gear_lists
  add column if not exists weight_target_grams integer;
