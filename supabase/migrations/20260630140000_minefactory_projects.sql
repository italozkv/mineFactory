create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  color text not null default '#22c55e',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tags_color_hex_check check (color ~ '^#[0-9A-Fa-f]{6}$')
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text not null,
  description text not null,
  logo_url text,
  banner_url text,
  status text not null default 'development',
  category_id uuid references public.categories(id) on delete set null,
  minecraft_versions text[] not null default '{}',
  loaders text[] not null default '{}',
  visibility text not null default 'private',
  is_published boolean not null default false,
  external_links jsonb not null default '[]'::jsonb,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_status_check check (
    status in ('development', 'testing', 'beta', 'release', 'paused', 'archived')
  ),
  constraint projects_visibility_check check (visibility in ('public', 'private'))
);

create table if not exists public.project_tags (
  project_id uuid not null references public.projects(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, tag_id)
);

create index if not exists projects_category_id_idx on public.projects(category_id);
create index if not exists projects_status_idx on public.projects(status);
create index if not exists projects_visibility_idx on public.projects(visibility, is_published);
create index if not exists projects_minecraft_versions_idx on public.projects using gin(minecraft_versions);
create index if not exists projects_loaders_idx on public.projects using gin(loaders);
create index if not exists project_tags_tag_id_idx on public.project_tags(tag_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists tags_set_updated_at on public.tags;
create trigger tags_set_updated_at
before update on public.tags
for each row execute function public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.projects enable row level security;
alter table public.project_tags enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
on public.categories for select
using (true);

drop policy if exists "Authenticated users manage categories" on public.categories;
create policy "Authenticated users manage categories"
on public.categories for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Public can read tags" on public.tags;
create policy "Public can read tags"
on public.tags for select
using (true);

drop policy if exists "Authenticated users manage tags" on public.tags;
create policy "Authenticated users manage tags"
on public.tags for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
on public.projects for select
using (visibility = 'public' and archived_at is null and status <> 'archived');

drop policy if exists "Authenticated users read all projects" on public.projects;
create policy "Authenticated users read all projects"
on public.projects for select
using (auth.role() = 'authenticated');

drop policy if exists "Authenticated users manage projects" on public.projects;
create policy "Authenticated users manage projects"
on public.projects for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Public can read project tags for published projects" on public.project_tags;
create policy "Public can read project tags for published projects"
on public.project_tags for select
using (
  exists (
    select 1
    from public.projects
    where projects.id = project_tags.project_id
      and projects.visibility = 'public'
      and projects.archived_at is null
      and projects.status <> 'archived'
  )
);

drop policy if exists "Authenticated users read all project tags" on public.project_tags;
create policy "Authenticated users read all project tags"
on public.project_tags for select
using (auth.role() = 'authenticated');

drop policy if exists "Authenticated users manage project tags" on public.project_tags;
create policy "Authenticated users manage project tags"
on public.project_tags for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('project-assets', 'project-assets', true)
on conflict (id) do nothing;

drop policy if exists "Public can read project assets" on storage.objects;
create policy "Public can read project assets"
on storage.objects for select
using (bucket_id = 'project-assets');

drop policy if exists "Authenticated users manage project assets" on storage.objects;
create policy "Authenticated users manage project assets"
on storage.objects for all
using (bucket_id = 'project-assets' and auth.role() = 'authenticated')
with check (bucket_id = 'project-assets' and auth.role() = 'authenticated');
