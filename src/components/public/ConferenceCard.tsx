import Link from "next/link";
import { ArrowRight, Layers, MapPin } from "lucide-react";
import type { Conference } from "@/types";
import { isUpcoming } from "@/utils/date";
import { DateTile } from "./DateTile";

export function ConferenceCard({ conference }: { conference: Conference }) {
  const past = !isUpcoming(conference.date);
  const trackCount = conference.tracks?.length || 0;

  return (
    <Link
      href={`/conferences/view?id=${conference.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200/70 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
    >
      {/* Decorative header — conferences carry no banner image by design, so the date tile is the visual anchor */}
      <div className="relative h-28 overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900">
        <div className="bg-dots absolute inset-0 opacity-40" aria-hidden />
        <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-brand-400/30 blur-2xl transition-transform duration-500 group-hover:scale-125" aria-hidden />
        <div className="absolute left-5 top-5 flex items-center gap-2">
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur">
            {conference.mode}
          </span>
          {past && (
            <span className="rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur">
              Completed
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5">
        <DateTile date={conference.date} className="relative z-10 -mt-9" />
        <h3 className="mt-4 line-clamp-3 font-serif text-xl font-semibold leading-snug text-ink-900 transition-colors group-hover:text-brand-700">
          {conference.title}
        </h3>
        {conference.theme && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">{conference.theme}</p>}

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-ink-600">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-brand-500" /> {conference.city || conference.venue}
          </span>
          {trackCount > 0 && (
            <span className="flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-brand-500" /> {trackCount} {trackCount === 1 ? "track" : "tracks"}
            </span>
          )}
        </div>

        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand-600">
          View details <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
