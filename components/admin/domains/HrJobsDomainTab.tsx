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
import { Briefcase, Building, TrendingUp } from "lucide-react";
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ================= TOP METRICS SECTION ================= */}
      {summary && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[140px]">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block">
                  Employed Citizens
                </span>
                <h3 className="text-2xl font-serif font-bold text-slate-800 mt-2">
                  {summary.byEmploymentStatus
                    .filter((e: any) => e.employmentStatus === "employed")
                    .reduce((acc: number, curr: any) => acc + curr.citizenCount, 0)
                    .toLocaleString()}
                </h3>
              </div>
              <span className="text-[9px] font-mono text-slate-400">Formal & Contract employment</span>
            </div>

            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[140px]">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block">
                  Enterprise & Business Owners
                </span>
                <h3 className="text-2xl font-serif font-bold text-slate-800 mt-2">
                  {summary.byEmploymentStatus
                    .filter((e: any) => e.employmentStatus === "business_owner")
                    .reduce((acc: number, curr: any) => acc + curr.citizenCount, 0)
                    .toLocaleString()}
                </h3>
              </div>
              <span className="text-[9px] font-mono text-slate-400">Self-employed & SMEs (CAC)</span>
            </div>

            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[140px]">
              <div>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block">
                  Unemployed Citizens
                </span>
                <h3 className="text-2xl font-serif font-bold text-slate-800 mt-2">
                  {summary.byEmploymentStatus
                    .filter((e: any) => e.employmentStatus === "unemployed")
                    .reduce((acc: number, curr: any) => acc + curr.citizenCount, 0)
                    .toLocaleString()}
                </h3>
              </div>
              <span className="text-[9px] font-mono text-slate-400">Actively seeking opportunities</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WidgetPanel
              title="Employment Sector Distribution"
              icon={Briefcase}
              className="h-[320px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(
                    summary.byEmploymentStatus.reduce((acc: Record<string, number>, curr: any) => {
                      const sector = curr.industrySector || "unspecified";
                      acc[sector] = (acc[sector] || 0) + curr.citizenCount;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([sector, count]) => ({
                    sector: sector.charAt(0).toUpperCase() + sector.slice(1).replace("_", " "),
                    Count: count,
                  }))}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="sector" stroke="#94a3b8" fontSize={10} angle={-15} textAnchor="end" />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e2e8f0",
                      borderRadius: 12,
                      fontSize: 10,
                    }}
                  />
                  <Bar dataKey="Count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </WidgetPanel>

            <WidgetPanel
              title="Monthly Income Range Breakdown"
              icon={TrendingUp}
              className="h-[320px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(
                    summary.byEmploymentStatus.reduce((acc: Record<string, number>, curr: any) => {
                      const bracket = curr.monthlyIncomeRange || "unspecified";
                      acc[bracket] = (acc[bracket] || 0) + curr.citizenCount;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([range, count]) => ({
                    range: range.toUpperCase(),
                    Citizens: count,
                  }))}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="range" stroke="#94a3b8" fontSize={9} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderColor: "#e2e8f0",
                      borderRadius: 12,
                      fontSize: 10,
                    }}
                  />
                  <Bar dataKey="Citizens" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </WidgetPanel>
          </div>

          {/* Consolidated Business Affairs / SME Classification Summary */}
          <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 select-none">
                <Building className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-widest">
                  Enterprise Classification & SME Sector Profile
                </h4>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                Business Affairs Module
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold">Industry Sector</th>
                    <th className="py-3 px-4 font-bold">Monthly Income Range</th>
                    <th className="py-3 px-4 font-bold">Employment Status</th>
                    <th className="py-3 px-4 font-bold text-right">Profiled SMEs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {summary.byEmploymentStatus
                    .filter((e: any) => e.employmentStatus === "business_owner")
                    .map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/40">
                        <td className="py-2.5 px-4 font-semibold text-slate-800">
                          {item.industrySector
                            ? item.industrySector.replace("_", " ").toUpperCase()
                            : "GENERAL RETAIL / COMMERCE"}
                        </td>
                        <td className="py-2.5 px-4 font-mono">{item.monthlyIncomeRange || "N/A"}</td>
                        <td className="py-2.5 px-4 uppercase font-mono text-[9px] text-slate-400">
                          {item.employmentStatus}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-indigo-600">
                          {item.citizenCount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ================= BOTTOM CITIZEN DATA TABLE ================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-800">
              Workforce, SME & Economic Profile Registry
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
