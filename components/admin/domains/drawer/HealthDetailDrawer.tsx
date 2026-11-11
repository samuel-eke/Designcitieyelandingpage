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
  Activity,
  Heart,
  Shield,
  Baby,
  Calendar,
  AlertTriangle,
  MapPin,
  Loader2,
  Syringe,
  FileText,
} from "lucide-react";
import { useAdminCitizenLifecycle } from "@/lib/hooks/useAdminCitizenLifecycle";
import { useHealthRecords } from "@/lib/hooks/useAnalytics";

interface HealthDetailDrawerProps {
  citizenCode: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function HealthDetailDrawer({
  citizenCode,
  isOpen,
  onClose,
}: HealthDetailDrawerProps) {
  const { data: profile, isLoading: isLifecycleLoading } = useAdminCitizenLifecycle(citizenCode);
  const { data: healthRecords, isLoading: isHealthLoading } = useHealthRecords(citizenCode);

  if (!citizenCode) return null;
  const isLoading = isLifecycleLoading && isHealthLoading;

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
                <Activity className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-mono text-rose-600 font-bold uppercase tracking-widest">
                  Longitudinal Health & Clinical Records
                </span>
                <SheetTitle className="text-xl font-bold text-slate-900">
                  {profile?.fullName || "Citizen Medical Record"}
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
              <span className="text-xs font-mono text-slate-500">Loading medical records...</span>
            </div>
          ) : (
            <>
              {/* Vitals, Genotype & HMO Overview Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    Clinical Baseline & HMO Coverage
                  </h4>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold ${
                      profile?.hasHmo
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {profile?.hasHmo ? "HMO ACTIVE" : "NO HMO COVERAGE"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Blood Group</span>
                    <span className="text-rose-600 font-bold text-base mt-0.5 block">
                      {(profile as any)?.bloodGroup || "—"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Genotype</span>
                    <span className="text-amber-600 font-bold text-base mt-0.5 block">
                      {(profile as any)?.bloodGenotype || "—"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">HMO Provider</span>
                    <span className="text-slate-800 font-semibold text-xs mt-0.5 block truncate">
                      {profile?.hmoProviderName || "N/A"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Policy No</span>
                    <span className="text-slate-800 font-semibold text-xs mt-0.5 block truncate">
                      {profile?.hmoPolicyNumber || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Maternal Health & Antenatal Tracker (if female/pregnant) */}
              {profile?.isPregnant && (
                <div className="bg-purple-50/50 border border-purple-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Baby className="w-5 h-5 text-purple-600" />
                      <div>
                        <h4 className="text-xs font-mono font-bold text-purple-950 uppercase tracking-wider">
                          Maternal Antenatal Profile (ANC)
                        </h4>
                        <span className="text-[10px] text-purple-600 font-mono">
                          Trimester {profile.trimester || "—"} • Estimated Due Date: {profile.estimatedDueDate || "Not set"}
                        </span>
                      </div>
                    </div>
                    {profile.highRiskPregnancyFlag && (
                      <span className="px-2.5 py-1 bg-red-100 text-red-700 border border-red-200 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        HIGH RISK
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-3 bg-white rounded-xl border border-purple-150">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">ANC Clinic Hospital</span>
                      <span className="text-slate-900 font-semibold mt-1 block">
                        {profile.antenatalHospitalName || "Not assigned"}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-purple-150">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">ANC Visits Count</span>
                      <span className="text-purple-700 font-bold text-base mt-0.5 block">
                        {profile.ancVisitsCount ?? 0} visits
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-purple-150">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Antenatal Status</span>
                      <span className="text-emerald-700 font-semibold mt-1 block">
                        {profile.hasStartedAntenatal ? "Active in ANC Program" : "Pending First Visit"}
                      </span>
                    </div>
                  </div>

                  {profile.maternalNotes && (
                    <div className="p-3 bg-white/80 rounded-xl border border-purple-150 text-xs text-slate-700">
                      <strong className="text-[10px] font-mono text-purple-700 uppercase block mb-1">Clinical Remarks:</strong>
                      {profile.maternalNotes}
                    </div>
                  )}
                </div>
              )}

              {/* Longitudinal Health Records Timeline */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    Clinical Encounters & Immunization History
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    {healthRecords?.length || 0} records logged
                  </span>
                </div>

                {!healthRecords || healthRecords.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs font-mono">
                    No clinical visit or immunization records registered for this citizen.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {healthRecords.map((rec) => (
                      <div
                        key={rec.id}
                        className="p-3.5 bg-slate-50/70 border border-slate-200/70 rounded-xl space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-slate-800 uppercase tracking-wider">
                            {rec.recordType || "General Checkup"}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {rec.loggedAt ? new Date(rec.loggedAt).toLocaleDateString() : ""}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{rec.description || "Routine clinical evaluation"}</p>
                        {rec.notes && (
                          <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1 pt-1">
                            <span>Notes:</span>
                            <span className="font-semibold text-slate-700">{rec.notes}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
