"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { KpiItem } from "../types";

interface KpisTabProps {
  kpiChecklist: KpiItem[];
  kpisCompletedCount: number;
  totalKpisCount: number;
  kpiPercentage: number;
  toggleKpi: (id: string) => void;
}

export function KpisTab({
  kpiChecklist,
  kpisCompletedCount,
  totalKpisCount,
  kpiPercentage,
  toggleKpi,
}: KpisTabProps) {
  return (
    <div className="max-w-2xl bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-stone-900">Citizen Key Performance Indicators (KPIs)</h3>
          <p className="text-xs text-stone-500 mt-1">
            Your civic engagement scores dictate your priority standing in federal funding waitlists.
          </p>
        </div>
        <div className="px-4 py-2.5 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-green-700 block">Civic KPI Ratio</span>
          <span className="text-base font-bold">{kpisCompletedCount} / {totalKpisCount} Tasks</span>
        </div>
      </div>

      {/* Progress bar info */}
      <div className="bg-stone-50 border border-stone-200/80 p-5 rounded-2xl space-y-3">
        <div className="flex justify-between text-xs font-bold text-stone-700">
          <span>Registry Score Progress</span>
          <span className="text-green-700">{kpiPercentage}% Completed</span>
        </div>
        <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
          <motion.div
            className="bg-green-700 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${kpiPercentage}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        <p className="text-[11px] text-stone-400 leading-normal">
          💡 <strong>Tip:</strong> Reach 70% or more to qualify for fast-track micro-enterprise seed disbursements.
        </p>
      </div>

      {/* KPI Checklist */}
      <div className="space-y-3.5">
        {kpiChecklist.map((k) => (
          <div
            key={k.id}
            onClick={() => toggleKpi(k.id)}
            className={`flex items-start gap-4 p-4 border rounded-2xl transition-all cursor-pointer select-none ${
              k.completed
                ? "bg-green-50/20 border-green-200 text-stone-800"
                : "bg-white border-stone-200 hover:bg-stone-50/30 text-stone-600"
            }`}
          >
            <div
              className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                k.completed ? "bg-green-600 border-green-600 text-white" : "border-stone-300 bg-white"
              }`}
            >
              {k.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <div className="flex-1 text-left">
              <span className="text-xs md:text-sm font-semibold block leading-tight">{k.label}</span>
              <span className="text-[10px] font-bold text-stone-400 mt-1 inline-block">
                CIVIC VALUE: +{k.points} POINTS
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
