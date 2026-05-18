export function ProgressBar({ completed, total }: { completed: number; total: number }) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div aria-label="Survey completion progress" className="rounded border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-medium text-slate-800">Estimated completion</span>
        <span className="font-semibold text-slate-950">{percent}%</span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-slate-800 transition-all" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {completed} of {total} required questions answered.
      </p>
    </div>
  );
}
