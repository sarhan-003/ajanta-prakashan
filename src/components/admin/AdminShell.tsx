"use client";

import { ExternalLink, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { signOutAdmin } from "@/firebase/auth";
import { logAdminAction } from "@/services/adminService";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { admin } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    if (admin) {
      await logAdminAction({
        adminUid: admin.uid,
        adminEmail: admin.email,
        action: "LOGOUT",
        resource: "admin",
        resourceId: admin.uid,
      }).catch(() => {});
    }
    await signOutAdmin();
    router.replace("/admin");
  }

  return (
    <div className="flex min-h-screen bg-paper-50">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed h-screen w-64">
          <AdminSidebar onLogout={handleLogout} />
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 animate-fade-in bg-ink-950/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl">
            <AdminSidebar onNavigate={() => setMobileOpen(false)} onLogout={handleLogout} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-ink-200/70 bg-white/90 px-4 backdrop-blur lg:hidden">
          <span className="font-serif text-base font-bold text-ink-900">Ajanta Prakashan Admin</span>
          <button onClick={() => setMobileOpen((v) => !v)} className="rounded-lg p-2 text-ink-700 transition-colors hover:bg-ink-100" aria-label="Toggle menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Desktop top bar */}
        <header className="sticky top-0 z-30 hidden h-14 items-center justify-end gap-4 border-b border-ink-200/70 bg-white/80 px-8 backdrop-blur lg:flex">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
          >
            View public site <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
