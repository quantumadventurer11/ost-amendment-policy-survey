create extension if not exists pgcrypto;

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  respondent_name text,
  respondent_email text,
  respondent_role text,
  respondent_type text,
  answers jsonb not null,
  comments jsonb,
  artemis_support text,
  selected_artemis_policies text[],
  top_priorities text[],
  final_recommendation text,
  user_agent text,
  survey_version text default '1.0'
);

alter table public.survey_responses enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'survey_responses'
      and policyname = 'allow_anon_insert'
  ) then
    create policy "allow_anon_insert"
    on public.survey_responses
    for insert
    to anon
    with check (true);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'survey_responses'
      and policyname = 'allow_service_select'
  ) then
    create policy "allow_service_select"
    on public.survey_responses
    for select
    to service_role
    using (true);
  end if;
end
$$;

create table if not exists public.survey_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  reviewer_name text,
  reviewer_email text,
  section_id text,
  question_id text,
  feedback_type text,
  feedback_text text not null,
  suggested_revision text,
  priority text,
  status text default 'new'
);

alter table public.survey_feedback enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'survey_feedback'
      and policyname = 'allow_anon_feedback_insert'
  ) then
    create policy "allow_anon_feedback_insert"
    on public.survey_feedback
    for insert
    to anon
    with check (true);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'survey_feedback'
      and policyname = 'allow_service_feedback_select'
  ) then
    create policy "allow_service_feedback_select"
    on public.survey_feedback
    for select
    to service_role
    using (true);
  end if;
end
$$;
