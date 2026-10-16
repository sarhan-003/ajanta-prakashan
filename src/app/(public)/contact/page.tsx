"use client";

import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/public/PageHero";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function ContactPage() {
  const { settings } = useSiteSettings();
  const nothing = !settings.address && !settings.contactPhone && !settings.contactEmail && !settings.whatsappUrl;

  return (
    <>
      <PageHero eyebrow="We'd love to hear from you" title="Contact Us" description="Reach out for queries about conferences, registration or publication." />

      <div className="container-page max-w-4xl py-10 sm:py-14">
        <div className="grid gap-5 sm:grid-cols-2">
          {settings.contactPhone && <ContactRow icon={Phone} label="Phone" value={settings.contactPhone} href={`tel:${settings.contactPhone}`} />}
          {settings.contactEmail && <ContactRow icon={Mail} label="Email" value={settings.contactEmail} href={`mailto:${settings.contactEmail}`} />}
          {settings.whatsappUrl && <ContactRow icon={MessageCircle} label="WhatsApp" value="Chat with us" href={settings.whatsappUrl} external />}
          {settings.address && <ContactRow icon={MapPin} label="Address" value={settings.address} wide />}
        </div>
        {nothing && <p className="text-sm text-ink-500">Contact details will be published here soon.</p>}
      </div>
    </>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  external,
  wide,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  wide?: boolean;
}) {
  const content = (
    <div
      className={`group flex h-full items-start gap-4 rounded-2xl border border-ink-200/70 bg-white p-5 shadow-card transition duration-300 ${
        href ? "hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift" : ""
      }`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors duration-300 ${
          href ? "group-hover:bg-brand-500 group-hover:text-white" : ""
        }`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">{label}</p>
        <p className="mt-1 break-words font-medium leading-relaxed text-ink-900">{value}</p>
      </div>
      {href && <ArrowUpRight className="h-5 w-5 shrink-0 text-ink-300 transition-colors group-hover:text-brand-500" aria-hidden />}
    </div>
  );

  const wrapperClass = wide ? "sm:col-span-2" : undefined;
  if (!href) return <div className={wrapperClass}>{content}</div>;
  return (
    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={`block ${wrapperClass ?? ""}`}>
      {content}
    </a>
  );
}
