"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { DomainFilterBar } from "./DomainFilterBar";
import { DomainDataTable } from "./DomainDataTable";
import { PensionDetailDrawer } from "./drawer/PensionDetailDrawer";
import { useDomainCitizens } from "@/lib/hooks/useDomainCitizens";
import type { DomainFilterParams } from "@/lib/types/domainCitizens";
import type { AnalyticsSummaryDto } from "@/lib/types/citieye";

interface PensionDomainTabProps {
  summary: AnalyticsSummaryDto | null | undefined;
  filters: DomainFilterParams;
  onFilterChange: (key: keyof DomainFilterParams, value: any) => void;
  onResetFilters: () => void;
}

export function PensionDomainTab({
  summary,
  filters,
  onFilterChange,
  onResetFilters,
}: PensionDomainTabProps) {
  const [selectedCitizenCode, setSelectedCitizenCode] = useState<string | null>(null);

  const { data, isLoading } = useDomainCitizens({
    ...filters,
    domain: "pension",
  });

  const preRetirementCohort = summary?.byCohort.find(
    (c: any) =>
      c.cohortName.toLowerCase().includes("pre-retirement") ||
      (c.minAge !== null && c.minAge >= 45 && c.minAge < 55)
  );

  const activeAgingCohort = summary?.byCohort.find(
    (c: any) =>
      c.cohortName.toLowerCase().includes("active aging") ||
      c.cohortName.toLowerCase().includes("aging") ||
      (c.minAge !== null && c.minAge >= 50 && (c.maxAge === null || c.maxAge <= 60))
  );

  const elderlyCareCohort = summary?.byCohort.find(
    (c: any) =>
      c.cohortName.toLowerCase().includes("elderly") ||
      c.cohortName.toLowerCase().includes("senior") ||
      (c.minAge !== null && c.minAge >= 60)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ================= TOP METRICS SECTION ================= */}
      {summary && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[140px]">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block truncate">
                  {preRetirementCohort?.cohortName || "Pre-Retirement"}
                </span>
                <h3 className="text-2xl font-serif font-bold text-slate-800 mt-2">
                  {(preRetirementCohort?.totalCitizens || 0).toLocaleString()}
                </h3>
              </div>
              <span className="text-[9px] font-mono text-slate-400">
                {preRetirementCohort && preRetirementCohort.minAge != null && preRetirementCohort.maxAge != null
                  ? `Ages ${preRetirementCohort.minAge} - ${preRetirementCohort.maxAge} Cohort`
                  : preRetirementCohort && preRetirementCohort.minAge != null
                  ? `Ages ${preRetirementCohort.minAge}+ Cohort`
                  : "Ages 49 - 54 Cohort"}
              </span>
            </div>

            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[140px]">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block truncate">
                  {activeAgingCohort?.cohortName || "Active Aging"}
                </span>
                <h3 className="text-2xl font-serif font-bold text-slate-800 mt-2">
                  {(activeAgingCohort?.totalCitizens || 0).toLocaleString()}
                </h3>
              </div>
              <span className="text-[9px] font-mono text-slate-400">
                {activeAgingCohort && activeAgingCohort.minAge != null && activeAgingCohort.maxAge != null
                  ? `Ages ${activeAgingCohort.minAge} - ${activeAgingCohort.maxAge} Cohort`
                  : activeAgingCohort && activeAgingCohort.minAge != null
                  ? `Ages ${activeAgingCohort.minAge}+ Cohort`
                  : "Ages 55 - 60 Cohort"}
              </span>
            </div>

            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[140px]">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block truncate">
                  {elderlyCareCohort?.cohortName || "Elderly Care"}
                </span>
                <h3 className="text-2xl font-serif font-bold text-slate-800 mt-2">
                  {(elderlyCareCohort?.totalCitizens || 0).toLocaleString()}
                </h3>
              </div>
              <span className="text-[9px] font-mono text-slate-400">
                {elderlyCareCohort && elderlyCareCohort.minAge != null
                  ? `Ages ${elderlyCareCohort.minAge}+ Cohort`
                  : "Ages 61+ Cohort"}
              </span>
            </div>
          </div>
        </>
      )}

      {/* ================= BOTTOM CITIZEN DATA TABLE ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-slate-800">
              Pension & Retirement Citizen Registry
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {data?.totalElements ? `${data.totalElements.toLocaleString()} citizens tracked` : ""}
          </span>
        </div>

        {/* Filter Bar */}
        <DomainFilterBar
          domain="pension"
          filters={filters}
          onFilterChange={onFilterChange}
          onResetFilters={onResetFilters}
        />

        {/* Paginated Data Table */}
        <DomainDataTable
          domain="pension"
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
      <PensionDetailDrawer
        citizenCode={selectedCitizenCode}
        isOpen={!!selectedCitizenCode}
        onClose={() => setSelectedCitizenCode(null)}
      />
    </div>
  );
}
