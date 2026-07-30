"use client";

import { CheckCircle2, Clock, CircleAlert, ShieldCheck } from "lucide-react";
import { KpiItem } from "./types";

interface MilestoneTrackerProps {
  kpiChecklist: KpiItem[];
  kpisCompletedCount: number;
  totalKpisCount: number;
  onToggleKpi: (id: string) => void;
  onNavigateToKpis: () => void;
}

export function MilestoneTracker({
  kpiChecklist,
  kpisCompletedCount,
  totalKpisCount,
  onToggleKpi,
  onNavigateToKpis,
}: MilestoneTrackerProps) {
  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-serif text-stone-900">
              Mandatory Milestone Tracker
            </h3>
            <p className="text-xs text-stone-500">
              Civic engagement verification and life stage progression milestones
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
            {kpisCompletedCount} of {totalKpisCount} Milestones Met
          </span>
          <button
            onClick={onNavigateToKpis}
            className="text-xs font-bold text-green-700 hover:text-green-800 cursor-pointer"
          >
            Manage All →
          </button>
        </div>
      </div>

      {/* Horizontal / Grid Milestone Step Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
        {kpiChecklist.map((item, idx) => {
          const isCompleted = item.completed;
          return (
            <div
              key={item.id}
              onClick={() => onToggleKpi(item.id)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                isCompleted
                  ? "bg-emerald-50/60 border-emerald-200/80 hover:border-emerald-300"
                  : "bg-stone-50/80 border-stone-200/70 hover:border-amber-300"
              }`}
            >
              {/* Top Step Number & Status Icon */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400">
                  Step 0{idx + 1}
                </span>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-500" />
                )}
              </div>

              {/* Title & points */}
              <div>
                <h4 className="text-xs font-bold text-stone-900 leading-snug">
                  {item.label}
                </h4>
                <span className="text-[10px] font-semibold text-stone-500 mt-1 block">
                  +{item.points} Civic Points
                </span>
              </div>

              {/* Status Badge */}
              <div>
                {isCompleted ? (
                  <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    In Progress
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
