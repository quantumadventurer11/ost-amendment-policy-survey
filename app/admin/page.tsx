import { LayoutShell } from "@/components/LayoutShell";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { mockResponses } from "@/lib/mockData";

export default function AdminPage() {
  return (
    <LayoutShell>
      <section className="mb-6 rounded border border-slate-200 bg-white p-6">
        <h1 className="text-3xl font-semibold">Admin results dashboard</h1>
        <p className="mt-3 max-w-3xl leading-7 text-slate-700">
          This v1 dashboard is intentionally unauthenticated and uses mock data unless a protected production data path is added. Do not expose live response data publicly without authentication and appropriate Supabase read policies.
        </p>
      </section>
      <ResultsDashboard responses={mockResponses} usingMockData />
    </LayoutShell>
  );
}
