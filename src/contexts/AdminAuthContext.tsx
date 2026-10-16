"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { watchAuthState } from "@/firebase/auth";
import { getAdminAccount } from "@/services/adminService";
import type { AdminAccount } from "@/types";

type AdminAuthStatus = "checking" | "signed-out" | "unauthorized" | "authorized";

interface AdminAuthState {
  status: AdminAuthStatus;
  user: User | null;
  admin: AdminAccount | null;
}

const AdminAuthContext = createContext<AdminAuthState>({ status: "checking", user: null, admin: null });

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AdminAuthState>({ status: "checking", user: null, admin: null });

  useEffect(() => {
    const unsubscribe = watchAuthState(async (user) => {
      // Visitors of the public site hold a silent anonymous session (see
      // PublicAuthContext). That is not an admin sign-in attempt, so show the
      // normal login form rather than an "Access Denied" screen.
      if (!user || user.isAnonymous) {
        setState({ status: "signed-out", user: null, admin: null });
        return;
      }
      setState((prev) => ({ ...prev, status: "checking", user }));
      try {
        const admin = await getAdminAccount(user.uid);
        if (!admin) {
          setState({ status: "unauthorized", user, admin: null });
          return;
        }
        setState({ status: "authorized", user, admin });
      } catch {
        setState({ status: "unauthorized", user, admin: null });
      }
    });
    return unsubscribe;
  }, []);

  return <AdminAuthContext.Provider value={state}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
