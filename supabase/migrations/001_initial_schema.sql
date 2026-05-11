-- CVGen database schema
-- Migration: 001_initial_schema
-- Run via: npx supabase db push

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- One per user. Stores the full skill inventory and background.
-- ============================================================

create table profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,

  -- Personal info
  full_name text not null default '',
  email text not null default '',
  phone text default '',
  location text default '',
  linkedin_url text default '',
  github_url text default '',

  -- Professional statement (optional, used as fallback context)
  professional_statement text default '',

  -- Work experience (stored as JSONB array for flexibility)
  -- Each item: { title, company, start_date, end_date, is_current, tasks: string[], tools: string[] }
  work_experience jsonb not null default '[]',

  -- Education
  -- Each item: { degree, institution, start_date, end_date, specialisation, courses: string[] }
  education jsonb not null default '[]',

  -- Academic projects
  -- Each item: { title, description, stack: string[], skills_demonstrated: string[], github_url, NOT_in_project: string[] }
  projects jsonb not null default '[]',

  -- Volunteering
  -- Each item: { role, organisation, date, description }
  volunteering jsonb not null default '[]',

  -- Interests
  -- Each item: { name, description }
  interests jsonb not null default '[]',

  -- Field of work (e.g. 'IT', 'Marketing', 'Finance') — for future non-IT support
  field text not null default 'IT',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- SKILL ITEMS
-- Individual skills linked to a profile.
-- Separated from profiles table for easier querying and filtering.
-- ============================================================

create table skill_items (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id) on delete cascade not null,

  -- The skill name (e.g. 'React', 'Python', 'PostgreSQL')
  name text not null,

  -- Category auto-suggested by AI (e.g. 'Frontend', 'Cloud & DevOps', 'Data & ML')
  category text not null default 'Other',

  -- Context: how was this skill used?
  context text not null check (context in ('professional', 'academic', 'learning', 'exposure')),

  -- Free-text description of how the skill was used
  usage_description text default '',

  -- Whether this is a current learning in progress
  is_learning boolean not null default false,

  -- Display order within its category
  sort_order integer not null default 0,

  created_at timestamptz not null default now()
);

-- ============================================================
-- JOB APPLICATIONS
-- One per job the user applies to.
-- ============================================================

create table job_applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,

  -- Job details
  company_name text not null,
  role_title text not null,
  job_ad_text text not null,           -- the raw pasted job offer
  job_url text default '',

  -- AI-generated job analysis (stored so we don't re-run it)
  -- Structure mirrors the prompt system: { responsibilities, required_skills, nice_to_have, gaps, culture_notes }
  job_analysis jsonb default null,

  -- Application status
  status text not null default 'draft' check (status in ('draft', 'applied', 'interviewing', 'rejected', 'offered')),

  -- Optional notes
  notes text default '',

  applied_at timestamptz default null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- GENERATED DOCUMENTS
-- CV and cover letter output, linked to a job application.
-- ============================================================

create table generated_documents (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid references job_applications(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,

  -- Document type
  document_type text not null check (document_type in ('cv', 'cover_letter', 'cover_letter_short')),

  -- The generated text content
  content text not null,

  -- The prompt that was used (for debugging and iteration)
  prompt_used text default '',

  -- Supabase Storage path for exported PDF
  pdf_path text default null,

  -- Which Claude model was used
  model_used text not null default 'claude-sonnet-4-20250514',

  -- Token usage for monitoring
  tokens_input integer default 0,
  tokens_output integer default 0,

  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Users can only access their own data.
-- ============================================================

alter table profiles enable row level security;
alter table skill_items enable row level security;
alter table job_applications enable row level security;
alter table generated_documents enable row level security;

-- Profiles: users manage their own profile only
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = user_id);

create policy "Users can delete own profile"
  on profiles for delete using (auth.uid() = user_id);

-- Skill items: access via profile ownership
create policy "Users can view own skills"
  on skill_items for select
  using (exists (
    select 1 from profiles where profiles.id = skill_items.profile_id and profiles.user_id = auth.uid()
  ));

create policy "Users can insert own skills"
  on skill_items for insert
  with check (exists (
    select 1 from profiles where profiles.id = skill_items.profile_id and profiles.user_id = auth.uid()
  ));

create policy "Users can update own skills"
  on skill_items for update
  using (exists (
    select 1 from profiles where profiles.id = skill_items.profile_id and profiles.user_id = auth.uid()
  ));

create policy "Users can delete own skills"
  on skill_items for delete
  using (exists (
    select 1 from profiles where profiles.id = skill_items.profile_id and profiles.user_id = auth.uid()
  ));

-- Job applications: users manage their own only
create policy "Users can view own applications"
  on job_applications for select using (auth.uid() = user_id);

create policy "Users can insert own applications"
  on job_applications for insert with check (auth.uid() = user_id);

create policy "Users can update own applications"
  on job_applications for update using (auth.uid() = user_id);

create policy "Users can delete own applications"
  on job_applications for delete using (auth.uid() = user_id);

-- Generated documents: users manage their own only
create policy "Users can view own documents"
  on generated_documents for select using (auth.uid() = user_id);

create policy "Users can insert own documents"
  on generated_documents for insert with check (auth.uid() = user_id);

create policy "Users can delete own documents"
  on generated_documents for delete using (auth.uid() = user_id);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- Automatically update the updated_at column on row changes.
-- ============================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

create trigger job_applications_updated_at
  before update on job_applications
  for each row execute function update_updated_at();

-- ============================================================
-- INDEXES
-- ============================================================

create index skill_items_profile_id_idx on skill_items(profile_id);
create index skill_items_category_idx on skill_items(category);
create index job_applications_user_id_idx on job_applications(user_id);
create index job_applications_status_idx on job_applications(status);
create index generated_documents_application_id_idx on generated_documents(application_id);
