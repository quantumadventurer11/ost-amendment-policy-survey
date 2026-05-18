# Survey Improvement Loop

## Collect

Reviewers submit issues through `/feedback`, including section ID, question ID, feedback type, priority, feedback text, and suggested revision. Feedback is stored in `survey_feedback` when Supabase is configured.

## Review

The research lead should review new feedback by priority:

1. Critical legal accuracy, bias, or technical issues.
2. High-priority missing options or wording concerns.
3. Medium and low-priority clarity or UX improvements.

## Update

Make survey changes only in `lib/surveyConfig.ts`.

- Preserve question IDs when the analytical meaning of the question is unchanged.
- Add a new ID when a question changes enough to affect longitudinal comparison.
- Keep option wording neutral.
- Add an "Unsure" or "Other" option when the absence of one could force a misleading response.
- Increment `surveyVersion`.
- Update `lastUpdated`.
- Add a `changeLog` entry.

## Test and redeploy

Run:

```powershell
npm run lint
npm run build
```

Deploy to Vercel only after checks pass. Keep the README and Supabase schema notes aligned with any data model changes.
