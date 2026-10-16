"use client";

import { useEffect, useState } from "react";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { EventCard } from "@/components/public/EventCard";
import { PageHero } from "@/components/public/PageHero";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/common/LoadingSpinner";
import { Button } from "@/components/common/Button";
import { getPublishedEvents } from "@/services/eventService";
import type { EventItem } from "@/types";

export default function EventsPage() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPublishedEvents({ pageSize: 12 })
      .then((page) => {
        setItems(page.items);
        setCursor(page.lastDoc);
        setHasMore(page.hasMore);
      })
      .catch(() => setError("Could not load events."))
      .finally(() => setLoading(false));
  }, []);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const page = await getPublishedEvents({ pageSize: 12, cursor });
      setItems((prev) => [...prev, ...page.items]);
      setCursor(page.lastDoc);
      setHasMore(page.hasMore);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <>
      <PageHero eyebrow="Happening soon" title="Events" description="Seminars, workshops and other academic events." />

      <div className="container-page py-10 sm:py-12">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} />
        ) : items.length === 0 ? (
          <EmptyState title="No upcoming events available." description="New seminars and workshops will be listed here as soon as they are announced." />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
            {hasMore && (
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
