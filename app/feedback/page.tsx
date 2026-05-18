import { Suspense } from "react";
import { FeedbackForm } from "@/components/FeedbackForm";
import { LayoutShell } from "@/components/LayoutShell";

export default function FeedbackPage() {
  return (
    <LayoutShell>
      <section className="mb-6 rounded border border-slate-200 bg-white p-6">
        <h1 className="text-3xl font-semibold">Survey feedback and improvement</h1>
        <p className="mt-3 max-w-3xl leading-7 text-slate-700">
          Reviewers may flag wording, bias, missing policy options, legal accuracy concerns, technical issues, UX issues, or new question suggestions. Feedback is reviewed before survey configuration changes are made.
        </p>
      </section>
      <Suspense fallback={<p>Loading feedback form...</p>}>
        <FeedbackForm />
      </Suspense>
    </LayoutShell>
  );
}
