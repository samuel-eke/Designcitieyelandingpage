import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Database, MapPin, FileSearch, ShieldCheck } from "lucide-react";
import { CulturalPattern } from "../ui/CulturalPattern";

const pillars = [
  {
    icon: Database,
    title: "Fragmented data, unified.",
    body: "Across Nigeria's 36 states and the FCT, citizen records live in silos — paper ledgers, disconnected spreadsheets, legacy databases. CitiEye provides a single, structured source of truth that field officers and administrators can act on in real time.",
    accent: "#008751",
  },
  {
    icon: MapPin,
    title: "Field operations, digitized.",
    body: "CitiEye puts the tools of verification, data collection, and service delivery directly into the hands of officers — on mobile, offline-capable, and synced the moment connectivity is restored. No more lost forms, no more manual reconciliation.",
    accent: "#FFD100",
  },
  {
    icon: FileSearch,
    title: "Accountability at every step.",
    body: "Every action is timestamped, attributed, and auditable. From an enrolment visit to a fund disbursement, CitiEye creates a transparent paper trail that administrators and oversight bodies can trust.",
    accent: "#1c1917",
  },
];

function PillarCard({ icon: Icon, title, body, accent, index }: typeof pillars[0] & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.12 }}
      className="relative bg-white border border-stone-200 rounded-2xl p-7 flex flex-col gap-5 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)] transition-shadow"
    >
      {/* Accent line */}
      <div className="absolute top-0 left-8 right-8 h-[3px] rounded-b-full" style={{ backgroundColor: accent }} />

      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${accent}14` }}
      >
        <Icon className="w-5 h-5" style={{ color: accent === "#FFD100" ? "#92700a" : accent }} />
      </div>

      <div>
        <h3 className="font-serif font-bold text-stone-900 leading-snug mb-3 text-[24px]">{title}</h3>
        <p className="text-stone-500 text-sm leading-relaxed font-light">{body}</p>
      </div>
    </motion.div>
  );
}

export function WhyExists() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-80px" });

  return (
    <div className="relative w-full bg-stone-50 py-24 lg:py-32 overflow-hidden border-t border-stone-100">
      <CulturalPattern opacity={0.025} />

      {/* Institutional rule lines */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#008751]/20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#008751]/20 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Editorial header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl mb-20"
        >
          <span className="font-bold tracking-[3px] uppercase text-green-700 mb-6 block text-[20px]">
            Why CitiEye Exists
          </span>

          <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-serif font-bold text-stone-900 leading-[1.15] mb-6">
            Nigeria's civic infrastructure deserves better tools.
          </h2>

          <p className="text-base text-stone-500 font-light leading-relaxed">
            Government agencies still rely on paper, silos, and fragmented processes. CitiEye digitizes field operations and citizen management — built for Nigerian governance, designed for real-world conditions.
          </p>
        </motion.div>

        {/* Pillar cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <PillarCard key={p.title} {...p} index={i} />
          ))}
        </div>

        {/* Institutional footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-white border border-stone-200 rounded-2xl"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-50 border border-green-200 shrink-0">
            <ShieldCheck className="w-6 h-6 text-green-700" />
          </div>
          <div>
            <p className="font-semibold text-stone-900 text-[16px]">Built for government. Governed by standards.</p>
            <p className="text-stone-500 mt-0.5 font-light text-[14px]">
              CitiEye is designed to comply with Nigeria's Data Protection Regulation (NDPR), integrates with NIMC's NIN infrastructure, and meets the governance standards required by federal and state agency procurement.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
