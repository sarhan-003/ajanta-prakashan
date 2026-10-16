"use client";

import { ArrowRight, BookOpen, Building2, CalendarCheck, GraduationCap, Globe2 } from "lucide-react";
import { LinkButton } from "@/components/common/LinkButton";
import { useSiteSettings } from "@/hooks/useSiteSettings";

// Short, factual highlights — the same claims already made in the "Why Join" and About sections.
const HIGHLIGHTS = [
  { icon: GraduationCap, title: "Peer-reviewed publication", text: "Accepted papers are published in UGC-listed journals." },
  { icon: Globe2, title: "National & international", text: "Commerce, law, sciences, humanities and technology." },
  { icon: Building2, title: "Partner colleges", text: "Organised with colleges and universities across India." },
];

export function Hero() {
  const { settings } = useSiteSettings();
  return (
    <section className="relative isolate overflow-hidden bg-ink-950 text-white">
      {/* Background: warm glows, dotted texture and decorative rings */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(60% 70% at 88% 8%, rgba(181,101,29,0.50), transparent 62%), radial-gradient(45% 55% at 0% 100%, rgba(220,137,53,0.20), transparent 60%), linear-gradient(180deg, #14171c 0%, #0a0c0f 100%)",
        }}
        aria-hidden
      />
      <div className="bg-dots absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(70%_80%_at_70%_30%,black,transparent)]" aria-hidden />
      <svg className="absolute -right-72 -top-72 -z-10 h-[36rem] w-[36rem] text-brand-400/20 sm:-right-40 sm:-top-40 sm:h-[40rem] sm:w-[40rem]" viewBox="0 0 400 400" fill="none" aria-hidden>
        <circle cx="200" cy="200" r="196" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="104" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="58" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div className="container-page grid items-center gap-14 pb-28 pt-16 sm:pb-32 sm:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:pt-28">
        <div>
          <p className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-1.5 text-xs font-medium tracking-wide text-brand-200 backdrop-blur">
            <BookOpen className="h-3.5 w-3.5" /> Academic Conferences &amp; Publication
          </p>
          <h1 className="mt-6 animate-fade-up font-serif text-4xl font-bold leading-[1.08] tracking-tight [animation-delay:80ms] sm:text-5xl lg:text-6xl">
            {settings.websiteName}
          </h1>
          <p className="mt-6 max-w-xl animate-fade-up text-base leading-relaxed text-ink-300 [animation-delay:160ms] sm:text-lg">
            {settings.description}
          </p>
          <div className="mt-9 flex animate-fade-up flex-col gap-3 [animation-delay:240ms] sm:flex-row sm:flex-wrap">
            <LinkButton href="/conferences" size="lg" className="w-full sm:w-auto">
              <CalendarCheck className="h-5 w-5" /> Explore Conferences
            </LinkButton>
            <LinkButton href="/register" variant="glass" size="lg" className="w-full sm:w-auto">
              Register for Updates <ArrowRight className="h-5 w-5" />
            </LinkButton>
          </div>
        </div>

        {/* Highlight cards (desktop) */}
        <div className="relative hidden lg:block">
          <div className="absolute -inset-6 rounded-[2rem] bg-brand-500/10 blur-3xl" aria-hidden />
          <ul className="relative space-y-4">
            {HIGHLIGHTS.map((item, i) => (
              <li
                key={item.title}
                className={`animate-float rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-glow backdrop-blur-md ${i === 1 ? "ml-12" : i === 2 ? "mr-8" : ""}`}
                style={{ animationDelay: `${i * 1.4}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300 ring-1 ring-brand-400/30">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-300">{item.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Soft wave into the page background */}
      <svg className="absolute bottom-0 left-0 w-full text-paper-50" viewBox="0 0 1440 56" preserveAspectRatio="none" aria-hidden>
        <path d="M0 56V30C240 4 480 4 720 18s480 22 720 4v34H0Z" fill="currentColor" />
      </svg>
    </section>
  );
}
