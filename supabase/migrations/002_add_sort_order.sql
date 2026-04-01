-- Add sort_order columns for drag-and-drop reordering

alter table public.gear_lists
  add column if not exists sort_order integer not null default 0;

alter table public.gear_items
  add column if not exists sort_order integer not null default 0;

-- Initialise sort_order based on existing created_at order so nothing jumps around
with ranked_lists as (
  select id, row_number() over (partition by user_id order by created_at) - 1 as rn
  from public.gear_lists
)
update public.gear_lists
set sort_order = ranked_lists.rn
from ranked_lists
where gear_lists.id = ranked_lists.id;

with ranked_items as (
  select id, row_number() over (partition by list_id order by created_at) - 1 as rn
  from public.gear_items
)
update public.gear_items
set sort_order = ranked_items.rn
from ranked_items
where gear_items.id = ranked_items.id;

-- Index for fast ordering queries
create index if not exists gear_lists_sort_order_idx on public.gear_lists (user_id, sort_order);
create index if not exists gear_items_sort_order_idx on public.gear_items (list_id, sort_order);
