"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Shield, FileText, ArrowRight, Activity, Calendar, MapPin, BadgeCheck } from "lucide-react";
import { CulturalPattern } from "../ui/CulturalPattern";

const stagesData = [
  {
    id: "childhood",
    label: "Infancy & Childhood",
    name: "Aisha Bello",
    role: "Registered Child",
    location: "Kano State",
    idNumber: "NIN-B4912-KN",
    avatar: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=150",
    benefits: [
      { title: "Maternal Health Support", status: "Active Plan", desc: "Monthly nutritional grants & pediatric support.", meta: "Grant code: MSG-401" },
      { title: "Immunisation Schedule Tracker", status: "Up to Date", desc: "6-month checkup (Yellow Fever & Polio) scheduled.", meta: "Next clinic visit: July 12" },
      { title: "Early Childhood Assessment", status: "Registered", desc: "Aptitude and developmental checkups starting at 24 months.", meta: "Nurture track active" },
    ]
  },
  {
    id: "youth",
    label: "Youth & Careers",
    name: "David Okonkwo",
    role: "Graduate Scholar",
    location: "Enugu State",
    idNumber: "NIN-Y9843-EN",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150",
    benefits: [
      { title: "National Digital Skills Track", status: "72% Complete", desc: "Enrolled in Advanced Software Engineering & Data Architecture.", meta: "Class: Cohort 9" },
      { title: "Graduate Internship Scheme", status: "3 Matches", desc: "Verified corporate internships matching aptitude profiles.", meta: "Interviews pending" },
      { title: "Aptitude & Talent Assessment", status: "Completed", desc: "Identified high aptitude for logic structures and system design.", meta: "Aptitude Score: 94%" },
    ]
  },
  {
    id: "senior",
    label: "Senior Years",
    name: "Chief Ibrahim Musa",
    role: "Retired Veteran",
    location: "FCT Abuja",
    idNumber: "NIN-S0123-FC",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150",
    benefits: [
      { title: "Monthly Pension Disbursement", status: "Paid (June)", desc: "Secured direct deposit. Verified on-chain citizen identification.", meta: "Transaction: TX-82910-FC" },
      { title: "Senior Citizen Care Pass", status: "Active", desc: "Free access to localized healthcare clinics and home assistance.", meta: "Card: CCP-092-ACTIVE" },
      { title: "Dedicated Welfare Officer", status: "Assigned", desc: "Officer: Gabriel Adebayo. Direct support and monthly checkups.", meta: "Officer ID: OF-9821" },
    ]
  }
];

