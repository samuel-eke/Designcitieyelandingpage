"use client";

import React, { useState } from "react";
import { Activity, Heart, Shield, Baby } from "lucide-react";
import { DomainFilterBar } from "./DomainFilterBar";
import { DomainDataTable } from "./DomainDataTable";
import { HealthDetailDrawer } from "./drawer/HealthDetailDrawer";
import { useDomainCitizens } from "@/lib/hooks/useDomainCitizens";
import type { DomainFilterParams } from "@/lib/types/domainCitizens";
import type { AnalyticsSummaryDto } from "@/lib/types/citieye";

interface HealthDomainTabProps {
  summary: AnalyticsSummaryDto | null | undefined;
  filters: DomainFilterParams;
  onFilterChange: (key: keyof DomainFilterParams, value: any) => void;
  onResetFilters: () => void;
}

export function HealthDomainTab({
  summary,
  filters,
  onFilterChange,
  onResetFilters,
}: HealthDomainTabProps) {
  const [selectedCitizenCode, setSelectedCitizenCode] = useState<string | null>(null);

  const { data, isLoading } = useDomainCitizens({
    ...filters,
    domain: "health",
  });

  const vaccinationRatePercent = summary?.healthIndicators.totalCitizensProfiled
    ? Math.round(
        (summary.healthIndicators.vaccinationComplete /
          summary.healthIndicators.totalCitizensProfiled) *
          100
      )
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ================= TOP METRICS SECTION ================= */}
      {summary && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* NHIS Enrollment Card */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">
                    NHIS Coverage
                  </span>
                  <Shield className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-bold text-slate-800">
                    {summary.healthIndicators.nhisEnrolledCount.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    / {summary.healthIndicators.totalCitizensProfiled.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2 font-light">
                  Citizens enrolled in National Health Insurance Schemes.
                </p>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/40 mt-4">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round(
                      (summary.healthIndicators.nhisEnrolledCount /
                        (summary.healthIndicators.totalCitizensProfiled || 1)) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Maternal & Child Health Card */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">
                    Maternal & Child Health
                  </span>
                  <Baby className="w-4 h-4 text-purple-500" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-mono">Pregnant Count:</span>
                    <span className="font-bold text-rose-600 font-mono">
                      {summary.healthIndicators.pregnantCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-mono">Expectant Parents:</span>
                    <span className="font-bold text-slate-800 font-mono">
                      {summary.healthIndicators.expectantParents}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-mono">Completed Vaccinations:</span>
                    <span className="font-bold text-emerald-600 font-mono">
                      {summary.healthIndicators.vaccinationComplete}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/40 mt-4">
                <div
                  className="bg-purple-500 h-full rounded-full"
                  style={{
                    width: `${vaccinationRatePercent}%`,
                  }}
                />
              </div>
            </div>

            {/* Special Care Registry Card */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">
                    Special Care Registry
                  </span>
                  <Heart className="w-4 h-4 text-rose-500" />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div>
                    <span className="text-[9px] text-slate-400 font-mono block">CARDIAC REGISTRY</span>
                    <span className="text-2xl font-bold text-rose-500">
                      {summary.healthIndicators.hypertensionDiabetesCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-mono block">GENOTYPE LOGS</span>
                    <span className="text-2xl font-bold text-amber-500">
                      {summary.healthIndicators.bloodGroupRecorded}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2 font-light">
                  Active chronic monitoring watch for{" "}
                  <span className="text-rose-500 font-bold font-mono">
                    {summary.healthIndicators.chronicIllnessCount}
                  </span>{" "}
                  citizens.
                </p>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/40 mt-4">
                <div
                  className="bg-rose-500 h-full rounded-full"
                  style={{
                    width: `${Math.round(
                      (summary.healthIndicators.chronicIllnessCount /
                        (summary.healthIndicators.totalCitizensProfiled || 1)) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Welfare Quality Report */}
          <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center gap-2 select-none">
              <Heart className="w-4 h-4 text-rose-500" />
              <h4 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-widest">
                Welfare Profiling Quality Report
              </h4>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Welfare metrics are reconciled against primary healthcare records, local government clinics, and field-officer logs.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono border-t border-slate-100 pt-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold">TOTAL PROFILED:</span>
                <span className="font-bold text-slate-800">
                  {summary.healthIndicators.totalCitizensProfiled}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold">IMMUNIZATION RATE:</span>
                <span className="font-bold text-emerald-600">{vaccinationRatePercent}%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold">CHRONIC WATCH:</span>
                <span className="font-bold text-rose-500">
                  {summary.healthIndicators.chronicIllnessCount}
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
            <Activity className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-slate-800">
              Health Registry, ANC & Clinical Records
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {data?.totalElements ? `${data.totalElements.toLocaleString()} citizens profiled` : ""}
          </span>
        </div>

        {/* Filter Bar */}
        <DomainFilterBar
          domain="health"
          filters={filters}
          onFilterChange={onFilterChange}
          onResetFilters={onResetFilters}
        />

        {/* Paginated Data Table */}
        <DomainDataTable
          domain="health"
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
      <HealthDetailDrawer
        citizenCode={selectedCitizenCode}
        isOpen={!!selectedCitizenCode}
        onClose={() => setSelectedCitizenCode(null)}
      />
    </div>
  );
}
