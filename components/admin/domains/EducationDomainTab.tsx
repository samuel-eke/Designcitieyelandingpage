"use client";

import React, { useState } from "react";
import { GraduationCap } from "lucide-react";
import { DomainFilterBar } from "./DomainFilterBar";
import { DomainDataTable } from "./DomainDataTable";
import { EducationDetailDrawer } from "./drawer/EducationDetailDrawer";
import { useDomainCitizens } from "@/lib/hooks/useDomainCitizens";
import {
  useEducationTierCounts,
  useEducationTierCountsInMemory,
  EDUCATION_TIERS,
} from "@/lib/hooks/useEducationDomainStats";
import type { DomainFilterParams } from "@/lib/types/domainCitizens";
import type { AnalyticsSummaryDto } from "@/lib/types/citieye";

interface EducationDomainTabProps {
  summary?: AnalyticsSummaryDto | null | undefined;
  filters: DomainFilterParams;
  onFilterChange: (key: keyof DomainFilterParams, value: any) => void;
  onResetFilters: () => void;
}

export function EducationDomainTab({
  summary: _summary,
  filters,
  onFilterChange,
  onResetFilters,
}: EducationDomainTabProps) {
  const [selectedCitizenCode, setSelectedCitizenCode] = useState<string | null>(null);

  // Fetch domain citizens (in-memory filtered or server fallback)
  const { data, rawRecords, isServerMode, isLoading } = useDomainCitizens({
    ...filters,
    domain: "education",
  });

  // Zero-HTTP-request in-memory tier count aggregation
  const memoryCounts = useEducationTierCountsInMemory(rawRecords, {
    state: filters.state,
    lga: filters.lga,
    gender: filters.gender,
  });

  // Server-side fallback tier counts if dataset exceeds threshold
  const serverCounts = useEducationTierCounts(
    {
      state: filters.state,
      lga: filters.lga,
      gender: filters.gender,
    },
    isServerMode
  );

  const counts = isServerMode ? serverCounts.counts : memoryCounts.counts;
  const isCountsLoading = isServerMode ? serverCounts.isLoading : isLoading;

  const handleTierClick = (tierKey: string) => {
    if (filters.educationalLevel === tierKey) {
      onFilterChange("educationalLevel", undefined);
    } else {
      onFilterChange("educationalLevel", tierKey);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ================= 6 EDUCATION STATS CARDS (NO ICONS) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {EDUCATION_TIERS.map((tier) => {
          const isActive = filters.educationalLevel === tier.key;
          const count = counts[tier.key] ?? 0;

          return (
            <button
              key={tier.key}
              type="button"
              onClick={() => handleTierClick(tier.key)}
              className={`bg-white border rounded-2xl p-4 shadow-2xs flex flex-col justify-between h-[128px] text-left transition-all duration-150 cursor-pointer group relative ${
                isActive
                  ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20 shadow-xs"
                  : "border-slate-200/80 hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              {/* Card Top: Title & Active Badge */}
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-wider block line-clamp-1">
                  {tier.title}
                </span>
                {isActive && (
                  <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[9px] font-mono font-bold leading-none shrink-0">
                    Active
                  </span>
                )}
              </div>

              {/* Card Middle: Live Stat Count */}
              <div className="my-1">
                {isCountsLoading ? (
                  <div className="h-7 w-20 bg-slate-100 animate-pulse rounded-md" />
                ) : (
                  <h3 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
                    {count.toLocaleString()}
                  </h3>
                )}
              </div>

              {/* Card Bottom: Subtitle & Quick Action */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="truncate">{tier.label}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 font-semibold ml-1 shrink-0">
                  {isActive ? "Clear" : "Filter →"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ================= BOTTOM CITIZEN DATA TABLE ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-800">
              Education Citizen Registry & Progression
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {data?.totalElements ? `${data.totalElements.toLocaleString()} citizens enrolled` : ""}
          </span>
        </div>

        {/* Filter Bar */}
        <DomainFilterBar
          domain="education"
          filters={filters}
          onFilterChange={onFilterChange}
          onResetFilters={onResetFilters}
        />

        {/* Paginated Data Table */}
        <DomainDataTable
          domain="education"
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

      {/* Slide-over Detail Drawer */}
      <EducationDetailDrawer
        citizenCode={selectedCitizenCode}
        isOpen={!!selectedCitizenCode}
        onClose={() => setSelectedCitizenCode(null)}
      />
    </div>
  );
}
