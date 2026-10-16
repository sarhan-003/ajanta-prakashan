"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CalendarClock, GraduationCap, Newspaper, ShieldCheck } from "lucide-react";
import { Hero } from "@/components/public/Hero";
import { Section } from "@/components/public/Section";
import { ConferenceCard } from "@/components/public/ConferenceCard";
import { EventCard } from "@/components/public/EventCard";
import { NotificationCard } from "@/components/public/NotificationCard";
import { LandingGallery } from "@/components/public/LandingGallery";
import { RegistrationGate } from "@/components/public/RegistrationGate";
import { EmptyState } from "@/components/common/EmptyState";
import { LinkButton } from "@/components/common/LinkButton";
import { Reveal } from "@/components/common/Reveal";
import { Skeleton } from "@/components/common/LoadingSpinner";
import { getPublishedConferences } from "@/services/conferenceService";
import { getPublishedEvents } from "@/services/eventService";
import { getPublishedNotifications } from "@/services/notificationService";
import { getActiveLandingImages } from "@/services/landingImageService";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { usePublicAuth } from "@/contexts/PublicAuthContext";
import type { Conference, EventItem, LandingImage, NotificationItem } from "@/types";

const WHY_JOIN = [
  { icon: GraduationCap, title: "Peer-Reviewed Publication", text: "Accepted papers are published in Ajanta Prakashan's UGC-listed journals." },
  { icon: CalendarClock, title: "Multiple Disciplines", text: "Conferences across commerce, law, sciences, humanities and technology." },
  { icon: Newspaper, title: "Timely Updates", text: "Notifications for deadlines, acceptances and schedule changes." },
  { icon: ShieldCheck, title: "Trusted Process", text: "Transparent registration, fees and payment information for every conference." },
];

export default function HomePage() {
  const { settings } = useSiteSettings();
  const { loading: authLoading, profile, isAdmin } = usePublicAuth();
  const canSeeConferences = !!profile || isAdmin;
  const [upcoming, setUpcoming] = useState<Conference[] | null>(null);
  const [past, setPast] = useState<Conference[] | null>(null);
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[] | null>(null);
  const [galleryImages, setGalleryImages] = useState<LandingImage[]>([]);

  useEffect(() => {
    if (!canSeeConferences) return; // conferences are gated behind registration — don't even attempt the read
    getPublishedConferences({ when: "upcoming", pageSize: 3 })
      .then((r) => setUpcoming(r.items))
      .catch(() => setUpcoming([]));
    getPublishedConferences({ when: "past", pageSize: 3 })
      .then((r) => setPast(r.items))
      .catch(() => setPast([]));
  }, [canSeeConferences]);

  useEffect(() => {
    getPublishedEvents({ pageSize: 3 })
      .then((r) => setEvents(r.items))
      .catch(() => setEvents([]));
    getPublishedNotifications({ pageSize: 4 })
      .then((r) => setNotifications(r.items))
      .catch(() => setNotifications([]));
    getActiveLandingImages()
      .then(setGalleryImages)
      .catch(() => setGalleryImages([]));
  }, []);

  return (
    <>
      <Hero />

      {galleryImages.length > 0 && (
        <Section eyebrow="Highlights" title="Gallery" subtitle="Moments from our conferences and events.">
          <LandingGallery images={galleryImages} />
        </Section>
      )}

      <Section
        eyebrow="What's next"
        title="Upcoming Conferences"
        subtitle="National and international conferences currently open for registration."
        viewAllHref={canSeeConferences ? "/conferences?tab=upcoming" : undefined}
      >
        {authLoading ? (
          <GridSkeleton />
        ) : !canSeeConferences ? (
          <RegistrationGate />
        ) : upcoming === null ? (
          <GridSkeleton />
        ) : upcoming.length === 0 ? (
          <EmptyState title="No upcoming conferences available." description="Please check back soon, or register to be notified when a new conference is announced." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((c) => (
              <ConferenceCard key={c.id} conference={c} />
            ))}
          </div>
        )}
      </Section>

      {notifications && notifications.length > 0 && (
        <Section eyebrow="Stay informed" title="Latest Notifications" subtitle="Deadlines, acceptances and announcements." viewAllHref="/notifications" tone="muted">
          <div className="grid gap-4 md:grid-cols-2">
            {notifications.map((n) => (
              <NotificationCard key={n.id} notification={n} />
            ))}
          </div>
        </Section>
      )}

      {events && events.length > 0 && (
        <Section eyebrow="Happening soon" title="Upcoming Events" subtitle="Seminars, workshops and other academic events." viewAllHref="/events">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </Section>
      )}

      <Section eyebrow="Why us" title={`Why Join ${settings.websiteName} Conferences`} tone="muted">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_JOIN.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-ink-200/70 bg-paper-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:bg-white hover:shadow-lift"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-white">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-semibold text-ink-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {canSeeConferences && past && past.length > 0 && (
        <Section eyebrow="Archive" title="Past Conferences" subtitle="A record of conferences successfully concluded." viewAllHref="/conferences?tab=past">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((c) => (
              <ConferenceCard key={c.id} conference={c} />
            ))}
          </div>
        </Section>
      )}

      <ClosingBand registered={canSeeConferences} loading={authLoading} />
    </>
  );
}

function ClosingBand({ registered, loading }: { registered: boolean; loading: boolean }) {
  return (
    <section className="px-4 pb-16 pt-4 sm:px-6 sm:pb-24 lg:px-8">
      <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-ink-950 px-6 py-14 text-center text-white shadow-lift sm:px-12 sm:py-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(60% 90% at 100% 0%, rgba(181,101,29,0.55), transparent 60%), radial-gradient(50% 70% at 0% 100%, rgba(220,137,53,0.25), transparent 60%)",
          }}
          aria-hidden
        />
        <div className="bg-dots absolute inset-0 opacity-50 [mask-image:radial-gradient(60%_80%_at_50%_50%,black,transparent)]" aria-hidden />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            {registered ? "Need help with a conference?" : "Join our academic community"}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-300 sm:text-lg">
            {registered
              ? "Our team is happy to help with registration, paper submission and payments."
              : "Register once to unlock conference details, fees and committees — and get updates on every deadline."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {!loading && !registered && (
              <LinkButton href="/register" size="lg">
                Register now <ArrowRight className="h-5 w-5" />
              </LinkButton>
            )}
            {!loading && registered && (
              <LinkButton href="/conferences" size="lg">
                Browse conferences <ArrowRight className="h-5 w-5" />
              </LinkButton>
            )}
            <LinkButton href="/contact" variant="glass" size="lg">
              Contact us
            </LinkButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function GridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-[26rem] w-full rounded-2xl" />
      ))}
    </div>
  );
}
