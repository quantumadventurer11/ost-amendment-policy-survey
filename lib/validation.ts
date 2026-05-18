import { z } from "zod";
import { allQuestions, surveyConfig } from "./surveyConfig";

const answerValueSchema = z.union([z.string(), z.array(z.string())]);

export const surveySubmissionSchema = z.object({
  respondent_name: z.string().optional().default(""),
  respondent_email: z.string().email().optional().or(z.literal("")).default(""),
  respondent_role: z.string().optional().default(""),
  respondent_type: z.string().optional().default(""),
  answers: z.record(z.string(), answerValueSchema),
  comments: z.record(z.string(), z.string()).optional().default({}),
  artemis_support: z.string().optional().default(""),
  selected_artemis_policies: z.array(z.string()).optional().default([]),
  top_priorities: z.array(z.string()).optional().default([]),
  final_recommendation: z.string().optional().default(""),
  user_agent: z.string().optional(),
  survey_version: z.string().default(surveyConfig.surveyVersion),
});

export const feedbackSubmissionSchema = z.object({
  reviewer_name: z.string().optional().default(""),
  reviewer_email: z.string().email().optional().or(z.literal("")).default(""),
  section_id: z.string().optional().default(""),
  question_id: z.string().optional().default(""),
  feedback_type: z.enum([
    "Wording issue",
    "Bias or leading question",
    "Missing policy option",
    "Legal accuracy concern",
    "Technical issue",
    "UX issue",
    "New question suggestion",
  ]),
  feedback_text: z.string().min(1, "Feedback text is required."),
  suggested_revision: z.string().optional().default(""),
  priority: z.enum(["Low", "Medium", "High", "Critical"]).optional().default("Medium"),
});

export function getMissingRequiredQuestionIds(answers: Record<string, string | string[]>) {
  return allQuestions
    .filter((question) => question.required)
    .filter((question) => {
      const value = answers[question.id];
      if (Array.isArray(value)) return value.length === 0;
      return !value;
    })
    .map((question) => question.id);
}
