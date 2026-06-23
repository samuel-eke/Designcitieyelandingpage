"use client";

import { motion } from "motion/react";
import { CheckCircle2, ArrowRight, Download, Copy } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface Props {
  name: string;
  email: string;
}

function generateRef(): string {
  return `CTE-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

export function SuccessScreen({ name, email }: Props) {
  const [ref] = useState(generateRef);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(ref).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col items-center text-center px-4 py-8 max-w-md mx-auto">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6"
      >
        <CheckCircle2 className="w-12 h-12 text-green-600" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3 mb-8"
      >
        <h2 className="text-3xl font-serif font-bold text-stone-900">
          Welcome, {name.split(" ")[0]}!
        </h2>
        <p className="text-stone-500 text-sm leading-relaxed">
          Your CitiEye registration is submitted and under review. We'll send a confirmation to{" "}
          <strong className="text-stone-700">{email}</strong> within 24–48 hours.
        </p>
      </motion.div>

      {/* Reference Box */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-5 mb-6"
      >
        <p className="text-[11px] uppercase font-bold tracking-widest text-stone-400 mb-2">Application Reference</p>
        <div className="flex items-center justify-between gap-3">
          <code className="text-lg font-mono font-bold text-stone-800 tracking-wider">{ref}</code>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="text-[11px] text-stone-400 mt-2">Keep this for tracking your application status.</p>
      </motion.div>

      {/* What's Next */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="w-full text-left space-y-3 mb-8"
      >
        <p className="text-[12px] font-bold uppercase tracking-widest text-stone-400">What happens next</p>
        {[
          { step: "1", text: "Email confirmation sent to your inbox" },
          { step: "2", text: "NIMC identity verification (24–48 hrs)" },
          { step: "3", text: "Programme eligibility assessment" },
          { step: "4", text: "Dedicated officer assigned to your profile" },
        ].map(({ step, text }) => (
          <div key={step} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-[11px] font-bold flex items-center justify-center shrink-0">
              {step}
            </div>
            <p className="text-sm text-stone-600">{text}</p>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-3 w-full"
      >
        <button className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-stone-100 text-stone-700 rounded-xl text-sm font-semibold hover:bg-stone-200 transition-all">
          <Download className="w-4 h-4" />
          Download Receipt
        </button>
        <Link
          href="/"
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition-all"
        >
          Go to Homepage
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}