export function PersonalizedSpace() {
  const [activeTab, setActiveTab] = useState(stagesData[0]);

  return (
    <section className="relative w-full bg-stone-900 py-24 lg:py-32 overflow-hidden border-t border-stone-800">
      {/* Subtle Cultural Pattern Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]">
        <CulturalPattern opacity={0.3} className="text-[#FFD100]" />
      </div>

      {/* Decorative ambient background glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[60%] rounded-full bg-[#008751]/12 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[60%] rounded-full bg-[#FFD100]/6 blur-[130px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Header Block */}
        <div className="max-w-3xl mb-16">
          <span className="text-[10px] font-bold tracking-[3px] uppercase text-[#FFD100] mb-4 block">
            The Citizen Experience
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white leading-[1.15] mb-6">
            A personal space for every Nigerian.
          </h2>
          <p className="text-stone-300 text-lg font-light leading-relaxed">
            Every registered citizen gains access to a secure, personalized portal designed entirely around your life stage. With CitiEye, government initiatives stop feeling distant and start feeling relevant to you.
          </p>
        </div>

        {/* Large Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: List of benefits (col-span-4) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-stone-950/40 border border-stone-800/80 p-6 rounded-2xl">
              <h3 className="text-sm font-semibold text-stone-300 uppercase tracking-wider mb-6">
                Citizen Portal Capabilities
              </h3>
              
              <div className="space-y-6">
                {[
                  { title: "View Opportunities", desc: "Access verified programmes, resources, and career pathways relevant to you." },
                  { title: "Track Benefits", desc: "Monitor grant statuses, care schedules, and direct deposits transparently." },
                  { title: "Personalised Tickers", desc: "Receive live reminders and local clinic or cohort announcements automatically." },
                  { title: "Lifetime Support", desc: "Your portal transitions with you as you step into new stages of life." }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-lg bg-[#008751]/20 flex items-center justify-center border border-[#008751]/30">
                      <CheckCircle2 className="w-4 h-4 text-[#008751]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                      <p className="text-xs text-stone-400 font-light leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-1 rounded-xl bg-stone-900 border border-stone-800 flex gap-2">
              {stagesData.map((stage) => {
                const isActive = activeTab.id === stage.id;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveTab(stage)}
                    className={`flex-1 text-center py-2.5 px-2 text-[11px] font-bold rounded-lg transition-all duration-300 uppercase tracking-wider ${
                      isActive
                        ? "bg-[#008751] text-white shadow-lg shadow-[#008751]/20"
                        : "text-stone-400 hover:text-white hover:bg-stone-800/50"
                    }`}
                  >
                    {stage.id === "childhood" ? "Child" : stage.id === "youth" ? "Youth" : "Senior"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Large Widescreen Wires/Dashboard Mockup (col-span-8) */}
          <div className="lg:col-span-8 flex justify-center">
            <div className="w-full bg-stone-950 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl relative">
              
              {/* Browser Header Bar */}
              <div className="flex items-center justify-between px-6 py-4 bg-stone-900/60 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-stone-700" />
                  <div className="w-3 h-3 rounded-full bg-stone-700" />
                  <div className="w-3 h-3 rounded-full bg-stone-700" />
                </div>
                <div className="bg-stone-950 px-4 py-1.5 rounded-lg text-[10px] text-stone-500 font-mono tracking-wide w-1/2 text-center border border-stone-850 select-none">
                  citieye.gov.ng/dashboard/profile
                </div>
                <div className="w-12 text-right">
                  <span className="text-[9px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded font-mono border border-green-500/20">
                    SECURE
                  </span>
                </div>
              </div>

              {/* Large Mockup Split */}
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
                
                {/* Mockup Left Sidebar (NIN Identity details) */}
                <div className="md:col-span-4 p-6 border-r border-stone-900 bg-stone-950/60">
                  <div className="flex flex-col items-center text-center pb-6 border-b border-stone-900">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-stone-800 bg-stone-900 mb-4 relative group">
                      <img src={activeTab.avatar} alt={activeTab.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center gap-1.5 justify-center">
                      <h4 className="text-base font-bold text-white leading-tight">{activeTab.name}</h4>
                      <BadgeCheck className="w-4 h-4 text-green-500 shrink-0" />
                    </div>
                    <p className="text-xs text-[#FFD100] font-medium uppercase tracking-wider mt-1">{activeTab.role}</p>
                    <p className="text-[10px] text-stone-500 mt-0.5 font-mono">{activeTab.idNumber}</p>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-2.5 text-xs text-stone-400">
                      <MapPin className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                      <span>{activeTab.location}, Nigeria</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-stone-400">
                      <Activity className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                      <span>Status: <strong className="text-green-400 font-semibold">Active Citizen</strong></span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-stone-400">
                      <Calendar className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                      <span>Registered since: 2025</span>
                    </div>
                  </div>
                </div>

                {/* Mockup Right Workspace (Featuring generated mockup background + Live overlays) */}
                <div className="md:col-span-8 p-6 md:p-8 flex flex-col justify-between relative bg-stone-950">
                  
                  {/* Generated Widescreen Dashboard Mockup Image Background */}
                  <div className="absolute inset-0 z-0 opacity-15 overflow-hidden">
                    <img 
                      src="/citieye_dashboard_mockup.png" 
                      alt="Dashboard Interface Background Graph" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Glassmorphic Live Card Overlay */}
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                        Benefits and Programs Active
                      </h5>
                      <span className="text-[10px] text-stone-500 font-medium">3 Total Services Registered</span>
                    </div>

                    <div className="space-y-3">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTab.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className="space-y-3"
                        >
                          {activeTab.benefits.map((benefit, i) => (
                            <div
                              key={i}
                              className="p-4 bg-stone-900/80 border border-stone-850 rounded-xl hover:border-stone-800 transition-colors flex items-start gap-4 backdrop-blur-md shadow-md"
                            >
                              <div className="mt-0.5 p-1.5 rounded-lg bg-stone-950 border border-stone-800 text-stone-300">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="flex-grow min-w-0">
                                <div className="flex items-center justify-between gap-4">
                                  <h6 className="text-sm font-semibold text-white leading-tight truncate">
                                    {benefit.title}
                                  </h6>
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#008751] shrink-0 px-2 py-0.5 rounded bg-[#008751]/10 border border-[#008751]/20">
                                    {benefit.status}
                                  </span>
                                </div>
                                <p className="text-xs text-stone-300 font-light mt-1.5 leading-normal">
                                  {benefit.desc}
                                </p>
                                <div className="text-[9px] font-mono text-stone-500 mt-2 tracking-wider">
                                  {benefit.meta}
                                </div>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Mockup footer message */}
                  <div className="relative z-10 mt-6 pt-4 border-t border-stone-900 flex justify-between items-center text-[10px] text-stone-500 font-medium">
                    <span>One Citizen · One Identity</span>
                    <span className="flex items-center gap-1 text-[#008751] hover:text-[#008751]/90 cursor-pointer">
                      View full profile details <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
