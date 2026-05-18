import { allQuestions } from "./surveyConfig";
import type { StoredSurveyResponse } from "./surveyTypes";

export interface CountDatum {
  name: string;
  count: number;
}

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

export function countQuestionAnswers(responses: StoredSurveyResponse[], questionId: string): CountDatum[] {
  const counts = new Map<string, number>();
  for (const response of responses) {
    const value = response.answers[questionId];
    if (Array.isArray(value)) {
      value.forEach((item) => increment(counts, item));
    } else if (value) {
      increment(counts, value);
    }
  }
  return [...counts.entries()].map(([name, count]) => ({ name, count }));
}

export function getRadioQuestions() {
  return allQuestions.filter((question) => question.type === "radio");
}

export function getCheckboxQuestions() {
  return allQuestions.filter((question) => question.type === "checkbox");
}

export function countTopPriorities(responses: StoredSurveyResponse[]) {
  const counts = new Map<string, number>();
  for (const response of responses) {
    const priorities = response.top_priorities?.length ? response.top_priorities : response.answers["14.1"];
    if (Array.isArray(priorities)) priorities.slice(0, 5).forEach((priority) => increment(counts, priority));
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
