import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const stages = [
  {
    label: "Childhood",
    title: "A strong start",
    desc: "Identifying strengths, nurturing potential, and building confidence from day one. Our early years support gives children the foundation they need to thrive.",
    image: "https://images.unsplash.com/photo-1582307811683-75b18a39ab71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOaWdlcmlhbiUyMGNoaWxkJTIwbGVhcm5pbmclMjBlYXJseSUyMGVkdWNhdGlvbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3OTEyMDQ4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    accent: "bg-yellow-400",
    accentText: "text-yellow-600",
  },
  {
    label: "Youth & Families",
    title: "Growing together",
    desc: "Health support for expectant mothers and young families navigating new beginnings. We provide the care and resources to ensure strong, resilient households.",
    image: "https://images.unsplash.com/photo-1504888060547-83cbe78ccfe0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOaWdlcmlhbiUyMHlvdW5nJTIwZmFtaWx5JTIwbW90aGVyJTIwYW5kJTIwYmFieXxlbnwxfHx8fDE3NzkxMjA0ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    accent: "bg-green-600",
    accentText: "text-green-600",
  },
  {
    label: "Adulthood",
    title: "Pursuing purpose",
    desc: "Career development, entrepreneurship, and building a life of meaningful achievement. We partner with you to turn aspirations into reality.",
    image: "https://images.unsplash.com/photo-1584713945776-55f3daca7a5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOaWdlcmlhbiUyMGFkdWx0JTIwZW50cmVwcmVuZXVyJTIwd29ya2luZyUyMGhhcHB5fGVufDF8fHx8MTc3OTEyMDQ4OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    accent: "bg-black",
    accentText: "text-stone-900",
  },
  {
    label: "Seniors",
    title: "Honoured & cared for",
    desc: "Compassionate support and dignified care for those who have given so much. Ensuring our elders enjoy their golden years with respect and comfort.",
    image: "https://images.unsplash.com/photo-1657356217673-4f7000f768b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOaWdlcmlhbiUyMHNlbmlvciUyMGVsZGVybHklMjByZXNwZWN0ZWQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzkxMjA0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    accent: "bg-green-600",
    accentText: "text-green-600",
  },
];

export function LifeStages() {
  return (
    <div id="stages" className="w-full bg-white py-24 md:py-32 relative overflow-clip">
      {/* Introduction Section */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 mb-20 text-center">
        <span className="text-[11px] font-bold tracking-[3px] uppercase text-stone-400 mb-6 block">
          With you at every stage
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-stone-900 leading-[1.15]">
          A guided walk through life
        </h2>
        <div className="mt-8 w-16 h-1 bg-yellow-400 mx-auto" />
      </div>

      {/* The Scroll Journey */}
      <div className="flex flex-col relative w-full pb-32">
        {stages.map((stage, idx) => (
          <StageCard key={idx} stage={stage} index={idx} />
        ))}
      </div>
    </div>
  );
}

function StageCard({ stage, index }: { stage: typeof stages[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of this specific element
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // Triggers while element is in the viewport
  });

  // Spotlight effect: peaks at 0.5 (center of viewport)
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0.85, 0.9, 1.05, 0.9, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0.2, 0.4, 1, 0.4, 0.2]);
  const grayscale = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], ["100%", "70%", "0%", "70%", "100%"]);
  const filter = useTransform(grayscale, (g) => `grayscale(${g})`);

  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="min-h-[100vh] flex items-center justify-center py-10 w-full relative">
      <motion.div 
        style={{ scale, opacity, filter }}
        className={`relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col ${
          isEven ? "md:flex-row" : "md:flex-row-reverse"
        } items-center gap-12 lg:gap-24`}
      >
        {/* Image Side */}
        <div className="w-full md:w-1/2 relative">
          {/* Artistic Brush Stroke Accent Background */}
          <div 
            className={`absolute -inset-4 md:-inset-8 ${stage.accent} opacity-10`}
            style={{
              clipPath: "polygon(2% 8%, 98% 2%, 95% 95%, 5% 98%)",
              borderRadius: "20% 40% 10% 30%",
            }}
          />
          
          <div className="relative aspect-[4/5] md:aspect-square overflow-hidden shadow-2xl">
            {/* Soft uneven border radius for NGO grassroots feel */}
            <div 
              className="absolute inset-0 bg-white"
              style={{ borderRadius: "10% 14% 12% 8% / 12% 8% 14% 10%" }}
            />
            
            <ImageWithFallback 
              src={stage.image}
              alt={stage.title}
              className="w-full h-full object-cover relative z-10"
              style={{ borderRadius: "8% 12% 10% 6% / 10% 6% 12% 8%" }}
            />
            <div className={`absolute inset-0 ${stage.accent} mix-blend-overlay opacity-20 z-20`}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent mix-blend-overlay z-20" />
            
            {/* Organic brush stroke accent in corner */}
            <div className="absolute -bottom-6 -right-6 z-30 opacity-80">
              <svg width="120" height="120" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id={`adire-pattern-lifestage-${index}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <g stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.3">
                      <path d="M20 4 L36 20 L20 36 L4 20 Z" />
                      <circle cx="20" cy="20" r="4" fill="#ffffff" opacity="0.4" />
                    </g>
                  </pattern>
                </defs>
                <path 
                  fill={stage.accent === 'bg-black' ? '#000000' : stage.accent === 'bg-green-600' ? '#16a34a' : '#facc15'} 
                  d="M47.7,-57.2C59.4,-47.3,65,-29.4,67.8,-11.1C70.6,7.2,70.5,26,61.9,40.1C53.3,54.2,36.2,63.6,18.5,67.4C0.8,71.2,-17.6,69.4,-33.5,60.8C-49.4,52.2,-62.8,36.8,-69.1,18.9C-75.4,1,-74.6,-19.4,-65,-35.1C-55.4,-50.8,-37.1,-61.8,-19.7,-65.4C-2.3,-69,14.2,-65.2,30.3,-60.2L47.7,-57.2Z" 
                  transform="translate(100 100) scale(1.1)" 
                />
                <path 
                  fill={`url(#adire-pattern-lifestage-${index})`}
                  d="M47.7,-57.2C59.4,-47.3,65,-29.4,67.8,-11.1C70.6,7.2,70.5,26,61.9,40.1C53.3,54.2,36.2,63.6,18.5,67.4C0.8,71.2,-17.6,69.4,-33.5,60.8C-49.4,52.2,-62.8,36.8,-69.1,18.9C-75.4,1,-74.6,-19.4,-65,-35.1C-55.4,-50.8,-37.1,-61.8,-19.7,-65.4C-2.3,-69,14.2,-65.2,30.3,-60.2L47.7,-57.2Z" 
                  transform="translate(100 100) scale(1.1)" 
                  style={{ mixBlendMode: 'overlay' }}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="w-full md:w-1/2 space-y-6 md:space-y-8">
          <div className="flex items-center gap-4">
             <div className={`h-[2px] w-12 ${stage.accent}`} />
             <span className={`text-[12px] font-bold tracking-[3px] uppercase ${stage.accentText}`}>
               {stage.label}
             </span>
          </div>
          
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-stone-900 leading-[1.1] tracking-tight">
            {stage.title}
          </h3>
          
          <p className="text-lg md:text-xl text-stone-600 leading-relaxed font-light max-w-lg">
            {stage.desc}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
