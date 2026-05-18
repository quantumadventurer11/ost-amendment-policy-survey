"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { allQuestions, surveyConfig } from "@/lib/surveyConfig";

const feedbackTypes = [
  "Wording issue",
  "Bias or leading question",
  "Missing policy option",
  "Legal accuracy concern",
  "Technical issue",
  "UX issue",
  "New question suggestion",
];

const priorities = ["Low", "Medium", "High", "Critical"];

interface FeedbackResponse {
  ok?: boolean;
  mode?: "supabase" | "local-only";
  warning?: string;
  error?: unknown;
}

export function FeedbackForm() {
  const params = useSearchParams();
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    reviewer_name: "",
    reviewer_email: "",
    section_id: params.get("section") ?? "",
    question_id: params.get("question") ?? "",
    feedback_type: "Wording issue",
    feedback_text: "",
    suggested_revision: "",
    priority: "Medium",
  });

  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("Submitting feedback...");
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!response.ok) {
      setStatus("Feedback submission failed. Please check required fields or Supabase configuration.");
      return;
    }
    const result = (await response.json()) as FeedbackResponse;
    setStatus(
      result.mode === "local-only"
        ? "Feedback accepted in local development mode only. Configure Supabase before production review."
        : "Feedback saved to Supabase. Thank you.",
    );
    setForm((current) => ({ ...current, feedback_text: "", suggested_revision: "" }));
  };

  return (
    <form onSubmit={submit} className="space-y-5 rounded border border-slate-200 bg-white p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label="Reviewer name" value={form.reviewer_name} onChange={(value) => update("reviewer_name", value)} />
        <TextInput label="Reviewer email" value={form.reviewer_email} onChange={(value) => update("reviewer_email", value)} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Select label="Section ID" value={form.section_id} onChange={(value) => update("section_id", value)} options={["", ...surveyConfig.sections.map((section) => section.id)]} />
        <Select label="Question ID" value={form.question_id} onChange={(value) => update("question_id", value)} options={["", ...allQuestions.map((question) => question.id)]} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Select label="Feedback type" value={form.feedback_type} onChange={(value) => update("feedback_type", value)} options={feedbackTypes} />
        <Select label="Priority" value={form.priority} onChange={(value) => update("priority", value)} options={priorities} />
      </div>
      <label className="block">
        <span className="text-sm font-medium text-slate-800">Feedback text *</span>
        <textarea
          required
          value={form.feedback_text}
          onChange={(event) => update("feedback_text", event.target.value)}
          className="mt-2 min-h-32 w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-700"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-slate-800">Suggested revision</span>
        <textarea
          value={form.suggested_revision}
          onChange={(event) => update("suggested_revision", event.target.value)}
          className="mt-2 min-h-24 w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-700"
        />
      </label>
      <button type="submit" className="rounded bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700">
        Submit feedback
      </button>
      {status ? <p className="text-sm text-slate-600">{status}</p> : null}
    </form>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-700" />
    </label>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-700">
        {options.map((option) => (
          <option key={option} value={option}>
            {option || "General"}
          </option>
        ))}
      </select>
    </label>
  );
}
