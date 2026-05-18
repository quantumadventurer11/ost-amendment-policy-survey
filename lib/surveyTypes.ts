export type QuestionType = "radio" | "checkbox" | "textarea" | "likert" | "ranking" | "text";

export type RespondentType = "Individual" | "Organization" | "Unsure / prefer not to say" | "";

export interface QuestionOption {
  label: string;
  value: string;
}

export interface QuestionDependency {
  questionId: string;
  value: string | string[];
}

export interface SurveyQuestion {
  id: string;
  sectionId: string;
  title: string;
  context?: string;
  authorAttribution?: string;
  nationalLegislationComparison?: string;
  artemisComparison?: string;
  type: QuestionType;
  options?: QuestionOption[];
  required?: boolean;
  allowOther?: boolean;
  placeholder?: string;
  dependsOn?: QuestionDependency;
  tags: string[];
  analysisCategory: string;
}

export interface SurveySection {
  id: string;
  title: string;
  context?: string;
  authorAttribution?: string;
  nationalLegislationComparison?: string;
  artemisComparison?: string;
  questions: SurveyQuestion[];
}

export interface SurveyChangeLogEntry {
  version: string;
  date: string;
  summary: string;
}

export interface SurveyConfig {
  surveyVersion: string;
  lastUpdated: string;
  changeLog: SurveyChangeLogEntry[];
  sections: SurveySection[];
}

export type AnswerValue = string | string[];

export interface SurveyDraft {
  respondent_name?: string;
  respondent_email?: string;
  respondent_role?: string;
  respondent_type?: RespondentType;
  answers: Record<string, AnswerValue>;
}

export interface SurveySubmission extends SurveyDraft {
  comments?: Record<string, string>;
  artemis_support?: string;
  selected_artemis_policies?: string[];
  top_priorities?: string[];
  final_recommendation?: string;
  user_agent?: string;
  survey_version: string;
}

export interface FeedbackSubmission {
  reviewer_name?: string;
  reviewer_email?: string;
  section_id?: string;
  question_id?: string;
  feedback_type: string;
  feedback_text: string;
  suggested_revision?: string;
  priority?: string;
}

export interface StoredSurveyResponse extends SurveySubmission {
  id: string;
  created_at: string;
}
