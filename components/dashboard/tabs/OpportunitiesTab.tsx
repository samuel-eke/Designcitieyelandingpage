"use client";

import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Activity, Briefcase, ChevronDown, ChevronUp, FileText, AlertCircle, Check } from "lucide-react";
import { Opportunity } from "../types";
import { METRICS, SUPPORT_OPTIONS } from "../constants";

interface OpportunitiesTabProps {
  kpisCompletedCount: number;
  totalKpisCount: number;
  kpiPercentage: number;
  desiredSupportCode: string;
  matchingOpportunities: Opportunity[];
  expandedOpportunityId: string | null;
  setExpandedOpportunityId: (id: string | null) => void;
  appliedOpportunities: Record<string, boolean>;
  handleApply: (id: string, title: string) => void;
  cohortName: string;
}

export function OpportunitiesTab({
  kpisCompletedCount,
  totalKpisCount,
  kpiPercentage,
  desiredSupportCode,
  matchingOpportunities,
  expandedOpportunityId,
  setExpandedOpportunityId,
  appliedOpportunities,
  handleApply,
  cohortName,
}: OpportunitiesTabProps) {
  return (
    <div className="space-y-6">
      {/* --- METRICS CARDS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* KPI Card */}
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.04)" }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white border border-stone-200/80 rounded-3xl p-5 shadow-sm shadow-stone-100/50 relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-green-700"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Initiatives Applied</span>
            <div className="p-2 bg-green-50 rounded-xl text-green-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-stone-900">{kpisCompletedCount}</span>
            <span className="text-stone-400 text-sm">/ {totalKpisCount}</span>
          </div>
          {/* Progress bar */}
          <div className="mt-4 space-y-1.5">
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-green-700 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${kpiPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-stone-400">
              <span>CIVIC SCORE</span>
              <span className="text-green-700">{kpiPercentage}% DONE</span>
            </div>
          </div>
        </motion.div>

        {/* Opportunities Available Card */}
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.04)" }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white border border-stone-200/80 rounded-3xl p-5 shadow-sm shadow-stone-100/50 relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#030213]"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Targeted Programs</span>
            <div className="p-2 bg-stone-100 rounded-xl text-stone-700">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-stone-900">
              {matchingOpportunities.length} Available
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-4 leading-normal">
            Program offers tailored specifically to your chosen empowerment program:{" "}
            <strong className="text-stone-700">{SUPPORT_OPTIONS[desiredSupportCode as keyof typeof SUPPORT_OPTIONS] || "General"}</strong>.
          </p>
        </motion.div>
      </div>

      {/* Opportunities Header Info */}
      <div className="bg-gradient-to-r from-green-700 to-green-800 text-white rounded-3xl p-6 shadow-md shadow-green-800/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-green-300">Welfare Empowerment Program Recommendation</span>
          <h3 className="text-xl font-serif font-bold leading-tight">
            Initiatives for {SUPPORT_OPTIONS[desiredSupportCode as keyof typeof SUPPORT_OPTIONS] || "General Welfare"}
          </h3>
          <p className="text-xs text-green-100 max-w-xl leading-relaxed">
            Based on your citizen profile details, state of residence, and registry evaluation, you have been prioritized for these federal initiatives. Expand below to apply.
          </p>
        </div>
        <div className="shrink-0 z-10 px-4 py-2 border border-white/20 bg-white/10 rounded-2xl text-xs font-semibold text-white">
          Life Stage: {cohortName}
        </div>
        {/* Decorative Pattern Background */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-6 translate-x-6 w-48 h-48 border-[12px] border-white rounded-full"></div>
      </div>

      {/* --- OPPORTUNITIES ACCORDION LIST --- */}
      <div className="space-y-4">
        {matchingOpportunities.map((op) => {
          const isExpanded = expandedOpportunityId === op.id;
          const isApplied = appliedOpportunities[op.id];
          return (
            <div
              key={op.id}
              className={`bg-white border transition-all duration-300 rounded-3xl overflow-hidden shadow-sm hover:shadow-md ${isExpanded ? "border-green-600/60 ring-1 ring-green-600/10" : "border-stone-200/80"
                }`}
            >
              {/* Summary Row */}
              <div
                onClick={() => setExpandedOpportunityId(isExpanded ? null : op.id)}
                className="p-5 md:p-6 flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-stone-100 text-stone-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {op.type}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wide flex items-center gap-1 ${isApplied
                        ? op.applicationStatus === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : op.applicationStatus === "REJECTED"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-green-100 text-green-750"
                        : op.status === "Open"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-stone-200 text-stone-500"
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isApplied || op.status === "Open" ? "bg-green-500" : "bg-stone-400"}`}></span>
                      {isApplied
                        ? op.applicationStatus === "UNDER_REVIEW"
                          ? "Under Review"
                          : op.applicationStatus === "APPROVED"
                            ? "Approved"
                            : op.applicationStatus === "REJECTED"
                              ? "Rejected"
                              : "Submitted"
                        : op.status}
                    </span>
                  </div>
                  <h4 className="text-sm md:text-base font-semibold text-stone-900 truncate">
                    {op.title}
                  </h4>
                  <p className="text-xs text-stone-500 leading-normal line-clamp-1">
                    {op.brief}
                  </p>
                </div>
                <div className="shrink-0 p-2 bg-stone-50 rounded-xl border border-stone-150 text-stone-400 hover:text-stone-800 transition-colors">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Expandable Details Container */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="border-t border-stone-100 bg-stone-50/40"
                  >
                    <div className="p-5 md:p-6 space-y-5 text-xs md:text-sm">
                      {/* Full Description */}
                      <div className="space-y-1.5">
                        <h5 className="font-bold text-stone-850">Program Overview</h5>
                        <p className="text-stone-600 leading-relaxed">{op.full}</p>
                      </div>

                      {/* Documentation Required */}
                      <div className="bg-white border border-stone-200/80 p-4 rounded-2xl space-y-2">
                        <div className="flex items-center gap-2 text-stone-800 font-bold">
                          <FileText className="w-4 h-4 text-green-700" />
                          <span>Required Documents for Registry Validation</span>
                        </div>
                        <p className="text-xs text-stone-500 leading-relaxed font-mono pl-6">
                          {op.docs}
                        </p>
                      </div>

                      {/* Officer Notes */}
                      {op.officerNotes && (
                        <div className="bg-yellow-50/50 border border-yellow-200/60 p-4 rounded-2xl space-y-1">
                          <div className="flex items-center gap-2 text-yellow-800 font-bold">
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                            <span>Notes from Field Officer {op.assignedOfficerName || "Registry Admin"}</span>
                          </div>
                          <p className="text-xs text-yellow-750 leading-relaxed pl-6">
                            "{op.officerNotes}"
                          </p>
                        </div>
                      )}
 
                      {/* Action Bar */}
                      <div className="flex justify-end pt-2">
                        <button
                          disabled={isApplied || op.status === "Upcoming" || op.applicationStatus === "REJECTED"}
                          onClick={() => handleApply(op.id, op.title)}
                          className={`px-6 py-3 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${isApplied
                            ? "bg-stone-100 text-stone-400 border border-stone-200 shadow-none"
                            : op.status === "Upcoming"
                              ? "bg-stone-200 text-stone-500 cursor-not-allowed"
                              : "bg-green-700 hover:bg-green-800 text-white shadow-green-750/10 active:scale-[0.98]"
                            }`}
                        >
                          {isApplied && <Check className="w-4 h-4 text-green-600" />}
                          {isApplied
                            ? op.applicationStatus === "UNDER_REVIEW"
                              ? "Under Review"
                              : op.applicationStatus === "APPROVED"
                                ? "Approved Successfully"
                                : op.applicationStatus === "REJECTED"
                                  ? "Rejected"
                                  : "Applied Successfully"
                            : op.actionLabel}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
