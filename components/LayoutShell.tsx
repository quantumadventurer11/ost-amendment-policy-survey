import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/survey", label: "Survey" },
  { href: "/admin", label: "Admin" },
  { href: "/feedback", label: "Feedback" },
];

export function LayoutShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link href="/" className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Celestial Governance Initiative</p>
            <p className="mt-1 text-xl font-semibold text-slate-950">OST Amendment Policy Survey</p>
          </Link>
          <nav aria-label="Primary navigation" className="flex flex-wrap gap-2 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded border border-slate-200 px-3 py-2 font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Internal research consultation instrument. No account required.</p>
          <Link href="/feedback" className="font-medium text-slate-900 underline-offset-4 hover:underline">
            Suggest survey improvement
          </Link>
        </div>
      </footer>
    </div>
  );
}
