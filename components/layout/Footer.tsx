"use client";

import React from "react";
import { motion } from "motion/react";
import { Eye, Phone, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { CulturalPattern } from "../ui/CulturalPattern";

const footerLinks = [
  {
    title: "Life Pillars",
    links: [
      { label: "Infant & Mother Care", href: "#" },
      { label: "Youth & Careers Track", href: "#" },
      { label: "Senior Years & Pension", href: "#" }
    ]
  },
  {
    title: "Platform Portal",
    links: [
      { label: "Online Personal Space", href: "#" },
      { label: "Mobile Companion App", href: "#" },
      { label: "Dedicated Welfare Officers", href: "#" }
    ]
  },
  {
    title: "Citizen Resources",
    links: [
      { label: "Verification Documents", href: "#" },
      { label: "NIN Integration Help", href: "#" },
      { label: "Frequently Asked Questions", href: "#" }
    ]
  },
  {
    title: "Governance",
    links: [
      { label: "NDPR Compliance Portal", href: "#" },
      { label: "National Program Registry", href: "#" },
      { label: "Technical Status Updates", href: "#" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="w-full bg-[#002919] relative overflow-hidden border-t border-stone-850 select-none">

      {/* Flag Stripes Header border */}
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <div className="flex-1 bg-[#008751]" />
        <div className="flex-1 bg-white/10" />
        <div className="flex-1 bg-[#008751]" />
      </div>

      {/* Subtle Adire Geometric Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0">
        <CulturalPattern opacity={1} />
      </div>

      {/* Giant Typography Background Watermark */}
      <div 
        className="absolute bottom-[-15px] left-0 right-0 text-center font-serif font-black tracking-wider uppercase text-[#008751]/[0.08] pointer-events-none select-none overflow-hidden whitespace-nowrap leading-none"
        style={{ fontSize: "11vw" }}
      >
        One Lifelong Journey
      </div>

      {/* Glowing background ambient bubble */}
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[60%] rounded-full bg-[#008751]/5 blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 pt-20 pb-10">
        
        {/* Top Section: Logo Block & Column Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 pb-16 border-b border-white/[0.06] items-start">
          
          {/* Brand Column (spans 2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <Eye className="h-6 w-6 text-[#FFD100] stroke-[2.5]" />
              <span className="text-xl font-serif font-bold tracking-tight text-white group-hover:text-stone-200 transition-colors">
                CitiEye
              </span>
            </Link>
            <p className="text-green-100/70 text-xs font-light leading-relaxed max-w-sm">
              Making government plans visible, personal, and relevant. A national initiative built to ensure every citizen is planned for and supported at every milestone of life.
            </p>
            <div className="pt-2 flex flex-col gap-2.5">
              <a href="tel:+2348000000000" className="flex items-center gap-2 text-xs font-semibold text-green-200/90 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#FFD100]" />
                +234 (0) 800-CITIEYE
              </a>
              <a href="mailto:support@citieye.gov.ng" className="flex items-center gap-2 text-xs font-semibold text-green-200/90 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#FFD100]" />
                support@citieye.gov.ng
              </a>
            </div>
          </div>

          {/* Structured Link Columns */}
          {footerLinks.map((col, index) => (
            <div key={index} className="space-y-4">
              <h4 className="text-[10px] font-bold text-[#FFD100] uppercase tracking-[2px]">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link, i) => (
                  <li key={i}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 4, color: "#FFD100" }}
                      transition={{ type: "tween", duration: 0.2 }}
                      className="text-green-100/60 text-[11px] font-medium uppercase tracking-wider block hover:text-[#FFD100] transition-colors"
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Section: Status Indicators & Legal Details */}
        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Live Status indicator */}
          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.07] px-4 py-2.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
            </span>
            <span className="text-[10px] font-mono text-green-200/80 uppercase tracking-widest leading-none">
              SYSTEM STATUS: NOMINAL · 36 STATES ONLINE
            </span>
          </div>

          {/* Legal / Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
            <p className="text-[10px] text-green-200/40 font-light">
              &copy; {new Date().getFullYear()} CitiEye Community Governance. Secure Lifecycle Registry.
            </p>
            <div className="flex items-center gap-3 text-[10px] text-green-200/40">
              <a href="#" className="hover:text-stone-300 transition-colors">Privacy Policy</a>
              <span>·</span>
              <a href="#" className="hover:text-stone-300 transition-colors">NDPR Audited</a>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
