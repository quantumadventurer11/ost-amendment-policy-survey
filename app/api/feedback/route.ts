import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { feedbackSubmissionSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = feedbackSubmissionSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, mode: "local-only", warning: "Supabase is not configured." });
  }

  const { error } = await supabase.from("survey_feedback").insert(parsed.data);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
