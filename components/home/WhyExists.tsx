"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
// Icons removed; UI focuses on images and content
import { CulturalPattern } from "../ui/CulturalPattern";

const pillars = [
  {
    title: "The Mother",
    quote: "“A mother should not have to fight for child's right to opportunity.”",
    body: "CitiEye starts at birth. When a baby is registered, a lifetime of planning begins — mapping out healthcare, vaccination tracking, and early education opportunities so mothers never have to struggle in the dark.",
    image: "/mother.png",
    accent: "#008751",
  },
  {
    title: "The Youth",
    quote: "“A young Nigerian's future should not hang on luck or connections.”",
    body: "Ambition meets direction. CitiEye connects talented teenagers and graduates directly with digital skills programs, scholarship tracks, and internship placements — bypassing nepotism to reward raw merit.",
    image: "/youu.png",
    accent: "#FFD100",
  },
  {
    title: "The Elder",
    quote: "“An elderly citizen should not be invisible to the nation they spent their lives building.”",
    body: "Dignity in their golden years. We track and prepare for the needs of senior citizens long before they arrive, ensuring secure pension disbursement, localized care coordination, and dedicated support officers.",
    image: "/eldd.png",
    accent: "#b45309",
  },
  // Additional pillars
  {
    title: "The Teacher",
    quote: "“Educators deserve tools to nurture future generations.”",
    body: "CitiEye provides teachers with student progress dashboards, resource allocation, and community mentorship links, empowering them to guide learners effectively.",
    image: "/teacher.png",
    accent: "#0066FF",
  },
  {
    title: "The Entrepreneur",
    quote: "“Small businesses need visibility and support.”",
    body: "Through CitiEye, entrepreneurs access micro‑finance, market data, and networking events, fostering sustainable growth across regions.",
    image: "/entrepreneur.png",
    accent: "#FF6600",
  },
  {
    title: "The Farmer",
    quote: "“Agriculture thrives with data and resources.”",
    body: "CitiEye links farmers to weather forecasts, subsidy programs, and supply‑chain partners, ensuring resilient harvests and fair market access.",
    image: "/farmer.png",
    accent: "#228B22",
  },
  {
    title: "The Artist",
    quote: "“Creativity flourishes with community backing.”",
    body: "Artists receive grants, exhibition platforms, and mentorship networks via CitiEye, turning cultural talent into sustainable careers.",
    image: "/artist.png",
    accent: "#C71585",
  },
  {
    title: "The Innovator",
    quote: "“Innovation needs infrastructure and collaboration.”",
    body: "CitiEye bridges innovators with research hubs, funding streams, and prototype labs, accelerating tech solutions for societal challenges.",
    image: "/innovator.png",
    accent: "#8A2BE2",
  },
  {
    title: "The Community",
    quote: "“Collective strength drives national progress.”",
    body: "Communities organize civic projects, share resources, and voice needs through CitiEye, fostering inclusive, bottom‑up development.",
    image: "/community.png",
    accent: "#FF1493",
  },
];

interface CardProps {
  title: string;
  quote: string;
  body: string;
  image: string;
  accent: string;
  index: number;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
}

