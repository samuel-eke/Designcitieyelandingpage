import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { NG_STATE_PATHS } from "./nigeriaMapData";
import { CheckCircle2, Clock, MapPin } from "lucide-react";

type Status = "active" | "pilot" | "coming-soon";

interface StateInfo {
  status: Status;
  officers?: number;
  citizens?: number;
}

const STATE_DATA: Record<string, StateInfo> = {
  "NG-LA": { status: "active", officers: 120, citizens: 48200 },
  "NG-FC": { status: "active", officers: 98,  citizens: 41000 },
  "NG-RI": { status: "active", officers: 85,  citizens: 33500 },
  "NG-KN": { status: "active", officers: 76,  citizens: 29800 },
  "NG-OY": { status: "active", officers: 64,  citizens: 24100 },
  "NG-AN": { status: "active", officers: 58,  citizens: 21700 },
  "NG-KD": { status: "active", officers: 52,  citizens: 19400 },
  "NG-ED": { status: "active", officers: 47,  citizens: 17300 },
  "NG-DE": { status: "active", officers: 43,  citizens: 15900 },
  "NG-EN": { status: "active", officers: 41,  citizens: 15200 },
  "NG-OG": { status: "pilot",  officers: 28,  citizens: 9800  },
  "NG-ON": { status: "pilot",  officers: 24,  citizens: 8400  },
  "NG-OS": { status: "pilot",  officers: 22,  citizens: 7700  },
  "NG-PL": { status: "pilot",  officers: 19,  citizens: 6600  },
  "NG-BE": { status: "pilot",  officers: 17,  citizens: 5900  },
  "NG-KO": { status: "pilot",  officers: 16,  citizens: 5400  },
  "NG-IM": { status: "pilot",  officers: 15,  citizens: 5100  },
  "NG-NA": { status: "pilot",  officers: 13,  citizens: 4400  },
  "NG-AB": { status: "coming-soon" },
  "NG-AD": { status: "coming-soon" },
  "NG-AK": { status: "coming-soon" },
  "NG-BA": { status: "coming-soon" },
  "NG-BO": { status: "coming-soon" },
  "NG-BY": { status: "coming-soon" },
  "NG-CR": { status: "coming-soon" },
  "NG-EB": { status: "coming-soon" },
  "NG-EK": { status: "coming-soon" },
  "NG-GO": { status: "coming-soon" },
  "NG-JI": { status: "coming-soon" },
  "NG-KE": { status: "coming-soon" },
  "NG-KT": { status: "coming-soon" },
  "NG-KW": { status: "coming-soon" },
  "NG-NI": { status: "coming-soon" },
  "NG-SO": { status: "coming-soon" },
  "NG-TA": { status: "coming-soon" },
  "NG-YO": { status: "coming-soon" },
  "NG-ZA": { status: "coming-soon" },
};

const STATUS_COLORS: Record<Status, { fill: string; stroke: string; hover: string; glow: string }> = {
  "active":       { fill: "#008751", stroke: "#006633", hover: "#00a362", glow: "rgba(0,135,81,0.4)" },
  "pilot":        { fill: "#b45309", stroke: "#92400e", hover: "#d97706", glow: "rgba(180,83,9,0.35)" },
  "coming-soon":  { fill: "#292524", stroke: "#44403c", hover: "#3d3835", glow: "transparent" },
};

const STATUS_LABELS: Record<Status, string> = {
  "active":      "Active",
  "pilot":       "Pilot",
  "coming-soon": "Coming Soon",
};

interface TooltipState {
  id: string;
  x: number;
  y: number;
}

const ACTIVE_COUNT  = Object.values(STATE_DATA).filter(s => s.status === "active").length;
const PILOT_COUNT   = Object.values(STATE_DATA).filter(s => s.status === "pilot").length;
const TOTAL_OFFICERS = Object.values(STATE_DATA).reduce((s, d) => s + (d.officers ?? 0), 0);
const TOTAL_CITIZENS = Object.values(STATE_DATA).reduce((s, d) => s + (d.citizens ?? 0), 0);

