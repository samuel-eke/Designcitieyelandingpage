"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Eye } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupWizard } from "@/components/auth/SignupWizard";

/** Inner component that uses useSearchParams — must be inside <Suspense> */
function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode") === "login" ? "login" : "signup";

  const setMode = (m: "login" | "signup") => {
    router.push(`/auth?mode=${m}`);
  };

  return (
    <div className={`w-full ${mode === "login" ? "max-w-md" : "max-w-2xl"} transition-all duration-300 ease-in-out flex flex-col items-center`}>
      {/* Brand logo header */}
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-700 text-[#FFD100] shadow-sm group-hover:scale-105 transition-transform">
            <Eye className="h-5.5 w-5.5 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
            CitiEye Community Governance
          </span>
        </Link>
      </div>

      {/* Main card container */}
      <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-10 shadow-sm shadow-stone-100/40 w-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {mode === "login" ? (
              <LoginForm onSwitchToSignup={() => setMode("signup")} />
            ) : (
              <SignupWizard onSwitchToLogin={() => setMode("login")} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-stone-50/60 py-12 px-4 sm:px-6 lg:px-8">
      {/* Suspense required because AuthContent uses useSearchParams() */}
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <AuthContent />
      </Suspense>
    </div>
  );
}