function PillarCard({
  title,
  quote,
  body,
  image,
  accent,
  index,
  hoveredIndex,
  setHoveredIndex
}: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const isHovered = hoveredIndex === index;
  const isAnyHovered = hoveredIndex !== null;

  // Animation values based on focus-hover state
  let cardOpacity = 1;
  let cardScale = 1;
  let cardFilter = "grayscale(0%) blur(0px)";

  if (isAnyHovered) {
    if (isHovered) {
      cardOpacity = 1;
      cardScale = 1.03;
      cardFilter = "grayscale(0%) blur(0px)";
    } else {
      cardOpacity = 0.45;
      cardScale = 0.97;
      cardFilter = "grayscale(100%) blur(0.5px)";
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? {
        opacity: cardOpacity,
        scale: cardScale,
        filter: cardFilter
      } : {}}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 24,
        mass: 0.8
      }}
      className="relative h-[480px] w-[88vw] sm:w-[380px] md:w-[420px] shrink-0 snap-center rounded-2xl overflow-hidden border border-stone-200/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] group cursor-pointer flex flex-col justify-end p-8 bg-stone-950"
    >
      {/* Background Image */}
      <motion.img
        src={image}
        alt={title}
        animate={{ scale: isHovered ? 1.08 : 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 group-hover:opacity-55 transition-opacity"
      />

      {/* Deep Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/75 to-transparent z-10 pointer-events-none" />

      {/* Card Text Content */}
      <div className="relative z-20 flex flex-col gap-3 pointer-events-none">
        {/* Accent Bar */}
        <div className="w-10 h-0.5 rounded-full mb-1" style={{ backgroundColor: accent }} />

        <span className="text-[10px] font-bold tracking-[2.5px] uppercase text-stone-400">
          {title}
        </span>

        <h3 className="font-serif italic font-semibold text-white text-[22px] sm:text-[24px] leading-snug">
          {quote}
        </h3>

        {/* Expandable description text */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isHovered ? "auto" : 0,
            opacity: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <p className="text-stone-300 text-[13px] leading-relaxed font-light pt-2">
            {body}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function WhyExists() {
  const headRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-80px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth } = carouselRef.current;
      const cardWidth = scrollWidth / pillars.length;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(index);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollLeft } = carouselRef.current;
      // Scroll by roughly 1 card width (420px card + 24px gap = 444px)
      const cardWidth = 444;
      const target = direction === "left" ? scrollLeft - cardWidth : scrollLeft + cardWidth;
      carouselRef.current.scrollTo({ left: target, behavior: "smooth" });
    }
  };

  const scrollToCard = (index: number) => {
    if (carouselRef.current) {
      const { scrollWidth } = carouselRef.current;
      const cardWidth = scrollWidth / pillars.length;
      carouselRef.current.scrollTo({ left: index * cardWidth, behavior: "smooth" });
    }
  };

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
          className="max-w-3xl mb-16"
        >
          <span className="font-bold tracking-[3px] uppercase text-green-700 mb-6 block text-[20px]">
            Today it becomes a reality for everyone
          </span>

          <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-serif font-bold text-stone-900 leading-[1.15] mb-6">
            One Citizen. One Identity. One Lifelong Journey.
          </h2>

          <p className="text-base text-stone-500 font-light leading-relaxed">
            CitiEye Community Governance is a new national programme — and it was built with one purpose: to make sure every Nigerian is seen, planned for, and supported at every stage of life.</p>
        </motion.div>

        {/* Horizontal Carousel */}
        <div className="relative">
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-8 px-4 -mx-4 scroll-smooth after:content-[''] after:w-4 sm:after:w-6 md:after:w-8 after:shrink-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {pillars.map((p, i) => (
              <PillarCard
                key={p.title}
                {...p}
                index={i}
                hoveredIndex={hoveredIndex}
                setHoveredIndex={setHoveredIndex}
              />
            ))}
          </div>

          {/* Desktop Navigation buttons & dots */}
          <div className="hidden md:flex justify-between items-center mt-8">
            <div className="flex gap-2">
              {pillars.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToCard(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeIndex === i ? 'bg-green-700 w-8' : 'bg-stone-300 hover:bg-stone-400'
                  }`}
                  style={{ width: activeIndex === i ? '2rem' : '0.625rem' }}
                  aria-label={`Go to card ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => scroll("left")}
                className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center bg-white text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-colors shadow-sm"
                aria-label="Previous card"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center bg-white text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-colors shadow-sm"
                aria-label="Next card"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Dot Navigation */}
          <div className="flex md:hidden justify-center gap-2 mt-4">
            {pillars.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToCard(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === i ? 'bg-green-700 w-6' : 'bg-stone-300'
                }`}
                style={{ width: activeIndex === i ? '1.5rem' : '0.5rem' }}
                aria-label={`Go to card ${i + 1}`}
              />
            ))}
          </div>
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
