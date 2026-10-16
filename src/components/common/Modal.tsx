"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/utils/cn";

export function Modal({
  open,
  onClose,
  title,
  widthClassName = "max-w-2xl",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  widthClassName?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-start justify-center overflow-y-auto bg-ink-950/60 p-4 pt-10 backdrop-blur-sm sm:pt-16"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className={cn("relative w-full animate-scale-in rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5", widthClassName)}>
        {title && (
          <div className="mb-5 flex items-center justify-between border-b border-ink-100 pb-4">
            <h2 className="text-lg font-semibold text-ink-900">{title}</h2>
            <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        {!title && (
          <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700">
            <X className="h-5 w-5" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
