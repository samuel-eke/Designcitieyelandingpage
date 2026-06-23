"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useMemo } from "react";
import { CulturalPattern } from "../ui/CulturalPattern";
import { Coins, IdCard, ShieldCheck } from "lucide-react";

/* ─── Nigeria Dot-Grid Particle Map ─────────────────────────────────────────
   Nigeria's outline as a clipPath; a rectangular dot grid is clipped to it.
   Dots animate opacity in a south-to-north wave (staggered animation-delay).
   Uses only CSS animations — GPU-accelerated, performant on mobile.
────────────────────────────────────────────────────────────────────────────── */
const NG_PATH =
  "M 20,52 Q 100,30 180,46 C 188,56 188,74 185,92 C 182,110 178,128 " +
  "172,144 C 166,160 156,174 144,188 C 130,202 112,210 94,210 " +
  "C 76,210 58,200 46,185 C 34,170 24,150 18,124 C 12,98 14,72 20,52 Z";

function NigeriaParticleMap() {
  const dots = useMemo(() => {
    const items: Array<{ x: number; y: number; delay: number }> = [];
    const Y_MIN = 30, Y_MAX = 218, X_MIN = 10, X_MAX = 194, STEP = 11;
    for (let y = Y_MIN; y <= Y_MAX; y += STEP) {
      for (let x = X_MIN; x <= X_MAX; x += STEP) {
        // South (high y) = delay 0 → pulses first; north (low y) = delay 3s → pulses last
        const normFromSouth = (Y_MAX - y) / (Y_MAX - Y_MIN);
        items.push({ x, y, delay: normFromSouth * 3.2 });
      }
    }
    return items;
  }, []);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 204 230"
        width="100%"
        height="100%"
        // "slice" fills the card fully; Nigeria is centred and slightly cropped
        // at extremes — the populated heartland stays visible on any card height.
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.52 }}
      >
        <defs>
          <clipPath id="promise-ng-clip">
            <path d={NG_PATH} />
          </clipPath>

          {/* Subtle green radial glow inside the silhouette */}
          <radialGradient id="promise-ng-glow" cx="50%" cy="55%" r="48%">
            <stop offset="0%"   stopColor="#166534" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#166534" stopOpacity="0"    />
          </radialGradient>
        </defs>

        {/* Keyframe + class injected inline — scoped to this SVG subtree */}
        <style>{`
          @keyframes promise-ng-wave {
            0%, 100% { opacity: 0.07; }
            46%, 54%  { opacity: 0.92; }
          }
          .promise-ng-dot {
            fill: #4ade80;
            animation: promise-ng-wave 5s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .promise-ng-dot {
              animation: none !important;
              opacity: 0.2 !important;
            }
          }
        `}</style>

        {/* Radial inner-glow fill clipped to Nigeria shape */}
        <rect
          width="204"
          height="230"
          fill="url(#promise-ng-glow)"
          clipPath="url(#promise-ng-clip)"
        />

        {/* Very faint country outline — anchors the silhouette even between waves */}
        <path
          d={NG_PATH}
          fill="none"
          stroke="#4ade80"
          strokeWidth="0.7"
          opacity="0.2"
        />

        {/* Dot grid — browser clips everything outside Nigeria's path */}
        <g clipPath="url(#promise-ng-clip)">
          {dots.map((dot, i) => (
            <circle
              key={i}
              className="promise-ng-dot"
              cx={dot.x}
              cy={dot.y}
              r={1.45}
              style={{ animationDelay: `${dot.delay.toFixed(2)}s` }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export function Promise() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create scroll-driven progress tracking for this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Hardware-accelerated parallax transform maps
  const bgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const orbsY = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full bg-stone-900 py-24 lg:py-40 overflow-hidden flex items-center justify-center border-y border-stone-800"
    >
      {/* 1. Parallax Background & Pattern */}
      <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ y: bgY }}>
        <CulturalPattern opacity={0.06} className="text-[#FFD100]" />
      </motion.div>

      {/* 2. Floating Narrative Elements & Orbs */}
      <motion.div className="absolute inset-0 pointer-events-none z-0" style={{ y: orbsY }}>
        {/* Yellow glowing orb */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[80%] rounded-full bg-[#FFD100]/5 blur-[120px]" />
        
        {/* Green glowing orb */}
        <div className="absolute bottom-[-20%] right-[-10%] w-[45%] h-[60%] rounded-full bg-green-600/10 blur-[140px]" />
        
        {/* Slow-floating Narrative Icons */}
        <motion.div 
          animate={{ y: [0, -40, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] right-[10%] text-[#FFD100]/20"
        >
          <Coins size={80} strokeWidth={1} />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 50, 0], rotate: [0, -15, 5, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] left-[8%] text-green-500/20"
        >
          <IdCard size={100} strokeWidth={1} />
        </motion.div>

        <motion.div 
          animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          className="absolute top-[45%] left-[50%] text-white/5"
        >
          <ShieldCheck size={64} strokeWidth={1.5} />
        </motion.div>
      </motion.div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">

          {/* Left: Content (Parallax slowed slightly) */}
          <motion.div className="lg:col-span-7" style={{ y: contentY }}>
            <span className="text-[11px] font-bold tracking-[3px] uppercase text-[#FFD100] mb-8 block">
              Our promise
            </span>
            <blockquote className="relative pl-6 sm:pl-8 border-l-4 border-[#FFD100] mb-10">
              <p className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-white leading-[1.25]">
                "Information, programmes, and support shaped entirely around you — your circumstances, your goals, your life."
              </p>
            </blockquote>
            
            <div className="space-y-6 max-w-2xl pl-6 sm:pl-8">
              <p className="text-base sm:text-lg text-stone-300 leading-relaxed font-light">
                You will never feel like a number in a system. With CitiEye, every citizen is paired with a <strong className="text-white font-medium">dedicated officer</strong> — a consistent, caring presence who walks with you through life's milestones, challenges, and triumphs.
              </p>
              

              {/* Active badge */}
              <div className="inline-flex items-center gap-3 mt-8 px-5 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm shadow-xl">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-xs sm:text-sm text-stone-200 font-medium tracking-wide">
                  Programme active nationwide
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right: Scroll-Delayed Foreground Asset */}
          <div className="lg:col-span-5 relative h-full min-h-[400px] flex items-center justify-center lg:justify-end mt-4 lg:mt-0">
            <motion.div
              style={{ y: cardY }}
              className="relative w-full max-w-[420px]"
            >
              {/* Photo frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1642929426263-caf1617ced29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxibGFjayUyMHdvbWFuJTIwZ292ZXJubWVudCUyMG9mZmljZXIlMjBzbWlsaW5nJTIwdGFibGV0JTIwaW50ZXJ2aWV3JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzgwMzI4MzM5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="CitiEye dedicated officer on duty with a tablet, smiling with a citizen"
                  className="w-full h-full object-cover object-center"
                />
                {/* Gradient overlay — bottom caption area */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-stone-900/80 to-transparent pointer-events-none" />
                {/* Caption tag */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
                  <p className="text-white text-xs font-semibold tracking-wide">Officer on duty · Field visit in progress</p>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-4 sm:-left-8 bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-stone-200"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">Status</p>
                  <p className="text-sm font-bold text-stone-900">Verified Citizen</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}