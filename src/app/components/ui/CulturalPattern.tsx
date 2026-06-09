import { motion } from "motion/react";

export function CulturalPattern({ className = "", opacity = 0.03 }: { className?: string, opacity?: number }) {
  return (
    <div className={`absolute inset-0 z-0 overflow-hidden pointer-events-none ${className}`} style={{ opacity }}>
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-[-100%] w-[300%] h-[300%]"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="adire-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              {/* Geometric Adire/Ankara inspired motif */}
              <g stroke="currentColor" strokeWidth="1.5" fill="none" className="text-stone-900">
                {/* Concentric diamonds */}
                <path d="M50 10 L90 50 L50 90 L10 50 Z" />
                <path d="M50 25 L75 50 L50 75 L25 50 Z" strokeWidth="1" opacity="0.6" />
                <path d="M50 40 L60 50 L50 60 L40 50 Z" fill="currentColor" opacity="0.3" />
                
                {/* Connecting dots/circles */}
                <circle cx="0" cy="0" r="4" fill="currentColor" opacity="0.5" />
                <circle cx="100" cy="0" r="4" fill="currentColor" opacity="0.5" />
                <circle cx="0" cy="100" r="4" fill="currentColor" opacity="0.5" />
                <circle cx="100" cy="100" r="4" fill="currentColor" opacity="0.5" />
                
                {/* Wavy lines connecting the diamonds */}
                <path d="M0 50 Q 25 25 50 50 T 100 50" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
                <path d="M50 0 Q 75 25 50 50 T 50 100" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
              </g>
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#adire-pattern)" />
        </svg>
      </motion.div>
    </div>
  );
}
