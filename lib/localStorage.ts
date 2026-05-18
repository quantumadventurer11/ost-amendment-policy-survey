import type { SurveyDraft } from "./surveyTypes";

const STORAGE_KEY = "ost-amendment-policy-survey-draft";

export function loadDraft(): SurveyDraft | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SurveyDraft;
  } catch {
    return null;
  }
}

export function saveDraft(draft: SurveyDraft) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
