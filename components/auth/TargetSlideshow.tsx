"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Heart, Sparkles, Briefcase } from "lucide-react";

interface Slide {
  id: string;
  tag: string;
  targetGroup: string;
  title: string;
  description: string;
  image: string;
  icon: typeof Heart;
  badgeColor: string;
}

const SLIDES: Slide[] = [
  {
    id: "motherhood",
    tag: "Maternal Health & Child Welfare",
    targetGroup: "Nursing Mothers & Families",
    title: "Healthcare & Nutrition Guaranteed for Every Mother",
    description: "Access prenatal subsidies, free child immunizations, and monthly healthcare checkups directly through your citizen code.",
    image: "/mother.png",
    icon: Heart,
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  {
    id: "business",
    tag: "SMEDAN & Micro-Enterprise Grants",
    targetGroup: "Artisans & Small Business Owners",
    title: "Equity-Free Capital & Working Equipment",
    description: "Get matched with seed grants, BOI interest-free loans, and local market trade toolkits to scale your business.",
    image: "/entrepreneur.png",
    icon: Briefcase,
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  {
    id: "youth",
    tag: "Digital Skills & Career Matching",
    targetGroup: "Nigerian Youth & Graduates",
    title: "Empowering 3 Million Technical Talents",
    description: "Free intensive training in software, AI, and product design with guaranteed paid internship matches nationwide.",
    image: "/youu.png",
    icon: Sparkles,
    badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  },
];

export function TargetSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play slideshow every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const currentSlide = SLIDES[currentIndex];
  const Icon = currentSlide.icon;

  return (
    <div className="relative w-full h-[500px] lg:h-full rounded-3xl overflow-hidden shadow-2xl bg-stone-950 border border-stone-800 flex flex-col justify-between group">
      {/* Background Image Carousel with Fade Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0"
        >
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="w-full h-full object-cover object-top filter brightness-[0.75]"
          />
          {/* Subtle gradient overlays for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Top Spacer */}
      <div className="relative z-10 p-4 sm:p-6" />

      {/* Bottom Main Content Overlay */}
      <div className="relative z-10 p-6 md:p-10 space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-4 max-w-lg"
          >
            {/* Category Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border backdrop-blur-md shadow-sm">
              <Icon className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-white">{currentSlide.tag}</span>
            </div>

            {/* Title */}
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-white leading-snug drop-shadow-md">
              {currentSlide.title}
            </h3>

            {/* Encouraging Quote / Short Direct Statement */}
            <p className="text-stone-200 text-xs md:text-sm font-light leading-relaxed drop-shadow">
              "{currentSlide.description}"
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation Bar */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          {/* Slide Indicator Dots & Numbers */}
          <div className="flex items-center gap-2">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === index ? "w-8 bg-green-500" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
                title={`Go to slide ${index + 1}`}
              />
            ))}
            <span className="text-[10px] font-mono text-stone-300 ml-2 font-bold">
              0{currentIndex + 1} / 0{SLIDES.length}
            </span>
          </div>

          {/* Previous / Next Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-colors cursor-pointer backdrop-blur-md active:scale-95"
              title="Previous target group"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-colors cursor-pointer backdrop-blur-md active:scale-95"
              title="Next target group"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
