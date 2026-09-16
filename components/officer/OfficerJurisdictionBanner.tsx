"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, School as SchoolIcon, MapPin, AlertCircle, Loader2 } from "lucide-react";
import { getMyAssignments } from "@/lib/services/educationalOfficerService";
import type { OfficerSchoolAssignment } from "@/lib/types/educationOfficer";

export function OfficerJurisdictionBanner() {
  const [assignments, setAssignments] = useState<OfficerSchoolAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyAssignments()
      .then((data) => {
        setAssignments(data || []);
      })
      .catch((err) => {
        console.error("Failed to load officer school assignments", err);
        setAssignments([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-3 bg-blue-50/60 border border-blue-200/60 rounded-xl text-xs text-blue-700">
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        <span>Verifying active jurisdictional assignments...</span>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">No Active School Assignments:</span>
          <p className="text-[11px] text-amber-700 mt-0.5">
            You do not currently have assigned school jurisdictions. School and student data creation requires an active jurisdiction granted by the Super Administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 rounded-2xl space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span className="uppercase tracking-wider">Assigned Jurisdictional Scope</span>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
          {assignments.length} School Jurisdiction{assignments.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {assignments.map((asg) => (
          <div
            key={asg.id}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 rounded-xl text-xs shadow-xs"
          >
            <SchoolIcon className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-bold text-stone-800">{asg.schoolName}</span>
            <span className="text-[11px] text-stone-500 font-mono">
              ({asg.lga}{asg.state ? `, ${asg.state}` : ""})
            </span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-stone-500 font-mono mt-1">
        RBAC Enforcement: Queries and data entry are strictly isolated to these assigned schools and LGAs.
      </p>
    </div>
  );
}
