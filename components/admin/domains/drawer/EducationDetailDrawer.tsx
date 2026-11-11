"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { GraduationCap, Building, BookOpen, Award, School, MapPin, User, Loader2 } from "lucide-react";
import { useAdminCitizenLifecycle } from "@/lib/hooks/useAdminCitizenLifecycle";
import { AcademicProgressionTimeline } from "@/components/dashboard/education/AcademicProgressionTimeline";

interface EducationDetailDrawerProps {
  citizenCode: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EducationDetailDrawer({
  citizenCode,
  isOpen,
  onClose,
}: EducationDetailDrawerProps) {
  const { data: profile, isLoading } = useAdminCitizenLifecycle(citizenCode);

  if (!citizenCode) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl md:max-w-3xl overflow-y-auto bg-slate-50/50 p-0 border-l border-slate-200"
      >
        {/* Drawer Header */}
        <div className="bg-white border-b border-slate-200 p-6 sticky top-0 z-10">
          <SheetHeader className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <GraduationCap className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-mono text-blue-600 font-bold uppercase tracking-widest">
                  Education Profile & Academic Progression
                </span>
                <SheetTitle className="text-xl font-bold text-slate-900">
                  {profile?.fullName || "Citizen Academic Record"}
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
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="text-xs font-mono text-slate-500">Loading academic records...</span>
            </div>
          ) : (
            <>
              {/* Placement & Academic Snapshot Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <School className="w-4 h-4 text-blue-600" />
                    Current Academic Placement
                  </h4>
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-mono font-bold">
                    {profile?.tertiaryInstitutionName ? "Tertiary Level" : profile?.schoolName ? "Basic / Secondary" : "Enrolled"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">
                      Institution / School
                    </span>
                    <span className="text-slate-900 font-semibold mt-1 block">
                      {profile?.tertiaryInstitutionName || profile?.schoolName || "No active institution registered"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">
                      Current Grade / Level
                    </span>
                    <span className="text-slate-900 font-semibold mt-1 block">
                      {profile?.tertiaryCurrentLevel || profile?.currentClassGrade || "Unspecified"}
                    </span>
                  </div>

                  {profile?.tertiaryCourseOfStudy && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">
                        Course of Study
                      </span>
                      <span className="text-slate-900 font-semibold mt-1 block">
                        {profile.tertiaryCourseOfStudy}
                      </span>
                    </div>
                  )}

                  {profile?.tertiaryAcademicSession && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">
                        Academic Session / Semester
                      </span>
                      <span className="text-slate-900 font-semibold mt-1 block">
                        {profile.tertiaryAcademicSession} {profile.tertiaryCurrentSemester ? `(${profile.tertiaryCurrentSemester})` : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Annual Academic Results & Progression Timeline */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    Annual Academic Updates & Result Cards
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Annual progression history, subject grades breakdown, and certified result documentation.
                  </p>
                </div>

                <AcademicProgressionTimeline
                  citizenCode={citizenCode}
                  isOfficerReview={false}
                />
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

