"use client";

import { ArrowRight, BookOpen, Building2, Landmark, MapPin } from "lucide-react";
import { PageHero } from "@/components/public/PageHero";
import { LinkButton } from "@/components/common/LinkButton";
import { Reveal } from "@/components/common/Reveal";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const PILLARS = [
  { icon: BookOpen, title: "Publication", text: "Accepted conference papers are published in peer-reviewed journals." },
  { icon: Building2, title: "Partner Institutions", text: "We work with colleges and universities to organize academic conferences." },
  { icon: Landmark, title: "Multi-Disciplinary", text: "Conferences span commerce, law, sciences, humanities and technology." },
];

export default function AboutPage() {
  const { settings } = useSiteSettings();
  return (
    <>
      <PageHero eyebrow="Who we are" title={`About ${settings.websiteName}`} description={settings.description} />

      <div className="container-page max-w-5xl py-12 sm:py-16">
        <Reveal className="grid gap-6 sm:grid-cols-3">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="group rounded-2xl border border-ink-200/70 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-white">
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-semibold text-ink-900">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{p.text}</p>
            </div>
          ))}
        </Reveal>

        {settings.address && (
          <Reveal className="mt-10">
            <div className="flex flex-col gap-6 rounded-2xl border border-ink-200/70 bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink-900">Registered Address</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">{settings.address}</p>
                </div>
              </div>
              <LinkButton href="/contact" variant="outline" className="shrink-0">
                Get in touch <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </div>
          </Reveal>
        )}
      </div>
    </>
  );
}
