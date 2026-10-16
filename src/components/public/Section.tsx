import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";
import { cn } from "@/utils/cn";

export function Section({
  eyebrow,
  title,
  subtitle,
  viewAllHref,
  tone = "light",
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  tone?: "light" | "muted";
  children: React.ReactNode;
}) {
  return (
    <section className={cn("py-16 sm:py-20", tone === "muted" && "border-y border-ink-200/60 bg-white")}>
      <div className="container-page">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">{title}</h2>
            <span className="mt-4 block h-1 w-12 rounded-full bg-brand-500" aria-hidden />
            {subtitle && <p className="mt-4 text-base leading-relaxed text-ink-500">{subtitle}</p>}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="group inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 shadow-sm transition hover:border-brand-300 hover:text-brand-700"
            >
              View all <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </Reveal>
        <Reveal delay={60}>{children}</Reveal>
      </div>
    </section>
  );
}
