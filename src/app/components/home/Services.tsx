import { Lightbulb, Heart, Phone, Home, ArrowRight } from "lucide-react";
import { motion, useScroll, useInView, useSpring } from "motion/react";
import { useRef } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const pillars = [
  {
    icon: Lightbulb,
    number: "01",
    tag: "Education & Development",
    title: "Discover your child's genius",
    desc: "Through thoughtful IQ and aptitude assessments, we help identify where every child truly excels — because greatness is never one-size-fits-all. Our early childhood experts work closely with families to cultivate a nurturing environment for your little ones to blossom.",
    quote: "Every child's potential is a seed — CitiEye helps it grow into greatness.",
    heroImg:
      "https://images.unsplash.com/photo-1536337005238-94b997371b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGNoaWxkJTIwbGVhcm5pbmclMjBzdHVkZW50fGVufDF8fHx8MTc3OTExOTAzMXww&ixlib=rb-4.1.0&q=80&w=1080",
    accent: "#2563eb",
    clipPath: "polygon(0% 5%, 100% 0%, 100% 95%, 0% 100%)",
  },
  {
    icon: Heart,
    number: "02",
    tag: "Health & Wellness",
    title: "Healthcare that centres your family",
    desc: "Receive attentive, personalised healthcare for every member of your household — with the care and dedication your family deserves. From maternal support to nutritional guidance, we're with you at every step of your family's health journey.",
    quote: "A healthy family is the foundation of a thriving community.",
    heroImg:
      "https://images.unsplash.com/photo-1632054229892-21103035a686?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGZhbWlseSUyMGhlYWx0aGNhcmUlMjBoYXBweXxlbnwxfHx8fDE3NzkxMTkwMzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    accent: "#16a34a",
    clipPath: "polygon(0% 0%, 100% 5%, 100% 100%, 0% 95%)",
  },
  {
    icon: Phone,
    number: "03",
    tag: "Economic Empowerment",
    title: "Build a life you're proud of",
    desc: "Whether your goal is a fulfilling career or building your own enterprise, CitiEye equips you with skills, guidance, and the resources to get there. Our dedicated officers provide 1:1 mentorship and connect you with local opportunities.",
    quote: "Opportunity doesn't knock — CitiEye builds the door.",
    heroImg:
      "https://images.unsplash.com/photo-1723221906960-1c5a5febc9c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMHByb2Zlc3Npb25hbCUyMHdvcmtpbmclMjBjb25maWRlbnR8ZW58MXx8fHwxNzc5MTE5MDM4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    accent: "#d97706",
    clipPath: "polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)",
  },
  {
    icon: Home,
    number: "04",
    tag: "Elder Care",
    title: "Golden years, lived with dignity",
    desc: "Our care for older citizens is rooted in compassion and deep respect — ensuring your later years are as rich and fulfilling as any that came before. We offer community engagement, health check-ups, and home assistance.",
    quote: "Those who built Nigeria deserve to rest in honour.",
    heroImg:
      "https://images.unsplash.com/photo-1659645006849-97168e342f83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhbiUyMGVsZGVybHklMjBzbWlsaW5nJTIwcHJvdWR8ZW58MXx8fHwxNzc5MTE5MDQxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    accent: "#be123c",
    clipPath: "polygon(0% 0%, 95% 0%, 100% 100%, 5% 100%)",
  },
] as const;

type Pillar = (typeof pillars)[number];

