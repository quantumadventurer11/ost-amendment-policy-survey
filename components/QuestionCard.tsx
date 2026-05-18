"use client";

import type { AnswerValue, SurveyQuestion } from "@/lib/surveyTypes";

interface QuestionCardProps {
  question: SurveyQuestion;
  value: AnswerValue | undefined;
  onChange: (questionId: string, value: AnswerValue) => void;
}

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  const id = `question-${question.id}`;
  const selectedValues = Array.isArray(value) ? value : [];

  const updateCheckbox = (optionValue: string, checked: boolean) => {
    const next = checked ? [...selectedValues, optionValue] : selectedValues.filter((item) => item !== optionValue);
    onChange(question.id, next);
  };

  const moveRanking = (optionValue: string, direction: -1 | 1) => {
    const current = Array.isArray(value) && value.length ? value : question.options?.map((option) => option.value) ?? [];
    const index = current.indexOf(optionValue);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= current.length) return;
    const next = [...current];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(question.id, next);
  };

  return (
    <fieldset className="rounded border border-slate-200 bg-white p-5">
      <legend id={id} className="text-base font-semibold text-slate-950">
        {question.title}
        {question.required ? <span className="ml-1 text-slate-500">*</span> : null}
      </legend>
      {question.context ? <p className="mt-2 text-sm leading-6 text-slate-600">{question.context}</p> : null}

      {question.type === "text" ? (
        <input
          aria-labelledby={id}
          className="mt-4 w-full rounded border border-slate-300 px-3 py-2 text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-700"
          value={typeof value === "string" ? value : ""}
          placeholder={question.placeholder}
          onChange={(event) => onChange(question.id, event.target.value)}
        />
      ) : null}

      {question.type === "textarea" ? (
        <textarea
          aria-labelledby={id}
          className="mt-4 min-h-32 w-full rounded border border-slate-300 px-3 py-2 text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-700"
          value={typeof value === "string" ? value : ""}
          placeholder={question.placeholder}
          onChange={(event) => onChange(question.id, event.target.value)}
        />
      ) : null}

      {question.type === "radio" || question.type === "likert" ? (
        <div className="mt-4 grid gap-2">
          {question.options?.map((option) => (
            <label key={option.value} className="flex gap-3 rounded border border-slate-200 p-3 text-sm hover:bg-slate-50">
              <input
                type="radio"
                name={question.id}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(question.id, option.value)}
                className="mt-1"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      ) : null}

      {question.type === "checkbox" ? (
        <div className="mt-4 grid gap-2">
          {question.options?.map((option) => (
            <label key={option.value} className="flex gap-3 rounded border border-slate-200 p-3 text-sm hover:bg-slate-50">
              <input
                type="checkbox"
                value={option.value}
                checked={selectedValues.includes(option.value)}
                onChange={(event) => updateCheckbox(option.value, event.target.checked)}
                className="mt-1"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      ) : null}

      {question.type === "ranking" ? (
        <ol className="mt-4 grid gap-2">
          {(Array.isArray(value) && value.length ? value : question.options?.map((option) => option.value) ?? []).map((optionValue, index) => (
            <li key={optionValue} className="flex items-center justify-between gap-3 rounded border border-slate-200 p-3 text-sm">
              <span>
                <span className="mr-2 font-semibold text-slate-500">{index + 1}.</span>
                {optionValue}
              </span>
              <span className="flex gap-1">
                <button type="button" onClick={() => moveRanking(optionValue, -1)} className="rounded border border-slate-300 px-2 py-1 hover:bg-slate-100">
                  Up
                </button>
                <button type="button" onClick={() => moveRanking(optionValue, 1)} className="rounded border border-slate-300 px-2 py-1 hover:bg-slate-100">
                  Down
                </button>
              </span>
            </li>
          ))}
        </ol>
      ) : null}
    </fieldset>
  );
}
