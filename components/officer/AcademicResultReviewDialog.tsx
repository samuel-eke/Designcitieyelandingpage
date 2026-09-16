"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ExternalLink,
  Loader2,
  Clock,
  Building,
} from "lucide-react";
import { toast } from "sonner";
import { updateAcademicStatus } from "@/lib/services/educationService";
import type { StudentAcademicUpdate, AcademicStatus } from "@/lib/types/education";

interface AcademicResultReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  update: StudentAcademicUpdate | null;
  onSuccess?: () => void;
}

export function AcademicResultReviewDialog({
  isOpen,
  onClose,
  update,
  onSuccess,
}: AcademicResultReviewDialogProps) {
  const [remarks, setRemarks] = useState("");
  const [submittingStatus, setSubmittingStatus] = useState<string | null>(null);

  if (!update) return null;

  const handleTransition = async (targetStatus: AcademicStatus) => {
    if (targetStatus === "REJECTED" && !remarks.trim()) {
      toast.error("Please provide audit remarks explaining why the result was rejected.");
      return;
    }

    setSubmittingStatus(targetStatus);
    try {
      await updateAcademicStatus(update.id, {
        status: targetStatus,
        remarks: remarks.trim() || undefined,
      });

      toast.success(`Academic update transitioned to ${targetStatus}!`);
      setRemarks("");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Status transition error:", err);
      const msg =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response?.data : null) ||
        err.message ||
        "Failed to update academic status.";
      toast.error(msg);
    } finally {
      setSubmittingStatus(null);
    }
  };

  const grades = update.subjectGrades || {};
  const gradeKeys = Object.keys(grades);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-0 rounded-2xl bg-white border border-stone-200">
        <div className="p-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold font-serif text-white">
                Review Student Academic Update
              </DialogTitle>
              <DialogDescription className="text-xs text-blue-100 mt-0.5">
                Audit student results and log real-time status transitions.
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Metadata Card */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/60 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 font-mono">
                {update.citizenCode}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">
                {update.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-stone-600">
              <div>
                <span className="text-[10px] text-stone-400 block uppercase">Session</span>
                <span className="font-medium">{update.academicYear}</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block uppercase">Level / Grade</span>
                <span className="font-medium">{update.academicLevel} ({update.classGrade || "N/A"})</span>
              </div>
              {update.institutionName && (
                <div className="col-span-2">
                  <span className="text-[10px] text-stone-400 block uppercase">Institution</span>
                  <span className="font-medium">{update.institutionName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Grades List */}
          {gradeKeys.length > 0 && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Dynamic Course Grades
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                {gradeKeys.map((subj) => (
                  <div
                    key={subj}
                    className="flex items-center justify-between p-2 bg-stone-50 rounded-lg border border-stone-200/60 text-xs"
                  >
                    <span className="font-medium text-stone-700 truncate mr-2">{subj}</span>
                    <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-white border border-stone-200 text-blue-700">
                      {grades[subj]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Result Card Link */}
          {update.resultDocumentUrl && (
            <div className="flex items-center justify-between p-3 bg-blue-50/50 border border-blue-200 rounded-xl text-xs">
              <div className="flex items-center gap-2 text-blue-900 font-medium">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Result Card Uploaded</span>
              </div>
              <a
                href={update.resultDocumentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900"
              >
                Inspect Document
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Audit Remarks */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Audit Remarks & Officer Notes
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Verified against WAEC master gazette; grades authenticated..."
              rows={2}
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-blue-600 placeholder:text-stone-400"
            />
          </div>

          {/* Transition Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Audit Status Transition
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleTransition("VERIFIED")}
                disabled={!!submittingStatus}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-60 cursor-pointer"
              >
                {submittingStatus === "VERIFIED" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                <span>Verify</span>
              </button>

              <button
                type="button"
                onClick={() => handleTransition("ACTIVE")}
                disabled={!!submittingStatus}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-60 cursor-pointer"
              >
                {submittingStatus === "ACTIVE" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5" />
                )}
                <span>Activate</span>
              </button>

              <button
                type="button"
                onClick={() => handleTransition("REJECTED")}
                disabled={!!submittingStatus}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-60 cursor-pointer"
              >
                {submittingStatus === "REJECTED" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                <span>Reject</span>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
