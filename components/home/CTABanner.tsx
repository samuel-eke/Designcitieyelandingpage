"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Check, Smartphone, ArrowRight, ShieldCheck, Download } from "lucide-react";
import { CulturalPattern } from "../ui/CulturalPattern";

export function CTABanner() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      id="download" 
      className="w-full bg-stone-950 py-24 lg:py-32 overflow-hidden relative border-t border-stone-900"
    >
      {/* Faint static background pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02] text-white">
        <CulturalPattern opacity={0.3} />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Section Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <span className="text-[10px] font-bold tracking-[3px] uppercase text-[#FFD100] mb-4 block">
            Join the Movement
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-6 leading-tight">
            Nigeria, finally working for every Nigerian.
          </h2>
          <p className="text-stone-400 font-light leading-relaxed text-base">
            Registration is free, secure, and open to all citizens. Choose how you want to step into your new relationship with your country.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Left Bento: Online Portal Registration (6 columns wide) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 relative bg-[#008751] rounded-3xl p-8 md:p-10 overflow-hidden flex flex-col justify-between group shadow-xl hover:shadow-[#008751]/10 transition-all duration-500"
          >
            {/* Visual Adire Watermark Overlay */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none z-0">
              <CulturalPattern opacity={1} />
            </div>
            
            {/* Glowing background highlights */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-white/10 blur-[80px] pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <span className="text-[9px] font-bold tracking-[2.5px] uppercase text-[#FFD100] mb-4 block">
                  Online Portal
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-4 leading-snug max-w-md">
                  Create your citizen profile in minutes.
                </h3>
                <p className="text-green-100 text-sm font-light leading-relaxed mb-8 max-w-md">
                  Gain immediate access to your personalized lifecycle dashboard, connect with your dedicated officer, and view public programs tailored to your family.
                </p>

                {/* Benefits Checkmarks */}
                <div className="space-y-3 mb-8">
                  {[
                    "Free to join — zero administrative fees",
                    "Takes under 3 minutes to activate profile",
                    "No documents required to explore basic programs"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3 text-white text-xs font-light">
                      <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center border border-white/30 flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                      </div>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button: slides white background left-to-right on hover */}
              <div className="mt-auto pt-4">
                <button className="relative overflow-hidden bg-stone-950 px-8 py-4 text-[12px] font-bold uppercase tracking-wider text-white border border-stone-900 group/btn transition-colors duration-300 w-full sm:w-auto">
                  <span className="absolute inset-0 bg-white transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out origin-left z-0" />
                  <span className="relative z-10 flex items-center justify-center gap-2 group-hover/btn:text-stone-900 transition-colors">
                    Register Profile <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Bento: Mobile App Download (5 columns wide) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            className="lg:col-span-5 relative bg-[#EFEBE4] rounded-3xl p-8 md:p-10 overflow-hidden flex flex-col justify-between group shadow-xl hover:shadow-[#EFEBE4]/5 transition-all duration-500 text-stone-900"
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <span className="text-[9px] font-bold tracking-[2.5px] uppercase text-[#008751] mb-4 block">
                  Companion App
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-4 leading-snug">
                  CitiEye, right in your pocket.
                </h3>
                <p className="text-stone-600 text-sm font-light leading-relaxed mb-8">
                  Download the CitiEye mobile companion app to track benefits on the go, view offline profile details, and receive prompt notifications.
                </p>

                {/* Minimalist Mobile Phone Interface Preview */}
                <div className="border border-stone-300/60 p-4 bg-white/70 backdrop-blur-sm rounded-2xl mb-8 flex items-center gap-3.5 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#008751]/10 flex items-center justify-center text-[#008751] shrink-0 border border-[#008751]/15">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-stone-900">CitiEye Mobile App</span>
                      <span className="text-[8px] font-bold bg-[#008751]/15 text-[#008751] px-1.5 py-0.5 rounded">v1.4</span>
                    </div>
                    <p className="text-[10px] text-stone-500 font-light mt-0.5">Compatible with iOS 15+ and Android 9+</p>
                  </div>
                </div>
              </div>

              {/* App Download Buttons */}
              <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-4">
                <a
                  href="#"
                  className="flex items-center gap-3 px-5 py-3 bg-stone-900 rounded-xl hover:bg-stone-800 transition-colors text-white flex-1 justify-center"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left leading-none">
                    <span className="text-[8px] text-stone-400 block font-light uppercase tracking-wider">App Store</span>
                    <span className="text-[11px] font-bold mt-0.5 block">iOS Download</span>
                  </div>
                </a>

                <a
                  href="#"
                  className="flex items-center gap-3 px-5 py-3 bg-stone-900 rounded-xl hover:bg-stone-800 transition-colors text-white flex-1 justify-center"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="m3.18 23.76.02-.01 10.79-6.06-2.38-2.38zM.5 1.4C.18 1.7 0 2.17 0 2.77v18.44c0 .6.18 1.07.51 1.36l.07.07L11.2 12l-.07-.07zM20.49 9.29l-2.78-1.56-2.67 2.67 2.67 2.67 2.79-1.57c.8-.45.8-1.19 0-1.64zm-17.3-7.53 10.38 10.39-2.38 2.38 10.8 6.07.02.01z"/>
                  </svg>
                  <div className="text-left leading-none">
                    <span className="text-[8px] text-stone-400 block font-light uppercase tracking-wider">Google Play</span>
                    <span className="text-[11px] font-bold mt-0.5 block">Android APK</span>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
