"use client";

import { ArrowRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { buttonClasses } from "@/components/common/buttonStyles";
import { getActiveLandingImages } from "@/services/landingImageService";
import type { LandingImage } from "@/types";

const DISMISSED_KEY = "ajanta-popup-dismissed-id";

/**
 * Site-wide promotional popup — admin-managed from the same Landing Images
 * screen used for the gallery (/admin/landing-images, "Also show as a popup
 * banner" checkbox). Shows the first active popup-flagged image, once per
 * browser session (sessionStorage, not localStorage — reappears on a fresh
 * visit, not on every page navigation within the same visit), and only once
 * per distinct image so a newly-flagged banner still shows even if an
 * earlier one was already dismissed this session.
 */
export function PopupBanner() {
  const [image, setImage] = useState<LandingImage | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getActiveLandingImages()
      .then((images) => {
        const candidate = images.find((img) => img.showAsPopup) || null;
        if (!candidate) return;
        let dismissedId: string | null = null;
        try {
          dismissedId = sessionStorage.getItem(DISMISSED_KEY);
        } catch {
          // sessionStorage unavailable (private mode, etc.) — just show it.
        }
        if (candidate.id === dismissedId) return;
        setImage(candidate);
        setOpen(true);
      })
      .catch(() => {});
  }, []);

  const dismiss = useCallback(() => {
    setOpen(false);
    if (!image) return;
    try {
      sessionStorage.setItem(DISMISSED_KEY, image.id);
    } catch {
      // Nothing to persist to — it'll just show again next page load, which is fine.
    }
  }, [image]);

  // Esc closes the popup, like any other dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismiss();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  if (!open || !image) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex animate-fade-in items-center justify-center bg-ink-950/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={image.caption || "Announcement"}
      onClick={dismiss}
    >
      <div className="relative w-full max-w-md animate-scale-in overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-white/10" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 rounded-full bg-black/55 p-2 text-white backdrop-blur transition-colors hover:bg-black/75"
        >
          <X className="h-4 w-4" />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.imageUrl} alt={image.caption} className="max-h-[70vh] w-full object-cover" />
        {(image.caption || image.linkUrl) && (
          <div className="space-y-4 p-5">
            {image.caption && <p className="font-serif text-lg font-semibold leading-snug text-ink-900">{image.caption}</p>}
            {image.linkUrl && (
              <a
                href={image.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={dismiss}
                className={buttonClasses({ variant: "primary", size: "md", className: "w-full" })}
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
