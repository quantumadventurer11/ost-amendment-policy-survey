# OST Amendment Policy Survey

Professional Next.js survey application for collecting structured policy responses about proposed Outer Space Treaty amendments, national space legislation comparisons, and the Artemis Accords.

## Local setup

```powershell
cd C:\
mkdir C:\OST-Amendment-Policy-Survey
cd C:\OST-Amendment-Policy-Survey
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local`. Respondent submissions use only public Supabase anon credentials:

```env
# Public browser-safe Supabase values used for respondent and feedback inserts.
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Live admin reads are disabled by default. To enable live results on a protected admin deployment, add server-only values:

```env
# Server-side admin controls. Keep live data disabled until /admin is protected.
ADMIN_DASHBOARD_LIVE_DATA=true
SUPABASE_SERVICE_ROLE_KEY=
```

Never expose a Supabase service role key in client code, browser-accessible variables, screenshots, or the repository. In Vercel, `SUPABASE_SERVICE_ROLE_KEY` must be a server environment variable only.

## Supabase SQL

Run the migration in `supabase/migrations/001_create_survey_tables.sql` before accepting production submissions.

If you use the Supabase CLI:

```powershell
supabase link --project-ref zmkoyezcoyqqtcporqaq
supabase db push
```

If you do not use the CLI, paste the migration SQL into the Supabase SQL Editor and run it. The migration creates the same tables and policies as the summary below:

```sql
create table if not exists survey_responses (
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

alter table survey_responses enable row level security;

create policy "allow_anon_insert"
on survey_responses
for insert
to anon
with check (true);

create policy "allow_service_select"
on survey_responses
for select
to service_role
using (true);

create table if not exists survey_feedback (
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

alter table survey_feedback enable row level security;

create policy "allow_anon_feedback_insert"
on survey_feedback
for insert
to anon
with check (true);

create policy "allow_service_feedback_select"
on survey_feedback
for select
to service_role
using (true);
```

Do not add public `select` policies for `survey_responses` or `survey_feedback` unless you fully understand the data exposure risk. The live admin dashboard reads through a server-only Supabase service role key so response data does not need to be readable by the public anon key.

## Running locally

```powershell
npm install
npm run lint
npm run build
npm run dev
```

## Editing survey questions

All survey content lives in `lib/surveyConfig.ts`. Preserve stable question IDs when possible, edit wording or options there, increment `surveyVersion`, update `lastUpdated`, and add a `changeLog` entry.

## Exporting results

The admin page includes CSV and JSON export buttons. By default it uses mock data. It reads live Supabase data only when all of the following are true:

- `NEXT_PUBLIC_SUPABASE_URL` is set.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set.
- `SUPABASE_SERVICE_ROLE_KEY` is set as a server-only environment variable.
- `ADMIN_DASHBOARD_LIVE_DATA=true`.
- `/admin` is protected through Vercel deployment protection or app-level authentication.

The automatic report is available at `/admin/report`. It uses the same mock/live data source as `/admin` and can export Markdown, CSV, and JSON. Protect `/admin/report` the same way as `/admin` before enabling live data.

## Reviewing feedback

Feedback is submitted through `/feedback` and stored in `survey_feedback` when Supabase is configured. Review feedback by priority, update `surveyConfig.ts`, increment the survey version, test, and redeploy. See `docs/improvement-loop.md`.

## Vercel deployment

1. Push the repository to GitHub.
2. Import it into Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Confirm Supabase RLS insert policies are enabled.
5. Enable Vercel deployment protection or add app-level authentication before showing live admin results.
6. Add `SUPABASE_SERVICE_ROLE_KEY` as a server-only Vercel environment variable.
7. Set `ADMIN_DASHBOARD_LIVE_DATA=true` only after admin access is protected.

## Pilot launch checklist

Before sharing the survey:

- Run `npm run lint` and `npm run build`.
- Submit one anonymous survey response with Supabase configured.
- Submit one feedback item with Supabase configured.
- Confirm both rows appear in Supabase.
- Confirm `/admin` shows mock data when `ADMIN_DASHBOARD_LIVE_DATA=false`.
- Confirm `/admin` shows live response counts only after protection and `ADMIN_DASHBOARD_LIVE_DATA=true`.
- Export CSV and JSON from `/admin` and confirm expected rows are included.

## GitHub repository

If GitHub CLI is authenticated:

```powershell
gh repo create ost-amendment-policy-survey --public --source=. --remote=origin --push
```

If not authenticated:

```powershell
gh auth login
gh repo create ost-amendment-policy-survey --public --source=. --remote=origin --push
```

Manual remote setup:

```powershell
git remote add origin https://github.com/<YOUR_USERNAME>/ost-amendment-policy-survey.git
git branch -M main
git push -u origin main
```

## Security notes

- Survey respondents do not need accounts.
- Name, email, role, and respondent type are optional.
- Do not collect sensitive personal data.
- Only Supabase anon keys belong in client-accessible environment variables.
- The admin page must be protected before live data is enabled.
- Do not create anon `select` policies for response tables for normal pilot use.
- Use `SUPABASE_SERVICE_ROLE_KEY` only as a server-side secret for protected admin reads.

## Known limitations

- Admin results use mock data by default unless live data is explicitly enabled.
- No custom production authentication is included; use Vercel deployment protection for the pilot or add app-level auth later.
- API routes accept submissions only when Supabase is configured; otherwise they return a local-only success response for development.
- Legal-policy text reflects supplied project framing and does not add external legal citations.

## Troubleshooting

- If submissions do not appear, confirm `.env.local`, table names, and RLS insert policies.
- If survey submission reports a missing `user_agent` column, run `alter table survey_responses add column if not exists user_agent text;`.
- If `/admin` still shows mock data, confirm `ADMIN_DASHBOARD_LIVE_DATA=true`, `SUPABASE_SERVICE_ROLE_KEY`, and deployment protection.
- If GitHub push fails, run `gh auth login` or add the remote manually.
- If build fails after editing survey content, check for malformed question objects or non-string option values.
