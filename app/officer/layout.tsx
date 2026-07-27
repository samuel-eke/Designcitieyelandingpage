"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, extractUserRole } from "@/components/auth/authStore";
import { Loader2, ShieldCheck } from "lucide-react";

/** Strip the ROLE_ prefix Spring Boot adds to JWT authorities, then check */
function isFieldOfficerRole(role: string): boolean {
  const normalized = role.toLowerCase().replace(/^role_/, "");
  return normalized.startsWith("field_officer");
}

export default function OfficerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, initializeAuth, user, accessToken } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Only attempt a silent refresh when there is no token already in
        // memory. If the user just logged in, the token is already set and we
        // should NOT call initializeAuth() again — doing so fires another
        // POST /api/auth/refresh which can fail and boot the user back to login.
        const currentToken = useAuthStore.getState().accessToken;
        if (!currentToken) {
          const ok = await initializeAuth();
          if (!ok) {
            router.push("/auth?mode=login&role=officer");
            return;
          }
        }

        // Verify that the authenticated user is a field officer
        const { user: u, accessToken: t } = useAuthStore.getState();
        const role = extractUserRole(u, t);
        if (!isFieldOfficerRole(role)) {
          router.push("/auth?mode=login&role=officer");
          return;
        }

        setIsVerifying(false);
      } catch (err) {
        console.error("Officer auth error:", err);
        router.push("/auth?mode=login&role=officer");
      }
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            Securing officer session...
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
