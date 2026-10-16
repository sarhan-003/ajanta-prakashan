"use client";

import { Share, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePWAInstall } from "@/hooks/usePWAInstall";

/**
 * Global, site-wide (public + admin) install prompt. Reappears on every full
 * page load/visit until the app is actually installed — dismissing it only
 * hides it for the current visit (component state, never persisted), by
 * design: the ask was for it to keep showing up until installed, not to be
 * silence-able forever like a typical "don't show again" banner.
 */
export function InstallPromptBanner() {
  const { canInstall, isIOS, isMobile, isStandalone, promptInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  // Android/desktop Chrome decides in its own time when to fire the native
  // install event — without the `isMobile` branch, a visitor on mobile who
  // lands before that fires would see nothing at all. Show a generic
  // fallback for any mobile browser in that gap, not just once
  // `canInstall`/`isIOS` are known.
  const visible = !isStandalone && !dismissed && (canInstall || isIOS || isMobile);

  // Let the rest of the page (floating chat button, footer) make room while the banner is up.
  useEffect(() => {
    const root = document.documentElement;
    if (visible) root.setAttribute("data-install-banner", "");
    else root.removeAttribute("data-install-banner");
    return () => root.removeAttribute("data-install-banner");
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 animate-fade-up sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[26rem]">
      <div className="flex items-center gap-3 rounded-2xl bg-white p-3 pr-2 shadow-lift ring-1 ring-ink-200/70">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/icon-192.png" alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink-900">Install the Ajanta Prakashan app</p>
          {isIOS && !canInstall ? (
            <p className="mt-0.5 flex flex-wrap items-center gap-x-1 text-xs leading-snug text-ink-500">
              Tap <Share className="inline h-3.5 w-3.5" /> Share, then &quot;Add to Home Screen&quot;
            </p>
          ) : !canInstall && isMobile ? (
            <p className="mt-0.5 text-xs leading-snug text-ink-500">Open your browser menu and choose &quot;Add to Home Screen&quot; / &quot;Install app&quot;</p>
          ) : (
            <p className="mt-0.5 text-xs leading-snug text-ink-500">Quick access, offline support, no app store needed.</p>
          )}
        </div>
        {canInstall && (
          <button
            onClick={promptInstall}
            className="shrink-0 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600"
          >
            Install
          </button>
        )}
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="shrink-0 rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
