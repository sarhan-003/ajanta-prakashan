import { Download, ExternalLink, FileText, MessageCircle } from "lucide-react";
import { buttonClasses } from "@/components/common/buttonStyles";
import { usePublicAuth } from "@/contexts/PublicAuthContext";
import type { Conference } from "@/types";
import { buildWhatsAppLink, interestWhatsAppMessage } from "@/utils/whatsapp";
import { formatDate } from "@/utils/date";

/** Call-to-action buttons for a conference. Designed to sit on the dark conference header band. */
export function CTAButtons({ conference }: { conference: Conference }) {
  const { profile } = usePublicAuth();

  // Prefer a direct WhatsApp chat over an external form when the admin has
  // configured one — no form to fill, registration interest confirmed in one
  // tap. Falls back to the external registration URL when no number is set.
  const registerAction = conference.whatsappNumber
    ? {
        href: buildWhatsAppLink(conference.whatsappNumber, interestWhatsAppMessage(conference.title, formatDate(conference.date), profile?.fullName)),
        label: "Register via WhatsApp",
        icon: MessageCircle,
      }
    : conference.registrationUrl
      ? { href: conference.registrationUrl, label: "Register Now", icon: ExternalLink }
      : null;

  const buttons = [
    registerAction && { ...registerAction, primary: true },
    conference.paperSubmissionUrl && { href: conference.paperSubmissionUrl, label: "Submit Paper", icon: FileText, primary: false },
    conference.brochureUrl && { href: conference.brochureUrl, label: "Download Brochure", icon: Download, primary: false },
    conference.whatsappUrl && { href: conference.whatsappUrl, label: "Join WhatsApp Group", icon: MessageCircle, primary: false },
  ].filter(Boolean) as { href: string; label: string; icon: typeof ExternalLink; primary: boolean }[];

  if (!buttons.length) return null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {buttons.map((btn) => (
        <a
          key={btn.label}
          href={btn.href}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses({ variant: btn.primary ? "primary" : "glass", size: "lg", className: "w-full sm:w-auto" })}
        >
          <btn.icon className="h-5 w-5" /> {btn.label}
        </a>
      ))}
    </div>
  );
}
