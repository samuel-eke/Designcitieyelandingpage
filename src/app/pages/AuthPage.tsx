import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Eye, ShieldCheck, Users, Coins, Star } from "lucide-react";
import { LoginForm } from "../components/auth/LoginForm";
import { SignupWizard } from "../components/auth/SignupWizard";

const TESTIMONIAL = {
  quote: "I was part of the pilot in Enugu. My CitiEye officer helped me apply for the N-Power scheme — I wouldn't have known where to start on my own.",
  author: "Ngozi A.",
  location: "Enugu State · Pilot participant",
};

function BrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] bg-[#006633] flex-col relative overflow-hidden">
      {/* Nigerian flag stripe accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 flex">
        <div className="flex-1 bg-[#008751]" />
        <div className="flex-1 bg-white/20" />
        <div className="flex-1 bg-[#008751]" />
      </div>

      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.04]" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="auth-adire" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect x="10" y="10" width="20" height="20" fill="none" stroke="#FFD100" strokeWidth="1" transform="rotate(45 20 20)" />
              <circle cx="20" cy="20" r="3" fill="#FFD100" />
              <line x1="0" y1="20" x2="10" y2="20" stroke="#FFD100" strokeWidth="0.5" />
              <line x1="30" y1="20" x2="40" y2="20" stroke="#FFD100" strokeWidth="0.5" />
              <line x1="20" y1="0" x2="20" y2="10" stroke="#FFD100" strokeWidth="0.5" />
              <line x1="20" y1="30" x2="20" y2="40" stroke="#FFD100" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-adire)" />
        </svg>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 -right-20 w-64 h-64 rounded-full bg-[#FFD100]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-48 h-48 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group mb-auto">
          <div className="flex items-center justify-center text-[#FFD100]">
            <Eye className="h-7 w-7 stroke-[2.5]" />
          </div>
          <span className="text-2xl font-serif font-bold text-white tracking-tight">
            CitiEye
          </span>
        </Link>

        {/* Main Brand Message */}
        <div className="py-12">
          <h1 className="text-4xl xl:text-5xl font-serif font-bold text-white leading-[1.2] mb-6">
            Helping build
            <br />
            <span className="text-[#FFD100] italic">a better Nigeria.</span>
          </h1>
          <p className="text-green-100 text-base leading-relaxed font-light max-w-xs">
            Be among the first Nigerians to have a CitiEye profile — and help us build a welfare system that reaches everyone, everywhere.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: Users, label: "Early registrants", value: "12,400+" },
            { icon: Coins, label: "Pilot grants", value: "₦2.1B" },
            { icon: ShieldCheck, label: "States active", value: "8" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <Icon className="w-4 h-4 text-[#FFD100] mb-2" />
              <p className="text-white font-bold text-lg font-serif">{value}</p>
              <p className="text-green-200 text-[11px] font-medium uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
          <div className="flex gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 text-[#FFD100] fill-[#FFD100]" />
            ))}
          </div>
          <p className="text-green-100 text-sm leading-relaxed italic mb-3">"{TESTIMONIAL.quote}"</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FFD100]/20 border border-[#FFD100]/30 flex items-center justify-center shrink-0">
              <span className="text-[#FFD100] text-xs font-bold">{TESTIMONIAL.author[0]}</span>
            </div>
            <div>
              <p className="text-white text-[12px] font-semibold">{TESTIMONIAL.author}</p>
              <p className="text-green-300 text-[10px]">{TESTIMONIAL.location}</p>
            </div>
          </div>
        </div>

        {/* Tagline at bottom */}
        <p className="mt-6 text-green-400 text-[11px] font-semibold uppercase tracking-[2px]">
          Federal Republic of Nigeria · Early Access Programme
        </p>
      </div>
    </div>
  );
}

export function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "login" ? "login" : "signup";

  const setMode = (m: "login" | "signup") => {
    setSearchParams({ mode: m });
  };

  // Mobile logo bar (shown instead of BrandPanel on mobile)
  const MobileHeader = () => (
    <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-stone-100">
      <Link to="/" className="flex items-center gap-2 group">
        <Eye className="h-6 w-6 text-yellow-500 stroke-[2.5]" />
        <span className="text-xl font-serif font-bold text-stone-900">CitiEye</span>
      </Link>
      <div className="flex bg-stone-100 p-1 rounded-full">
        <button
          onClick={() => setMode("signup")}
          className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${mode === "signup" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"}`}
        >
          Register
        </button>
        <button
          onClick={() => setMode("login")}
          className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${mode === "login" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"}`}
        >
          Sign In
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      <BrandPanel />

      <div className="flex-1 flex flex-col">
        <MobileHeader />

        <div className="flex-1 flex items-start justify-center py-8 px-4 sm:px-8 lg:py-12 lg:px-12 xl:px-16 overflow-y-auto">
          <div className="w-full max-w-lg">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
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
      </div>
    </div>
  );
}
