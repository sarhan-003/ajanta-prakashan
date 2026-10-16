"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Search, SearchX } from "lucide-react";
import { ConferenceCard } from "@/components/public/ConferenceCard";
import { PageHero } from "@/components/public/PageHero";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/common/LoadingSpinner";
import { Button } from "@/components/common/Button";
import { Input, Select } from "@/components/common/FormControls";
import { RequireRegistration } from "@/components/public/RequireRegistration";
import { getPublishedConferences, searchPublishedConferences } from "@/services/conferenceService";
import type { Conference, ConferenceMode } from "@/types";
import { cn } from "@/utils/cn";

type Tab = "upcoming" | "past" | "all";

function ConferencesPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") as Tab) || "upcoming";

  const [items, setItems] = useState<Conference[]>([]);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState<ConferenceMode | "all">("all");
  const [cityFilter, setCityFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    setError(null);
    getPublishedConferences({ when: tab, pageSize: 9 })
      .then((page) => {
        setItems(page.items);
        setCursor(page.lastDoc);
        setHasMore(page.hasMore);
      })
      .catch(() => setError("Could not load conferences."))
      .finally(() => setLoading(false));
  }, [tab]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const page = await getPublishedConferences({ when: tab, pageSize: 9, cursor });
      setItems((prev) => [...prev, ...page.items]);
      setCursor(page.lastDoc);
      setHasMore(page.hasMore);
    } finally {
      setLoadingMore(false);
    }
  }

  const [searchResults, setSearchResults] = useState<Conference[] | null>(null);
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults(null);
      return;
    }
    const t = setTimeout(() => {
      searchPublishedConferences(search).then(setSearchResults);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const cities = useMemo(() => Array.from(new Set(items.map((c) => c.city).filter(Boolean))), [items]);

  const displayed = useMemo(() => {
    const base = searchResults ?? items;
    return base.filter((c) => (modeFilter === "all" || c.mode === modeFilter) && (cityFilter === "all" || c.city === cityFilter));
  }, [searchResults, items, modeFilter, cityFilter]);

  const filtering = !!search.trim() || modeFilter !== "all" || cityFilter !== "all";

  return (
    <>
      <PageHero eyebrow="Browse" title="Conferences" description="Browse national and international academic conferences." />

      <div className="container-page py-10 sm:py-12">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-ink-200/70 bg-white p-3 shadow-card lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex w-full gap-1 rounded-xl bg-ink-100 p-1 lg:w-auto" role="tablist" aria-label="Conference timeline">
            {(["upcoming", "past", "all"] as Tab[]).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => router.push(`/conferences?tab=${t}`)}
                className={cn(
                  "flex-1 rounded-lg px-5 py-2 text-sm font-medium capitalize transition-all lg:flex-none",
                  tab === t ? "bg-white text-brand-700 shadow-sm" : "text-ink-600 hover:text-ink-900"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, theme or city..."
                aria-label="Search conferences"
                className="pl-10"
              />
            </div>
            <Select value={modeFilter} onChange={(e) => setModeFilter(e.target.value as ConferenceMode | "all")} className="sm:w-40" aria-label="Filter by mode">
              <option value="all">All Modes</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </Select>
            {cities.length > 0 && (
              <Select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="sm:w-44" aria-label="Filter by location">
                <option value="all">All Locations</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-[26rem] w-full rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={() => router.refresh()} />
        ) : displayed.length === 0 ? (
          <EmptyState
            icon={filtering ? SearchX : undefined}
            title={filtering ? "No conferences match your search." : tab === "past" ? "No past conferences available." : "No upcoming conferences available."}
            description={filtering ? "Try a different keyword or clear the filters." : "Please check back soon, or register to be notified when a new conference is announced."}
          />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayed.map((c) => (
                <ConferenceCard key={c.id} conference={c} />
              ))}
            </div>
            {!searchResults && hasMore && (
              <div className="mt-10 flex justify-center">
                <Button variant="outline" size="lg" onClick={loadMore} loading={loadingMore}>
                  Load more
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default function ConferencesPage() {
  return (
    <Suspense fallback={<div className="container-page py-12"><Skeleton className="h-96 w-full rounded-2xl" /></div>}>
      <RequireRegistration>
        <ConferencesPageInner />
      </RequireRegistration>
    </Suspense>
  );
}
