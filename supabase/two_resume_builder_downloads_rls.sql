-- Close the public read on two_resume_builder_downloads.
-- Run once in the Supabase SQL editor. Safe to run again.
-- Does not change two_resume_builder_resumes, two_resume_builder_versions, or other apps' tables.
--
-- The browser logs a PDF download with the anon key (signed-in users use authenticated).
-- It must insert. It must not read, update, or delete. This table stores names, emails, and full CV JSON.
-- The Supabase dashboard still reads the table through the service role, which bypasses RLS.

alter table public.two_resume_builder_downloads enable row level security;
alter table public.two_resume_builder_downloads force row level security;

revoke all on table public.two_resume_builder_downloads from public, anon, authenticated;
grant insert on table public.two_resume_builder_downloads to anon, authenticated;

drop policy if exists two_resume_builder_downloads_insert on public.two_resume_builder_downloads;
drop policy if exists two_resume_builder_downloads_select on public.two_resume_builder_downloads;
drop policy if exists two_resume_builder_downloads_update on public.two_resume_builder_downloads;
drop policy if exists two_resume_builder_downloads_delete on public.two_resume_builder_downloads;

create policy two_resume_builder_downloads_insert
  on public.two_resume_builder_downloads
  for insert
  to anon, authenticated
  with check (true);
