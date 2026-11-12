"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Briefcase, Building } from "lucide-react";
import { WidgetPanel } from "@/components/admin/dashboard/WidgetPanel";
import { DomainFilterBar } from "./DomainFilterBar";
import { DomainDataTable } from "./DomainDataTable";
import { HrJobsDetailDrawer } from "./drawer/HrJobsDetailDrawer";
import { useDomainCitizens } from "@/lib/hooks/useDomainCitizens";
import type { DomainFilterParams } from "@/lib/types/domainCitizens";
import type { AnalyticsSummaryDto } from "@/lib/types/citieye";

interface HrJobsDomainTabProps {
  summary: AnalyticsSummaryDto | null | undefined;
  filters: DomainFilterParams;
  onFilterChange: (key: keyof DomainFilterParams, value: any) => void;
  onResetFilters: () => void;
}

export function HrJobsDomainTab({
  summary,
  filters,
  onFilterChange,
  onResetFilters,
}: HrJobsDomainTabProps) {
  const [selectedCitizenCode, setSelectedCitizenCode] = useState<string | null>(null);

  const { data, isLoading } = useDomainCitizens({
    ...filters,
    domain: "hr",
  });

  // Calculate live counts for each employment track from summary
  const employedCount = React.useMemo(() => {
    if (!summary?.byEmploymentStatus) return 0;
    return summary.byEmploymentStatus
      .filter((e: any) => e.employmentStatus?.toLowerCase() === "employed")
      .reduce((acc: number, curr: any) => acc + curr.citizenCount, 0);
  }, [summary]);

  const unemployedCount = React.useMemo(() => {
    if (!summary?.byEmploymentStatus) return 0;
    return summary.byEmploymentStatus
      .filter((e: any) => e.employmentStatus?.toLowerCase() === "unemployed")
      .reduce((acc: number, curr: any) => acc + curr.citizenCount, 0);
  }, [summary]);

  const businessCount = React.useMemo(() => {
    if (!summary?.byEmploymentStatus) return 0;
    return summary.byEmploymentStatus
      .filter((e: any) => {
        const s = e.employmentStatus?.toLowerCase() || "";
        return s === "business_owner" || s === "business" || s === "enterprise";
      })
      .reduce((acc: number, curr: any) => acc + curr.citizenCount, 0);
  }, [summary]);

  const vocationalCount = React.useMemo(() => {
    if (!summary?.byEmploymentStatus) return 0;
    return summary.byEmploymentStatus
      .filter((e: any) => {
        const s = e.employmentStatus?.toLowerCase() || "";
        return (
          s === "vocational" ||
          s === "artisan" ||
          s === "vocational_training" ||
          s === "apprenticeship"
        );
      })
      .reduce((acc: number, curr: any) => acc + curr.citizenCount, 0);
  }, [summary]);

  // Click-to-filter toggle handler for the 4 top cards
  const handleTrackClick = (trackKey: string) => {
    if (filters.employmentTrack === trackKey) {
      onFilterChange("employmentTrack", undefined);
    } else {
      onFilterChange("employmentTrack", trackKey);
    }
  };

  const statTracks = [
    {
      key: "employed",
      title: "Employed Citizens",
      label: "Formal & Contract Employment",
      count: employedCount,
    },
    {
      key: "unemployed",
      title: "Unemployed Citizens",
      label: "Actively Job-Seeking",
      count: unemployedCount,
    },
    {
      key: "business",
      title: "Business Owners & SMEs",
      label: "Self-Employed & Enterprise (CAC)",
      count: businessCount,
    },
    {
      key: "vocational",
      title: "Vocational Trade Learners",
      label: "Skills Acquisition & Apprenticeship",
      count: vocationalCount,
    },
  ];

  // Chart 1: Employed and Unemployed Citizens
  const employmentRatioData = React.useMemo(() => {
    return [
      {
        name: "Employed",
        Count: employedCount,
        fill: "#10b981", // Emerald
      },
      {
        name: "Unemployed",
        Count: unemployedCount,
        fill: "#f43f5e", // Rose
      },
    ];
  }, [employedCount, unemployedCount]);

  // Chart 2: Citizens with Businesses and Learning Vocational Trade
  const businessVocationalData = React.useMemo(() => {
    return [
      {
        name: "Doing Business (SMEs)",
        Count: businessCount,
        fill: "#6366f1", // Indigo
      },
      {
        name: "Vocational Trade / Trainees",
        Count: vocationalCount,
        fill: "#f59e0b", // Amber
      },
    ];
  }, [businessCount, vocationalCount]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ================= 4 TOP STAT CARDS (NO ICONS) ================= */}
      {summary && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statTracks.map((track) => {
              const isActive = filters.employmentTrack === track.key;

              return (
                <button
                  key={track.key}
                  type="button"
                  onClick={() => handleTrackClick(track.key)}
                  className={`bg-white border rounded-2xl p-4 shadow-2xs flex flex-col justify-between h-[128px] text-left transition-all duration-150 cursor-pointer group relative ${
                    isActive
                      ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20 shadow-xs"
                      : "border-slate-200/80 hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  {/* Card Top: Title & Active Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-wider block line-clamp-1">
                      {track.title}
                    </span>
                    {isActive && (
                      <span className="px-1.5 py-0.5 bg-indigo-600 text-white rounded text-[9px] font-mono font-bold leading-none shrink-0">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Card Middle: Live Stat Count */}
                  <div className="my-1">
                    <h3 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
                      {track.count.toLocaleString()}
                    </h3>
                  </div>

                  {/* Card Bottom: Subtitle & Quick Action */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="truncate">{track.label}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 font-semibold ml-1 shrink-0">
                      {isActive ? "Clear" : "Filter →"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ================= TWO COMPARATIVE CHARTS ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Employed and Unemployed Citizens */}
            <WidgetPanel
              title="Employed & Unemployed Citizens"
              icon={Briefcase}
              className="h-[320px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={employmentRatioData}
                  margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight={600} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e2e8f0",
                      borderRadius: 12,
                      fontSize: 11,
                    }}
                    formatter={(val: any) => [Number(val).toLocaleString(), "Citizens"]}
                  />
                  <Bar dataKey="Count" radius={[6, 6, 0, 0]}>
                    {employmentRatioData.map((entry, index) => (
                      <Cell key={`cell-emp-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </WidgetPanel>

            {/* Chart 2: Citizens with Businesses and Learning Vocational Trade */}
            <WidgetPanel
              title="Businesses & Vocational Trade Learners"
              icon={Building}
              className="h-[320px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={businessVocationalData}
                  margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight={600} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e2e8f0",
                      borderRadius: 12,
                      fontSize: 11,
                    }}
                    formatter={(val: any) => [Number(val).toLocaleString(), "Citizens"]}
                  />
                  <Bar dataKey="Count" radius={[6, 6, 0, 0]}>
                    {businessVocationalData.map((entry, index) => (
                      <Cell key={`cell-biz-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </WidgetPanel>
          </div>
        </>
      )}

      {/* ================= BOTTOM CITIZEN DATA TABLE ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-800">
              Jobs and Business Citizen Registry
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {data?.totalElements ? `${data.totalElements.toLocaleString()} citizens active` : ""}
          </span>
        </div>

        {/* Filter Bar */}
        <DomainFilterBar
          domain="hr"
          filters={filters}
          onFilterChange={onFilterChange}
          onResetFilters={onResetFilters}
        />

        {/* Paginated Data Table */}
        <DomainDataTable
          domain="hr"
          data={data}
          isLoading={isLoading}
          searchQuery={filters.query || ""}
          onSearchChange={(q) => onFilterChange("query", q || undefined)}
          page={filters.page || 0}
          pageSize={filters.size || 20}
          onPageChange={(p) => onFilterChange("page", p)}
          onPageSizeChange={(s) => onFilterChange("size", s)}
          onSelectCitizen={(code) => setSelectedCitizenCode(code)}
          onResetFilters={onResetFilters}
        />
      </div>

      {/* Detail Drawer */}
      <HrJobsDetailDrawer
        citizenCode={selectedCitizenCode}
        isOpen={!!selectedCitizenCode}
        onClose={() => setSelectedCitizenCode(null)}
      />
    </div>
  );
}
