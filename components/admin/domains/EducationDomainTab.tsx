"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Database, GraduationCap } from "lucide-react";
import { WidgetPanel } from "@/components/admin/dashboard/WidgetPanel";
import { DomainFilterBar } from "./DomainFilterBar";
import { DomainDataTable } from "./DomainDataTable";
import { EducationDetailDrawer } from "./drawer/EducationDetailDrawer";
import { useDomainCitizens } from "@/lib/hooks/useDomainCitizens";
import type { DomainFilterParams } from "@/lib/types/domainCitizens";
import type { AnalyticsSummaryDto } from "@/lib/types/citieye";

interface EducationDomainTabProps {
  summary: AnalyticsSummaryDto | null | undefined;
  filters: DomainFilterParams;
  onFilterChange: (key: keyof DomainFilterParams, value: any) => void;
  onResetFilters: () => void;
}

export function EducationDomainTab({
  summary,
  filters,
  onFilterChange,
  onResetFilters,
}: EducationDomainTabProps) {
  const [selectedCitizenCode, setSelectedCitizenCode] = useState<string | null>(null);

  // Fetch paginated domain citizens
  const { data, isLoading } = useDomainCitizens({
    ...filters,
    domain: "education",
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
                  Foundational Education
                </span>
                <h3 className="text-2xl font-serif font-bold text-slate-800 mt-2">
                  {(
                    summary.byCohort.find((c: any) => c.cohortName.toLowerCase().includes("foundational"))
                      ?.totalCitizens || 0
                  ).toLocaleString()}
                </h3>
              </div>
              <span className="text-[9px] font-mono text-slate-400">Ages 6 - 11 Cohort</span>
            </div>

            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[140px]">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block">
                  Secondary Education
                </span>
                <h3 className="text-2xl font-serif font-bold text-slate-800 mt-2">
                  {(
                    summary.byCohort.find((c: any) => c.cohortName.toLowerCase().includes("secondary"))
                      ?.totalCitizens || 0
                  ).toLocaleString()}
                </h3>
              </div>
              <span className="text-[9px] font-mono text-slate-400">Ages 12 - 18 Cohort</span>
            </div>

            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[140px]">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block">
                  Higher Education
                </span>
                <h3 className="text-2xl font-serif font-bold text-slate-800 mt-2">
                  {(
                    summary.byCohort.find((c: any) => c.cohortName.toLowerCase().includes("higher"))
                      ?.totalCitizens || 0
                  ).toLocaleString()}
                </h3>
              </div>
              <span className="text-[9px] font-mono text-slate-400">Ages 19 - 26 Cohort</span>
            </div>
          </div>

          <WidgetPanel
            title="Education Milestones & Enrollment Rates"
            icon={Database}
            className="h-[320px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    name: "Foundational",
                    Total:
                      summary.byCohort.find((c: any) =>
                        c.cohortName.toLowerCase().includes("foundational")
                      )?.totalCitizens || 0,
                    Completed:
                      summary.byCohort.find((c: any) =>
                        c.cohortName.toLowerCase().includes("foundational")
                      )?.citizensWithAnyMilestoneCompleted || 0,
                  },
                  {
                    name: "Secondary",
                    Total:
                      summary.byCohort.find((c: any) =>
                        c.cohortName.toLowerCase().includes("secondary")
                      )?.totalCitizens || 0,
                    Completed:
                      summary.byCohort.find((c: any) =>
                        c.cohortName.toLowerCase().includes("secondary")
                      )?.citizensWithAnyMilestoneCompleted || 0,
                  },
                  {
                    name: "Higher Ed",
                    Total:
                      summary.byCohort.find((c: any) =>
                        c.cohortName.toLowerCase().includes("higher")
                      )?.totalCitizens || 0,
                    Completed:
                      summary.byCohort.find((c: any) =>
                        c.cohortName.toLowerCase().includes("higher")
                      )?.citizensWithAnyMilestoneCompleted || 0,
                  },
                ]}
                margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderColor: "#e2e8f0",
                    borderRadius: 12,
                    fontSize: 10,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar name="Total Enrolled" dataKey="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar name="Milestones Met" dataKey="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </WidgetPanel>
        </>
      )}

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
