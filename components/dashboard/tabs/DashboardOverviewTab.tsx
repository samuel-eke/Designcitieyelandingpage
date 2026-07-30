"use client";

import { Users, HeartHandshake } from "lucide-react";
import { KpiStatCard } from "../KpiStatCard";
import { AnnouncementFeed } from "../AnnouncementFeed";
import { ProfileCompletionCard } from "../ProfileCompletionCard";
import { OpportunitiesWidget } from "../OpportunitiesWidget";
import { Opportunity } from "../types";

interface DashboardOverviewTabProps {
  cohortName: string;
  cohortDescription?: string;
  desiredSupportCode: string;
  matchingOpportunities: Opportunity[];
  appliedOpportunities: Record<string, boolean>;
  onApply: (id: string, title: string) => void;
  onNavigateTab: (tab: string) => void;
}

export function DashboardOverviewTab({
  cohortName,
  cohortDescription,
  desiredSupportCode,
  matchingOpportunities,
  appliedOpportunities,
  onApply,
  onNavigateTab,
}: DashboardOverviewTabProps) {
  const supportGroupLabel = desiredSupportCode
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="space-y-6">
      {/* ─── ZONE 1: Two Summary KPI Stat Cards ───────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KpiStatCard
          title="Assigned Life Stage"
          value={cohortName.replace(" Cohort", "").replace(" Life Stage", "")}
          sublabel={cohortDescription || "Life Stage & Demographic Group"}
          badgeText="Active Tier"
          badgeType="info"
          icon={Users}
          iconBg="bg-blue-50"
          iconColor="text-blue-700"
        />

        <KpiStatCard
          title="Empowerment Program"
          value={supportGroupLabel || "—"}
          sublabel="Selected Welfare Program"
          badgeText="Matched"
          badgeType="info"
          icon={HeartHandshake}
          iconBg="bg-purple-50"
          iconColor="text-purple-700"
        />
      </div>

      {/* ─── ZONE 2: Two-Column Main Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (2 Cols): Announcements Feed */}
        <div className="lg:col-span-2 space-y-6">
          <AnnouncementFeed />
        </div>

        {/* Right Column (1 Col): Profile Prompt + Opportunities */}
        <div className="space-y-6">
          {/* Nudge to complete profile */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-green-700 shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold font-serif text-stone-900">Complete Your Profile</h3>
                <p className="text-[10px] text-stone-500">Unlock tier-2 welfare matching</p>
              </div>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Answer the demographic questions relevant to your life stage to improve your welfare eligibility score.
            </p>
            <button
              onClick={() => onNavigateTab("profile")}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer group"
            >
              <span>Start Profile Questionnaire</span>
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <OpportunitiesWidget
            opportunities={matchingOpportunities}
            desiredSupportCode={desiredSupportCode}
            appliedOpportunities={appliedOpportunities}
            onApply={onApply}
            onNavigateToOpportunities={() => onNavigateTab("opportunities")}
          />
        </div>
      </div>
    </div>
  );
}
