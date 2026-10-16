import { CalendarDays } from "lucide-react";
import { cn } from "@/utils/cn";

function parts(iso: string | null | undefined) {
  if (!iso) return null;
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return null;
  return {
    month: d.toLocaleDateString("en-IN", { month: "short" }),
    day: d.getDate(),
    year: d.getFullYear(),
  };
}

/** Calendar-style tile showing month / day / year for an ISO date ("2026-04-25"). */
export function DateTile({ date, className }: { date: string | null | undefined; className?: string }) {
  const p = parts(date);
  return (
    <div
      className={cn(
        "flex h-[4.5rem] w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-white text-center shadow-lift ring-1 ring-ink-200/60",
        className
      )}
      aria-label={date || undefined}
    >
      {p ? (
        <>
          <span className="text-[11px] font-bold uppercase leading-none tracking-wider text-brand-600">{p.month}</span>
          <span className="mt-1 font-serif text-2xl font-bold leading-none text-ink-900">{p.day}</span>
          <span className="mt-1 text-[10px] font-medium leading-none text-ink-400">{p.year}</span>
        </>
      ) : (
        <CalendarDays className="h-6 w-6 text-brand-500" aria-hidden />
      )}
    </div>
  );
}
