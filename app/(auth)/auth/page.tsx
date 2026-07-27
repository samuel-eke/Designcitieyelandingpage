"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Eye, ArrowLeft, User, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupWizard } from "@/components/auth/SignupWizard";
import { OfficerLoginForm } from "@/components/auth/OfficerLoginForm";
import { OfficerSignupForm } from "@/components/auth/OfficerSignupForm";
import { TargetSlideshow } from "@/components/auth/TargetSlideshow";

/** Inner component that uses useSearchParams — must be inside <Suspense> */
function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mode = searchParams.get("mode") === "login" ? "login" : "signup";
  const role = searchParams.get("role") === "officer" ? "officer" : "citizen";

  const setAuthParams = (newMode: "login" | "signup", newRole: "citizen" | "officer") => {
    router.push(`/auth?mode=${newMode}&role=${newRole}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Brand logo header & Back to Landing Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <Link href="/" className="flex items-center gap-2.5 group w-fit">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-700 text-[#FFD100] shadow-sm group-hover:scale-105 transition-transform">
            <Eye className="h-5.5 w-5.5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xl font-serif font-bold text-stone-900 tracking-tight block leading-tight">
              CitiEye Governance
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block">
              Federal Citizen & Officer Portal
            </span>
          </div>
        </Link>

        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-green-700" />
          <span>Return to Homepage</span>
        </Link>
      </div>

      {/* Portal Type Switcher Bar */}
      <div className="max-w-md mx-auto mb-8 p-1 bg-stone-200/70 rounded-2xl flex items-center justify-between gap-1 shadow-inner">
        <button
          onClick={() => setAuthParams(mode, "citizen")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            role === "citizen"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <User className="w-3.5 h-3.5 text-green-700" />
          <span>Citizen Portal</span>
        </button>

        <button
          onClick={() => setAuthParams(mode, "officer")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            role === "officer"
              ? "bg-white text-blue-700 shadow-sm ring-1 ring-blue-500/20"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Field Officer Portal</span>
        </button>
      </div>

      {/* 2-COLUMN LAYOUT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* COLUMN 1: Registration / Login Form (Spans 7 columns on Desktop) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-10 shadow-sm shadow-stone-100/40 w-full h-full flex flex-col justify-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${role}-${mode}`}
                initial={{ opacity: 0, x: mode === "login" ? -15 : 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === "login" ? 15 : -15 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {role === "officer" ? (
                  mode === "login" ? (
                    <OfficerLoginForm onSwitchToSignup={() => setAuthParams("signup", "officer")} />
                  ) : (
                    <OfficerSignupForm onSwitchToLogin={() => setAuthParams("login", "officer")} />
                  )
                ) : mode === "login" ? (
                  <LoginForm onSwitchToSignup={() => setAuthParams("signup", "citizen")} />
                ) : (
                  <SignupWizard onSwitchToLogin={() => setAuthParams("login", "citizen")} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* COLUMN 2: Target Demographic Slideshow */}
        <div className="hidden lg:flex lg:col-span-5 flex-col lg:sticky lg:top-6 lg:h-[calc(100vh-6rem)]">
          <TargetSlideshow />
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-stone-50/70 flex flex-col justify-center">
      {/* Suspense required because AuthContent uses useSearchParams() */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-9 h-9 border-3 border-green-700 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <AuthContent />
      </Suspense>
    </div>
  );
}
