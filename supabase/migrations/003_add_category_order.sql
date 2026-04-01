-- Add category_order to gear_lists for persistent drag-and-drop category ordering

alter table public.gear_lists
  add column if not exists category_order text[] not null default '{}';
