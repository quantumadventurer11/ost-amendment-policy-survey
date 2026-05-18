import Link from "next/link";
import type { SurveySection } from "@/lib/surveyTypes";

export function SectionIntro({ section }: { section: SurveySection }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{section.id}</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">{section.title}</h2>
        </div>
        <Link
          href={`/feedback?section=${encodeURIComponent(section.id)}`}
          className="rounded border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-700"
        >
          Suggest improvement
        </Link>
      </div>
      {section.context ? <p className="mt-4 leading-7 text-slate-700">{section.context}</p> : null}
      {section.authorAttribution ? (
        <p className="mt-4 border-l-4 border-slate-300 pl-4 text-sm leading-6 text-slate-600">{section.authorAttribution}</p>
      ) : null}
      {section.nationalLegislationComparison ? (
        <p className="mt-3 rounded bg-slate-100 p-3 text-sm leading-6 text-slate-700">
          <span className="font-semibold">National legislation comparison: </span>
          {section.nationalLegislationComparison}
        </p>
      ) : null}
      {section.artemisComparison ? (
        <p className="mt-3 rounded bg-slate-100 p-3 text-sm leading-6 text-slate-700">
          <span className="font-semibold">Artemis comparison: </span>
          {section.artemisComparison}
        </p>
      ) : null}
    </section>
  );
}
