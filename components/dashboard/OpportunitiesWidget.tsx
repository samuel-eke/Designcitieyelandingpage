"use client";

import { Award, ArrowRight, CheckCircle2 } from "lucide-react";
import { Opportunity } from "./types";

interface OpportunitiesWidgetProps {
  opportunities: Opportunity[];
  desiredSupportCode: string;
  appliedOpportunities: Record<string, boolean>;
  onApply: (id: string, title: string) => void;
  onNavigateToOpportunities: () => void;
}

export function OpportunitiesWidget({
  opportunities,
  desiredSupportCode,
  appliedOpportunities,
  onApply,
  onNavigateToOpportunities,
}: OpportunitiesWidgetProps) {
  const displayItems = opportunities.slice(0, 3);

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-50 rounded-xl text-amber-700">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-serif text-stone-900">
              Matched Opportunities
            </h3>
            <p className="text-[11px] text-stone-500 capitalize">
              Empowerment Program: {desiredSupportCode.replace(/_/g, " ")}
            </p>
          </div>
        </div>
        <button
          onClick={onNavigateToOpportunities}
          className="text-xs font-bold text-green-700 hover:text-green-800 flex items-center gap-0.5 cursor-pointer"
        >
          View All ({opportunities.length}) →
        </button>
      </div>

      {/* List of 2-3 matched opportunities */}
      <div className="space-y-3">
        {displayItems.map((op) => {
          const isApplied = appliedOpportunities[op.id];
          return (
            <div
              key={op.id}
              className="p-3.5 bg-stone-50/80 border border-stone-200/60 rounded-xl space-y-2 hover:border-amber-200 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full inline-block mb-1">
                    {op.type}
                  </span>
                  <h4 className="text-xs font-bold text-stone-900 leading-snug">
                    {op.title}
                  </h4>
                </div>
              </div>
              <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                {op.brief}
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-stone-400 font-medium">
                  Status: <strong className="text-stone-700">{op.status}</strong>
                </span>
                <button
                  onClick={() => !isApplied && onApply(op.id, op.title)}
                  disabled={isApplied}
                  className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    isApplied
                      ? "bg-emerald-100 text-emerald-800 cursor-default"
                      : "bg-green-700 hover:bg-green-800 text-white"
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />{" "}
                      {op.applicationStatus === "UNDER_REVIEW"
                        ? "Under Review"
                        : op.applicationStatus === "APPROVED"
                        ? "Approved"
                        : op.applicationStatus === "REJECTED"
                        ? "Rejected"
                        : "Submitted"}
                    </>
                  ) : (
                    <>
                      Apply <ArrowRight className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
