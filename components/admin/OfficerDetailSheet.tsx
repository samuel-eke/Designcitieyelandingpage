"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Briefcase,
  Building2,
  MapPin,
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Lock,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { useOfficerDetail } from "@/lib/hooks/useOfficers";
import { cn } from "@/components/ui/utils";

interface OfficerDetailSheetProps {
  citizenCode: string | null;
  isOpen: boolean;
  onClose: () => void;
  onAssignJurisdiction?: (citizenCode: string) => void;
}

export function OfficerDetailSheet({
  citizenCode,
  isOpen,
  onClose,
  onAssignJurisdiction,
}: OfficerDetailSheetProps) {
  const {
    data: officer,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useOfficerDetail(isOpen ? citizenCode : null);

  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    if (!citizenCode) return;
    navigator.clipboard.writeText(citizenCode);
    setCopiedCode(true);
    toast.success("Citizen code copied to clipboard");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const isEdu =
    officer?.role === "field_officer_education" ||
    officer?.specialty?.toUpperCase() === "EDUCATION";
  const isHealth =
    officer?.role === "field_officer_health" ||
    officer?.specialty?.toUpperCase() === "HEALTH" ||
    officer?.specialty?.toUpperCase() === "MEDICAL";

  // Specialty question prompt
  const specialtyQuestion = isHealth
    ? "Are you currently working as a medical practitioner?"
    : isEdu
    ? "Are you currently working in the education space in any capacity?"
    : "Are you currently working in the same professional space as your specialty?";

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        className="bg-white border-l border-slate-200 text-slate-800 sm:max-w-2xl w-full sm:w-[640px] md:w-[700px] overflow-y-auto p-6 flex flex-col h-full outline-none"
        side="right"
      >
        <SheetHeader className="border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                Field Officer Personnel Clearance
              </span>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Refresh live officer profile"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isFetching && "animate-spin text-blue-600")} />
            </button>
          </div>

          <div className="flex items-start justify-between gap-4 mt-1">
            <div>
              <SheetTitle className="text-xl font-serif font-bold text-slate-900 tracking-tight">
                {isLoading ? (
                  <span className="inline-block w-48 h-6 bg-slate-100 animate-pulse rounded" />
                ) : officer ? (
                  officer.fullName || `${officer.firstName} ${officer.lastName}`
                ) : (
                  "Field Officer Details"
                )}
              </SheetTitle>

              <div className="flex items-center gap-2 mt-1">
                <SheetDescription className="text-xs text-slate-500 font-mono flex items-center gap-1.5 m-0">
                  <span>ID: {citizenCode || "—"}</span>
                  {citizenCode && (
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                      title="Copy citizen code"
                    >
                      {copiedCode ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </SheetDescription>
              </div>
            </div>

            {officer && (
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase border tracking-wider",
                    isEdu
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : isHealth
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-purple-50 text-purple-700 border-purple-200"
                  )}
                >
                  {officer.specialty || officer.role.replace("field_officer_", "").toUpperCase()}
                </span>
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  {officer.role}
                </span>
              </div>
            )}
          </div>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              Fetching officer ledger &amp; employment records...
            </span>
          </div>
        ) : isError ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-4 py-16">
            <div className="p-3 bg-red-50 text-red-500 border border-red-100 rounded-full">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-slate-800">Data Fetch Failure</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                {error?.message || "Failed to load officer details from `/api/admin/officers/{citizenCode}`."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
            >
              Retry
            </button>
          </div>
        ) : !officer ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs py-16">
            No officer record returned for this citizen code.
          </div>
        ) : (
          <div className="flex-1 space-y-6 py-4 overflow-y-auto pr-1">
            {/* ============================================================= */}
            {/* 1. CURRENT EMPLOYMENT DECLARATION (LIVE API DATA)             */}
            {/* ============================================================= */}
            <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-widest leading-none">
                      Current Professional Employment
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                      Declared during registration under specialty mandate
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                {officer.employment?.currentlyEmployed === true ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold font-mono uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Currently Employed
                  </span>
                ) : officer.employment?.currentlyEmployed === false ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold font-mono uppercase tracking-wider">
                    <XCircle className="w-3 h-3 text-slate-400" />
                    Not Employed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold font-mono uppercase tracking-wider">
                    <AlertCircle className="w-3 h-3 text-amber-500" />
                    Not Declared (Legacy)
                  </span>
                )}
              </div>

              {/* Specialty Inquiry Prompt */}
              <div className="p-3 bg-white border border-slate-200/60 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Mandatory Specialty Inquiry
                </span>
                <p className="text-xs font-serif font-bold text-slate-800 italic">
                  &ldquo;{specialtyQuestion}&rdquo;
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">Officer Declaration:</span>
                  <span
                    className={cn(
                      "text-xs font-bold font-mono uppercase px-2 py-0.5 rounded",
                      officer.employment?.currentlyEmployed === true
                        ? "bg-emerald-100 text-emerald-800 font-bold"
                        : officer.employment?.currentlyEmployed === false
                        ? "bg-slate-200 text-slate-700 font-bold"
                        : "bg-amber-100 text-amber-800"
                    )}
                  >
                    {officer.employment?.currentlyEmployed === true
                      ? "YES"
                      : officer.employment?.currentlyEmployed === false
                      ? "NO"
                      : "UNKNOWN / NOT PROVIDED"}
                  </span>
                </div>
              </div>

              {/* Condition 1: Officer Employed (Yes) -> Display full workplace data */}
              {officer.employment?.currentlyEmployed === true && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-white border border-slate-200/60 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-[10px] font-mono uppercase tracking-wider">
                        Current Role / Title
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 block break-words">
                      {officer.employment.role || "Not specified"}
                    </span>
                  </div>

                  <div className="p-3 bg-white border border-slate-200/60 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-[10px] font-mono uppercase tracking-wider">
                        Place of Work / Institution
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 block break-words">
                      {officer.employment.workplaceName || "Not specified"}
                    </span>
                  </div>

                  <div className="sm:col-span-2 p-3 bg-white border border-slate-200/60 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-[10px] font-mono uppercase tracking-wider">
                        Workplace Physical Address
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-800 block break-words">
                      {officer.employment.workplaceAddress || "Not specified"}
                    </span>
                  </div>
                </div>
              )}

              {/* Condition 2: Officer Declared Not Employed (No) */}
              {officer.employment?.currentlyEmployed === false && (
                <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl flex items-start gap-3">
                  <div className="p-1 rounded bg-slate-200/60 text-slate-600 shrink-0 mt-0.5">
                    <XCircle className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 text-xs text-slate-600">
                    <span className="font-bold text-slate-800 block">
                      No Active External Practice Declared
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      This field officer declared during onboarding that they are not currently working in this professional space. In accordance with privacy and compliance rules, no workplace details are stored.
                    </p>
                  </div>
                </div>
              )}

              {/* Condition 3: Legacy Record (Not Provided) */}
              {!officer.employment && (
                <div className="p-4 bg-amber-50/60 border border-amber-200/70 rounded-xl flex items-start gap-3">
                  <div className="p-1 rounded bg-amber-200/60 text-amber-700 shrink-0 mt-0.5">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 text-xs text-amber-900">
                    <span className="font-bold block">
                      Legacy Officer Record
                    </span>
                    <p className="text-[11px] text-amber-800/80 leading-relaxed">
                      Employment declaration was not captured for this officer. This record precedes the current employment step or was completed without optional employment metadata.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ============================================================= */}
            {/* 2. OFFICER IDENTITY & CONTACT                                 */}
            {/* ============================================================= */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest border-b border-slate-200/40 pb-2">
                Identity &amp; Official Contact Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                    Full Name
                  </span>
                  <span className="font-bold text-slate-800 block">
                    {officer.fullName || `${officer.firstName} ${officer.lastName}`}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                    Gender &amp; Date of Birth
                  </span>
                  <span className="font-semibold text-slate-700 capitalize block">
                    {officer.gender || "—"}{" "}
                    {officer.dateOfBirth && (
                      <span className="text-slate-400 font-mono text-[11px]">
                        ({officer.dateOfBirth})
                      </span>
                    )}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${officer.email}`}
                    className="font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{officer.email}</span>
                  </a>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                    Phone Number
                  </span>
                  <a
                    href={`tel:${officer.phoneNumber}`}
                    className="font-mono font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{officer.phoneNumber}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* ============================================================= */}
            {/* 3. JURISDICTION, ORIGIN & RESIDENCE                           */}
            {/* ============================================================= */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/40 pb-2">
                <h4 className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest">
                  Jurisdiction &amp; Residence Scopes
                </h4>
                {onAssignJurisdiction && (
                  <button
                    type="button"
                    onClick={() => onAssignJurisdiction(officer.citizenCode)}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Lock className="w-3 h-3" />
                    Assign Jurisdiction
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                    Residence Jurisdiction
                  </span>
                  <div className="flex items-center gap-1 text-slate-700 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {officer.residenceLga || officer.lga || "—"},{" "}
                      {officer.stateOfResidence || "Federation"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                    Origin Scope
                  </span>
                  <span className="font-semibold text-slate-700 block">
                    {officer.lga || "—"}, {officer.stateOfOrigin || "—"}
                  </span>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                    Residential Address
                  </span>
                  <span className="font-medium text-slate-600 block">
                    {officer.address || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* ============================================================= */}
            {/* 4. AUDIT & METADATA                                           */}
            {/* ============================================================= */}
            <div className="px-2 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-100 pt-3">
              <span>
                Registered:{" "}
                {officer.createdAt
                  ? new Date(officer.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </span>
              <span>
                Last Updated:{" "}
                {officer.updatedAt
                  ? new Date(officer.updatedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </span>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

