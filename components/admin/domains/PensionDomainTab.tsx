"use client";

import React, { useState } from "react";
import { Heart, Shield, Home, Clock } from "lucide-react";
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ================= TOP METRICS SECTION ================= */}
      {summary && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[140px]">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block">
                  Pre-Retirement
                </span>
                <h3 className="text-2xl font-serif font-bold text-slate-800 mt-2">
                  {(
                    summary.byCohort.find((c: any) =>
                      c.cohortName.toLowerCase().includes("pre-retirement")
                    )?.totalCitizens || 0
                  ).toLocaleString()}
                </h3>
              </div>
              <span className="text-[9px] font-mono text-slate-400">Ages 49 - 54 Cohort</span>
            </div>

            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[140px]">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block">
                  Active Aging
                </span>
                <h3 className="text-2xl font-serif font-bold text-slate-800 mt-2">
                  {(
                    summary.byCohort.find((c: any) =>
                      c.cohortName.toLowerCase().includes("active aging")
                    )?.totalCitizens || 0
                  ).toLocaleString()}
                </h3>
              </div>
              <span className="text-[9px] font-mono text-slate-400">Ages 55 - 60 Cohort</span>
            </div>

            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[140px]">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block">
                  Elderly Care
                </span>
                <h3 className="text-2xl font-serif font-bold text-slate-800 mt-2">
                  {(
                    summary.byCohort.find((c: any) =>
                      c.cohortName.toLowerCase().includes("elderly care")
                    )?.totalCitizens || 0
                  ).toLocaleString()}
                </h3>
              </div>
              <span className="text-[9px] font-mono text-slate-400">Ages 61+ Cohort</span>
            </div>
          </div>

          {/* Senior Citizen Social Welfare & Adult Care Home Banner */}
          <div className="bg-rose-50/60 border border-rose-200/80 p-6 rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 select-none">
                <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-mono font-bold text-rose-950 uppercase tracking-widest">
                    Senior Welfare: State Adult Care Home Placement
                  </h4>
                  <p className="text-xs text-rose-700 font-sans mt-0.5">
                    Priority social welfare interventions for vulnerable and retired seniors requiring residential care.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-700 bg-rose-100/90 px-3 py-1 rounded-full border border-rose-200">
                PRD Module 3.2 Track E
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 bg-white border border-rose-150 rounded-2xl flex flex-col justify-between">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Active Aging (55-60)</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold text-slate-800">
                    {(
                      summary.byCohort.find((c: any) =>
                        c.cohortName.toLowerCase().includes("active aging")
                      )?.totalCitizens || 0
                    ).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400">citizens</span>
                </div>
                <span className="text-[9px] text-emerald-600 mt-2 font-sans font-medium">
                  Eligible for Pre-Placement Assessment
                </span>
              </div>

              <div className="p-4 bg-white border border-rose-150 rounded-2xl flex flex-col justify-between">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Elderly Care (61+)</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold text-rose-700">
                    {(
                      summary.byCohort.find((c: any) =>
                        c.cohortName.toLowerCase().includes("elderly care")
                      )?.totalCitizens || 0
                    ).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400">citizens</span>
                </div>
                <span className="text-[9px] text-rose-600 mt-2 font-sans font-medium">
                  High Priority Social Care Cohort
                </span>
              </div>

              <div className="p-4 bg-white border border-rose-150 rounded-2xl flex flex-col justify-between">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Pension Coverage (NHIS)</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold text-emerald-600">
                    {summary.healthIndicators.nhisSeniorPlanCount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400">enrolled</span>
                </div>
                <span className="text-[9px] text-slate-500 mt-2 font-sans font-medium">
                  State Medical Plan Backed
                </span>
              </div>
            </div>
          </div>

          {/* NHIS Senior Plan Enrolment */}
          <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center gap-2 select-none">
              <Heart className="w-5 h-5 text-red-500" />
              <h4 className="text-sm font-mono font-bold text-slate-800 uppercase tracking-widest">
                Elderly Medical Senior Plan Enrolment
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono">
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex justify-between items-center">
                <span className="text-slate-400">NHIS SENIOR PLAN ACTIVE:</span>
                <span className="text-xl font-bold text-emerald-600">
                  {summary.healthIndicators.nhisSeniorPlanCount.toLocaleString()}
                </span>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex justify-between items-center">
                <span className="text-slate-400">ELDERLY VACCINATIONS RECORDED:</span>
                <span className="text-xl font-bold text-blue-600">
                  {summary.healthIndicators.vaccinationComplete.toLocaleString()}
                </span>
              </div>
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
              Pension Registry & Care Home Placement Candidates
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
