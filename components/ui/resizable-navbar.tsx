"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { Eye, ChevronDown, User, ShieldCheck, Building2 } from "lucide-react";
import { useAuthStore } from "../auth/authStore";

export function ResizableNavbar() {
  const { scrollY } = useScroll();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  // Collapse if scrolled more than 80px
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 80) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  });

  const navLinks = [
    { name: "What We Offer", href: "#pillars" },
    { name: "Life Stages", href: "#stages" },
    { name: "Get the App", href: "#download" },
    { name: "How It Works", href: "#" },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm"
      initial={false}
      animate={{
        height: isCollapsed ? "72px" : "96px",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex h-full items-center justify-between">
          {/* Logo - Always visible */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center text-yellow-500">
                <Eye className="h-6 w-6 sm:h-7 sm:w-7 stroke-[2.5]" />
              </div>
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors">
                CitiEye Community Governance
              </span>
            </Link>
          </div>

          {/* Desktop Nav - Hides on scroll */}
          <div className="hidden md:flex flex-1 justify-center">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center space-x-8"
                >
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="text-stone-600 hover:text-green-700 px-1 py-2 text-[14px] font-medium tracking-wide transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <AnimatePresence mode="popLayout">
              {isAuthenticated ? (
                <div className="flex items-center gap-4 animate-in fade-in duration-300">
                  <span className="text-sm text-stone-700 font-medium">
                    Hello, {user?.firstName || "Citizen"}
                  </span>
                  <Link
                    href="/dashboard"
                    className="inline-block bg-green-700 hover:bg-green-850 px-5 py-2 text-[13px] font-semibold tracking-wide text-white transition-all active:scale-95 rounded-full cursor-pointer"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      window.location.href = "/";
                    }}
                    className="inline-block bg-stone-100 hover:bg-stone-200 px-5 py-2 text-[13px] font-semibold tracking-wide text-stone-850 transition-all active:scale-95 rounded-full cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <motion.div layout className="relative group">
                  <button
                    className="inline-flex items-center gap-2 bg-[#008751] px-5 py-2.5 text-[13px] font-semibold tracking-wide text-white transition-all hover:bg-[#006633] active:scale-95 rounded-full cursor-pointer shadow-sm"
                  >
                    <span>Access Portal</span>
                    <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-stone-200/80 rounded-2xl p-2 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link
                      href="/auth?mode=signup&role=citizen"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-stone-50 transition-colors group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-800 block group-hover/item:text-green-700 transition-colors">
                          Citizen Registration
                        </span>
                        <span className="text-[10px] text-stone-400 block leading-tight">
                          Register your citizen profile & welfare account
                        </span>
                      </div>
                    </Link>

                    <Link
                      href="/auth?mode=signup&role=officer"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-blue-50/50 transition-colors group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-stone-800 block group-hover/item:text-blue-700 transition-colors">
                            Field Officer Portal
                          </span>
                          <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded text-[8px] font-mono font-bold">
                            NEW
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 block leading-tight">
                          Register & login as an authorized field agent
                        </span>
                      </div>
                    </Link>

                    <div className="my-1 border-t border-stone-100" />

                    <Link
                      href="/admin"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-stone-50 transition-colors group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-800 block group-hover/item:text-stone-900 transition-colors">
                          Admin Gateway
                        </span>
                        <span className="text-[10px] text-stone-400 block leading-tight">
                          Government agency & super admin login
                        </span>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile CTA (Fallback) */}
          <div className="md:hidden flex items-center">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  window.location.href = "/";
                }}
                className="inline-block bg-stone-200 px-5 py-2 text-[12px] font-semibold tracking-wide text-stone-900 transition-all hover:bg-stone-300 active:scale-95 rounded-full cursor-pointer"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth?mode=signup"
                className="inline-block bg-black px-5 py-2 text-[12px] font-semibold tracking-wide text-white transition-all hover:bg-stone-800 active:scale-95 rounded-full"
              >
                Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
