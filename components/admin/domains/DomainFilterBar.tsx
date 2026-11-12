"use client";

import React from "react";
import { Filter, X, RotateCcw } from "lucide-react";
import type { DomainFilterParams } from "@/lib/types/domainCitizens";

interface FilterOption {
  label: string;
  value: string;
}

interface DomainFilterBarProps {
  domain: "education" | "health" | "hr" | "pension";
  filters: DomainFilterParams;
  onFilterChange: (key: keyof DomainFilterParams, value: any) => void;
  onResetFilters: () => void;
}

export function DomainFilterBar({
  domain,
  filters,
  onFilterChange,
  onResetFilters,
}: DomainFilterBarProps) {
  // Count active filters (excluding domain, page, size, and query)
  const activeCount = Object.entries(filters).filter(([key, val]) => {
    if (["domain", "page", "size", "query"].includes(key)) return false;
    return val !== undefined && val !== null && val !== "" && val !== "all";
  }).length;

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl p-4 shadow-2xs space-y-3">
      {/* Top Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-600 uppercase tracking-wider pr-2 border-r border-slate-200">
          <Filter className="w-3.5 h-3.5 text-blue-600" />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-mono leading-none">
              {activeCount}
            </span>
          )}
        </div>

        {/* ================= EDUCATION FILTERS ================= */}
        {domain === "education" && (
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filters.educationalLevel || ""}
              onChange={(e) => onFilterChange("educationalLevel", e.target.value || undefined)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All Academic Levels</option>
              <option value="Nursery">Students in Nursery Section</option>
              <option value="Primary">Primary</option>
              <option value="Secondary">Secondary</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="Not in school">Not in School</option>
              <option value="Vocational">Vocational / Technical</option>
            </select>
          </div>
        )}

        {/* ================= HEALTH FILTERS ================= */}
        {domain === "health" && (
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filters.isPregnant === undefined ? "" : String(filters.isPregnant)}
              onChange={(e) =>
                onFilterChange(
                  "isPregnant",
                  e.target.value === "" ? undefined : e.target.value === "true"
                )
              }
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All Pregnancy / ANC Status</option>
              <option value="true">Pregnant / ANC Enrolled</option>
              <option value="false">Not Pregnant</option>
            </select>

            <select
              value={filters.hasHmo === undefined ? "" : String(filters.hasHmo)}
              onChange={(e) =>
                onFilterChange(
                  "hasHmo",
                  e.target.value === "" ? undefined : e.target.value === "true"
                )
              }
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All HMO Status</option>
              <option value="true">HMO Enrolled</option>
              <option value="false">No HMO Coverage</option>
            </select>

            <select
              value={filters.bloodGroup || ""}
              onChange={(e) => onFilterChange("bloodGroup", e.target.value || undefined)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All Blood Groups</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>

            <select
              value={filters.bloodGenotype || ""}
              onChange={(e) => onFilterChange("bloodGenotype", e.target.value || undefined)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All Genotypes</option>
              <option value="AA">AA</option>
              <option value="AS">AS</option>
              <option value="SS">SS</option>
              <option value="AC">AC</option>
              <option value="SC">SC</option>
            </select>

            <select
              value={filters.chronicCondition === undefined ? "" : String(filters.chronicCondition)}
              onChange={(e) =>
                onFilterChange(
                  "chronicCondition",
                  e.target.value === "" ? undefined : e.target.value === "true"
                )
              }
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All Chronic Disease Status</option>
              <option value="true">On Chronic Disease Watch</option>
              <option value="false">No Chronic Disease Logged</option>
            </select>
          </div>
        )}

        {/* ================= JOBS & BUSINESS FILTERS ================= */}
        {domain === "hr" && (
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filters.employmentTrack || ""}
              onChange={(e) => onFilterChange("employmentTrack", e.target.value || undefined)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All Employment Tracks</option>
              <option value="employed">Employed (Full-time / Contract)</option>
              <option value="business">Doing Business (Enterprise / SME)</option>
              <option value="vocational">On Vocation (Apprenticeship)</option>
              <option value="unemployed">Unemployed (Job-Seeking)</option>
            </select>

            <select
              value={filters.cacStatus || ""}
              onChange={(e) => onFilterChange("cacStatus", e.target.value || undefined)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All CAC Status</option>
              <option value="registered">CAC Registered Business</option>
              <option value="unregistered">Unregistered Enterprise</option>
            </select>

            <select
              value={filters.unemployedDesiredNextStep || ""}
              onChange={(e) => onFilterChange("unemployedDesiredNextStep", e.target.value || undefined)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">Desired Intervention (Unemployed)</option>
              <option value="SEARCH_FOR_JOBS">Job Placement / Employment</option>
              <option value="FUNDS_FOR_BUSINESS">Business Capital / Grant</option>
              <option value="VOCATIONAL_SKILL_ACQUISITION">Vocational Skill Acquisition</option>
            </select>
          </div>
        )}

        {/* ================= PENSION FILTERS ================= */}
        {domain === "pension" && (
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filters.pensionStatus || ""}
              onChange={(e) => onFilterChange("pensionStatus", e.target.value || undefined)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All Pension Schemes</option>
              <option value="under_pension">Under Pension (Active PFA / CPS)</option>
              <option value="not_under_pension">Not Under Pension</option>
            </select>

            <select
              value={filters.isRetired === undefined ? "" : String(filters.isRetired)}
              onChange={(e) =>
                onFilterChange(
                  "isRetired",
                  e.target.value === "" ? undefined : e.target.value === "true"
                )
              }
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All Retirement Status</option>
              <option value="true">Retired Citizens</option>
              <option value="false">Active / Pre-Retirement</option>
            </select>

            <select
              value={
                filters.interestedInAdultCareHome === undefined
                  ? ""
                  : String(filters.interestedInAdultCareHome)
              }
              onChange={(e) =>
                onFilterChange(
                  "interestedInAdultCareHome",
                  e.target.value === "" ? undefined : e.target.value === "true"
                )
              }
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">Adult Care Home Preference</option>
              <option value="true">Interested in State Care Home</option>
              <option value="false">No Residential Care Requested</option>
            </select>
          </div>
        )}

        {/* General Gender filter */}
        <select
          value={filters.gender || ""}
          onChange={(e) => onFilterChange("gender", e.target.value || undefined)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        {/* Clear All Button */}
        {activeCount > 0 && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mr-1">
            Active:
          </span>

          {filters.educationalLevel && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-mono">
              Level: {filters.educationalLevel}
              <button
                onClick={() => onFilterChange("educationalLevel", undefined)}
                className="hover:text-blue-900 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.isPregnant !== undefined && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-[11px] font-mono">
              ANC: {filters.isPregnant ? "Pregnant" : "Not Pregnant"}
              <button
                onClick={() => onFilterChange("isPregnant", undefined)}
                className="hover:text-purple-900 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.hasHmo !== undefined && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-mono">
              HMO: {filters.hasHmo ? "Covered" : "Uncovered"}
              <button
                onClick={() => onFilterChange("hasHmo", undefined)}
                className="hover:text-emerald-900 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.bloodGroup && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 rounded-lg text-[11px] font-mono">
              Blood: {filters.bloodGroup}
              <button
                onClick={() => onFilterChange("bloodGroup", undefined)}
                className="hover:text-rose-900 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.bloodGenotype && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-[11px] font-mono">
              Genotype: {filters.bloodGenotype}
              <button
                onClick={() => onFilterChange("bloodGenotype", undefined)}
                className="hover:text-amber-900 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.chronicCondition !== undefined && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-[11px] font-mono">
              Chronic: {filters.chronicCondition ? "Yes" : "No"}
              <button
                onClick={() => onFilterChange("chronicCondition", undefined)}
                className="hover:text-red-900 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.employmentTrack && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[11px] font-mono">
              Track: {filters.employmentTrack.toUpperCase()}
              <button
                onClick={() => onFilterChange("employmentTrack", undefined)}
                className="hover:text-indigo-900 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.cacStatus && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg text-[11px] font-mono">
              CAC: {filters.cacStatus.toUpperCase()}
              <button
                onClick={() => onFilterChange("cacStatus", undefined)}
                className="hover:text-teal-900 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.unemployedDesiredNextStep && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-50 text-cyan-700 rounded-lg text-[11px] font-mono">
              Next Step: {filters.unemployedDesiredNextStep.replace(/_/g, " ")}
              <button
                onClick={() => onFilterChange("unemployedDesiredNextStep", undefined)}
                className="hover:text-cyan-900 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.pensionStatus && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-mono">
              Pension: {filters.pensionStatus === "under_pension" ? "Active Scheme" : "Not Enrolled"}
              <button
                onClick={() => onFilterChange("pensionStatus", undefined)}
                className="hover:text-emerald-900 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.isRetired !== undefined && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 text-violet-700 rounded-lg text-[11px] font-mono">
              Retirement: {filters.isRetired ? "Retired" : "Active"}
              <button
                onClick={() => onFilterChange("isRetired", undefined)}
                className="hover:text-violet-900 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.interestedInAdultCareHome !== undefined && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-700 rounded-lg text-[11px] font-mono">
              Care Home: {filters.interestedInAdultCareHome ? "Interested" : "None"}
              <button
                onClick={() => onFilterChange("interestedInAdultCareHome", undefined)}
                className="hover:text-rose-900 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.gender && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-mono">
              Gender: {filters.gender.toUpperCase()}
              <button
                onClick={() => onFilterChange("gender", undefined)}
                className="hover:text-slate-900 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

