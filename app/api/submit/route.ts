import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { surveySubmissionSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = surveySubmissionSchema.safeParse({
    ...json,
    user_agent: request.headers.get("user-agent") ?? "",
  });

  if (!parsed.success) {
    console.error("[submit] Zod validation error:", parsed.error.flatten());
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, mode: "local-only", warning: "Supabase is not configured." });
  }

  const { error } = await supabase.from("survey_responses").insert(parsed.data);
  if (error) {
    console.error("[submit] Supabase insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, mode: "supabase" });
}
