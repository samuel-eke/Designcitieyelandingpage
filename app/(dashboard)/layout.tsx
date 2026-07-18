"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/components/auth/authStore";
import { Eye, Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    let active = false;
    const checkAuth = async () => {
      try {
        active = await initializeAuth();
        if (!active) {
          router.push("/auth?mode=login");
        } else {
          setIsVerifying(false);
        }
      } catch (err) {
        console.error("Dashboard auth verification error:", err);
        router.push("/auth?mode=login");
      }
    };
    checkAuth();
  }, [initializeAuth, router]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-700 text-yellow-500 shadow-md animate-pulse">
            <Eye className="h-7 w-7 stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-2 text-stone-500 font-medium text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-green-700" />
            Securing citizen workspace...
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
