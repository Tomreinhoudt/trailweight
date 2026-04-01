-- TrailWeight initial schema
-- Run this in your Supabase SQL editor or via the Supabase CLI

-- ─── Tables ───────────────────────────────────────────────────────────────────

create table if not exists public.gear_lists (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  name        text        not null,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.gear_items (
  id           uuid           primary key default gen_random_uuid(),
  list_id      uuid           not null references public.gear_lists(id) on delete cascade,
  user_id      uuid           not null references auth.users(id) on delete cascade,
  name         text           not null,
  description  text,
  category     text           not null default 'Uncategorized',
  weight_grams numeric(10, 2) not null default 0,
  cost_cents   integer        not null default 0,
  quantity     integer        not null default 1,
  worn         boolean        not null default false,
  consumable   boolean        not null default false,
  created_at   timestamptz    not null default now(),
  updated_at   timestamptz    not null default now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

create index if not exists gear_lists_user_id_idx on public.gear_lists (user_id);
create index if not exists gear_items_list_id_idx on public.gear_items (list_id);
create index if not exists gear_items_user_id_idx on public.gear_items (user_id);

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table public.gear_lists enable row level security;
alter table public.gear_items enable row level security;

-- gear_lists policies
create policy "gear_lists: select own"
  on public.gear_lists for select using (auth.uid() = user_id);

create policy "gear_lists: insert own"
  on public.gear_lists for insert with check (auth.uid() = user_id);

create policy "gear_lists: update own"
  on public.gear_lists for update using (auth.uid() = user_id);

create policy "gear_lists: delete own"
  on public.gear_lists for delete using (auth.uid() = user_id);

-- gear_items policies
create policy "gear_items: select own"
  on public.gear_items for select using (auth.uid() = user_id);

create policy "gear_items: insert own"
  on public.gear_items for insert with check (auth.uid() = user_id);

create policy "gear_items: update own"
  on public.gear_items for update using (auth.uid() = user_id);

create policy "gear_items: delete own"
  on public.gear_items for delete using (auth.uid() = user_id);

-- ─── updated_at trigger ───────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at
  before update on public.gear_lists
  for each row execute function public.set_updated_at();

create trigger set_updated_at
  before update on public.gear_items
  for each row execute function public.set_updated_at();
