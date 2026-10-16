"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const QUICK_LINKS = [
  { href: "/conferences", label: "Conferences" },
  { href: "/events", label: "Events" },
  { href: "/notifications", label: "Notifications" },
  { href: "/register", label: "Register" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const LEGAL_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

const SOCIALS: { key: "facebook" | "instagram" | "linkedin" | "twitter" | "youtube"; label: string; icon: LucideIcon }[] = [
  { key: "facebook", label: "Facebook", icon: Facebook },
  { key: "instagram", label: "Instagram", icon: Instagram },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin },
  { key: "twitter", label: "Twitter", icon: Twitter },
  { key: "youtube", label: "YouTube", icon: Youtube },
];

const linkClass = "text-sm text-ink-300 transition-colors hover:text-white";
const headingClass = "text-xs font-semibold uppercase tracking-[0.16em] text-brand-300";

export function Footer() {
  const { settings } = useSiteSettings();
  const year = new Date().getFullYear();
  const social = settings.socialLinks || {};

  return (
    <footer className="site-footer relative bg-ink-950 text-ink-200">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/70 to-transparent" aria-hidden />

      <div className="container-page grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.4fr]">
        <div>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={settings.logoUrl || "/images/logo.png"} alt="" width={40} height={40} className="h-10 w-10 rounded-lg bg-white object-cover" />
            <h3 className="font-serif text-xl font-bold text-white">{settings.websiteName}</h3>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-300">{settings.description}</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {SOCIALS.map(({ key, label, icon: Icon }) =>
              social[key] ? (
                <a
                  key={key}
                  href={social[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-ink-300 ring-1 ring-white/10 transition hover:bg-brand-500 hover:text-white hover:ring-brand-500"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ) : null
            )}
          </div>
        </div>

        <div>
          <h4 className={headingClass}>Quick Links</h4>
          <ul className="mt-5 space-y-3">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className={headingClass}>Legal</h4>
          <ul className="mt-5 space-y-3">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className={headingClass}>Contact</h4>
          <ul className="mt-5 space-y-4 text-sm text-ink-300">
            {settings.address && (
              <li className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-brand-300">
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="pt-1 leading-relaxed">{settings.address}</span>
              </li>
            )}
            {settings.contactPhone && (
              <li className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-brand-300">
                  <Phone className="h-4 w-4" />
                </span>
                <a href={`tel:${settings.contactPhone}`} className="pt-1 transition-colors hover:text-white">
                  {settings.contactPhone}
                </a>
              </li>
            )}
            {settings.contactEmail && (
              <li className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-brand-300">
                  <Mail className="h-4 w-4" />
                </span>
                <a href={`mailto:${settings.contactEmail}`} className="break-all pt-1 transition-colors hover:text-white">
                  {settings.contactEmail}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="container-page text-center text-xs text-ink-400">
          {settings.footerText || `© ${year} ${settings.websiteName}. All rights reserved.`}
        </p>
      </div>
    </footer>
  );
}
