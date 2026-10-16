import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/common/Card";
import { Skeleton } from "@/components/common/LoadingSpinner";
import { cn } from "@/utils/cn";

export function StatsCard({
  label,
  value,
  icon: Icon,
  loading,
  tone = "brand",
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  loading?: boolean;
  tone?: "brand" | "success" | "info" | "warning";
}) {
  const toneClasses = {
    brand: "bg-brand-50 text-brand-600 ring-brand-100",
    success: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    info: "bg-sky-50 text-sky-600 ring-sky-100",
    warning: "bg-amber-50 text-amber-600 ring-amber-100",
  }[tone];

  return (
    <Card className="p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink-500">{label}</p>
          {loading ? <Skeleton className="mt-2 h-8 w-16" /> : <p className="mt-1 font-serif text-3xl font-bold tracking-tight text-ink-900">{value}</p>}
        </div>
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-4", toneClasses)}>
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>
    </Card>
  );
}
