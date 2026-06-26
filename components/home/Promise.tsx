"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { CulturalPattern } from "../ui/CulturalPattern";

export function Promise() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#EFEBE4] py-24 lg:py-32 overflow-hidden border-t border-stone-200"
    >
      {/* Subtle Static Background Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] text-stone-900">
        <CulturalPattern opacity={0.4} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
          
          {/* Left: Clean Minimalist Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col justify-center text-stone-900"
          >
            <span className="text-[10px] font-bold tracking-[3px] uppercase text-[#008751] mb-6 block">
              Our Promise
            </span>
            
            <blockquote className="border-l-2 border-[#008751] pl-6 mb-8">
              <p className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-stone-900 leading-snug">
                "Information, programmes, and support shaped entirely around you — your circumstances, your goals, your life."
              </p>
            </blockquote>

            <div className="space-y-4 max-w-xl text-stone-700 leading-relaxed font-light text-base">
              <p>
                You will never feel like a number in a system. With CitiEye Community Governance, every citizen is paired with a <strong className="font-semibold text-stone-900">dedicated officer</strong> — a consistent, caring presence who walks with you through life's milestones, challenges, and triumphs.
              </p>
            </div>

            {/* Clean Minimalist Status Indicator */}
            <div className="mt-8 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#008751]"></span>
              </span>
              <span className="text-[11px] font-semibold text-stone-600 tracking-wide uppercase">
                Programme active nationwide
              </span>
            </div>
          </motion.div>

          {/* Right: Clean, Static Frame Portrait */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-5 relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[380px] border border-stone-300 p-2 bg-white shadow-sm">
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1642929426263-caf1617ced29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxibGFjayUyMHdvbWFuJTIwZ292ZXJubWVudCUyMG9mZmljZXIlMjBzbWlsaW5nJTIwdGFibGV0JTIwaW50ZXJ2aWV3JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzgwMzI4MzM5fDA&ixlib=rb-4.1.0&q=80&w=600"
                  alt="CitiEye Community Governance dedicated officer on duty"
                  className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="pt-3 pb-1 px-1 flex justify-between items-center text-[10px] text-stone-500 font-medium uppercase tracking-wider">
                <span>Welfare Officer on Duty</span>
                <span className="text-stone-400">ID: CE-NG-7281</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}