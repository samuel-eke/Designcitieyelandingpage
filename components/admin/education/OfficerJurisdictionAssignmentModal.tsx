"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  School as SchoolIcon,
  UserCheck,
  CheckCircle2,
  Loader2,
  AlertCircle,
  MapPin,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  assignOfficerToSchool,
  getSchools,
} from "@/lib/services/educationalOfficerService";
import { getRegisteredOfficers } from "@/lib/services/officerService";
import type { School, OfficerAssignmentRequest } from "@/lib/types/educationOfficer";
import type { OfficerSummary } from "@/lib/types/officer";

interface OfficerJurisdictionAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultOfficerCode?: string;
}

export function OfficerJurisdictionAssignmentModal({
  isOpen,
  onClose,
  onSuccess,
  defaultOfficerCode = "",
}: OfficerJurisdictionAssignmentModalProps) {
  const [officerCode, setOfficerCode] = useState(defaultOfficerCode);
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | "">("");
  const [schoolName, setSchoolName] = useState("");
  const [lga, setLga] = useState("");
  const [state, setState] = useState("Lagos");

  const [schools, setSchools] = useState<School[]>([]);
  const [officers, setOfficers] = useState<OfficerSummary[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [loadingOfficers, setLoadingOfficers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [manualCodeEntry, setManualCodeEntry] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Fetch registered schools
    setLoadingSchools(true);
    getSchools()
      .then((data) => {
        setSchools(data || []);
        if (data && data.length > 0 && !selectedSchoolId) {
          setSelectedSchoolId(data[0].id);
          setSchoolName(data[0].name);
          setLga(data[0].lga);
          setState(data[0].state || "Lagos");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch schools for assignment:", err);
        toast.error("Could not load schools list.");
      })
      .finally(() => setLoadingSchools(false));

    // Fetch registered field officers
    setLoadingOfficers(true);
    getRegisteredOfficers()
      .then((data) => {
        setOfficers(data || []);
        if (defaultOfficerCode) {
          setOfficerCode(defaultOfficerCode);
        } else if (data && data.length > 0 && !officerCode) {
          // Default to first educational officer or first officer
          const eduOfficer = data.find(
            (o) =>
              o.role === "field_officer_education" ||
              o.specialty?.toUpperCase() === "EDUCATION"
          );
          const chosen = eduOfficer || data[0];
          setOfficerCode(chosen.citizenCode);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch officers for assignment:", err);
      })
      .finally(() => setLoadingOfficers(false));
  }, [isOpen]);

  useEffect(() => {
    if (defaultOfficerCode) {
      setOfficerCode(defaultOfficerCode);
      const matched = officers.find((o) => o.citizenCode === defaultOfficerCode);
      if (!matched) {
        setManualCodeEntry(true);
      }
    }
  }, [defaultOfficerCode, officers, isOpen]);

  const handleOfficerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "__manual__") {
      setManualCodeEntry(true);
      setOfficerCode("");
    } else {
      setOfficerCode(val);
      const found = officers.find((o) => o.citizenCode === val);
      if (found && found.residenceLga && !lga) {
        setLga(found.residenceLga);
      }
      if (found && found.stateOfResidence && !state) {
        setState(found.stateOfResidence);
      }
    }
  };

  const handleSchoolSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sId = Number(e.target.value);
    setSelectedSchoolId(sId);
    const found = schools.find((s) => s.id === sId);
    if (found) {
      setSchoolName(found.name);
      setLga(found.lga);
      setState(found.state || "Lagos");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!officerCode.trim()) {
      toast.error("Educational Officer code is required");
      return;
    }
    if (!selectedSchoolId) {
      toast.error("Please select a target school");
      return;
    }
    if (!lga.trim()) {
      toast.error("LGA is required");
      return;
    }

    setSubmitting(true);
    try {
      const payload: OfficerAssignmentRequest = {
        officerCode: officerCode.trim(),
        schoolId: Number(selectedSchoolId),
        schoolName: schoolName.trim() || undefined,
        lga: lga.trim(),
        state: state.trim() || undefined,
      };

      await assignOfficerToSchool(payload);
      toast.success(
        `Officer ${officerCode} successfully assigned to ${schoolName} (${lga} LGA)!`
      );
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Jurisdiction assignment error:", err);
      const status = err.response?.status;
      if (status === 403) {
        toast.error(
          "Forbidden: Only Super Administrators have clearance to map officer jurisdictions."
        );
      } else {
        const msg =
          err.response?.data?.message ||
          (typeof err.response?.data === "string" ? err.response?.data : null) ||
          err.message ||
          "Failed to assign officer jurisdiction.";
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const selectedOfficerObj = officers.find((o) => o.citizenCode === officerCode);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 rounded-2xl bg-white border border-stone-200">
        <div className="p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold font-serif text-white">
                Assign Officer Jurisdiction
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-300 mt-0.5">
                Super Admin Security Clearance: Bind field officers to strict School and LGA scopes.
              </DialogDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                Select Field Officer <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setManualCodeEntry(!manualCodeEntry)}
                className="text-[10px] text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
              >
                {manualCodeEntry ? "← Choose from directory" : "Enter code manually"}
              </button>
            </div>

            {manualCodeEntry ? (
              <input
                type="text"
                value={officerCode}
                onChange={(e) => setOfficerCode(e.target.value)}
                placeholder="e.g. CIT-OFR-ED-LAG-000001"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-600 font-mono font-bold"
              />
            ) : loadingOfficers ? (
              <div className="flex items-center gap-2 py-2 text-xs text-slate-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                Loading registered field officers...
              </div>
            ) : officers.length === 0 ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={officerCode}
                  onChange={(e) => setOfficerCode(e.target.value)}
                  placeholder="e.g. cit-fo-ed-009102"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-600 font-mono font-bold"
                />
                <p className="text-[10px] text-slate-400">
                  No officers loaded from API. Enter citizen code manually.
                </p>
              </div>
            ) : (
              <select
                value={officerCode}
                onChange={handleOfficerSelect}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-600 font-medium"
              >
                <option value="" disabled>-- Select a registered officer --</option>
                {officers.map((o) => (
                  <option key={o.id} value={o.citizenCode}>
                    {o.fullName} ({o.citizenCode}) — {o.specialty || o.role.replace("field_officer_", "").toUpperCase()} [{o.residenceLga || o.lga || "Federation"}]
                  </option>
                ))}
              </select>
            )}

            {selectedOfficerObj && !manualCodeEntry && (
              <div className="mt-2 p-2 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-[11px]">
                <div>
                  <span className="font-semibold text-slate-800">{selectedOfficerObj.fullName}</span>
                  <span className="text-slate-400 ml-1.5 font-mono text-[10px]">({selectedOfficerObj.citizenCode})</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[9px] uppercase border border-blue-100">
                  {selectedOfficerObj.specialty || selectedOfficerObj.role}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <SchoolIcon className="w-3.5 h-3.5 text-blue-600" />
              Target Primary School <span className="text-red-500">*</span>
            </label>
            {loadingSchools ? (
              <div className="flex items-center gap-2 py-2 text-xs text-slate-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                Loading registered schools...
              </div>
            ) : schools.length === 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                No schools found in registry. Please register a school first.
              </div>
            ) : (
              <select
                value={selectedSchoolId}
                onChange={handleSchoolSelect}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-600 font-medium"
              >
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.lga} LGA ({s.pupilCount} Pupils)
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                LGA Scope <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lga}
                onChange={(e) => setLga(e.target.value)}
                placeholder="e.g. Ikeja"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Lagos"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong>RBAC Isolation Active:</strong> Binding this officer will restrict their query and submission privileges strictly to students within <strong>{schoolName || "this school"}</strong> and <strong>{lga || "this LGA"}</strong>.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Binding Jurisdiction...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Confirm School Assignment
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
