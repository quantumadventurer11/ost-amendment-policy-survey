# Survey Methodology

## Step 1: Requirements extraction

The application collects structured legal-policy responses from a research team about possible amendments to the Outer Space Treaty, national space legislation comparisons, and the Artemis Accords. It supports anonymous participation, optional respondent metadata, section-by-section completion, local draft autosave, final review, structured submission, aggregate analysis, exports, and reviewer feedback.

## Step 2: Architecture plan

The app uses Next.js App Router with TypeScript and Tailwind CSS. The survey is rendered from `lib/surveyConfig.ts`, validated with Zod, autosaved in LocalStorage, reviewed before submission, and posted to API routes. API routes validate payloads and insert into Supabase when public anon configuration is present. The dashboard uses mock data until production admin authentication and read policies are configured.

## Step 3: Survey design principles

Questions use neutral wording, stable IDs, visible context, and optional comments. The design avoids manipulative UX and allows uncertainty responses where appropriate. Accessibility is supported through labels, fieldsets, keyboard-friendly controls, clear headings, and progress feedback.

## Step 4: Risk review

- Leading wording could distort policy conclusions.
- Missing answer choices could understate disagreement.
- Overcollection of personal data could create avoidable privacy risk.
- Exposed credentials could compromise the database.
- An insecure admin page could expose response data.
- Loss of responses could occur if Supabase is misconfigured.
- Ambiguous legal claims could be mistaken for formal legal authority.

## Step 5: Mitigation plan

The app limits personal data to optional name, email, role, and respondent type. It uses only Supabase anon keys and documents RLS requirements. The admin page warns that it is not secured. Survey changes are centralized in `surveyConfig.ts` with versioning and a change log. Internal author attribution is presented as research context, not formal authority.

## Step 6: Iteration plan

Reviewers submit feedback through the feedback page. The team reviews feedback by priority and type, updates `surveyConfig.ts`, preserves stable IDs when possible, increments `surveyVersion`, updates `lastUpdated`, adds a `changeLog` entry, tests the app, and redeploys.
