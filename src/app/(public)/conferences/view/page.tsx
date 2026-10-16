"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Calendar, Clock, IndianRupee, Mail, MapPin, Phone, Radio } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/common/LoadingSpinner";
import { CTAButtons } from "@/components/public/CTAButtons";
import { FeeTable } from "@/components/public/FeeCard";
import { TracksList, SubThemesList } from "@/components/public/TrackCard";
import { CommitteeSection } from "@/components/public/CommitteeSection";
import { RequireRegistration } from "@/components/public/RequireRegistration";
import { getConferenceById } from "@/services/conferenceService";
import { getCommitteesByConference } from "@/services/committeeService";
import type { CommitteeMember, Conference } from "@/types";
import { formatDate, isUpcoming } from "@/utils/date";

export default function ConferenceDetailPage() {
  return (
    <Suspense fallback={<div className="container-page py-12"><Skeleton className="h-64 w-full rounded-2xl" /></div>}>
      <RequireRegistration>
        <ConferenceDetailInner />
      </RequireRegistration>
    </Suspense>
  );
}

function ConferenceDetailInner() {
  const id = useSearchParams().get("id") || "";
  const [conference, setConference] = useState<Conference | null | undefined>(undefined);
  const [committee, setCommittee] = useState<CommitteeMember[]>([]);

  useEffect(() => {
    if (!id) {
      setConference(null);
      return;
    }
    getConferenceById(id).then((c) => {
      setConference(c);
      if (c) document.title = `${c.title} | Ajanta Prakashan`;
    });
    getCommitteesByConference(id).then(setCommittee).catch(() => setCommittee([]));
  }, [id]);

  if (conference === undefined) {
    return (
      <div>
        <Skeleton className="h-80 w-full rounded-none" />
        <div className="container-page py-10">
          <Skeleton className="h-8 w-2/3 rounded-md" />
          <Skeleton className="mt-4 h-4 w-1/3 rounded-md" />
          <Skeleton className="mt-8 h-56 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (conference === null || conference.status === "archived") {
    return (
      <div className="container-page py-16">
        <EmptyState title="Conference not found" description="This conference may have been removed or is no longer available." />
      </div>
    );
  }

  const past = !isUpcoming(conference.date);

  return (
    <div>
      {/* Header band */}
      <div className="relative isolate overflow-hidden bg-ink-950 text-white">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(60% 80% at 90% 0%, rgba(181,101,29,0.5), transparent 60%), radial-gradient(45% 60% at 0% 100%, rgba(220,137,53,0.18), transparent 60%), linear-gradient(180deg, #14171c 0%, #0a0c0f 100%)",
          }}
          aria-hidden
        />
        <div className="bg-dots absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(70%_90%_at_75%_20%,black,transparent)]" aria-hidden />

        <div className="container-page pb-20 pt-8 sm:pb-24 sm:pt-10">
          <Link href="/conferences" className="inline-flex items-center gap-1.5 text-sm text-ink-300 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" /> All conferences
          </Link>

          <div className="mt-7 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-200 ring-1 ring-inset ring-brand-400/30">
              {conference.mode}
            </span>
            {past && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink-200 ring-1 ring-inset ring-white/15">
                Completed
              </span>
            )}
          </div>

          <h1 className="mt-5 max-w-4xl font-serif text-3xl font-bold leading-tight tracking-tight sm:text-5xl">{conference.title}</h1>
          {conference.theme && (
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-300 sm:text-lg">
              <span className="font-semibold text-brand-300">Theme:</span> {conference.theme}
            </p>
          )}

          <div className="mt-8 flex max-w-4xl flex-wrap items-start gap-3">
            <InfoChip icon={Calendar} label="Date" value={formatDate(conference.date)} />
            {conference.startTime && (
              <InfoChip icon={Clock} label="Time" value={`${conference.startTime}${conference.endTime ? ` – ${conference.endTime}` : ""}`} />
            )}
            <InfoChip icon={MapPin} label="Venue" value={conference.venue} />
          </div>

          <div className="mt-8">
            <CTAButtons conference={conference} />
          </div>
        </div>

        <svg className="absolute bottom-0 left-0 w-full text-paper-50" viewBox="0 0 1440 56" preserveAspectRatio="none" aria-hidden>
          <path d="M0 56V30C240 4 480 4 720 18s480 22 720 4v34H0Z" fill="currentColor" />
        </svg>
      </div>

      {/* Body */}
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_340px] lg:gap-12">
        <div className="min-w-0 space-y-14">
          {conference.description && (
            <SectionBlock title="About the Conference">
              <p className="prose-content whitespace-pre-line text-base">{conference.description}</p>
            </SectionBlock>
          )}

          {conference.objectives?.length > 0 && (
            <SectionBlock title="Objectives">
              <ol className="space-y-3">
                {conference.objectives.map((obj, i) => (
                  <li key={i} className="flex gap-4 rounded-xl border border-ink-200/70 bg-white p-4 shadow-card">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed text-ink-700">{obj}</span>
                  </li>
                ))}
              </ol>
            </SectionBlock>
          )}

          {conference.tracks?.length > 0 && (
            <SectionBlock title="Conference Tracks">
              <TracksList tracks={conference.tracks} />
            </SectionBlock>
          )}

          {conference.subThemes?.length > 0 && (
            <SectionBlock title="Suggested Sub-Themes" subtitle="This list is suggestive — papers on any conference-related theme are welcome.">
              <SubThemesList groups={conference.subThemes} />
            </SectionBlock>
          )}

          {conference.paperGuidelines && (
            <SectionBlock title="Call for Papers &amp; Guidelines">
              <dl className="grid gap-3 sm:grid-cols-2">
                <Spec label="Font" value={`${conference.paperGuidelines.font}, ${conference.paperGuidelines.fontSize}`} />
                <Spec label="Line spacing" value={conference.paperGuidelines.lineSpacing} />
                <Spec label="File format" value={conference.paperGuidelines.fileFormat} />
                <Spec label="Margins" value={`${conference.paperGuidelines.marginLeft} left / ${conference.paperGuidelines.marginRight} right`} />
                <Spec label="Word limit" value={conference.paperGuidelines.maxWords} />
                <Spec label="References" value={`${conference.paperGuidelines.referenceStyle} style`} />
                <Spec label="Plagiarism limit" value={conference.paperGuidelines.plagiarismLimit} />
                {conference.paperGuidelines.journalName && (
                  <Spec
                    label="Journal"
                    value={`${conference.paperGuidelines.journalName}${conference.paperGuidelines.journalIssn ? ` (ISSN ${conference.paperGuidelines.journalIssn})` : ""}`}
                  />
                )}
              </dl>
              {conference.paperGuidelines.requiredFields?.length > 0 && (
                <p className="mt-4 text-sm leading-relaxed text-ink-600">
                  <span className="font-medium text-ink-800">Required in the manuscript:</span> {conference.paperGuidelines.requiredFields.join(", ")}.
                </p>
              )}
              {conference.paperGuidelines.submissionNote && (
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{conference.paperGuidelines.submissionNote}</p>
              )}
              {conference.paperGuidelines.awards && (
                <p className="mt-4 rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium leading-relaxed text-brand-800 ring-1 ring-inset ring-brand-100">
                  {conference.paperGuidelines.awards}
                </p>
              )}
            </SectionBlock>
          )}

          {committee.length > 0 && (
            <SectionBlock title="Organizing Committee">
              <CommitteeSection members={committee} />
            </SectionBlock>
          )}

          {conference.paymentInformation && (
            <SectionBlock title="Payment Information">
              <div className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-card sm:p-6">
                <dl className="grid gap-4 text-sm sm:grid-cols-2">
                  <Field label="Account Name" value={conference.paymentInformation.accountName} />
                  <Field label="Account Number" value={conference.paymentInformation.accountNumber} />
                  <Field label="Bank" value={conference.paymentInformation.bank} />
                  <Field label="Branch" value={conference.paymentInformation.branch} />
                  <Field label="IFSC Code" value={conference.paymentInformation.ifsc} />
                  {conference.paymentInformation.upiMobile && <Field label="GPay / PhonePe" value={conference.paymentInformation.upiMobile} />}
                </dl>
                {conference.paymentInformation.paymentQrUrl && (
                  <div className="mt-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={conference.paymentInformation.paymentQrUrl}
                      alt="Payment QR code"
                      className="h-48 w-48 rounded-xl border border-ink-200 bg-white object-contain p-2"
                    />
                  </div>
                )}
                {conference.paymentInformation.notes && <p className="mt-4 text-sm leading-relaxed text-ink-500">{conference.paymentInformation.notes}</p>}
              </div>
            </SectionBlock>
          )}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          {conference.registrationFees?.length > 0 && (
            <SidebarCard title="Registration Fees" icon={IndianRupee}>
              <FeeTable fees={conference.registrationFees} />
            </SidebarCard>
          )}

          {conference.importantDates?.length > 0 && (
            <SidebarCard title="Important Dates" icon={Calendar}>
              <ul className="divide-y divide-ink-100 text-sm">
                {conference.importantDates.map((d, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                    <span className="text-ink-600">{d.label}</span>
                    <span className="shrink-0 font-semibold text-ink-900">{formatDate(d.date)}</span>
                  </li>
                ))}
              </ul>
            </SidebarCard>
          )}

          <SidebarCard title="Venue" icon={MapPin}>
            <p className="text-sm font-medium text-ink-800">{conference.venue}</p>
            {conference.address && <p className="mt-1 text-sm leading-relaxed text-ink-500">{conference.address}</p>}
            <p className="mt-1 text-sm text-ink-500">
              {conference.city}
              {conference.city && conference.state ? ", " : ""}
              {conference.state}
            </p>
          </SidebarCard>

          {(conference.organizer || conference.coOrganizer) && (
            <SidebarCard title="Organized By" icon={Radio}>
              <p className="text-sm font-medium text-ink-800">{conference.organizer}</p>
              {conference.coOrganizer && <p className="mt-1 text-sm leading-relaxed text-ink-500">In collaboration with {conference.coOrganizer}</p>}
            </SidebarCard>
          )}

          {(conference.contactEmail || conference.contactPhone) && (
            <SidebarCard title="Contact" icon={Mail}>
              <div className="space-y-2.5">
                {conference.contactEmail && (
                  <a href={`mailto:${conference.contactEmail}`} className="flex items-center gap-2.5 break-all text-sm font-medium text-brand-700 hover:underline">
                    <Mail className="h-4 w-4 shrink-0" /> {conference.contactEmail}
                  </a>
                )}
                {conference.contactPhone && (
                  <a href={`tel:${conference.contactPhone}`} className="flex items-center gap-2.5 text-sm font-medium text-brand-700 hover:underline">
                    <Phone className="h-4 w-4 shrink-0" /> {conference.contactPhone}
                  </a>
                )}
              </div>
            </SidebarCard>
          )}
        </aside>
      </div>
    </div>
  );
}

function InfoChip({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex min-w-[11rem] max-w-full items-start gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3.5 pr-5 backdrop-blur sm:max-w-sm">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/20 text-brand-300">
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">{label}</p>
        <p className="mt-0.5 text-sm font-medium leading-snug text-white">{value}</p>
      </div>
    </div>
  );
}

function SectionBlock({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">{title}</h2>
      <span className="mt-3 block h-1 w-10 rounded-full bg-brand-500" aria-hidden />
      {subtitle && <p className="mt-3 text-sm text-ink-500">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function SidebarCard({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-card">
      <h3 className="mb-4 flex items-center gap-2.5 text-sm font-semibold text-ink-900">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <Icon className="h-4 w-4" />
        </span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink-200/70 bg-white px-4 py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-ink-900">{value}</dd>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-ink-400">{label}</dt>
      <dd className="mt-1 break-words font-medium text-ink-900">{value}</dd>
    </div>
  );
}
