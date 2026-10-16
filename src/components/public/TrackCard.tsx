import { Layers } from "lucide-react";
import type { ConferenceSubThemeGroup, ConferenceTrack } from "@/types";

export function TracksList({ tracks }: { tracks: ConferenceTrack[] }) {
  if (!tracks?.length) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {tracks.map((track, i) => (
        <div
          key={track.id}
          className="group rounded-xl border border-ink-200/80 bg-white p-4 shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Track {i + 1}</p>
              <h4 className="mt-0.5 font-semibold leading-snug text-ink-900">{track.title}</h4>
              {track.disciplines?.length > 0 && <p className="mt-1 text-sm leading-relaxed text-ink-500">{track.disciplines.join(", ")}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SubThemesList({ groups }: { groups: ConferenceSubThemeGroup[] }) {
  if (!groups?.length) return null;
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.id} className="rounded-xl border border-ink-200/80 bg-white p-5">
          <h4 className="font-serif text-base font-semibold text-ink-900">{group.category}</h4>
          <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {group.items.map((item, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
