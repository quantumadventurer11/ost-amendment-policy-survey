import { allQuestions } from "./surveyConfig";
import { countQuestionAnswers, countTopPriorities } from "./analytics";
import type { StoredSurveyResponse, SurveyQuestion } from "./surveyTypes";

export interface ReportOptionSummary {
  questionId: string;
  questionTitle: string;
  leadingOption: string;
  leadingCount: number;
  total: number;
  share: number;
}

export interface ReportComment {
  questionId: string;
  questionTitle: string;
  text: string;
}

export interface SurveyReport {
  generatedAt: string;
  responseCount: number;
  surveyVersion: string;
  artemisBreakdown: { name: string; count: number }[];
  topPriorities: { name: string; count: number }[];
  consensus: ReportOptionSummary[];
  disagreement: ReportOptionSummary[];
  writtenRecommendations: ReportComment[];
}

const questionById = new Map(allQuestions.map((question) => [question.id, question]));
const radioQuestions = allQuestions.filter((question) => question.type === "radio");
const textQuestions = allQuestions.filter((question) => question.type === "textarea");

function summarizeQuestion(responses: StoredSurveyResponse[], question: SurveyQuestion): ReportOptionSummary | null {
  const counts = countQuestionAnswers(responses, question.id);
  const total = counts.reduce((sum, item) => sum + item.count, 0);
  if (!total) return null;

  const leading = [...counts].sort((a, b) => b.count - a.count)[0];
  return {
    questionId: question.id,
    questionTitle: question.title,
    leadingOption: leading.name,
    leadingCount: leading.count,
    total,
    share: leading.count / total,
  };
}

export function buildSurveyReport(responses: StoredSurveyResponse[]): SurveyReport {
  const radioSummaries = radioQuestions
    .map((question) => summarizeQuestion(responses, question))
    .filter((summary): summary is ReportOptionSummary => Boolean(summary));

  const consensus = radioSummaries
    .filter((summary) => summary.total >= 2 && summary.share >= 0.67)
    .sort((a, b) => b.share - a.share || b.total - a.total)
    .slice(0, 8);

  const disagreement = radioSummaries
    .filter((summary) => summary.total >= 2 && summary.share <= 0.6)
    .sort((a, b) => a.share - b.share || b.total - a.total)
    .slice(0, 8);

  return {
    generatedAt: new Date().toISOString(),
    responseCount: responses.length,
    surveyVersion: responses[0]?.survey_version ?? "1.0",
    artemisBreakdown: countQuestionAnswers(responses, "13.1"),
    topPriorities: countTopPriorities(responses),
    consensus,
    disagreement,
    writtenRecommendations: collectWrittenRecommendations(responses),
  };
}

function collectWrittenRecommendations(responses: StoredSurveyResponse[]): ReportComment[] {
  const textQuestionIds = new Set(textQuestions.map((question) => question.id));
  const comments: ReportComment[] = [];

  for (const response of responses) {
    for (const [questionId, value] of Object.entries(response.answers)) {
      if (!textQuestionIds.has(questionId) || typeof value !== "string" || !value.trim()) continue;
      const question = questionById.get(questionId);
      comments.push({
        questionId,
        questionTitle: question?.title ?? questionId,
        text: value.trim().slice(0, 900),
      });
    }
  }

  return comments.slice(0, 20);
}

export function reportToMarkdown(report: SurveyReport, usingMockData: boolean) {
  const lines = [
    "# OST Amendment Policy Survey Report",
    "",
    `Generated: ${report.generatedAt}`,
    `Data source: ${usingMockData ? "Mock fallback data" : "Live Supabase responses"}`,
    `Responses: ${report.responseCount}`,
    `Survey version: ${report.surveyVersion}`,
    "",
    "## Artemis Support Breakdown",
    ...formatCounts(report.artemisBreakdown),
    "",
    "## Top Ranked Amendment Priorities",
    ...formatCounts(report.topPriorities),
    "",
    "## Strongest Consensus Signals",
    ...formatSummaries(report.consensus),
    "",
    "## Highest Disagreement Signals",
    ...formatSummaries(report.disagreement),
    "",
    "## Written Recommendation Excerpts",
    ...formatComments(report.writtenRecommendations),
  ];

  return lines.join("\n");
}

function formatCounts(items: { name: string; count: number }[]) {
  return items.length ? items.map((item) => `- ${item.name}: ${item.count}`) : ["- No data available."];
}

function formatSummaries(items: ReportOptionSummary[]) {
  return items.length
    ? items.map(
        (item) =>
          `- ${item.questionId} ${item.questionTitle}: ${item.leadingOption} (${item.leadingCount}/${item.total}, ${Math.round(item.share * 100)}%)`,
      )
    : ["- No qualifying signals yet."];
}

function formatComments(items: ReportComment[]) {
  return items.length ? items.map((item) => `- ${item.questionId} ${item.questionTitle}: ${item.text}`) : ["- No written comments available."];
}
