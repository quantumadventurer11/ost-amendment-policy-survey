import Link from "next/link";
import { LayoutShell } from "@/components/LayoutShell";

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const params = await searchParams;
  const isLocalOnly = params.mode === "local";

  return (
    <LayoutShell>
      <section className="rounded border border-slate-200 bg-white p-8">
        <h1 className="text-3xl font-semibold">Submission received</h1>
        {isLocalOnly ? (
          <p className="mt-4 max-w-2xl rounded border border-amber-200 bg-amber-50 p-4 leading-7 text-amber-900">
            This response was accepted in local development mode only because Supabase is not configured. Configure Supabase before collecting production responses.
          </p>
        ) : (
          <p className="mt-4 max-w-2xl leading-7 text-slate-700">
            Thank you. Your response has been submitted for internal policy analysis and survey improvement.
          </p>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="rounded border border-slate-300 px-4 py-2 text-center font-medium hover:bg-slate-100">Return home</Link>
          <Link href="/feedback" className="rounded bg-slate-900 px-4 py-2 text-center font-medium text-white hover:bg-slate-700">Suggest improvement</Link>
        </div>
      </section>
    </LayoutShell>
  );
}
