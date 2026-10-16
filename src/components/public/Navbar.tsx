"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { LinkButton } from "@/components/common/LinkButton";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { usePublicAuth } from "@/contexts/PublicAuthContext";
import { cn } from "@/utils/cn";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/conferences", label: "Conferences" },
  { href: "/events", label: "Events" },
  { href: "/notifications", label: "Notifications" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

export function Navbar() {
  const { settings } = useSiteSettings();
  const { loading, profile } = usePublicAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-white/90 backdrop-blur-md transition-shadow duration-300",
        scrolled || open ? "border-ink-200/80 shadow-[0_6px_24px_-12px_rgba(20,23,28,0.25)]" : "border-transparent"
      )}
    >
      <div className="container-page flex h-[4.25rem] items-center justify-between gap-3">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- logo URL is admin-controlled/external, see README on external media URLs */}
          <img
            src={settings.logoUrl || "/images/logo.png"}
            alt=""
            width={40}
            height={40}
            className="h-9 w-9 shrink-0 rounded-lg object-cover ring-1 ring-ink-200/70 sm:h-10 sm:w-10"
          />
          <span className="truncate font-serif text-lg font-bold tracking-tight text-ink-900 sm:text-xl">{settings.websiteName}</span>
        </Link>

        <nav className="hidden h-full items-stretch lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex items-center px-3.5 text-sm font-medium transition-colors",
                  "after:absolute after:inset-x-3.5 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-brand-500 after:transition-transform after:duration-300",
                  active ? "text-brand-700 after:scale-x-100" : "text-ink-600 hover:text-ink-900 hover:after:scale-x-100"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <AccountLink loading={loading} name={profile?.fullName} registered={!!profile} />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <AccountLink loading={loading} name={profile?.fullName} registered={!!profile} compact />
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-ink-700 transition-colors hover:bg-ink-100"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full max-h-[calc(100vh-4.25rem)] animate-fade-in overflow-y-auto border-t border-ink-100 bg-white shadow-lg lg:hidden">
          <nav className="container-page flex flex-col py-2" aria-label="Mobile">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-3.5 text-base font-medium transition-colors",
                    active ? "bg-brand-50 text-brand-700" : "text-ink-700 hover:bg-ink-50"
                  )}
                >
                  {link.label}
                  <ChevronRight className={cn("h-4 w-4", active ? "text-brand-500" : "text-ink-300")} />
                </Link>
              );
            })}
            {!loading && !profile && (
              <LinkButton href="/register" size="lg" className="mb-3 mt-3 w-full min-[360px]:hidden">
                Register
              </LinkButton>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function AccountLink({ loading, registered, name, compact }: { loading: boolean; registered: boolean; name?: string; compact?: boolean }) {
  if (loading) return <div className={compact ? "h-10 w-10" : "h-10 w-28"} aria-hidden />;

  if (registered) {
    const first = (name || "").trim().split(/\s+/)[0] || "Profile";
    return (
      <Link
        href="/profile"
        aria-label="My profile"
        title="My profile"
        className="flex items-center gap-2.5 rounded-full border border-ink-200 bg-white py-1 pl-1 pr-1 text-sm font-medium text-ink-700 shadow-sm transition-colors hover:border-brand-300 hover:bg-brand-50 lg:pr-4"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold uppercase text-white">
          {first.charAt(0)}
        </span>
        {!compact && <span className="max-w-[8rem] truncate">{first}</span>}
      </Link>
    );
  }

  // Compact (mobile top bar) keeps a small button; the full-width one lives in the menu panel.
  return (
    <LinkButton href="/register" size={compact ? "sm" : "md"} className={compact ? "hidden min-[360px]:inline-flex" : undefined}>
      Register
    </LinkButton>
  );
}
