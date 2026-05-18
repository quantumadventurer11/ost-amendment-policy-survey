import type { StoredSurveyResponse } from "./surveyTypes";

function escapeCsv(value: unknown) {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export function responsesToCsv(responses: StoredSurveyResponse[]) {
  const headers = [
    "id",
    "created_at",
    "respondent_name",
    "respondent_email",
    "respondent_role",
    "respondent_type",
    "artemis_support",
    "selected_artemis_policies",
    "top_priorities",
    "final_recommendation",
    "survey_version",
    "answers",
    "comments",
  ];

  const rows = responses.map((response) =>
    headers.map((header) => escapeCsv(response[header as keyof StoredSurveyResponse])).join(","),
  );

  return [headers.join(","), ...rows].join("\n");
}

export function downloadText(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
