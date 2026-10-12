create table public.story_chapters (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Sin título',
  content text not null default '',
  chapter_order integer not null default 0 check (chapter_order >= 0),
  period_label text,
  location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint story_chapters_story_order_key unique (story_id, chapter_order)
);

create index story_chapters_owner_id_idx on public.story_chapters (owner_id);
create index story_chapters_story_order_idx on public.story_chapters (story_id, chapter_order);

alter table public.story_chapters enable row level security;

create policy owners_manage_story_chapters
  on public.story_chapters
  for all
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create table public.story_versions (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  chapter_id uuid references public.story_chapters(id) on delete set null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Versión sin título',
  content text not null default '',
  change_reason text,
  created_at timestamptz not null default now()
);

create index story_versions_owner_id_idx on public.story_versions (owner_id);
create index story_versions_story_created_idx on public.story_versions (story_id, created_at desc);
create index story_versions_chapter_id_idx on public.story_versions (chapter_id);

alter table public.story_versions enable row level security;

create policy owners_manage_story_versions
  on public.story_versions
  for all
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);
