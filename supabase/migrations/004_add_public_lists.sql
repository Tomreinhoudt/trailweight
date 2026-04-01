-- Add is_public to gear_lists for shareable public views

alter table public.gear_lists
  add column if not exists is_public boolean not null default false;

-- Allow anyone (including unauthenticated / anon key) to read public lists
create policy "gear_lists: select public"
  on public.gear_lists for select using (is_public = true);

-- Allow anyone to read items that belong to a public list
create policy "gear_items: select public"
  on public.gear_items for select using (
    exists (
      select 1 from public.gear_lists gl
      where gl.id = gear_items.list_id
        and gl.is_public = true
    )
  );
