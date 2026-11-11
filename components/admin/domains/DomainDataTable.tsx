"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ExternalLink,
  SlidersHorizontal,
  X,
  AlertCircle,
  GraduationCap,
  Activity,
  Briefcase,
  Heart,
} from "lucide-react";
import type { DomainCitizenRecord, PagedResult } from "@/lib/types/domainCitizens";
import { exportDomainCitizensCsv } from "@/lib/services/domainCitizenService";

interface ColumnDef {
  id: string;
  label: string;
  defaultVisible: boolean;
}

interface DomainDataTableProps {
  domain: "education" | "health" | "hr" | "pension";
  data: PagedResult<DomainCitizenRecord> | undefined;
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSelectCitizen: (citizenCode: string) => void;
  onResetFilters?: () => void;
}

export function DomainDataTable({
  domain,
  data,
  isLoading,
  searchQuery,
  onSearchChange,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSelectCitizen,
  onResetFilters,
}: DomainDataTableProps) {
  const [searchInput, setSearchInput] = useState(searchQuery || "");
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== searchQuery) {
        onSearchChange(searchInput);
      }
    }, 350);
    return () => clearTimeout(handler);
  }, [searchInput, searchQuery, onSearchChange]);

  // Sync internal input when parent search query changes
  useEffect(() => {
    setSearchInput(searchQuery || "");
  }, [searchQuery]);

  // Define domain-specific columns
  const getDomainColumns = (): ColumnDef[] => {
    switch (domain) {
      case "education":
        return [
          { id: "code", label: "Citizen Code", defaultVisible: true },
          { id: "name", label: "Full Name", defaultVisible: true },
          { id: "demographics", label: "Age / Gender", defaultVisible: true },
          { id: "eduLevel", label: "Academic Level", defaultVisible: true },
          { id: "institution", label: "Institution / School", defaultVisible: true },
          { id: "classGrade", label: "Class / Grade", defaultVisible: true },
          { id: "qualification", label: "Qualification", defaultVisible: false },
          { id: "location", label: "State / LGA", defaultVisible: true },
          { id: "actions", label: "Actions", defaultVisible: true },
        ];
      case "health":
        return [
          { id: "code", label: "Citizen Code", defaultVisible: true },
          { id: "name", label: "Full Name", defaultVisible: true },
          { id: "demographics", label: "Age / Gender", defaultVisible: true },
          { id: "pregnancy", label: "Pregnancy / ANC", defaultVisible: true },
          { id: "hmo", label: "HMO Coverage", defaultVisible: true },
          { id: "blood", label: "Blood / Genotype", defaultVisible: true },
          { id: "chronic", label: "Chronic Illness", defaultVisible: true },
          { id: "location", label: "State / LGA", defaultVisible: false },
          { id: "actions", label: "Actions", defaultVisible: true },
        ];
      case "hr":
        return [
          { id: "code", label: "Citizen Code", defaultVisible: true },
          { id: "name", label: "Full Name", defaultVisible: true },
          { id: "demographics", label: "Age / Gender", defaultVisible: true },
          { id: "track", label: "Employment Track", defaultVisible: true },
          { id: "employer", label: "Employer / Business", defaultVisible: true },
          { id: "cac", label: "CAC Status", defaultVisible: true },
          { id: "vocation", label: "Vocational Skill", defaultVisible: false },
          { id: "nextStep", label: "Intervention Plan", defaultVisible: true },
          { id: "actions", label: "Actions", defaultVisible: true },
        ];
      case "pension":
        return [
          { id: "code", label: "Citizen Code", defaultVisible: true },
          { id: "name", label: "Full Name", defaultVisible: true },
          { id: "demographics", label: "Age / Gender", defaultVisible: true },
          { id: "retirement", label: "Retirement Status", defaultVisible: true },
          { id: "pensionProvider", label: "PFA Provider", defaultVisible: true },
          { id: "pin", label: "CPS PIN", defaultVisible: true },
          { id: "disbursement", label: "Disbursement", defaultVisible: true },
          { id: "careHome", label: "Care Home Placement", defaultVisible: true },
          { id: "actions", label: "Actions", defaultVisible: true },
        ];
      default:
        return [
          { id: "code", label: "Citizen Code", defaultVisible: true },
          { id: "name", label: "Full Name", defaultVisible: true },
          { id: "demographics", label: "Age / Gender", defaultVisible: true },
          { id: "location", label: "State / LGA", defaultVisible: true },
          { id: "actions", label: "Actions", defaultVisible: true },
        ];
    }
  };

  const domainColumns = getDomainColumns();
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    domainColumns.forEach((col) => {
      initial[col.id] = col.defaultVisible;
    });
    return initial;
  });

  const toggleColumn = (colId: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [colId]: !prev[colId],
    }));
  };

  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 0;
  const records = data?.content || [];
  const startRow = totalElements > 0 ? page * pageSize + 1 : 0;
  const endRow = Math.min((page + 1) * pageSize, totalElements);

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden flex flex-col">
      {/* Top Search, Column Visibility & Export Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-150 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={
              domain === "education"
                ? "Search by citizen code, name, or school..."
                : domain === "health"
                ? "Search by citizen code, name..."
                : domain === "hr"
                ? "Search by code, employer, business name..."
                : "Search by citizen code, name, PFA..."
            }
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("");
                onSearchChange("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Column Visibility Menu */}
          <div className="relative">
            <button
              onClick={() => setShowColumnMenu(!showColumnMenu)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-mono transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>Columns</span>
            </button>

            {showColumnMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowColumnMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-30 space-y-2 text-xs font-mono">
                  <div className="font-bold text-[10px] text-slate-400 uppercase tracking-wider px-1">
                    Toggle Columns
                  </div>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto">
                    {domainColumns.map((col) => (
                      <label
                        key={col.id}
                        className="flex items-center gap-2 px-1 py-1 hover:bg-slate-50 rounded-lg cursor-pointer text-slate-700"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns[col.id] !== false}
                          onChange={() => toggleColumn(col.id)}
                          className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                        />
                        <span>{col.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* CSV Export */}
          <button
            onClick={() => exportDomainCitizensCsv(domain, records)}
            disabled={records.length === 0 || isLoading}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-black disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200/90 bg-slate-50/70 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider select-none">
              {domainColumns.map(
                (col) =>
                  visibleColumns[col.id] !== false && (
                    <th key={col.id} className="py-3.5 px-4 font-bold whitespace-nowrap">
                      {col.label}
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  {domainColumns.map(
                    (col) =>
                      visibleColumns[col.id] !== false && (
                        <td key={col.id} className="py-4 px-4">
                          <div className="h-4 bg-slate-200/60 rounded-md w-24" />
                        </td>
                      )
                  )}
                </tr>
              ))
            ) : records.length === 0 ? (
              // Empty State
              <tr>
                <td
                  colSpan={domainColumns.filter((c) => visibleColumns[c.id] !== false).length}
                  className="py-16 text-center"
                >
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-800">No citizens found</h4>
                      <p className="text-xs text-slate-500">
                        {searchQuery
                          ? `No matches for "${searchQuery}". Try broadening your search or resetting filters.`
                          : "No citizen records match the selected domain filters."}
                      </p>
                    </div>
                    {onResetFilters && (
                      <button
                        onClick={onResetFilters}
                        className="px-3.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              records.map((citizen) => (
                <tr
                  key={citizen.citizenCode}
                  onClick={() => onSelectCitizen(citizen.citizenCode)}
                  className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                >
                  {/* CITIZEN CODE */}
                  {visibleColumns["code"] !== false && (
                    <td className="py-3 px-4 font-mono font-semibold text-blue-600 whitespace-nowrap">
                      {citizen.citizenCode}
                    </td>
                  )}

                  {/* FULL NAME */}
                  {visibleColumns["name"] !== false && (
                    <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                      {citizen.fullName}
                    </td>
                  )}

                  {/* DEMOGRAPHICS (Age / Gender) */}
                  {visibleColumns["demographics"] !== false && (
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      <span className="font-mono">{citizen.age} yrs</span>
                      <span className="mx-1.5 text-slate-300">•</span>
                      <span className="capitalize">{citizen.gender?.toLowerCase()}</span>
                    </td>
                  )}

                  {/* ================= EDUCATION COLS ================= */}
                  {domain === "education" && visibleColumns["eduLevel"] !== false && (
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-mono font-medium">
                        {citizen.educationalLevel || "Unspecified"}
                      </span>
                    </td>
                  )}
                  {domain === "education" && visibleColumns["institution"] !== false && (
                    <td className="py-3 px-4 text-slate-700 max-w-[200px] truncate">
                      {citizen.institutionName || "—"}
                    </td>
                  )}
                  {domain === "education" && visibleColumns["classGrade"] !== false && (
                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {citizen.currentClassGrade || "—"}
                    </td>
                  )}
                  {domain === "education" && visibleColumns["qualification"] !== false && (
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {citizen.highestAcademicQualification || "—"}
                    </td>
                  )}

                  {/* ================= HEALTH COLS ================= */}
                  {domain === "health" && visibleColumns["pregnancy"] !== false && (
                    <td className="py-3 px-4 whitespace-nowrap">
                      {citizen.isPregnant ? (
                        <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-[11px] font-mono font-medium">
                          ANC Enrolled
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">Not Pregnant</span>
                      )}
                    </td>
                  )}
                  {domain === "health" && visibleColumns["hmo"] !== false && (
                    <td className="py-3 px-4 whitespace-nowrap">
                      {citizen.hasHmo ? (
                        <div className="flex flex-col">
                          <span className="text-emerald-700 font-medium text-[11px]">Enrolled</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {citizen.hmoProviderName || "Active"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">Uncovered</span>
                      )}
                    </td>
                  )}
                  {domain === "health" && visibleColumns["blood"] !== false && (
                    <td className="py-3 px-4 font-mono whitespace-nowrap">
                      <span className="text-rose-600 font-semibold">{citizen.bloodGroup || "—"}</span>
                      <span className="mx-1 text-slate-300">/</span>
                      <span className="text-amber-600 font-semibold">{citizen.bloodGenotype || "—"}</span>
                    </td>
                  )}
                  {domain === "health" && visibleColumns["chronic"] !== false && (
                    <td className="py-3 px-4 whitespace-nowrap">
                      {citizen.chronicCondition ? (
                        <span className="px-2.5 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px] font-mono font-bold">
                          CHRONIC WATCH
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-mono">None</span>
                      )}
                    </td>
                  )}

                  {/* ================= HR & JOBS COLS ================= */}
                  {domain === "hr" && visibleColumns["track"] !== false && (
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium uppercase ${
                          citizen.employmentTrack === "employed"
                            ? "bg-emerald-50 text-emerald-700"
                            : citizen.employmentTrack === "business"
                            ? "bg-indigo-50 text-indigo-700"
                            : citizen.employmentTrack === "vocational"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {citizen.employmentTrack || "UNSPECIFIED"}
                      </span>
                    </td>
                  )}
                  {domain === "hr" && visibleColumns["employer"] !== false && (
                    <td className="py-3 px-4 max-w-[200px] truncate text-slate-800 font-medium">
                      {citizen.employerName || citizen.businessName || "—"}
                    </td>
                  )}
                  {domain === "hr" && visibleColumns["cac"] !== false && (
                    <td className="py-3 px-4 whitespace-nowrap">
                      {citizen.isCacRegistered ? (
                        <span className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded-md text-[10px] font-mono font-bold">
                          CAC {citizen.cacRegistrationNumber || "REG"}
                        </span>
                      ) : citizen.hasBusiness ? (
                        <span className="text-slate-400 text-[10px] font-mono">Unregistered</span>
                      ) : (
                        <span className="text-slate-300 text-[10px] font-mono">—</span>
                      )}
                    </td>
                  )}
                  {domain === "hr" && visibleColumns["vocation"] !== false && (
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {citizen.tradeSkillKind || "—"}
                    </td>
                  )}
                  {domain === "hr" && visibleColumns["nextStep"] !== false && (
                    <td className="py-3 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                      {citizen.desiredNextStep ? citizen.desiredNextStep.replace(/_/g, " ") : "—"}
                    </td>
                  )}

                  {/* ================= PENSION COLS ================= */}
                  {domain === "pension" && visibleColumns["retirement"] !== false && (
                    <td className="py-3 px-4 whitespace-nowrap">
                      {citizen.isRetired ? (
                        <span className="px-2.5 py-1 bg-violet-50 text-violet-700 rounded-lg text-[11px] font-mono font-medium">
                          Retired
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-mono">Pre-Retirement</span>
                      )}
                    </td>
                  )}
                  {domain === "pension" && visibleColumns["pensionProvider"] !== false && (
                    <td className="py-3 px-4 text-slate-700 max-w-[180px] truncate whitespace-nowrap">
                      {citizen.pensionProviderName || "—"}
                    </td>
                  )}
                  {domain === "pension" && visibleColumns["pin"] !== false && (
                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {citizen.cpsPensionPin || "—"}
                    </td>
                  )}
                  {domain === "pension" && visibleColumns["disbursement"] !== false && (
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          citizen.disbursementStatus === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : citizen.disbursementStatus === "PENDING"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {citizen.disbursementStatus || "NOT_ENROLLED"}
                      </span>
                    </td>
                  )}
                  {domain === "pension" && visibleColumns["careHome"] !== false && (
                    <td className="py-3 px-4 whitespace-nowrap">
                      {citizen.interestedInAdultCareHome ? (
                        <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg text-[10px] font-mono font-bold">
                          CARE HOME PLACEMENT
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-mono">None</span>
                      )}
                    </td>
                  )}

                  {/* LOCATION (State / LGA) */}
                  {visibleColumns["location"] !== false && (
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      <span>{citizen.stateOfResidence || citizen.stateOfOrigin}</span>
                      <span className="text-slate-400 text-[10px] block">
                        {citizen.residenceLga || citizen.lga}
                      </span>
                    </td>
                  )}

                  {/* ACTIONS */}
                  {visibleColumns["actions"] !== false && (
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCitizen(citizen.citizenCode);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 hover:bg-blue-600 text-slate-600 hover:text-white rounded-lg text-xs font-mono transition-all cursor-pointer shadow-2xs group-hover:bg-blue-600 group-hover:text-white"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-150 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500">
        <div className="flex items-center gap-3">
          <span>
            Showing <strong className="text-slate-800">{startRow}</strong> to{" "}
            <strong className="text-slate-800">{endRow}</strong> of{" "}
            <strong className="text-slate-800">{totalElements.toLocaleString()}</strong> citizens
          </span>

          <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-700 cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Page Nav Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 0 || isLoading}
            className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800">
            {page + 1} / {Math.max(1, totalPages)}
          </span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1 || isLoading}
            className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

