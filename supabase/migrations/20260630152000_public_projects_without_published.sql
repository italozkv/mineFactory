do $$
declare
  has_archived_at boolean;
  public_project_condition text;
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'projects'
  ) then
    select exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'projects' and column_name = 'archived_at'
    ) into has_archived_at;

    public_project_condition :=
      'visibility = ''public'' and lower(coalesce(status, '''')) not in (''archived'', ''arquivado'')';

    if has_archived_at then
      public_project_condition := public_project_condition || ' and archived_at is null';
    end if;

    drop policy if exists "Public can read published projects" on public.projects;
    drop policy if exists "Public can read public projects" on public.projects;

    execute format(
      'create policy "Public can read public projects" on public.projects for select using (%s)',
      public_project_condition
    );
  end if;

  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'project_tags'
  ) then
    drop policy if exists "Public can read project tags for published projects" on public.project_tags;
    drop policy if exists "Public can read project tags for public projects" on public.project_tags;

    execute format(
      'create policy "Public can read project tags for public projects"
       on public.project_tags for select
       using (
         exists (
           select 1
           from public.projects
           where projects.id = project_tags.project_id
             and %s
         )
       )',
      replace(public_project_condition, 'archived_at', 'projects.archived_at')
    );
  end if;
end $$;
