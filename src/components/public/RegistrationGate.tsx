import { CheckCircle2, Lock } from "lucide-react";
import { LinkButton } from "@/components/common/LinkButton";
import { cn } from "@/utils/cn";

const BENEFITS = [
  "Full conference details, tracks and important dates",
  "Registration fees, payment information and committees",
  "Register in one tap through WhatsApp",
];

/**
 * Call-to-action shown in place of conference content for visitors who haven't
 * registered yet. Conference data is gated by Firestore rules (isRegistered()),
 * so this is only a friendly front for a read the database would refuse.
 */
export function RegistrationGate({
  registerHref = "/register",
  title = "Register to view conferences",
  className,
}: {
  registerHref?: string;
  title?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-br from-white via-white to-brand-50/70 p-6 shadow-card sm:p-10", className)}>
      <div className="bg-dots-dark absolute inset-0 opacity-50 [mask-image:linear-gradient(to_left,black,transparent_60%)]" aria-hidden />
      <div className="relative flex flex-col gap-8 md:flex-row md:items-center">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-lift">
          <Lock className="h-7 w-7" aria-hidden />
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-2xl font-semibold text-ink-900">{title}</h3>
          <p className="mt-1.5 text-sm text-ink-500">It takes under a minute — no OTP, no password.</p>
          <ul className="mt-5 flex flex-col gap-2.5 text-sm text-ink-700 lg:flex-row lg:flex-wrap lg:gap-x-7">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden /> {b}
              </li>
            ))}
          </ul>
        </div>
        <LinkButton href={registerHref} size="lg" className="w-full shrink-0 md:w-auto">
          Register now
        </LinkButton>
      </div>
    </div>
  );
}
