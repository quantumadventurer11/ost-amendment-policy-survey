import Link from "next/link";
import { LayoutShell } from "@/components/LayoutShell";
import { surveyConfig } from "@/lib/surveyConfig";

export default function HomePage() {
  return (
    <LayoutShell>
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div className="rounded border border-slate-200 bg-white p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Policy consultation</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">OST Amendment Policy Survey</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            A structured research instrument for reviewing proposed amendments to the Outer Space Treaty, comparing national space legislation approaches, and evaluating the Artemis Accords as a possible interim or complementary framework.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/survey" className="rounded bg-slate-900 px-5 py-3 text-center font-semibold text-white hover:bg-slate-700">
              Start survey
            </Link>
            <Link href="/feedback" className="rounded border border-slate-300 px-5 py-3 text-center font-semibold text-slate-900 hover:bg-slate-100">
              Suggest improvement
            </Link>
          </div>
        </div>
        <aside className="rounded border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold">Purpose and consent</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Responses will help identify consensus, disagreement, priority reforms, and recommendations for possible submission to COPUOS or direct diplomacy with individual states.
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Name, email, and role are optional. Anonymous submissions are accepted. Draft progress is stored locally in your browser until submitted or cleared.
          </p>
          <dl className="mt-5 grid gap-3 text-sm">
            <div className="flex justify-between gap-3 border-t border-slate-100 pt-3">
              <dt className="text-slate-500">Survey version</dt>
              <dd className="font-medium">{surveyConfig.surveyVersion}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-slate-100 pt-3">
              <dt className="text-slate-500">Last updated</dt>
              <dd className="font-medium">{surveyConfig.lastUpdated}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-slate-100 pt-3">
              <dt className="text-slate-500">Sections</dt>
              <dd className="font-medium">{surveyConfig.sections.length}</dd>
            </div>
          </dl>
        </aside>
      </section>
    </LayoutShell>
  );
}
