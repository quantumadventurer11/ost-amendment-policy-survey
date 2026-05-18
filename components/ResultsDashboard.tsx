"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { countQuestionAnswers, countTopPriorities, getCheckboxQuestions, getRadioQuestions } from "@/lib/analytics";
import { downloadText, responsesToCsv } from "@/lib/exportCsv";
import type { StoredSurveyResponse } from "@/lib/surveyTypes";

export function ResultsDashboard({
  responses,
  usingMockData,
  liveDataEnabled,
}: {
  responses: StoredSurveyResponse[];
  usingMockData: boolean;
  liveDataEnabled: boolean;
}) {
  const artemisData = countQuestionAnswers(responses, "13.1");
  const priorityData = countTopPriorities(responses);
  const radioQuestions = getRadioQuestions().filter((question) => countQuestionAnswers(responses, question.id).length);
  const checkboxQuestions = getCheckboxQuestions().filter((question) => countQuestionAnswers(responses, question.id).length);

  const exportJson = () => downloadText("ost-survey-responses.json", JSON.stringify(responses, null, 2), "application/json");
  const exportCsv = () => downloadText("ost-survey-responses.csv", responsesToCsv(responses), "text/csv");

  return (
    <div className="space-y-6">
      {usingMockData ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          This dashboard is using mock/local data. Configure Supabase, enable live admin reads, and protect admin access before using this page in production.
        </div>
      ) : null}
      {!usingMockData && liveDataEnabled ? (
        <div className="rounded border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900">
          Live response data is visible on this route. Keep Vercel deployment protection or app-level authentication enabled before sharing this URL.
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Total responses</p>
          <p className="mt-2 text-4xl font-semibold">{responses.length}</p>
        </div>
        <div className="rounded border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Survey version</p>
          <p className="mt-2 text-4xl font-semibold">{responses[0]?.survey_version ?? "1.0"}</p>
        </div>
        <div className="rounded border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Exports</p>
          <div className="mt-3 flex gap-2">
            <button onClick={exportCsv} className="rounded border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100">CSV</button>
            <button onClick={exportJson} className="rounded border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100">JSON</button>
          </div>
        </div>
      </section>

      {!usingMockData && responses.length === 0 ? (
        <section className="rounded border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold">No live responses yet</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Supabase live data is connected, but the `survey_responses` table does not contain any rows available to this dashboard.
          </p>
        </section>
      ) : null}

      <ChartBlock title="Artemis endorsement breakdown" data={artemisData} />
      <ChartBlock title="Top ranked amendment priorities" data={priorityData} />

      <section className="rounded border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Radio question distributions</h2>
        <div className="mt-5 grid gap-5">
          {radioQuestions.map((question) => (
            <ChartBlock key={question.id} title={`${question.id} ${question.title}`} data={countQuestionAnswers(responses, question.id)} compact />
          ))}
        </div>
      </section>

      <section className="rounded border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Checkbox option counts</h2>
        <div className="mt-5 grid gap-5">
          {checkboxQuestions.map((question) => (
            <ChartBlock key={question.id} title={`${question.id} ${question.title}`} data={countQuestionAnswers(responses, question.id)} compact />
          ))}
        </div>
      </section>

      <section className="rounded border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700">
        <h2 className="text-xl font-semibold text-slate-950">Connecting live data</h2>
        <p className="mt-3">
          Add Supabase environment variables and configure authenticated read access before replacing the mock fallback with production admin data.
          Respondent submission does not require login, but this page should be protected before public launch.
        </p>
      </section>
    </div>
  );
}

function ChartBlock({ title, data, compact = false }: { title: string; data: { name: string; count: number }[]; compact?: boolean }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {data.length ? (
        <div className={compact ? "mt-3 h-52" : "mt-3 h-72"}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={compact ? 208 : 288}>
            <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={compact ? 180 : 260} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#1e293b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">No data yet.</p>
      )}
    </div>
  );
}
