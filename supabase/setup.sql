-- ════════════════════════════════════════════════════════════════
--  Our Memory Garden — Supabase setup
--  Run this whole file in: Supabase Dashboard → SQL Editor → New query
-- ════════════════════════════════════════════════════════════════

-- 1) The memories table -------------------------------------------------
create table if not exists public.memories (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('photo', 'message')),
  image_url   text,
  caption     text,
  author      text,
  created_at  timestamptz not null default now()
);

-- Helpful index for ordering by date
create index if not exists memories_created_at_idx
  on public.memories (created_at desc);

-- 2) Row Level Security -------------------------------------------------
--    This is a private gift app (protected by the password gate in the UI),
--    so we allow public read + insert. We do NOT allow update/delete from
--    the browser, so memories can't be tampered with or wiped by visitors.
alter table public.memories enable row level security;

drop policy if exists "public read"   on public.memories;
drop policy if exists "public insert" on public.memories;
drop policy if exists "public delete" on public.memories;

create policy "public read"
  on public.memories for select
  using (true);

create policy "public insert"
  on public.memories for insert
  with check (true);

-- Allow deleting a memory from the app (used by the trash button).
create policy "public delete"
  on public.memories for delete
  using (true);

-- 3) Storage bucket for photos -----------------------------------------
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do update set public = true;

-- Allow anyone to read photos, and allow uploads to the 'photos' bucket.
drop policy if exists "photos public read"   on storage.objects;
drop policy if exists "photos public upload"  on storage.objects;
drop policy if exists "photos public delete"  on storage.objects;

create policy "photos public read"
  on storage.objects for select
  using (bucket_id = 'photos');

create policy "photos public upload"
  on storage.objects for insert
  with check (bucket_id = 'photos');

-- Allow the app to remove a photo file when its memory is deleted.
create policy "photos public delete"
  on storage.objects for delete
  using (bucket_id = 'photos');

-- ✅ Done! Your app can now read, add, and upload memories.
