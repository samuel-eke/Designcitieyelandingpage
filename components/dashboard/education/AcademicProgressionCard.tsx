"use client";

import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Plus,
  ChevronRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import { getAcademicProgression } from "@/lib/services/educationService";
import type { StudentAcademicUpdate } from "@/lib/types/education";
import { AcademicUpdateModal } from "./AcademicUpdateModal";

interface AcademicProgressionCardProps {
  citizenCode: string;
  onViewProgression?: () => void;
}

export function AcademicProgressionCard({
  citizenCode,
  onViewProgression,
}: AcademicProgressionCardProps) {
  const [latestUpdate, setLatestUpdate] = useState<StudentAcademicUpdate | null>(null);
  const [totalUpdates, setTotalUpdates] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const loadData = async () => {
    if (!citizenCode) return;
    try {
      const res = await getAcademicProgression(citizenCode);
      const updates = res.updates || [];
      setTotalUpdates(updates.length);
      if (updates.length > 0) {
        setLatestUpdate(updates[0]); // Most recent
      }
    } catch (e) {
      // Non-fatal
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [citizenCode]);

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3 h-3" />
            ACTIVE
          </span>
        );
      case "VERIFIED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3 h-3" />
            VERIFIED
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3" />
            REJECTED
          </span>
        );
      case "SUBMITTED":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            SUBMITTED
          </span>
        );
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm space-y-4 hover:border-blue-200 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Academic Result Updates
              </h4>
              <p className="text-[10px] text-stone-400 font-mono">
                Annual Student Progression Track
              </p>
            </div>
          </div>
          {latestUpdate && getStatusBadge(latestUpdate.status)}
        </div>

        {/* Content */}
        {latestUpdate ? (
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-800">
                {latestUpdate.academicYear} ({latestUpdate.academicLevel})
              </span>
              <span className="text-[11px] font-medium text-stone-500">
                {latestUpdate.classGrade || "Annual Record"}
              </span>
            </div>
            {latestUpdate.institutionName && (
              <p className="text-xs text-stone-600 truncate">
                {latestUpdate.institutionName}
              </p>
            )}
            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200/60">
              <span>{totalUpdates} annual update{totalUpdates === 1 ? "" : "s"} logged</span>
              <span className="font-mono text-[10px]">
                Updated {new Date(latestUpdate.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-100 text-center space-y-1.5">
            <BookOpen className="w-5 h-5 text-blue-600 mx-auto" />
            <p className="text-xs font-bold text-stone-800">No Academic Result Logged</p>
            <p className="text-[11px] text-stone-500">
              Upload your latest report card or course grades to verify student status.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-700/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Submit Result
          </button>
          {onViewProgression && (
            <button
              type="button"
              onClick={onViewProgression}
              className="flex items-center justify-center gap-1 py-2 px-3 bg-stone-50 hover:bg-stone-100 text-stone-700 rounded-xl text-xs font-bold border border-stone-200 transition-all cursor-pointer"
            >
              <span>View History</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <AcademicUpdateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        citizenCode={citizenCode}
        onSuccess={loadData}
      />
    </>
  );
}
