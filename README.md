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

Copy `.env.example` to `.env.local` and add only public Supabase anon credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Never expose a Supabase service role key in this app.

## Supabase SQL

Run this SQL in Supabase before accepting production submissions:

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
  survey_version text default '1.0'
);

alter table survey_responses enable row level security;

create policy "Allow public survey submissions"
on survey_responses
for insert
to anon
with check (true);

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

create policy "Allow public survey feedback"
on survey_feedback
for insert
to anon
with check (true);
```

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

The admin page includes CSV and JSON export buttons. In v1 it uses mock data unless a protected live-data read path is added.

## Reviewing feedback

Feedback is submitted through `/feedback` and stored in `survey_feedback` when Supabase is configured. Review feedback by priority, update `surveyConfig.ts`, increment the survey version, test, and redeploy. See `docs/improvement-loop.md`.

## Vercel deployment

1. Push the repository to GitHub.
2. Import it into Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Confirm Supabase RLS policies are enabled.
5. Protect the admin route before public release.

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
- The admin page is not authenticated in v1 and must not be presented as secure.
- Add protected admin authentication and restricted read policies before exposing live results.

## Known limitations

- Admin results use mock data by default.
- No production authentication is included.
- API routes accept submissions only when Supabase is configured; otherwise they return a local-only success response for development.
- Legal-policy text reflects supplied project framing and does not add external legal citations.

## Troubleshooting

- If submissions do not appear, confirm `.env.local`, table names, and RLS insert policies.
- If GitHub push fails, run `gh auth login` or add the remote manually.
- If build fails after editing survey content, check for malformed question objects or non-string option values.
