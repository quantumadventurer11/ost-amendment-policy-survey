import { LayoutShell } from "@/components/LayoutShell";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { getAdminResponses } from "@/lib/adminResponses";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { responses, usingMockData, liveDataEnabled, error } = await getAdminResponses();

  return (
    <LayoutShell>
      <section className="mb-6 rounded border border-slate-200 bg-white p-6">
        <h1 className="text-3xl font-semibold">Admin results dashboard</h1>
        <p className="mt-3 max-w-3xl leading-7 text-slate-700">
          This dashboard can read live Supabase response data only when explicitly enabled by server environment variable. Protect this route through Vercel deployment protection or app-level authentication before enabling live data.
        </p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded border border-slate-200 p-3">
            <dt className="font-medium text-slate-500">Live data flag</dt>
            <dd className="mt-1 font-semibold">{liveDataEnabled ? "Enabled" : "Disabled"}</dd>
          </div>
          <div className="rounded border border-slate-200 p-3">
            <dt className="font-medium text-slate-500">Data source</dt>
            <dd className="mt-1 font-semibold">{usingMockData ? "Mock fallback" : "Supabase"}</dd>
          </div>
          <div className="rounded border border-slate-200 p-3">
            <dt className="font-medium text-slate-500">Route protection</dt>
            <dd className="mt-1 font-semibold">Required before launch</dd>
          </div>
        </dl>
        {error ? (
          <p className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Live data could not be loaded, so the dashboard is using mock data. Supabase error: {error}
          </p>
        ) : null}
      </section>
      <ResultsDashboard responses={responses} usingMockData={usingMockData} liveDataEnabled={liveDataEnabled} />
    </LayoutShell>
  );
}
