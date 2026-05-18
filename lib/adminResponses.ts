import "server-only";

import { mockResponses } from "./mockData";
import { getSupabaseAdminClient, isSupabaseConfigured } from "./supabaseClient";
import type { StoredSurveyResponse } from "./surveyTypes";

export interface AdminResponsesResult {
  responses: StoredSurveyResponse[];
  usingMockData: boolean;
  liveDataEnabled: boolean;
  error?: string;
}

export async function getAdminResponses(): Promise<AdminResponsesResult> {
  const liveDataEnabled = process.env.ADMIN_DASHBOARD_LIVE_DATA === "true";

  if (!liveDataEnabled || !isSupabaseConfigured()) {
    return {
      responses: mockResponses,
      usingMockData: true,
      liveDataEnabled,
    };
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return {
      responses: mockResponses,
      usingMockData: true,
      liveDataEnabled,
      error: "Supabase admin environment variables are not configured. Set SUPABASE_SERVICE_ROLE_KEY only in server-side deployment settings.",
    };
  }

  const { data, error } = await supabase
    .from("survey_responses")
    .select(
      "id, created_at, respondent_name, respondent_email, respondent_role, respondent_type, answers, comments, artemis_support, selected_artemis_policies, top_priorities, final_recommendation, survey_version",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return {
      responses: mockResponses,
      usingMockData: true,
      liveDataEnabled,
      error: error.message,
    };
  }

  return {
    responses: (data ?? []) as StoredSurveyResponse[],
    usingMockData: false,
    liveDataEnabled,
  };
}
