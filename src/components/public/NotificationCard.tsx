import { AlertTriangle, Bell, CalendarClock, CheckCircle2, Info } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { NOTIFICATION_TYPE_LABELS, type NotificationItem } from "@/types";
import { cn } from "@/utils/cn";
import { formatDateTime } from "@/utils/date";

type Tone = "brand" | "warning" | "danger" | "info" | "neutral" | "success";

const TYPE_TONE: Record<string, Tone> = {
  deadline: "danger",
  important: "danger",
  paper_submission: "warning",
  acceptance: "success",
  registration: "info",
  venue_update: "warning",
  event: "brand",
  conference: "brand",
  general: "neutral",
};

const TONE_STYLE: Record<Tone, { accent: string; icon: string; glyph: LucideIcon }> = {
  danger: { accent: "before:bg-red-400", icon: "bg-red-50 text-red-600", glyph: AlertTriangle },
  warning: { accent: "before:bg-amber-400", icon: "bg-amber-50 text-amber-600", glyph: CalendarClock },
  success: { accent: "before:bg-emerald-400", icon: "bg-emerald-50 text-emerald-600", glyph: CheckCircle2 },
  info: { accent: "before:bg-sky-400", icon: "bg-sky-50 text-sky-600", glyph: Info },
  brand: { accent: "before:bg-brand-400", icon: "bg-brand-50 text-brand-600", glyph: Bell },
  neutral: { accent: "before:bg-ink-300", icon: "bg-ink-100 text-ink-500", glyph: Bell },
};

export function NotificationCard({ notification }: { notification: NotificationItem }) {
  const tone = TYPE_TONE[notification.type] || "neutral";
  const style = TONE_STYLE[tone];

  return (
    <article
      className={cn(
        "relative flex gap-4 overflow-hidden rounded-2xl border border-ink-200/70 bg-white p-4 pl-5 shadow-card transition duration-300 hover:shadow-lift sm:p-5 sm:pl-6",
        "before:absolute before:inset-y-0 before:left-0 before:w-1",
        style.accent
      )}
    >
      <div className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full", style.icon)}>
        <style.glyph className="h-[18px] w-[18px]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={tone}>{NOTIFICATION_TYPE_LABELS[notification.type]}</Badge>
          <span className="text-xs text-ink-400">{formatDateTime(notification.createdAt)}</span>
        </div>
        <h3 className="mt-2 font-semibold leading-snug text-ink-900">{notification.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-600">{notification.message}</p>
      </div>
    </article>
  );
}
