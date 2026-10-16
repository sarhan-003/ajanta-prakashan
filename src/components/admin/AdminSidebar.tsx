"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CalendarDays,
  Database,
  FileImage,
  GalleryHorizontalEnd,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Settings,
  ShieldCheck,
  Users,
  UserSquare2,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { cn } from "@/utils/cn";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/conferences", label: "Conferences", icon: CalendarDays },
      { href: "/admin/events", label: "Events", icon: CalendarDays },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
      { href: "/admin/landing-images", label: "Landing Images", icon: GalleryHorizontalEnd },
      { href: "/admin/media", label: "Media", icon: FileImage },
      { href: "/admin/committees", label: "Committees", icon: UserSquare2 },
    ],
  },
  {
    label: "People & Payments",
    items: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/payment", label: "Payment Info", icon: Wallet },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/database", label: "Database", icon: Database },
      { href: "/admin/settings", label: "Settings", icon: Settings },
      { href: "/admin/profile", label: "Admin Profile", icon: ShieldCheck },
      { href: "/admin/logs", label: "Activity Logs", icon: ListChecks },
    ],
  },
];

export function AdminSidebar({ onNavigate, onLogout }: { onNavigate?: () => void; onLogout: () => void }) {
  const pathname = usePathname();
  const { admin } = useAdminAuth();

  return (
    <div className="flex h-full flex-col bg-ink-950 text-ink-200">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo.png" alt="" className="h-9 w-9 rounded-lg bg-white object-cover" />
        <div className="leading-tight">
          <p className="font-serif text-base font-bold text-white">Ajanta Prakashan</p>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-brand-300">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Admin">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-6 last:mb-0">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">{group.label}</p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        active ? "bg-brand-500 text-white shadow-sm" : "text-ink-300 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-3">
        {admin?.email && (
          <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-sm font-semibold uppercase text-brand-200">
              {admin.email.charAt(0)}
            </span>
            <span className="min-w-0 truncate text-xs text-ink-300" title={admin.email}>
              {admin.email}
            </span>
          </div>
        )}
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-300 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </div>
  );
}
