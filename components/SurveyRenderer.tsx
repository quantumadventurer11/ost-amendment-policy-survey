"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import { SectionIntro } from "./SectionIntro";
import { clearDraft, loadDraft, saveDraft } from "@/lib/localStorage";
import { requiredQuestions, surveyConfig } from "@/lib/surveyConfig";
import type { AnswerValue, SurveyDraft } from "@/lib/surveyTypes";

const initialDraft: SurveyDraft = {
  respondent_name: "",
  respondent_email: "",
  respondent_role: "",
  respondent_type: "",
  answers: {},
};

export function SurveyRenderer() {
  const router = useRouter();
  const [draft, setDraft] = useState<SurveyDraft>(() => {
    const saved = loadDraft();
    return saved ? { ...initialDraft, ...saved, answers: saved.answers ?? {} } : initialDraft;
  });
  const [sectionIndex, setSectionIndex] = useState(0);

  useEffect(() => {
    saveDraft(draft);
  }, [draft]);

  const section = surveyConfig.sections[sectionIndex];
  const completedRequired = useMemo(
    () =>
      requiredQuestions.filter((question) => {
        const value = draft.answers[question.id];
        return Array.isArray(value) ? value.length > 0 : Boolean(value);
      }).length,
    [draft.answers],
  );

  const handleChange = (questionId: string, value: AnswerValue) => {
    const profileKeys = ["respondent_name", "respondent_email", "respondent_role", "respondent_type"];
    if (profileKeys.includes(questionId)) {
      setDraft((current) => ({ ...current, [questionId]: value }));
      return;
    }
    setDraft((current) => ({ ...current, answers: { ...current.answers, [questionId]: value } }));
  };

  const getValue = (questionId: string) => {
    if (questionId === "respondent_name") return draft.respondent_name;
    if (questionId === "respondent_email") return draft.respondent_email;
    if (questionId === "respondent_role") return draft.respondent_role;
    if (questionId === "respondent_type") return draft.respondent_type;
    return draft.answers[questionId];
  };

  const resetDraft = () => {
    clearDraft();
    setDraft(initialDraft);
    setSectionIndex(0);
  };

  const goToReview = () => {
    saveDraft(draft);
    router.push("/review");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <ProgressBar completed={completedRequired} total={requiredQuestions.length} />
        <div className="rounded border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-900">Save progress locally</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Draft answers are stored in this browser only until submission or manual clearing.
          </p>
          <button
            type="button"
            onClick={resetDraft}
            className="mt-4 w-full rounded border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-700"
          >
            Clear saved draft
          </button>
        </div>
        <nav aria-label="Survey sections" className="rounded border border-slate-200 bg-white p-2">
          {surveyConfig.sections.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSectionIndex(index)}
              className={`block w-full rounded px-3 py-2 text-left text-sm ${
                index === sectionIndex ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.id.toUpperCase()} {item.title}
            </button>
          ))}
        </nav>
      </aside>

      <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
        <SectionIntro section={section} />
        {section.questions.map((question) => (
          <QuestionCard key={question.id} question={question} value={getValue(question.id)} onChange={handleChange} />
        ))}

        <div className="flex flex-col gap-3 rounded border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setSectionIndex((index) => Math.max(0, index - 1))}
            disabled={sectionIndex === 0}
            className="rounded border border-slate-300 px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous section
          </button>
          {sectionIndex < surveyConfig.sections.length - 1 ? (
            <button
              type="button"
              onClick={() => setSectionIndex((index) => Math.min(surveyConfig.sections.length - 1, index + 1))}
              className="rounded bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-700"
            >
              Next section
            </button>
          ) : (
            <button
              type="button"
              onClick={goToReview}
              className="rounded bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-700"
            >
              Review answers
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
