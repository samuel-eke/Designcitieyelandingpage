"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { CulturalPattern } from "../ui/CulturalPattern";

function Counter({ value, duration = 1.5, delay = 0 }: { value: string; duration?: number; delay?: number }) {
  const [displayValue, setDisplayValue] = useState(() => {
    // Start with all numeric digits replaced with 0
    return value.replace(/\d/g, "0");
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const numericRegex = /(\d+)/g;
      const matches = value.match(numericRegex);

      if (!matches) {
        setDisplayValue(value);
        return;
      }

      const start = performance.now();

      const animate = (now: number) => {
        const elapsed = (now - start) / 1000;
        const progress = Math.min(elapsed / duration, 1);

        // Easing: easeOutQuad
        const easeProgress = progress * (2 - progress);

        const result = value.replace(numericRegex, (match) => {
          const target = parseInt(match, 10);
          const current = Math.round(target * easeProgress);
          return current.toString();
        });

        setDisplayValue(result);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(value);
        }
      };

      requestAnimationFrame(animate);
    }, delay * 1000);

    return () => clearTimeout(timeoutId);
  }, [value, duration, delay]);

  return <span>{displayValue}</span>;
}

const cyclerTexts = [
  "Imagine child healthcare and education secured.",
  "Imagine talented youth finding clear direction.",
  "Imagine young graduates matching directly to careers.",
  "Imagine growing old with prepared dignity.",
  "This is how a nation should work."
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Typewriter cycler states
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [fadeState, setFadeState] = useState<"in" | "out">("in");
  const [startCycler, setStartCycler] = useState(false);

  // 1. Initial delay before starting the cycler
  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStartCycler(true);
    }, 1700);
    return () => clearTimeout(startTimeout);
  }, []);

  // 2. Typing animation logic - Loops Infinitely
  useEffect(() => {
    if (!startCycler) return;

    const currentText = cyclerTexts[textIndex];

    if (charIndex < currentText.length) {
      const typeTimeout = setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, 20);
      return () => clearTimeout(typeTimeout);
    } else {
      // Hold closing remark (index 4) for 5.5s, others for 3.5s
      const holdTime = textIndex === cyclerTexts.length - 1 ? 5500 : 3500;
      
      const pauseTimeout = setTimeout(() => {
        setFadeState("out");
        
        const fadeTimeout = setTimeout(() => {
          setTextIndex((prev) => (prev + 1) % cyclerTexts.length);
          setCharIndex(0);
          setFadeState("in");
        }, 300);
        
        return () => clearTimeout(fadeTimeout);
      }, holdTime);
      
      return () => clearTimeout(pauseTimeout);
    }
  }, [startCycler, textIndex, charIndex]);

  // Track scroll progress for scroll zoom / parallax transition
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Visual Map transforms
  const mapScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const mapOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const mapY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  // Text content transforms (exit scroll animations)
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Framer motion entrance animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  // Text character arrays for typewriter animation
  const line1 = "What If Nigeria";
  const line2 = "Could See You?";

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-white pt-12 pb-24 lg:pt-24 lg:pb-32 overflow-visible"
    >
      {/* Cultural Pattern Background */}
      <CulturalPattern opacity={0.03} />

      {/* Abstract map/shape background in light brown/tan */}
      <div className="absolute top-0 right-0 w-3/4 h-[800px] pointer-events-none z-0">
        <svg viewBox="0 0 800 800" className="w-full h-full text-[#EFEBE4] fill-current opacity-70" preserveAspectRatio="none">
          <path d="M400,0 C600,0 800,200 800,400 C800,600 600,800 400,800 C200,800 0,600 0,400 C0,200 200,0 400,0 Z"
            style={{ transform: "scale(1.5) translate(10%, -20%)" }} />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ y: textY, opacity: textOpacity }}
            className="max-w-xl"
          >
            {/* Top Category Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-block mb-4 px-4 py-1.5 bg-stone-100 border border-stone-200 rounded-full"
            >
              <span className="text-[10px] font-semibold tracking-[2px] uppercase text-stone-850">
                One Citizen. One Identity. One Lifelong Journey
              </span>
            </motion.div>

            {/* Typewriter Animated Title */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-[72px] leading-[1.15] font-serif font-bold text-stone-900 tracking-tight"
            >
              <span className="block mb-1">
                {Array.from(line1).map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 + 0.2, duration: 0.01 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>

              <span className="relative inline-block mt-1">
                <span className="relative z-10 italic">
                  {Array.from(line2).map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: (line1.length + i) * 0.04 + 0.25, duration: 0.01 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>

                {/* Yellow background slider - animates right after typing completes */}
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    delay: (line1.length + line2.length) * 0.04 + 0.35,
                    duration: 0.45,
                    ease: "easeOut"
                  }}
                  className="absolute bottom-1 sm:bottom-2 left-0 w-[105%] h-4 sm:h-6 bg-[#FFD100] -z-10 transform -rotate-1 rounded-sm origin-left"
                />
              </span>
            </motion.h1>

            {/* Introductory Paragraph with Typewriter Cycler */}
            {textIndex < 4 ? (
              <div 
                className="mt-8 text-stone-600 max-w-md leading-relaxed font-light text-[20px] min-h-[90px] transition-opacity duration-300"
                style={{ opacity: fadeState === "in" ? 1 : 0 }}
              >
                {cyclerTexts[textIndex].substring(0, charIndex)}
                <span className="animate-pulse font-semibold">|</span>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 16 }}
                className="mt-8 relative inline-block w-fit min-h-[90px]"
              >
                <span className="relative z-10 text-2xl sm:text-3xl font-serif text-[#008751] font-bold leading-normal">
                  {cyclerTexts[4].substring(0, charIndex)}
                  {charIndex < cyclerTexts[4].length && <span className="animate-pulse">|</span>}
                </span>
                
                {/* Emphatic aesthetic yellow highlight slider beneath the closing remark */}
                {charIndex === cyclerTexts[4].length && (
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="absolute bottom-1.5 left-0 w-[105%] h-3 sm:h-4 bg-[#FFD100]/80 -z-10 transform -rotate-1 rounded-sm origin-left"
                  />
                )}
              </motion.div>
            )}

            {/* CTAs with Left-to-Right Hover slide */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex items-center gap-6 flex-wrap"
            >
              {/* Primary Button: Slides green background left-to-right on hover */}
              <button className="relative overflow-hidden bg-black px-8 py-4 text-[13px] font-semibold tracking-wide text-white border border-black group transition-colors duration-300">
                <span className="absolute inset-0 bg-[#008751] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out origin-left z-0" />
                <span className="relative z-10 block">
                  Register for Free
                </span>
              </button>

              {/* Secondary CTA: Meets 44px touch target guidelines */}
              <button className="text-[13px] font-semibold text-stone-900 hover:text-[#008751] flex items-center gap-2 group py-3 px-1 transition-colors duration-300">
                Download the App{" "}
                <motion.span
                  className="inline-block text-lg font-bold"
                  animate={{
                    x: [0, 4, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: "easeInOut",
                  }}
                  whileHover={{
                    x: [0, 6, 0],
                    transition: {
                      repeat: Infinity,
                      duration: 0.6,
                      ease: "easeInOut",
                    }
                  }}
                >
                  →
                </motion.span>
              </button>
            </motion.div>

            {/* Hero Stats with Counter Animating */}
            <motion.div
              variants={itemVariants}
              className="mt-12 pt-8 border-t border-stone-200 grid grid-cols-3 gap-6"
            >
              <div>
                <div className="text-3xl font-serif font-bold text-stone-900">
                  <Counter value="36" delay={1.2} />
                </div>
                <div className="text-stone-500 font-medium tracking-wide uppercase mt-1 text-[11px]">States Covered</div>
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-stone-900">
                  <Counter value="4" delay={1.4} />
                </div>
                <div className="text-stone-500 font-medium tracking-wide uppercase mt-1 text-[11px]">Life Stage Programmes</div>
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-stone-900">
                  <Counter value="1:1" delay={1.6} />
                </div>
                <div className="text-stone-500 font-medium tracking-wide uppercase mt-1 text-[11px]">Dedicated Officer Support</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image Composition — Original */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            style={{ y: mapY, opacity: mapOpacity, scale: mapScale }}
            className="relative mt-12 lg:mt-0 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[450px] aspect-[4/5]">
              {/* Organic Image Masking */}
              {/* Image Reveal Wipe — animates from left to right */}
              <motion.div
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1], delay: 0.6 }}
                className="w-full h-full"
              >
                <div
                  className="absolute inset-0 bg-stone-200"
                  style={{
                    clipPath: "polygon(10% 0%, 95% 5%, 100% 90%, 5% 100%)",
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1761370981139-c1fe5402c709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwZmFtaWx5JTIwb3V0c2lkZXxlbnwxfHx8fDE3Nzg2NjQ5OTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Citizen looking forward"
                    className="w-full h-full object-cover grayscale-[20%] contrast-[1.1]"
                  />
                </div>
              </motion.div>

              {/* Decorative green brush stroke behind */}
              <div className="absolute top-[20%] -left-8 w-32 h-12 bg-green-700/80 -z-10 transform -rotate-12 blur-[2px] rounded-full"></div>

              {/* Decorative yellow brush stroke overlay */}
              <div className="absolute bottom-[20%] -right-12 w-48 h-16 bg-[#FFD100]/90 z-20 transform -rotate-6 blur-[1px] rounded-full flex items-center justify-center flex-col shadow-sm">
                <span className="text-3xl font-serif font-bold text-stone-900 leading-none">1.2M</span>
                <span className="text-[10px] text-stone-900 font-medium tracking-wide uppercase mt-1">Citizens Helped</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
