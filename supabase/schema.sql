-- ============================================================
-- FASE 2: Schema Database Supabase — Portfolio
-- Jalankan seluruh SQL ini di Supabase Studio > SQL Editor
-- Urutan eksekusi PENTING — jalankan dari atas ke bawah
-- Mengikuti schema.md persis
-- ============================================================

-- ----------------------------------------
-- STEP 1: Extension & Fungsi Shared
-- ----------------------------------------

create extension if not exists "pgcrypto";

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ----------------------------------------
-- STEP 2: Enum Types
-- ----------------------------------------

create type skill_category as enum (
  'programming_language',
  'framework_library',
  'tools_practice'
);

create type post_status as enum ('draft', 'published');

-- ----------------------------------------
-- STEP 3: Tabel about_me (1 baris saja)
-- ----------------------------------------

create table about_me (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role_title text not null,
  headline text,
  bio text,
  avatar_url text,
  cv_url text,
  email text,
  location text,
  updated_at timestamptz not null default now()
);

create trigger trg_about_me_updated_at
before update on about_me
for each row execute function set_updated_at();

-- ----------------------------------------
-- STEP 4: Tabel social_links
-- ----------------------------------------

create table social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_social_links_order on social_links (display_order);

-- ----------------------------------------
-- STEP 5: Tabel skills
-- ----------------------------------------

