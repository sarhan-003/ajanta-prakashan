import { CalendarDays, FileSpreadsheet, History, ShieldCheck } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

const FEATURES = [
  { icon: CalendarDays, text: "Publish conferences, events and announcements in minutes" },
  { icon: FileSpreadsheet, text: "Review registrations and export them to CSV" },
  { icon: History, text: "Every admin action is recorded in the activity log" },
];

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel (desktop) */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink-950 p-12 text-white lg:flex">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(70% 60% at 100% 0%, rgba(181,101,29,0.55), transparent 60%), radial-gradient(50% 50% at 0% 100%, rgba(220,137,53,0.22), transparent 60%)",
          }}
          aria-hidden
        />
        <div className="bg-dots absolute inset-0 opacity-50 [mask-image:radial-gradient(80%_80%_at_70%_30%,black,transparent)]" aria-hidden />
        <div className="relative flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="" className="h-11 w-11 rounded-xl bg-white object-cover" />
          <span className="font-serif text-xl font-bold">Ajanta Prakashan</span>
        </div>
        <div className="relative max-w-md">
          <p className="eyebrow !text-brand-300">Administrator Panel</p>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight tracking-tight">Everything for your conferences, in one place.</h1>
          <ul className="mt-10 space-y-5">
            {FEATURES.map((f) => (
              <li key={f.text} className="flex items-start gap-4 text-ink-200">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand-300 ring-1 ring-white/10">
                  <f.icon className="h-5 w-5" />
                </span>
                <span className="pt-2 text-sm leading-relaxed">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-ink-400">Authorised administrators only.</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-paper-50 px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="" className="h-14 w-14 rounded-2xl bg-white object-cover shadow-card ring-1 ring-ink-200/70" />
            <p className="mt-4 font-serif text-xl font-bold text-ink-900">Ajanta Prakashan</p>
            <p className="text-sm text-ink-500">Administrator Panel</p>
          </div>

          <div className="rounded-3xl border border-ink-200/70 bg-white p-7 shadow-card sm:p-9">
            <div className="mb-6 hidden items-center gap-3 lg:flex">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium text-ink-500">Secure sign-in</span>
            </div>
            <AdminLoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
