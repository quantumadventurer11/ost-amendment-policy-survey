import Link from "next/link";
import { LayoutShell } from "@/components/LayoutShell";

export default function ThankYouPage() {
  return (
    <LayoutShell>
      <section className="rounded border border-slate-200 bg-white p-8">
        <h1 className="text-3xl font-semibold">Submission received</h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-700">
          Thank you. Your response has been submitted for internal policy analysis and survey improvement.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="rounded border border-slate-300 px-4 py-2 text-center font-medium hover:bg-slate-100">Return home</Link>
          <Link href="/feedback" className="rounded bg-slate-900 px-4 py-2 text-center font-medium text-white hover:bg-slate-700">Suggest improvement</Link>
        </div>
      </section>
    </LayoutShell>
  );
}