create table skills (
  id uuid primary key default gen_random_uuid(),
  category skill_category not null,
  name text not null,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_skills_category on skills (category);
create index idx_skills_order on skills (display_order);

-- ----------------------------------------
-- STEP 6: Tabel experience
-- ----------------------------------------

create table experience (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  company_logo_url text,
  position_title text not null,
  description_points text[] not null default '{}',
  start_month int not null check (start_month between 1 and 12),
  start_year int not null,
  end_month int check (end_month between 1 and 12),
  end_year int,
  is_current boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_experience_updated_at
before update on experience
for each row execute function set_updated_at();

create index idx_experience_order on experience (display_order);

-- ----------------------------------------
-- STEP 7: Tabel projects
-- ----------------------------------------

create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  thumbnail_url text,
  description text not null,
  tech_stack text[] not null default '{}',
  live_url text,
  repo_url text,
  is_featured boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_projects_updated_at
before update on projects
for each row execute function set_updated_at();

create unique index idx_projects_slug on projects (slug);
create index idx_projects_order on projects (display_order);

-- ----------------------------------------
-- STEP 8: Tabel blog_posts
-- ----------------------------------------

create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  cover_image_url text,
  excerpt text,
  content text not null,
  status post_status not null default 'draft',
  tags text[] not null default '{}',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_blog_posts_updated_at
before update on blog_posts
for each row execute function set_updated_at();

create unique index idx_blog_posts_slug on blog_posts (slug);
create index idx_blog_posts_status on blog_posts (status);
create index idx_blog_posts_published_at on blog_posts (published_at desc);

-- ----------------------------------------
-- STEP 9: Aktifkan Row Level Security (RLS)
-- ----------------------------------------

alter table about_me enable row level security;
alter table social_links enable row level security;
alter table skills enable row level security;
alter table experience enable row level security;
alter table projects enable row level security;
alter table blog_posts enable row level security;

-- ----------------------------------------
-- STEP 10: RLS Policies
-- ----------------------------------------

-- === about_me ===
create policy "public read about_me" on about_me
  for select using (true);
create policy "authenticated write about_me" on about_me
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- === social_links ===
create policy "public read social_links" on social_links
  for select using (true);
create policy "authenticated write social_links" on social_links
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- === skills ===
create policy "public read skills" on skills
  for select using (true);
create policy "authenticated write skills" on skills
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- === experience ===
create policy "public read experience" on experience
  for select using (true);
create policy "authenticated write experience" on experience
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- === projects ===
create policy "public read projects" on projects
  for select using (true);
create policy "authenticated write projects" on projects
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- === blog_posts ===
-- Publik hanya boleh baca yang published
create policy "public read published blog_posts" on blog_posts
  for select using (status = 'published');
-- Authenticated (admin) boleh baca semua, termasuk draft
create policy "authenticated read all blog_posts" on blog_posts
  for select using (auth.role() = 'authenticated');
-- Authenticated boleh tulis semua
create policy "authenticated write blog_posts" on blog_posts
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- STEP 11: Storage Buckets
-- Buat manual di Supabase Dashboard > Storage > New Bucket,
-- ATAU jalankan SQL berikut jika menggunakan SQL Editor:
-- ============================================================

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('cv', 'cv', true),
  ('company-logos', 'company-logos', true),
  ('project-images', 'project-images', true),
  ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

-- Storage Policies — ulangi pola untuk tiap bucket
-- (avatars)
create policy "public read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');
create policy "authenticated upload avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');
create policy "authenticated update avatars"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.role() = 'authenticated');
create policy "authenticated delete avatars"
  on storage.objects for delete
  using (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- (cv)
create policy "public read cv"
  on storage.objects for select
  using (bucket_id = 'cv');
create policy "authenticated upload cv"
  on storage.objects for insert
  with check (bucket_id = 'cv' and auth.role() = 'authenticated');
create policy "authenticated update cv"
  on storage.objects for update
  using (bucket_id = 'cv' and auth.role() = 'authenticated');
create policy "authenticated delete cv"
  on storage.objects for delete
  using (bucket_id = 'cv' and auth.role() = 'authenticated');

-- (company-logos)
create policy "public read company-logos"
  on storage.objects for select
  using (bucket_id = 'company-logos');
create policy "authenticated upload company-logos"
  on storage.objects for insert
  with check (bucket_id = 'company-logos' and auth.role() = 'authenticated');
create policy "authenticated update company-logos"
  on storage.objects for update
  using (bucket_id = 'company-logos' and auth.role() = 'authenticated');
create policy "authenticated delete company-logos"
  on storage.objects for delete
  using (bucket_id = 'company-logos' and auth.role() = 'authenticated');

-- (project-images)
create policy "public read project-images"
  on storage.objects for select
  using (bucket_id = 'project-images');
create policy "authenticated upload project-images"
  on storage.objects for insert
  with check (bucket_id = 'project-images' and auth.role() = 'authenticated');
create policy "authenticated update project-images"
  on storage.objects for update
  using (bucket_id = 'project-images' and auth.role() = 'authenticated');
create policy "authenticated delete project-images"
  on storage.objects for delete
  using (bucket_id = 'project-images' and auth.role() = 'authenticated');

-- (blog-images)
create policy "public read blog-images"
  on storage.objects for select
  using (bucket_id = 'blog-images');
create policy "authenticated upload blog-images"
  on storage.objects for insert
  with check (bucket_id = 'blog-images' and auth.role() = 'authenticated');
create policy "authenticated update blog-images"
  on storage.objects for update
  using (bucket_id = 'blog-images' and auth.role() = 'authenticated');
create policy "authenticated delete blog-images"
  on storage.objects for delete
  using (bucket_id = 'blog-images' and auth.role() = 'authenticated');

-- ============================================================
-- STEP 12: Seed Data Awal
-- Isi dengan data nyata Anda di Supabase Studio > Table Editor
-- Atau uncomment dan edit data di bawah ini:
-- ============================================================

-- Contoh data about_me (isi sesuai profil Anda):
-- INSERT INTO about_me (full_name, role_title, headline, bio, email, location)
-- VALUES (
--   'Abdul Rahem Faqih',
--   'Fullstack Developer',
--   'Membangun aplikasi web modern — dari antarmuka ke infrastruktur.',
--   'Saya adalah Fullstack Developer dengan pengalaman dalam pengembangan aplikasi web modern, mencakup frontend (React, Next.js), backend (Node.js, Laravel), database (PostgreSQL, MySQL), dan integrasi API. Saya fokus pada kode yang bersih, performa yang baik, dan pengalaman pengguna yang solid.',
--   'abdulrahemfaqih@gmail.com',
--   'Indonesia'
-- );

-- Contoh social_links:
-- INSERT INTO social_links (platform, url, display_order) VALUES
--   ('github', 'https://github.com/abdulrahemfaqih', 0),
--   ('linkedin', 'https://linkedin.com/in/abdulrahemfaqih', 1);
