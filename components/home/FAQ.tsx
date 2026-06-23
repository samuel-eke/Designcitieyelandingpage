"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { ChevronDown } from "lucide-react";
import { CulturalPattern } from "../ui/CulturalPattern";

const faqs = [
  {
    q: "What is CitiEye and who is it built for?",
    a: "CitiEye is a citizen lifecycle management and field operations platform built for Nigerian government agencies — including federal ministries, state welfare boards, and local government authorities. It gives administrators, programme officers, and field staff a unified digital environment to enrol, verify, track, and serve citizens across all life stages.",
  },
  {
    q: "How does CitiEye handle citizen data privacy and security?",
    a: "All citizen data is encrypted in transit and at rest, and processed in strict compliance with Nigeria's Data Protection Regulation (NDPR). Access is role-based and fully audited — no officer can access records outside their assigned scope. CitiEye does not sell or share citizen data with any third party.",
  },
  {
    q: "Can CitiEye integrate with existing government databases?",
    a: "Yes. CitiEye is built with government interoperability as a core requirement. It supports integration with NIMC's NIN infrastructure, the IPPIS payroll system, and state-level registries via secure API connectors. Custom integration pathways can be scoped during onboarding.",
  },
  {
    q: "What devices do field officers need to use CitiEye?",
    a: "CitiEye's field application runs on Android smartphones and tablets — including low-cost devices widely available to government officers. No specialist hardware is required. The application is offline-first: officers can collect and verify data without internet connectivity and sync automatically when back online.",
  },
  {
    q: "Is CitiEye available across all states in Nigeria?",
    a: "CitiEye is currently in active deployment and agency onboarding across multiple states. National availability is the target, and the platform's architecture is designed to scale to all 36 states and the FCT. Contact our partnerships team to discuss rollout timelines for your agency or state.",
  },
  {
    q: "How long does onboarding a new agency take?",
    a: "Typical agency onboarding — including configuration, data migration scoping, and officer training — takes between four and eight weeks depending on agency size and existing data infrastructure. A dedicated implementation team supports every onboarding engagement from kickoff to go-live.",
  },
  {
    q: "What happens if a field officer loses connectivity in the field?",
    a: "CitiEye's mobile app is designed for offline-first operation. Officers can continue to collect data, complete forms, and conduct verifications without an internet connection. All offline actions are queued and automatically synchronised to the central platform the moment connectivity is restored, with no data loss.",
  },
  {
    q: "How is CitiEye different from other e-government platforms?",
    a: "Most e-government platforms are designed for citizen-facing self-service — portals where citizens apply for services. CitiEye is built for the operations side: the officers, administrators, and programme managers who deliver those services. It focuses on field data collection, case tracking, programme compliance, and internal accountability — areas that generic platforms consistently underserve.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease: "easeOut", delay: (index % 4) * 0.07 }}
      className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
        open ? "border-green-300 bg-green-50/50 shadow-sm" : "border-stone-200 bg-white hover:border-stone-300"
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className={`text-sm font-semibold leading-snug transition-colors ${open ? "text-green-800" : "text-stone-800"}`}>
          {q}
        </span>
        <span
          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
            open ? "bg-green-700 text-white rotate-180" : "bg-stone-100 text-stone-500"
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm text-stone-600 leading-relaxed font-light border-t border-green-200/60 pt-4">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-60px" });

  return (
    <div className="relative w-full bg-white py-24 lg:py-32 overflow-hidden border-t border-stone-100">
      <CulturalPattern opacity={0.018} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Left: sticky header */}
          <motion.div
            ref={headRef}
            initial={{ opacity: 0, x: -24 }}
            animate={headInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start"
          >
            <span className="text-[11px] font-bold tracking-[3px] uppercase text-green-700 mb-6 block">
              Frequently Asked
            </span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 leading-[1.15] mb-6">
              Questions<br />
              <span className="relative inline-block">
                <span className="relative z-10 italic">answered.</span>
                <span className="absolute bottom-1 left-0 w-[105%] h-3 bg-[#FFD100] -z-10 -rotate-1" />
              </span>
            </h2>
            <p className="text-stone-500 text-base font-light leading-relaxed">
              Everything agencies, administrators, and officers typically ask before adopting CitiEye. Still have questions? Reach our team directly.
            </p>

            <a
              href="mailto:hello@citieye.ng"
              className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 border border-stone-300 rounded-full text-sm font-semibold text-stone-700 hover:border-green-600 hover:text-green-700 transition-all"
            >
              Contact us →
            </a>
          </motion.div>

          {/* Right: accordion list */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            {faqs.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} index={i} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