export function StateMap() {
  const [hovered, setHovered] = useState<TooltipState | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const activeState = selected ?? hovered?.id ?? null;
  const activeData = activeState ? STATE_DATA[activeState] : null;
  const activePath = activeState ? NG_STATE_PATHS[activeState] : null;

  const handleMouseMove = (e: React.MouseEvent<SVGPathElement>, id: string) => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    setHovered({ id, x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div ref={sectionRef} className="relative w-full bg-[#0f0f0f] py-24 lg:py-32 overflow-hidden">

      {/* Subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }}
      />

      {/* Green glow bottom-left */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-[#008751]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mb-12"
        >
          <span className="text-[11px] font-bold tracking-[3px] uppercase text-[#008751] mb-4 block">
            Deployment Coverage
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white leading-[1.15]">
              CitiEye across<br />
              <span className="text-[#008751]">Nigeria.</span>
            </h2>
            {/* Top-line stats */}
            <div className="flex flex-wrap gap-8">
              {[
                { val: ACTIVE_COUNT,  label: "Active States",   color: "#008751" },
                { val: PILOT_COUNT,   label: "Pilot States",    color: "#d97706" },
                { val: TOTAL_OFFICERS, label: "Field Officers", color: "#e7e5e4" },
                { val: TOTAL_CITIZENS.toLocaleString(), label: "Citizens Enrolled", color: "#e7e5e4" },
              ].map(({ val, label, color }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-2xl font-serif font-bold" style={{ color }}>{val}</span>
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Map — takes most of the width */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="lg:col-span-8 relative"
          >
            {/* Tooltip */}
            {hovered && NG_STATE_PATHS[hovered.id] && (
              <div
                className="absolute z-20 pointer-events-none bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 shadow-2xl min-w-[160px]"
                style={{
                  left: Math.min(hovered.x + 14, 560),
                  top: Math.max(hovered.y - 60, 8),
                }}
              >
                <p className="text-white text-sm font-bold mb-1">{NG_STATE_PATHS[hovered.id].name}</p>
                {(() => {
                  const d = STATE_DATA[hovered.id];
                  const status = d?.status ?? "coming-soon";
                  const color = status === "active" ? "#4ade80" : status === "pilot" ? "#fbbf24" : "#78716c";
                  return (
                    <>
                      <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color }}>
                        {STATUS_LABELS[status]}
                      </p>
                      {d?.officers && (
                        <p className="text-[11px] text-stone-400 mt-1">{d.officers} officers · {d.citizens?.toLocaleString()} enrolled</p>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            <svg
              ref={svgRef}
              viewBox="-37 -30 818 660"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-auto"
              style={{ filter: "drop-shadow(0 0 40px rgba(0,135,81,0.08))" }}
              onMouseLeave={() => setHovered(null)}
            >
              <defs>
                <filter id="state-glow-active">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {Object.entries(NG_STATE_PATHS).map(([id, { d }]) => {
                const data = STATE_DATA[id];
                const status: Status = data?.status ?? "coming-soon";
                const colors = STATUS_COLORS[status];
                const isHovered = hovered?.id === id;
                const isSelected = selected === id;
                const isActive = isHovered || isSelected;

                return (
                  <path
                    key={id}
                    d={d}
                    fill={isActive ? colors.hover : colors.fill}
                    stroke={colors.stroke}
                    strokeWidth={isActive ? 1.5 : 0.8}
                    strokeLinejoin="round"
                    style={{
                      transition: "fill 0.15s ease, stroke-width 0.15s ease",
                      cursor: "pointer",
                      filter: isActive && status !== "coming-soon" ? `drop-shadow(0 0 6px ${colors.glow})` : undefined,
                    }}
                    onMouseMove={(e) => handleMouseMove(e, id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setSelected(selected === id ? null : id)}
                  />
                );
              })}
            </svg>
          </motion.div>

          {/* Right panel: legend + detail card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.3 }}
            className="lg:col-span-4 flex flex-col gap-5"
          >
            {/* Legend */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-stone-500 mb-4">Legend</p>
              {(["active", "pilot", "coming-soon"] as Status[]).map((status) => {
                const colors = STATUS_COLORS[status];
                const count = Object.values(STATE_DATA).filter(d => d.status === status).length;
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: colors.fill, border: `1.5px solid ${colors.stroke}` }} />
                      <span className="text-sm text-stone-300 font-medium">{STATUS_LABELS[status]}</span>
                    </div>
                    <span className="text-sm font-bold text-stone-500">{count} states</span>
                  </div>
                );
              })}
            </div>

            {/* Detail card — shows on hover/click */}
            {activeState && activeData && activePath ? (
              <motion.div
                key={activeState}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white/[0.05] border border-white/[0.1] rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-white font-serif font-bold text-xl leading-tight">{activePath.name}</p>
                    <p className="text-[11px] uppercase tracking-widest font-semibold mt-1"
                      style={{ color: activeData.status === "active" ? "#4ade80" : activeData.status === "pilot" ? "#fbbf24" : "#78716c" }}>
                      {STATUS_LABELS[activeData.status]}
                    </p>
                  </div>
                  {activeData.status === "active" && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1" />}
                  {activeData.status === "pilot" && <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-1" />}
                  {activeData.status === "coming-soon" && <MapPin className="w-5 h-5 text-stone-600 shrink-0 mt-1" />}
                </div>

                {activeData.officers ? (
                  <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500">Field Officers</span>
                      <span className="text-white font-semibold">{activeData.officers}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-500">Citizens Enrolled</span>
                      <span className="text-white font-semibold">{activeData.citizens?.toLocaleString()}</span>
                    </div>
                    {/* Mini bar — citizens as proportion of max */}
                    <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.round(((activeData.citizens ?? 0) / 48200) * 100)}%`,
                          backgroundColor: activeData.status === "active" ? "#008751" : "#b45309",
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-stone-600 text-sm pt-2 border-t border-white/[0.06]">
                    Deployment scheduled. Contact us to accelerate onboarding in this state.
                  </p>
                )}
              </motion.div>
            ) : (
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-5">
                <p className="text-stone-600 text-sm">Hover or click a state to see deployment details.</p>
              </div>
            )}

            {/* Active states list */}
            <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-5">
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-stone-500 mb-3">Active States</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(STATE_DATA)
                  .filter(([, d]) => d.status === "active")
                  .map(([id]) => (
                    <button
                      key={id}
                      onClick={() => setSelected(selected === id ? null : id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        selected === id
                          ? "bg-[#008751] text-white"
                          : "bg-[#008751]/10 text-green-400 hover:bg-[#008751]/20"
                      }`}
                    >
                      {NG_STATE_PATHS[id]?.name}
                    </button>
                  ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center text-[11px] text-stone-600 mt-10"
        >
          Coverage data reflects active deployments as of Q2 2026. Pilot programmes are in verification phase.
        </motion.p>

      </div>
    </div>
  );
}
