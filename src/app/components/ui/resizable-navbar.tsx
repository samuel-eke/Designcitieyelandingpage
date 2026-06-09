import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { Eye } from "lucide-react";

export function ResizableNavbar() {
  const { scrollY } = useScroll();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center text-yellow-500">
                <Eye className="h-6 w-6 sm:h-7 sm:w-7 stroke-[2.5]" />
              </div>
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors">
                CitiEye
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
              {/* Secondary CTA - Always visible */}
              <motion.div layout>
                <Link
                  to="/auth?mode=signup"
                  className="inline-block bg-[#008751] px-6 py-2.5 text-[13px] font-semibold tracking-wide text-white transition-all hover:bg-[#006633] active:scale-95 rounded-full"
                >
                  Register Now
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile CTA (Fallback) */}
          <div className="md:hidden flex items-center">
            <Link
              to="/auth?mode=signup"
              className="inline-block bg-black px-5 py-2 text-[12px] font-semibold tracking-wide text-white transition-all hover:bg-stone-800 active:scale-95 rounded-full"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
