create extension if not exists "pgcrypto";

create table if not exists public.roadmap_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'planned',
  priority text not null default 'medium',
  type text not null default 'feature',
  category text,
  target_version text,
  is_public boolean not null default false,
  sort_order integer not null default 0,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  cancelled_at timestamptz,
  constraint roadmap_items_status_check check (status in ('planned', 'in_progress', 'completed', 'cancelled')),
  constraint roadmap_items_priority_check check (priority in ('high', 'medium', 'low')),
  constraint roadmap_items_type_check check (
    type in ('feature', 'improvement', 'bugfix', 'visual', 'performance', 'documentation', 'refactor', 'idea')
  )
);

create index if not exists roadmap_items_project_id_idx on public.roadmap_items(project_id);
create index if not exists roadmap_items_status_idx on public.roadmap_items(status);
create index if not exists roadmap_items_priority_idx on public.roadmap_items(priority);
create index if not exists roadmap_items_type_idx on public.roadmap_items(type);
create index if not exists roadmap_items_is_public_idx on public.roadmap_items(is_public);
create index if not exists roadmap_items_created_at_idx on public.roadmap_items(created_at);

create or replace function public.set_roadmap_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();

  if new.status = 'completed' then
    if tg_op = 'INSERT' then
      new.completed_at = coalesce(new.completed_at, now());
    else
      new.completed_at = coalesce(old.completed_at, now());
    end if;
    new.cancelled_at = null;
  elsif new.status = 'cancelled' then
    if tg_op = 'INSERT' then
      new.cancelled_at = coalesce(new.cancelled_at, now());
    else
      new.cancelled_at = coalesce(old.cancelled_at, now());
    end if;
    new.completed_at = null;
  else
    new.completed_at = null;
    new.cancelled_at = null;
  end if;

  return new;
end;
$$;

drop trigger if exists roadmap_items_set_updated_at on public.roadmap_items;
create trigger roadmap_items_set_updated_at
before insert or update on public.roadmap_items
for each row execute function public.set_roadmap_updated_at();

alter table public.roadmap_items enable row level security;

drop policy if exists "Authenticated users manage roadmap items" on public.roadmap_items;
create policy "Authenticated users manage roadmap items"
on public.roadmap_items for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
