import { Clock, ExternalLink, MapPin, MessageCircle } from "lucide-react";
import { usePublicAuth } from "@/contexts/PublicAuthContext";
import type { EventItem } from "@/types";
import { formatDate } from "@/utils/date";
import { buildWhatsAppLink, interestWhatsAppMessage } from "@/utils/whatsapp";
import { DateTile } from "./DateTile";

export function EventCard({ event }: { event: EventItem }) {
  const { profile } = usePublicAuth();

  // Same pattern as conferences: a configured WhatsApp number takes priority
  // over an external registration form — one tap, no form to fill.
  const action = event.whatsappNumber
    ? {
        href: buildWhatsAppLink(event.whatsappNumber, interestWhatsAppMessage(event.title, formatDate(event.date), profile?.fullName)),
        label: "Register via WhatsApp",
        icon: MessageCircle,
      }
    : event.registrationUrl
      ? { href: event.registrationUrl, label: "Register Now", icon: ExternalLink }
      : event.eventUrl
        ? { href: event.eventUrl, label: "Learn more", icon: ExternalLink }
        : null;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-ink-200/70 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift">
      <div className="flex items-start gap-4">
        <DateTile date={event.date} className="shadow-card" />
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-lg font-semibold leading-snug text-ink-900">{event.title}</h3>
          {event.description && <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-600">{event.description}</p>}
        </div>
      </div>

      {(event.time || event.venue) && (
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-500">
          {event.time && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-brand-500" /> {event.time}
            </span>
          )}
          {event.venue && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-brand-500" /> {event.venue}
            </span>
          )}
        </div>
      )}

      {action && (
        <a
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-500 hover:text-white"
        >
          <action.icon className="h-4 w-4" /> {action.label}
        </a>
      )}
    </article>
  );
}
