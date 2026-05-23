"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { downloadText, responsesToCsv } from "@/lib/exportCsv";
import { reportToMarkdown, type SurveyReport } from "@/lib/report";
import type { StoredSurveyResponse } from "@/lib/surveyTypes";

export function ReportView({
  report,
  responses,
  usingMockData,
  liveDataEnabled,
}: {
  report: SurveyReport;
  responses: StoredSurveyResponse[];
  usingMockData: boolean;
  liveDataEnabled: boolean;
}) {
  const downloadMarkdown = () => {
    downloadText("ost-survey-report.md", reportToMarkdown(report, usingMockData), "text/markdown");
  };

  const downloadJson = () => {
    downloadText("ost-survey-report-data.json", JSON.stringify({ report, responses }, null, 2), "application/json");
  };

  const downloadCsv = () => {
    downloadText("ost-survey-responses.csv", responsesToCsv(responses), "text/csv");
  };

  return (
    <div className="space-y-6">
      {usingMockData ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          This report is generated from mock fallback data. Enable protected live admin reads before using it for policy conclusions.
        </div>
      ) : null}
      {!usingMockData && liveDataEnabled ? (
        <div className="rounded border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900">
          Live response data is visible on this route. Keep deployment protection or app-level authentication enabled before sharing this URL.
        </div>
      ) : null}

      <section className="rounded border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Automatic report</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">OST Amendment Policy Survey Report</h1>
            <p className="mt-3 max-w-3xl leading-7 text-slate-700">
              Generated from structured survey responses. This report summarizes observed response patterns and comment excerpts without adding external legal citations or conclusions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={downloadMarkdown} className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700">
              Export Markdown
            </button>
            <button onClick={downloadCsv} className="rounded border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100">
              Export CSV
            </button>
            <button onClick={downloadJson} className="rounded border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100">
              Export JSON
            </button>
            <Link href="/admin" className="rounded border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100">
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Metric label="Responses" value={String(report.responseCount)} />
        <Metric label="Survey version" value={report.surveyVersion} />
        <Metric label="Generated" value={new Date(report.generatedAt).toLocaleString()} />
      </section>

      {!usingMockData && responses.length === 0 ? (
        <section className="rounded border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold">No live responses yet</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Live admin reads are connected, but there are no visible rows in `survey_responses`. Submit a pilot response before relying on this report.
          </p>
        </section>
      ) : (
        <>
          <ReportSection title="Executive Summary">
            <p className="leading-7 text-slate-700">
              The current dataset contains {report.responseCount} response{report.responseCount === 1 ? "" : "s"}. The sections below identify priority rankings,
              Artemis Accords positions, consensus signals, disagreement signals, and written recommendation excerpts for review by the research team.
            </p>
          </ReportSection>
          <CountsSection title="Artemis Support Breakdown" items={report.artemisBreakdown} />
          <CountsSection title="Top Ranked Amendment Priorities" items={report.topPriorities} />
          <SummarySection title="Strongest Consensus Signals" items={report.consensus} empty="No consensus signals meet the threshold yet." />
          <SummarySection title="Highest Disagreement Signals" items={report.disagreement} empty="No disagreement signals meet the threshold yet." />
          <ReportSection title="Written Recommendation Excerpts">
            {report.writtenRecommendations.length ? (
              <div className="space-y-4">
                {report.writtenRecommendations.map((item, index) => (
                  <article key={`${item.questionId}-${index}`} className="rounded border border-slate-200 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {item.questionId} {item.questionTitle}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{item.text}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No written comments available.</p>
            )}
          </ReportSection>
        </>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function ReportSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function CountsSection({ title, items }: { title: string; items: { name: string; count: number }[] }) {
  return (
    <ReportSection title={title}>
      {items.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-4 rounded border border-slate-200 p-3 text-sm">
              <span>{item.name}</span>
              <span className="font-semibold">{item.count}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No data available.</p>
      )}
    </ReportSection>
  );
}

function SummarySection({
  title,
  items,
  empty,
}: {
  title: string;
  items: SurveyReport["consensus"];
  empty: string;
}) {
  return (
    <ReportSection title={title}>
      {items.length ? (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.questionId} className="rounded border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">
                {item.questionId} {item.questionTitle}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Leading response: {item.leadingOption} ({item.leadingCount}/{item.total}, {Math.round(item.share * 100)}%)
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">{empty}</p>
      )}
    </ReportSection>
  );
}
