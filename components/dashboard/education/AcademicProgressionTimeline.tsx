"use client";

import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  History,
  Plus,
  RefreshCw,
  Loader2,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { getAcademicProgression } from "@/lib/services/educationService";
import type {
  StudentAcademicUpdate,
  AcademicStatusTransition,
  AcademicProgressionResponse,
} from "@/lib/types/education";
import { AcademicUpdateModal } from "./AcademicUpdateModal";

interface AcademicProgressionTimelineProps {
  citizenCode: string;
  isOfficerReview?: boolean;
}

export function AcademicProgressionTimeline({
  citizenCode,
  isOfficerReview = false,
}: AcademicProgressionTimelineProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AcademicProgressionResponse | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [expandedUpdateIds, setExpandedUpdateIds] = useState<Record<number, boolean>>({});

  const fetchProgression = async () => {
    if (!citizenCode) return;
    setLoading(true);
    try {
      const res = await getAcademicProgression(citizenCode);
      setData(res);
    } catch (err: any) {
      console.error("Error fetching academic progression:", err);
      // Non-fatal if student has no records yet
      setData({ citizenCode, updates: [], transitions: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgression();
  }, [citizenCode]);

  const toggleExpand = (id: number) => {
    setExpandedUpdateIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            ACTIVE
          </span>
        );
      case "VERIFIED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            VERIFIED
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            REJECTED
          </span>
        );
      case "SUBMITTED":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            SUBMITTED
          </span>
        );
    }
  };

  const updates = data?.updates || [];
  const transitions = data?.transitions || [];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Academic Progression History
            </h3>
            <p className="text-xs text-stone-500 font-mono">
              Citizen: {citizenCode || "N/A"} · Continuous Annual Education Track
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchProgression}
            disabled={loading}
            className="p-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-stone-600 transition-colors"
            title="Refresh Progression"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          {!isOfficerReview && (
            <button
              type="button"
              onClick={() => setIsUpdateModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-700/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Submit Annual Result
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white rounded-2xl border border-stone-200/80">
          <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
          <p className="text-xs text-stone-500 font-mono">
            Loading student academic history & audit transitions...
          </p>
        </div>
      ) : updates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-2xl border border-stone-200/80 space-y-3">
          <div className="w-14 h-14 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center text-blue-600">
            <BookOpen className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-bold text-stone-800">
            No Annual Academic Records Found
          </h4>
          <p className="text-xs text-stone-500 max-w-sm">
            Maintain your continuous academic progression by logging your annual level results. Upload result cards or input your course grades.
          </p>
          {!isOfficerReview && (
            <button
              type="button"
              onClick={() => setIsUpdateModalOpen(true)}
              className="mt-2 flex items-center gap-1.5 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Submit First Annual Result
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {updates.map((update, idx) => {
            const isExpanded = !!expandedUpdateIds[update.id];
            const updateTransitions = transitions.filter((t) => t.updateId === update.id);
            const grades = update.subjectGrades || {};
            const gradeKeys = Object.keys(grades);

            return (
              <div
                key={update.id}
                className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden transition-all"
              >
                {/* Card Top Summary */}
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      #{updates.length - idx}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-stone-900">
                          {update.academicYear} Academic Session
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-semibold uppercase">
                          {update.academicLevel}
                        </span>
                        {update.classGrade && (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold">
                            {update.classGrade}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-stone-500 flex-wrap">
                        {update.institutionName && (
                          <span className="flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-stone-400" />
                            {update.institutionName}
                          </span>
                        )}
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          {new Date(update.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {getStatusBadge(update.status)}
                    <button
                      type="button"
                      onClick={() => toggleExpand(update.id)}
                      className="p-1.5 border border-stone-200 rounded-lg hover:bg-stone-50 text-stone-500 transition-colors"
                      title={isExpanded ? "Collapse Details" : "Expand Details"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Subject-Grade Preview */}
                <div className="p-5 space-y-4">
                  {gradeKeys.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                        Subject & Course Grades
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {gradeKeys.map((subj) => (
                          <div
                            key={subj}
                            className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200/60 text-xs"
                          >
                            <span className="font-medium text-stone-700 truncate mr-2" title={subj}>
                              {subj}
                            </span>
                            <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-white border border-stone-200 text-blue-700">
                              {grades[subj]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Document Link */}
                  {update.resultDocumentUrl && (
                    <div className="flex items-center justify-between p-3 bg-blue-50/50 border border-blue-200/80 rounded-xl text-xs">
                      <div className="flex items-center gap-2 text-blue-900 font-medium">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>Attached Result Card / Academic Document</span>
                      </div>
                      <a
                        href={update.resultDocumentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 hover:underline"
                      >
                        View Document
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {/* Notes */}
                  {update.notes && (
                    <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200/60 italic">
                      &quot;{update.notes}&quot;
                    </p>
                  )}

                  {/* Expanded Audit Log & Transitions */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-stone-100 space-y-3">
                      <div className="flex items-center gap-2">
                        <History className="w-3.5 h-3.5 text-stone-400" />
                        <h5 className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
                          Audit Trail & Status Transitions
                        </h5>
                      </div>

                      {updateTransitions.length === 0 ? (
                        <p className="text-xs text-stone-400 italic">
                          Initial submission recorded. No subsequent transitions logged yet.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {updateTransitions.map((trans) => (
                            <div
                              key={trans.id}
                              className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/60 text-xs"
                            >
                              <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <span className="font-bold text-stone-800">
                                    {trans.fromStatus || "START"} &rarr; {trans.toStatus}
                                  </span>
                                  <span className="font-mono text-[10px] text-stone-400">
                                    {new Date(trans.transitionTimestamp).toLocaleString("en-GB")}
                                  </span>
                                </div>
                                {trans.remarks && (
                                  <p className="text-stone-600 mt-1">{trans.remarks}</p>
                                )}
                                {trans.actorCode && (
                                  <p className="text-[10px] font-mono text-stone-400 mt-0.5">
                                    Audited by: {trans.actorCode}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Academic Update Modal */}
      <AcademicUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        citizenCode={citizenCode}
        onSuccess={fetchProgression}
      />
    </div>
  );
}
