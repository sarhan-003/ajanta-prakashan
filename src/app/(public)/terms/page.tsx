"use client";

import { PageHero } from "@/components/public/PageHero";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function TermsPage() {
  const { settings } = useSiteSettings();
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms & Conditions" />
      <div className="container-page max-w-3xl py-10 sm:py-14">
        <div className="prose-content whitespace-pre-line rounded-2xl border border-ink-200/70 bg-white p-6 shadow-card sm:p-10">
          {settings.terms || "Terms and conditions will be published here soon."}
        </div>
      </div>
    </>
  );
}
