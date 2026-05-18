"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearDraft, loadDraft } from "@/lib/localStorage";
import { surveyConfig } from "@/lib/surveyConfig";
import { getMissingRequiredQuestionIds } from "@/lib/validation";
import type { SurveyDraft } from "@/lib/surveyTypes";

const consent =
  "By submitting, you agree that your responses may be used internally by the Celestial Governance Initiative for policy analysis, survey improvement, report drafting, and preparation of recommendations concerning the Outer Space Treaty, national space legislation, and international frameworks such as the Artemis Accords.";

export function ReviewAnswers() {
  const router = useRouter();
  const [draft] = useState<SurveyDraft | null>(() => loadDraft());
  const [consented, setConsented] = useState(false);
  const [status, setStatus] = useState("");

  const missing = useMemo(() => getMissingRequiredQuestionIds(draft?.answers ?? {}), [draft]);

  const submit = async () => {
    if (!draft || !consented) return;
    setStatus("Submitting response...");
    const answers = draft.answers;
    const comments = Object.fromEntries(
      Object.entries(answers).filter(
        ([id, value]) =>
          typeof value === "string" &&
          (id.endsWith(".3") || id.endsWith(".4") || id.endsWith(".5") || id.endsWith(".6") || value.length > 120),
      ),
    );
    const response = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...draft,
        comments,
        artemis_support: typeof answers["13.1"] === "string" ? answers["13.1"] : "",
        selected_artemis_policies: Array.isArray(answers["13.2"]) ? answers["13.2"] : [],
        top_priorities: Array.isArray(answers["14.1"]) ? answers["14.1"].slice(0, 3) : [],
        final_recommendation: typeof answers["15.2"] === "string" ? answers["15.2"] : "",
        survey_version: surveyConfig.surveyVersion,
      }),
    });

    if (!response.ok) {
      setStatus("Submission failed. Please check the configuration or try again.");
      return;
    }

    clearDraft();
    router.push("/thank-you");
  };

  if (!draft) {
    return (
      <div className="rounded border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold">No saved draft found</h1>
        <p className="mt-3 text-slate-600">Start the survey before reviewing answers.</p>
        <Link href="/survey" className="mt-4 inline-block rounded bg-slate-900 px-4 py-2 font-medium text-white">
          Start survey
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded border border-slate-200 bg-white p-6">
        <h1 className="text-3xl font-semibold">Review before submission</h1>
        <p className="mt-3 text-slate-600">Review your answers, confirm consent, then submit the response.</p>
        {missing.length ? (
          <p className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Missing required answers: {missing.join(", ")}. You may return to the survey before submitting.
          </p>
        ) : null}
      </section>

      <section className="rounded border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Respondent information</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="font-medium">Name</dt><dd>{draft.respondent_name || "Anonymous"}</dd></div>
          <div><dt className="font-medium">Email</dt><dd>{draft.respondent_email || "Not provided"}</dd></div>
          <div><dt className="font-medium">Role</dt><dd>{draft.respondent_role || "Not provided"}</dd></div>
          <div><dt className="font-medium">Respondent type</dt><dd>{draft.respondent_type || "Not provided"}</dd></div>
        </dl>
      </section>

      {surveyConfig.sections.slice(1).map((section) => (
        <section key={section.id} className="rounded border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold">{section.title}</h2>
          <div className="mt-4 space-y-4">
            {section.questions.map((question) => {
              const value = draft.answers[question.id];
              return (
                <div key={question.id} className="border-t border-slate-100 pt-3">
                  <p className="text-sm font-medium text-slate-900">{question.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{Array.isArray(value) ? value.join(" | ") : value || "No answer"}</p>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <section className="rounded border border-slate-200 bg-white p-6">
        <label className="flex gap-3 text-sm leading-6 text-slate-700">
          <input type="checkbox" checked={consented} onChange={(event) => setConsented(event.target.checked)} className="mt-1" />
          <span>{consent}</span>
        </label>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href="/survey" className="rounded border border-slate-300 px-4 py-2 text-center font-medium">
            Return to survey
          </Link>
          <button
            type="button"
            disabled={!consented}
            onClick={submit}
            className="rounded bg-slate-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Submit response
          </button>
        </div>
        {status ? <p className="mt-3 text-sm text-slate-600">{status}</p> : null}
      </section>
    </div>
  );
}
