"use client";

import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  School as SchoolIcon,
  Users,
  Plus,
  Search,
  Filter,
  RefreshCw,
  HeartPulse,
  Percent,
  Edit2,
  FileCheck2,
  ClipboardList,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import {
  getSchools,
  getStudentRecords,
} from "@/lib/services/educationalOfficerService";
import type {
  School,
  StudentRecord,
} from "@/lib/types/educationOfficer";
import { OfficerJurisdictionBanner } from "./OfficerJurisdictionBanner";
import { SchoolRegistryModal } from "./SchoolRegistryModal";
import { StudentEnrollmentModal } from "./StudentEnrollmentModal";
import { EducationOfficerForm } from "./forms/EducationOfficerForm";
import { AcademicProgressionTimeline } from "@/components/dashboard/education/AcademicProgressionTimeline";

interface EducationOfficerWorkspaceProps {
  citizenCode?: string;
  citizenName?: string;
  onSuccess?: () => void;
}

export function EducationOfficerWorkspace({
  citizenCode,
  citizenName,
  onSuccess,
}: EducationOfficerWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"students" | "schools" | "audit" | "survey">("students");

  // School state
  const [schools, setSchools] = useState<School[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);

  // Student state
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>("");
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);

  const fetchSchools = async () => {
    setLoadingSchools(true);
    try {
      const data = await getSchools();
      setSchools(data || []);
    } catch (err) {
      console.error("Failed to load schools:", err);
      setSchools([]);
    } finally {
      setLoadingSchools(false);
    }
  };

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const schoolId = selectedSchoolFilter ? Number(selectedSchoolFilter) : undefined;
      const data = await getStudentRecords(schoolId);
      setStudents(data || []);
    } catch (err) {
      console.error("Failed to load students:", err);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [selectedSchoolFilter]);

  // Filter students by search query
  const filteredStudents = students.filter((s) => {
    const q = studentSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (s.studentName && s.studentName.toLowerCase().includes(q)) ||
      (s.citizenCode && s.citizenCode.toLowerCase().includes(q)) ||
      (s.schoolName && s.schoolName.toLowerCase().includes(q)) ||
      (s.lga && s.lga.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Officer Jurisdiction Scope Banner */}
      <OfficerJurisdictionBanner />

      {/* Workspace Navigation Tabs */}
      <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 flex gap-1 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab("students")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "students"
              ? "bg-white text-blue-700 shadow-sm border border-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Student Registry ({students.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("schools")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "schools"
              ? "bg-white text-blue-700 shadow-sm border border-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <SchoolIcon className="w-3.5 h-3.5" />
          <span>Assigned Schools ({schools.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("audit")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "audit"
              ? "bg-white text-blue-700 shadow-sm border border-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Academic Result Audits</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("survey")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "survey"
              ? "bg-white text-blue-700 shadow-sm border border-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Education Survey</span>
        </button>
      </div>

      {/* Tab 1: Student Scoped Registry */}
      {activeTab === "students" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  placeholder="Filter by pupil name, citizen code..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {schools.length > 0 && (
                <select
                  value={selectedSchoolFilter}
                  onChange={(e) => setSelectedSchoolFilter(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-blue-500 font-medium"
                >
                  <option value="">All Assigned Schools</option>
                  {schools.map((sch) => (
                    <option key={sch.id} value={sch.id}>
                      {sch.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchStudents}
                disabled={loadingStudents}
                className="p-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
                title="Refresh Records"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingStudents ? "animate-spin" : ""}`} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingStudent(null);
                  setIsStudentModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Enroll Student
              </button>
            </div>
          </div>

          {/* Students Table */}
          {loadingStudents ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-xs text-slate-400 font-mono">Loading jurisdiction student records...</span>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">No Student Records Found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Enroll students assigned to your jurisdiction to begin logging attendance and health requirements.
              </p>
              <button
                type="button"
                onClick={() => {
                  setEditingStudent(null);
                  setIsStudentModalOpen(true);
                }}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                Enroll First Student
              </button>
            </div>
          ) : (
            <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">Pupil & Citizen Code</th>
                      <th className="p-3.5">Assigned School & LGA</th>
                      <th className="p-3.5">Class / Session</th>
                      <th className="p-3.5">Attendance</th>
                      <th className="p-3.5">Special Needs / Health</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5">
                          <p className="font-bold text-slate-900">{st.studentName || "Pupil"}</p>
                          <p className="text-[10px] font-mono text-slate-400">{st.citizenCode}</p>
                          {st.stateOfOrigin && (
                            <span className="text-[9px] text-stone-500">Origin: {st.stateOfOrigin}</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <p className="font-semibold text-slate-800">{st.schoolName || `School #${st.schoolId}`}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{st.lga} LGA</span>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[11px]">
                            {st.classGrade || "Primary"}
                          </span>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{st.academicYear || "2024/2025"}</p>
                        </td>
                        <td className="p-3.5">
                          {st.attendanceRate !== null && st.attendanceRate !== undefined ? (
                            <div className="space-y-1">
                              <span className="font-mono font-bold text-slate-800">
                                {Number(st.attendanceRate).toFixed(1)}%
                              </span>
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    Number(st.attendanceRate) >= 80
                                      ? "bg-emerald-500"
                                      : Number(st.attendanceRate) >= 60
                                      ? "bg-amber-500"
                                      : "bg-rose-500"
                                  }`}
                                  style={{ width: `${Math.min(100, Math.max(0, Number(st.attendanceRate)))}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-300 font-mono">—</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          {st.healthConditionsSpecialNeeds ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              <HeartPulse className="w-3 h-3" />
                              {st.healthConditionsSpecialNeeds}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">None Recorded</span>
                          )}
                          {st.familyGuardianBackground && (
                            <p className="text-[10px] text-slate-500 italic truncate max-w-xs mt-0.5" title={st.familyGuardianBackground}>
                              {st.familyGuardianBackground}
                            </p>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingStudent(st);
                              setIsStudentModalOpen(true);
                            }}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-blue-600 transition-colors"
                            title="Edit Student Record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: School Jurisdiction Registry */}
      {activeTab === "schools" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Jurisdiction School Registry
              </h4>
              <p className="text-[11px] text-slate-400">
                Primary educational facilities assigned to your field monitoring jurisdiction.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchSchools}
                disabled={loadingSchools}
                className="p-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingSchools ? "animate-spin" : ""}`} />
              </button>
              <button
                type="button"
                onClick={() => setIsSchoolModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Register Primary School
              </button>
            </div>
          </div>

          {loadingSchools ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-xs text-slate-400 font-mono">Loading registered schools...</span>
            </div>
          ) : schools.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50">
              <SchoolIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">No Schools Registered Yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Register primary schools in your assigned jurisdiction to begin enrolling pupils.
              </p>
              <button
                type="button"
                onClick={() => setIsSchoolModalOpen(true)}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                Register Primary School
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {schools.map((sch) => (
                <div
                  key={sch.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3 shadow-xs hover:border-blue-200 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                        <SchoolIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">{sch.name}</h5>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {sch.lga} LGA {sch.state ? `· ${sch.state}` : ""}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {sch.schoolType || "Primary"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="text-slate-500 font-medium">Total Pupil Count:</span>
                    <span className="font-mono font-bold text-slate-900">{sch.pupilCount} Pupils</span>
                  </div>

                  {sch.address && (
                    <p className="text-[10px] text-slate-400 truncate">
                      {sch.address}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Student Academic Result Audits */}
      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 text-xs text-blue-900 space-y-1">
            <h4 className="font-bold flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              Annual Academic Result Audit Mode
            </h4>
            <p className="text-blue-800 text-[11px]">
              Inspect student annual result submissions (result card documents and dynamic course grades) and log official transitions (VERIFY, ACTIVATE, or REJECT).
            </p>
          </div>

          {citizenCode ? (
            <AcademicProgressionTimeline citizenCode={citizenCode} isOfficerReview={true} />
          ) : (
            <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-xs text-slate-500">
              Please select a citizen from the lookup directory on the left to audit their academic progression records.
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Legacy Questionnaires */}
      {activeTab === "survey" && (
        <div className="space-y-4">
          {citizenCode ? (
            <EducationOfficerForm
              citizenCode={citizenCode}
              citizenName={citizenName || "Citizen"}
              onSuccess={onSuccess}
            />
          ) : (
            <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-xs text-slate-500">
              Select a citizen from the lookup directory to complete education survey questionnaires.
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <SchoolRegistryModal
        isOpen={isSchoolModalOpen}
        onClose={() => setIsSchoolModalOpen(false)}
        onSuccess={fetchSchools}
      />

      <StudentEnrollmentModal
        isOpen={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setEditingStudent(null);
        }}
        citizenCode={citizenCode || ""}
        citizenName={citizenName || ""}
        editingRecord={editingStudent}
        onSuccess={fetchStudents}
      />
    </div>
  );
}
