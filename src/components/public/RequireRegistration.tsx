"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/common/LoadingSpinner";
import { usePublicAuth } from "@/contexts/PublicAuthContext";
import { RegistrationGate } from "./RegistrationGate";

/**
 * Full-page gate: only lets the wrapped page render its children once the
 * visitor has completed registration. This mirrors the Firestore rule
 * (isRegistered()) that actually enforces this server-side — the gate here
 * just gives a friendly prompt instead of a blank/broken page, and avoids
 * even attempting a read that the rules would reject.
 */
export function RequireRegistration({ children }: { children: React.ReactNode }) {
  const { loading, profile, isAdmin } = usePublicAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // The conference detail page identifies itself via ?id= (a query param,
  // not a path segment — see /conferences/view — so the whole route is a
  // static file the free Firebase Hosting plan can serve). Preserve the
  // full current URL (path + query) in `next`, not just the pathname, or
  // registering from a conference page would lose which conference it was.
  const conferenceId = searchParams.get("id") ?? undefined;
  const currentUrl = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

  if (loading) {
    return (
      <div className="container-page py-12">
        <Skeleton className="h-8 w-1/3 rounded-md" />
        <Skeleton className="mt-6 h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (!profile && !isAdmin) {
    const registerHref = conferenceId
      ? `/register?conferenceId=${conferenceId}&next=${encodeURIComponent(currentUrl)}`
      : `/register?next=${encodeURIComponent(currentUrl)}`;
    return (
      <div className="container-page py-16 sm:py-24">
        <RegistrationGate registerHref={registerHref} title="Registration required" />
      </div>
    );
  }

  return <>{children}</>;
}