/* ── Adire SVG watermark ── */
function AdireWatermark({ id, color }: { id: string; color: string }) {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={id} x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M14 2 L26 14 L14 26 L2 14 Z" fill="none" stroke={color} strokeWidth="0.7" opacity="0.55" />
          <circle cx="14" cy="14" r="2.2" fill={color} opacity="0.3" />
          <line x1="0" y1="14" x2="28" y2="14" stroke={color} strokeWidth="0.3" opacity="0.2" />
          <line x1="14" y1="0" x2="14" y2="28" stroke={color} strokeWidth="0.3" opacity="0.2" />
          <circle cx="0" cy="0" r="1.2" fill={color} opacity="0.2" />
          <circle cx="28" cy="0" r="1.2" fill={color} opacity="0.2" />
          <circle cx="0" cy="28" r="1.2" fill={color} opacity="0.2" />
          <circle cx="28" cy="28" r="1.2" fill={color} opacity="0.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/* ── Section-wide faint Adire background ── */
function SectionTexture() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="svc-bg-adire" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M20 4 L36 20 L20 36 L4 20 Z" fill="none" stroke="#78716c" strokeWidth="0.4" opacity="0.25" />
          <circle cx="20" cy="20" r="1.5" fill="#78716c" opacity="0.15" />
          <circle cx="0" cy="0" r="1" fill="#78716c" opacity="0.12" />
          <circle cx="40" cy="0" r="1" fill="#78716c" opacity="0.12" />
          <circle cx="0" cy="40" r="1" fill="#78716c" opacity="0.12" />
          <circle cx="40" cy="40" r="1" fill="#78716c" opacity="0.12" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#svc-bg-adire)" opacity="0.45" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   Main export
══════════════════════════════════════════════════ */
export function Services() {
  const timelineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 88%", "end 12%"],
  });

  const lineScaleY = useSpring(scrollYProgress, { stiffness: 28, damping: 16 });

  return (
    <section id="pillars" className="w-full bg-white relative overflow-hidden">
      {/* Very faint Adire section texture */}
      <div className="absolute inset-0 opacity-[0.022]">
        <SectionTexture />
      </div>

      {/* ── Header ── */}
      <div className="pt-24 pb-6 text-center relative z-10 px-4">
        <motion.span
          className="font-bold tracking-[0.28em] uppercase text-green-700 mb-4 block text-[24px]"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          What We Offer
        </motion.span>

        <motion.h2
          className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mb-6 leading-[1.1]"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
        >
          Every person is unique.
          <br />
          <span className="relative inline-block mt-2">
            <span className="relative z-10">So is their CitiEye experience.</span>
            <div className="absolute -bottom-2 left-0 w-full h-3 bg-yellow-300/60 rounded-full blur-[1px]" />
          </span>
        </motion.h2>

        <motion.p
          className="text-[15px] text-stone-600 leading-relaxed font-normal max-w-xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          CitiEye is built around you — not the other way around. Our programmes are tailored to
          your individual needs, life stage, and aspirations, so support is always relevant,
          timely, and genuinely helpful.
        </motion.p>

        {/* Life Thread sub-label */}
        <motion.div
          className="flex items-center justify-center gap-3 mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-stone-300" />
          {/* Decorative Adire diamond row */}
          <div className="flex items-center gap-[6px]">
            {[3, 4, 6, 4, 3].map((sz, i) => (
              <div
                key={i}
                className="rotate-45 bg-stone-300"
                style={{ width: sz, height: sz }}
              />
            ))}
          </div>
          <span className="font-black tracking-[0.32em] uppercase text-stone-400 text-[12px]">
            The Life Thread
          </span>
          <div className="flex items-center gap-[6px]">
            {[3, 4, 6, 4, 3].map((sz, i) => (
              <div
                key={i}
                className="rotate-45 bg-stone-300"
                style={{ width: sz, height: sz }}
              />
            ))}
          </div>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-stone-300" />
        </motion.div>
      </div>

      {/* ── Timeline ── */}
      <div ref={timelineRef} className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">

        {/* ── Central thread line (desktop) ── */}
        <div
          className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 hidden md:block pointer-events-none"
          style={{ width: 3 }}
        >
          {/* Dashed track */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line
              x1="1.5" y1="0" x2="1.5" y2="100%"
              stroke="#e7e5e4"
              strokeWidth="2"
              strokeDasharray="5 9"
            />
          </svg>

          {/* Diamond decorations at even intervals */}
          {Array.from({ length: 20 }).map((_, i) => {
            const pct = (i / 19) * 100;
            const isMajor = i % 5 === 0;
            return (
              <div
                key={i}
                className="absolute flex items-center justify-center"
                style={{ top: `${pct}%`, left: "50%", transform: "translate(-50%, -50%)" }}
              >
                <div
                  className="rotate-45 bg-stone-200"
                  style={{
                    width: isMajor ? 7 : 4,
                    height: isMajor ? 7 : 4,
                    opacity: isMajor ? 0.9 : 0.6,
                  }}
                />
              </div>
            );
          })}

          {/* Scroll-driven gradient fill */}
          <motion.div
            className="absolute top-0 left-0 right-0 origin-top"
            style={{
              scaleY: lineScaleY,
              height: "100%",
              background:
                "linear-gradient(to bottom, #facc15 0%, #4ade80 30%, #16a34a 65%, #15803d 100%)",
            }}
          />
        </div>

        {/* Pillar entries */}
        {pillars.map((pillar, idx) => (
          <PillarEntry key={idx} pillar={pillar} index={idx} />
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   One row of the timeline
══════════════════════════════════════════════════ */
function PillarEntry({ pillar, index }: { pillar: Pillar; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-6% 0px -6% 0px" });
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-[1fr_128px_1fr] items-center py-12 md:py-20"
    >
      {/* ── Left slot ── */}
      <div className="flex md:justify-end md:pr-12 order-2 md:order-1 mt-8 md:mt-0">
        {isEven ? (
          <ImageCard pillar={pillar} index={index} isInView={isInView} position="left" />
        ) : (
          <ContentCard pillar={pillar} index={index} isInView={isInView} position="left" />
        )}
      </div>

      {/* ── Diamond node (centre) ── */}
      <div className="flex justify-center items-center order-1 md:order-2">
        <DiamondNode pillar={pillar} isInView={isInView} />
      </div>

      {/* ── Right slot ── */}
      <div className="flex md:justify-start md:pl-12 order-3 md:order-3 mt-8 md:mt-0">
        {isEven ? (
          <ContentCard pillar={pillar} index={index} isInView={isInView} position="right" />
        ) : (
          <ImageCard pillar={pillar} index={index} isInView={isInView} position="right" />
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   Diamond node
══════════════════════════════════════════════════ */
function DiamondNode({ pillar, isInView }: { pillar: Pillar; isInView: boolean }) {
  const Icon = pillar.icon;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>

      {/* Expanding pulse diamonds */}
      {isInView &&
        [0, 1].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              className="rotate-45"
              style={{
                width: 52,
                height: 52,
                border: `1.5px solid ${pillar.accent}`,
              }}
              initial={{ scale: 1, opacity: 0.55 }}
              animate={{ scale: 3.6 + i * 1.1, opacity: 0 }}
              transition={{
                duration: 2.8,
                delay: i * 0.85,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          </motion.div>
        ))}

      {/* Outer diamond ring */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 13, delay: 0.12 }}
      >
        <div
          className="rotate-45 bg-white"
          style={{
            width: 58,
            height: 58,
            border: `2px solid ${pillar.accent}`,
            boxShadow: `0 0 0 6px ${pillar.accent}10`,
          }}
        />
      </motion.div>

      {/* Middle diamond — translucent fill */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.24 }}
      >
        <div
          className="rotate-45"
          style={{
            width: 40,
            height: 40,
            background: `${pillar.accent}18`,
          }}
        />
      </motion.div>

      {/* Inner diamond — solid, with icon, heartbeat entrance */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: [0, 1.25, 0.88, 1.1, 1] } : { scale: 0 }}
        transition={{ duration: 0.72, delay: 0.36, times: [0, 0.38, 0.6, 0.8, 1] }}
      >
        <div
          className="rotate-45 flex items-center justify-center"
          style={{ width: 26, height: 26, background: pillar.accent }}
        >
          {/* Un-rotate the icon so it stays upright */}
          <div
            className="flex items-center justify-center"
            style={{ transform: "rotate(-45deg)", width: 26, height: 26 }}
          >
            <Icon className="text-white" style={{ width: 13, height: 13 }} strokeWidth={2.5} />
          </div>
        </div>
      </motion.div>

      {/* Number above node */}
      <motion.div
        className="absolute inset-x-0 flex justify-center"
        style={{ top: -30 }}
        initial={{ opacity: 0, y: 7 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 7 }}
        transition={{ delay: 0.5 }}
      >
        <span
          className="text-[11px] font-black tracking-[0.22em]"
          style={{ color: pillar.accent }}
        >
          {pillar.number}
        </span>
      </motion.div>

      {/* Horizontal connector dashes — desktop */}
      {["left", "right"].map((side) => (
        <motion.div
          key={side}
          className="absolute hidden md:block"
          style={{
            top: "50%",
            height: 1,
            width: 52,
            ...(side === "left"
              ? { right: "100%", background: `linear-gradient(to left, ${pillar.accent}70, transparent)` }
              : { left: "100%", background: `linear-gradient(to right, ${pillar.accent}70, transparent)` }),
          }}
          initial={{ scaleX: 0, originX: side === "left" ? "right" : "left" }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ delay: 0.38, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   Image card
══════════════════════════════════════════════════ */
function ImageCard({
  pillar,
  index,
  isInView,
  position,
}: {
  pillar: Pillar;
  index: number;
  isInView: boolean;
  position: "left" | "right";
}) {
  const xInitial = position === "left" ? 56 : -56;

  return (
    <motion.div
      className="relative w-full max-w-[340px]"
      initial={{ x: xInitial, opacity: 0 }}
      animate={isInView ? { x: 0, opacity: 1 } : { x: xInitial, opacity: 0 }}
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
    >
      {/* Offset accent shadow */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          background: pillar.accent,
          transform: "translate(10px, 12px)",
          opacity: 0,
        }}
        animate={isInView ? { opacity: 0.14 } : { opacity: 0 }}
        transition={{ delay: 0.55 }}
      />

      {/* Image wrapper with editorial parallelogram clip */}
      <div
        className="relative overflow-hidden rounded-xl shadow-2xl aspect-[4/5]"
        style={{ clipPath: pillar.clipPath }}
      >
        {/* Ken Burns */}
        <motion.div
          className="w-full h-full"
          initial={{ scale: 1.2 }}
          animate={isInView ? { scale: 1.04 } : { scale: 1.2 }}
          transition={{ duration: 10, ease: [0.22, 1, 0.36, 1] }}
        >
          <ImageWithFallback
            src={pillar.heroImg}
            alt={pillar.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Colour tint */}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-[0.18]"
          style={{ background: pillar.accent }}
        />

        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Adire corner overlay */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.11] mix-blend-overlay pointer-events-none">
          <AdireWatermark id={`img-adire-${index}`} color="white" />
        </div>

        {/* Tag badge */}
        <motion.div
          className="absolute bottom-4 left-4"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: 0.68 }}
        >
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white"
            style={{
              background: pillar.accent,
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {pillar.tag}
          </span>
        </motion.div>

        {/* Animated inset accent border */}
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{ boxShadow: `inset 0 0 0 0px ${pillar.accent}` }}
          animate={
            isInView ? { boxShadow: `inset 0 0 0 2px ${pillar.accent}45` } : {}
          }
          transition={{ delay: 0.75, duration: 0.4 }}
        />
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════
   Content card
══════════════════════════════════════════════════ */
function ContentCard({
  pillar,
  index,
  isInView,
  position,
}: {
  pillar: Pillar;
  index: number;
  isInView: boolean;
  position: "left" | "right";
}) {
  const xInitial = position === "left" ? 56 : -56;

  return (
    <motion.div
      className="relative max-w-[400px] w-full"
      initial={{ x: xInitial, opacity: 0 }}
      animate={isInView ? { x: 0, opacity: 1 } : { x: xInitial, opacity: 0 }}
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
    >
      {/* Ghost number watermark */}
      <div
        className="absolute select-none pointer-events-none font-serif font-bold leading-none"
        style={{
          top: -36,
          right: position === "right" ? "auto" : 0,
          left: position === "right" ? 0 : "auto",
          fontSize: "10rem",
          color: `${pillar.accent}06`,
          lineHeight: 1,
        }}
      >
        {pillar.number}
      </div>

      {/* Ghost Adire watermark */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: -24,
          right: position === "right" ? "auto" : -28,
          left: position === "right" ? -28 : "auto",
          width: 180,
          height: 180,
          opacity: 0.038,
        }}
      >
        <AdireWatermark id={`cnt-adire-${index}`} color={pillar.accent} />
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-5">
        {/* Tag */}
        <motion.p
          style={{
            color: pillar.accent,
            fontSize: "14px",
            fontWeight: 900,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ delay: 0.33 }}
        >
          {pillar.tag}
        </motion.p>

        {/* Title */}
        <motion.h3
          className="font-serif font-bold text-stone-900 leading-[1.07] tracking-tight"
          style={{ fontSize: "clamp(1.75rem, 2.5vw, 2.3rem)" }}
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ delay: 0.41 }}
        >
          {pillar.title}
        </motion.h3>

        {/* Animated accent bar */}
        <motion.div
          className="rounded-full"
          style={{ height: 3, background: pillar.accent, width: 0 }}
          animate={isInView ? { width: 52 } : { width: 0 }}
          transition={{ delay: 0.52, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Description */}
        <motion.p
          className="text-stone-600 font-light leading-[1.8]"
          style={{ fontSize: "15px" }}
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ delay: 0.58 }}
        >
          {pillar.desc}
        </motion.p>

        {/* Pull quote */}
        <motion.blockquote
          className="pl-4 py-0.5 italic text-stone-500"
          style={{
            borderLeft: `2px solid ${pillar.accent}55`,
            fontSize: "13px",
            lineHeight: 1.7,
          }}
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
          transition={{ delay: 0.65 }}
        >
          "{pillar.quote}"
        </motion.blockquote>

        {/* CTA */}
        <motion.button
          className="group flex items-center gap-2 font-semibold tracking-wide pt-1"
          style={{ color: pillar.accent, fontSize: "13px" }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.72 }}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.97 }}
        >
          <span>Learn more about this pillar</span>
          <ArrowRight
            className="transition-transform group-hover:translate-x-1"
            style={{ width: 15, height: 15 }}
          />
        </motion.button>
      </div>
    </motion.div>
  );
}
