"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Heart,
  Shield,
  Home,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Loader2,
  FileCheck,
  Building2,
} from "lucide-react";
import { useAdminCitizenLifecycle } from "@/lib/hooks/useAdminCitizenLifecycle";

interface PensionDetailDrawerProps {
  citizenCode: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PensionDetailDrawer({
  citizenCode,
  isOpen,
  onClose,
}: PensionDetailDrawerProps) {
  const { data: profile, isLoading } = useAdminCitizenLifecycle(citizenCode);

  if (!citizenCode) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl md:max-w-3xl overflow-y-auto bg-slate-50/50 p-0 border-l border-slate-200"
      >
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-6 sticky top-0 z-10">
          <SheetHeader className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                <Heart className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-mono text-rose-600 font-bold uppercase tracking-widest">
                  Pension & Senior Citizen Social Welfare
                </span>
                <SheetTitle className="text-xl font-bold text-slate-900">
                  {profile?.fullName || "Pension & Welfare Record"}
                </SheetTitle>
              </div>
            </div>
            <SheetDescription className="font-mono text-xs text-slate-500 flex flex-wrap items-center gap-3 pt-1">
              <span className="text-blue-600 font-semibold">{citizenCode}</span>
              <span>•</span>
              <span>{profile?.age ? `${profile.age} yrs` : "Age N/A"}</span>
              <span>•</span>
              <span className="capitalize">{profile?.gender?.toLowerCase() || "Gender N/A"}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {profile?.stateOfResidence || profile?.stateOfOrigin || "State N/A"}
              </span>
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
              <span className="text-xs font-mono text-slate-500">Loading pension records...</span>
            </div>
          ) : (
            <>
              {/* Senior Care Home Facility Placement (Track E Alert) */}
              <div
                className={`p-5 rounded-2xl border shadow-xs space-y-3 ${
                  profile?.interestedInAdultCareHome
                    ? "bg-rose-50/70 border-rose-200/90"
                    : "bg-slate-50/80 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-xl ${
                        profile?.interestedInAdultCareHome
                          ? "bg-rose-100 text-rose-600"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <h4
                        className={`text-xs font-mono font-bold uppercase tracking-wider ${
                          profile?.interestedInAdultCareHome
                            ? "text-rose-950"
                            : "text-slate-800"
                        }`}
                      >
                        State Adult Care Home Placement Preference
                      </h4>
                      <span className="text-[10px] text-slate-500 font-sans block mt-0.5">
                        PRD Module 3.2 Track E — Residential Care Placement
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                      profile?.interestedInAdultCareHome
                        ? "bg-rose-600 text-white shadow-2xs"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {profile?.interestedInAdultCareHome
                      ? "HIGH PRIORITY PLACEMENT"
                      : "NO PLACEMENT REQUESTED"}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs">
                  {profile?.interestedInAdultCareHome ? (
                    <div className="space-y-1">
                      <div className="font-semibold text-rose-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-rose-600" />
                        Citizen has requested state residential adult care home placement.
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Eligible for senior placement evaluation, physical mobility assessment, and dedicated welfare officer follow-up.
                      </p>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-[11px]">
                      Citizen has not flagged residential adult care home needs. Standard active aging and pension administration apply.
                    </p>
                  )}
                </div>
              </div>

              {/* Pension Administration & Contributory Pension Scheme (CPS) */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Pension Fund Administration (PFA & CPS)
                  </h4>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold ${
                      profile?.isRetired
                        ? "bg-violet-50 text-violet-700 border border-violet-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {profile?.isRetired ? "RETIRED CITIZEN" : "ACTIVE CONTRIBUTOR"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">
                      Pension Fund Administrator (PFA)
                    </span>
                    <span className="text-slate-900 font-semibold mt-1 block">
                      {profile?.pensionProviderName || "No PFA Registered"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">
                      CPS Pension PIN (PenCom)
                    </span>
                    <span className="text-slate-900 font-semibold mt-1 block">
                      {profile?.pensionProviderName ? "PEN-ACTIVE" : "Not Provided"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">
                      Retirement Status
                    </span>
                    <span className="text-slate-900 font-semibold mt-1 block">
                      {profile?.isRetired ? "Officially Retired" : "Pre-Retirement / Active Workforce"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">
                      Welfare Disbursement Status
                    </span>
                    <span className="text-emerald-700 font-bold mt-1 block">
                      {profile?.isRetired && profile?.pensionProviderName
                        ? "ACTIVE DISBURSEMENT"
                        : profile?.pensionProviderName
                        ? "ACCUMULATION PHASE"
                        : "NOT ENROLLED"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Senior Health & Medical Protection */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    Healthcare & Senior Medical Plan
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    State NHIS Integration
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">
                      Senior Health Insurance (HMO)
                    </span>
                    <span className="text-slate-900 font-semibold mt-1 block">
                      {profile?.hasHmo
                        ? `${profile.hmoProviderName || "Active Senior HMO"}`
                        : "No Senior HMO Plan"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">
                      Dependents & Household Size
                    </span>
                    <span className="text-slate-900 font-semibold mt-1 block">
                      {profile?.numberOfChildren ? `${profile.numberOfChildren} children` : "None listed"}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

