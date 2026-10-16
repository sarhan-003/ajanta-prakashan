import { cn } from "@/utils/cn";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border border-ink-200/70 bg-white shadow-card", className)}>{children}</div>;
}
