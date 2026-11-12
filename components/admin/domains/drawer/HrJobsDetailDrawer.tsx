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
  Briefcase,
  Building,
  Wrench,
  TrendingUp,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { useAdminCitizenLifecycle } from "@/lib/hooks/useAdminCitizenLifecycle";

interface HrJobsDetailDrawerProps {
  citizenCode: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function HrJobsDetailDrawer({
  citizenCode,
  isOpen,
  onClose,
}: HrJobsDetailDrawerProps) {
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
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Briefcase className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-widest">
                  Jobs & Business Profile
                </span>
                <SheetTitle className="text-xl font-bold text-slate-900">
                  {profile?.fullName || "Economic Profile"}
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
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <span className="text-xs font-mono text-slate-500">Loading economic profile...</span>
            </div>
          ) : (
            <>
              {/* Formal Employment Details */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    Formal / Contract Employment
                  </h4>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold ${
                      profile?.isEmployed
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {profile?.isEmployed ? "EMPLOYED" : "NOT IN FORMAL EMPLOYMENT"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Employer Name</span>
                    <span className="text-slate-900 font-semibold mt-1 block">
                      {profile?.employerName || "N/A"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Employment Nature</span>
                    <span className="text-slate-900 font-semibold mt-1 block">
                      {profile?.natureOfEmployment || "N/A"}
                    </span>
                  </div>

                  {profile?.employerAddress && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 sm:col-span-2">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Employer Address</span>
                      <span className="text-slate-900 font-semibold mt-1 block">
                        {profile.employerAddress}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Enterprise & Business Ownership */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Building className="w-4 h-4 text-indigo-600" />
                    Business & Enterprise Ownership (CAC)
                  </h4>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold ${
                      profile?.isCacRegistered
                        ? "bg-teal-50 text-teal-700 border border-teal-200"
                        : profile?.hasBusiness
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {profile?.isCacRegistered
                      ? "CAC REGISTERED"
                      : profile?.hasBusiness
                      ? "UNREGISTERED SME"
                      : "NO ENTERPRISE"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Enterprise Name</span>
                    <span className="text-slate-900 font-semibold mt-1 block">
                      {profile?.businessName || "N/A"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Business Nature</span>
                    <span className="text-slate-900 font-semibold mt-1 block">
                      {profile?.businessNature || "N/A"}
                    </span>
                  </div>

                  {profile?.isCacRegistered && (
                    <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-200 sm:col-span-2 flex items-center justify-between">
                      <div>
                        <span className="text-teal-700 text-[10px] uppercase font-bold block">
                          Corporate Affairs Commission (CAC) Registration
                        </span>
                        <span className="text-teal-950 font-bold text-sm mt-0.5 block">
                          RC: {profile.cacRegistrationNumber || "VERIFIED"}
                        </span>
                      </div>
                      <BadgeCheck className="w-6 h-6 text-teal-600" />
                    </div>
                  )}
                </div>
              </div>

              {/* Vocational Skills & Apprenticeship */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-amber-600" />
                    Vocational Skills & Trade Training
                  </h4>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold ${
                      profile?.isUndergoingVocationalTraining
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {profile?.isUndergoingVocationalTraining ? "ACTIVE APPRENTICE" : "NO VOCATIONAL ENROLLMENT"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Trade / Skill Specialization</span>
                    <span className="text-slate-900 font-semibold mt-1 block">
                      {profile?.tradeSkillKind || "Unspecified"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Training Center</span>
                    <span className="text-slate-900 font-semibold mt-1 block">
                      {profile?.trainingCenterName || "N/A"}
                    </span>
                  </div>

                  {profile?.trainingCenterLocation && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Center Location</span>
                      <span className="text-slate-900 font-semibold mt-1 block">
                        {profile.trainingCenterLocation}
                      </span>
                    </div>
                  )}

                  {profile?.trainingDurationMonths && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Program Duration</span>
                      <span className="text-slate-900 font-semibold mt-1 block">
                        {profile.trainingDurationMonths} months
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Unemployed Intervention Plan */}
              {profile?.isUnemployed && (
                <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="border-b border-rose-100 pb-3 flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold text-rose-950 uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-rose-600" />
                      Job-Seeker & Welfare Intervention Plan
                    </h4>
                    <span className="px-2.5 py-1 bg-rose-100 text-rose-700 rounded-full text-[10px] font-mono font-bold">
                      ACTIVELY SEEKING INTERVENTION
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-rose-150 space-y-2 text-xs font-mono">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">
                      Requested Next Step Intervention:
                    </span>
                    <div className="text-sm font-bold text-rose-700">
                      {profile.desiredNextStep
                        ? profile.desiredNextStep.replace(/_/g, " ")
                        : "General Employment Intervention"}
                    </div>
                    <p className="text-xs text-slate-500 font-sans pt-1">
                      Citizen has opted in to state-sponsored livelihood interventions, job matching pools, or SME capital grant consideration.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

