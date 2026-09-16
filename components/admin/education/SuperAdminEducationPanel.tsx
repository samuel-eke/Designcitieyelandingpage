"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  School as SchoolIcon,
  Users,
  UserCheck,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Building,
  GraduationCap,
  Loader2,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  getSchools,
  getStudentRecords,
  getSchoolAssignments,
} from "@/lib/services/educationalOfficerService";
import { getRegisteredOfficers } from "@/lib/services/officerService";
import type { School, StudentRecord, OfficerSchoolAssignment } from "@/lib/types/educationOfficer";
import type { OfficerSummary } from "@/lib/types/officer";
import { OfficerJurisdictionAssignmentModal } from "./OfficerJurisdictionAssignmentModal";
import { SchoolRegistryModal } from "@/components/officer/SchoolRegistryModal";

interface SuperAdminEducationPanelProps {
  onSelectCitizen?: (citizenCode: string) => void;
}

export function SuperAdminEducationPanel({ onSelectCitizen }: SuperAdminEducationPanelProps) {
  const [schools, setSchools] = useState<School[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [officers, setOfficers] = useState<OfficerSummary[]>([]);
  const [assignments, setAssignments] = useState<OfficerSchoolAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeSection, setActiveSection] = useState<"officers" | "schools" | "students">("officers");
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [selectedOfficerCode, setSelectedOfficerCode] = useState("");

  const [officerFilterRole, setOfficerFilterRole] = useState<string>("all");
  const [officerSearch, setOfficerSearch] = useState("");

  const loadAll = async () => {
    setLoading(true);
    try {
      // Super admin fetches federation-wide without LGA restrictions
      const [schoolsData, studentsData, officersData, assignmentsData] = await Promise.all([
        getSchools().catch(() => []),
        getStudentRecords().catch(() => []),
        getRegisteredOfficers().catch(() => []),
        getSchoolAssignments().catch(() => []),
      ]);
      setSchools(schoolsData || []);
      setStudents(studentsData || []);
      setOfficers(officersData || []);
      setAssignments(assignmentsData || []);
    } catch (err) {
      console.error("Super admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const totalPupils = schools.reduce((acc, curr) => acc + (curr.pupilCount || 0), 0);

  // Filter officers
  const filteredOfficers = officers.filter((o) => {
    // Role filter
    if (officerFilterRole === "education") {
      const isEdu =
        o.role === "field_officer_education" ||
        o.specialty?.toUpperCase() === "EDUCATION";
      if (!isEdu) return false;
    } else if (officerFilterRole === "health") {
      const isHealth =
        o.role === "field_officer_health" ||
        o.specialty?.toUpperCase() === "HEALTH" ||
        o.specialty?.toUpperCase() === "MEDICAL";
      if (!isHealth) return false;
    } else if (officerFilterRole === "general") {
      if (o.role !== "field_officer") return false;
    }

    // Search query
    if (officerSearch.trim()) {
      const q = officerSearch.toLowerCase().trim();
      const matchName = o.fullName?.toLowerCase().includes(q);
      const matchCode = o.citizenCode?.toLowerCase().includes(q);
      const matchEmail = o.email?.toLowerCase().includes(q);
      const matchPhone = o.phoneNumber?.includes(q);
      const matchLga = (o.residenceLga || o.lga || "").toLowerCase().includes(q);
      const matchState = (o.stateOfResidence || o.stateOfOrigin || "").toLowerCase().includes(q);
      return matchName || matchCode || matchEmail || matchPhone || matchLga || matchState;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Super Admin Clearance Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-yellow-400/20 text-yellow-400 rounded-lg border border-yellow-400/30">
                <Shield className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-yellow-400 font-bold">
                Super Administrator Access Clearance
              </span>
            </div>
            <h3 className="text-xl font-serif font-bold text-white">
              Federation Education & Jurisdictional Control
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Audit registered field officers, assign School &amp; LGA scopes, register educational facilities across the federation, and manage student records with global override.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <button
              type="button"
              onClick={() => setIsSchoolModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Register School
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedOfficerCode("");
                setIsAssignmentModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Assign Jurisdiction
            </button>
          </div>
        </div>

        {/* Global Summary Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Registered Officers
            </span>
            <span className="text-2xl font-bold font-serif text-white">{officers.length}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Federation Schools
            </span>
            <span className="text-2xl font-bold font-serif text-white">{schools.length}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Pupils Capacity
            </span>
            <span className="text-2xl font-bold font-serif text-white">{totalPupils.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Student Records
            </span>
            <span className="text-2xl font-bold font-serif text-white">{students.length}</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 flex gap-1">
          <button
            type="button"
            onClick={() => setActiveSection("officers")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSection === "officers"
                ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Field Officers Directory ({officers.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("schools")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSection === "schools"
                ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <SchoolIcon className="w-3.5 h-3.5" />
            <span>Federation Schools ({schools.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("students")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSection === "students"
                ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>All Student Records ({students.length})</span>
          </button>
        </div>

        <button
          type="button"
          onClick={loadAll}
          disabled={loading}
          className="p-2.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors cursor-pointer"
          title="Refresh All Records"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Section 1: Registered Field Officers Directory */}
      {activeSection === "officers" && (
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-mono font-bold text-slate-800 uppercase tracking-widest">
                Registered Field Officers &amp; Jurisdictions
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time directory of field officers verified in <code className="text-blue-600 font-mono">auth.admin_user</code> with active RBAC scopes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedOfficerCode("");
                setIsAssignmentModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer self-start sm:self-center"
            >
              <Plus className="w-3.5 h-3.5" />
              Bind Officer Jurisdiction
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={officerSearch}
                onChange={(e) => setOfficerSearch(e.target.value)}
                placeholder="Search by officer name, citizen code, LGA, state, email..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-600 transition-all font-medium"
              />
              {officerSearch && (
                <button
                  type="button"
                  onClick={() => setOfficerSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <div className="bg-slate-100 p-1 rounded-xl flex gap-1 text-[11px] font-bold w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setOfficerFilterRole("all")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    officerFilterRole === "all"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All ({officers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setOfficerFilterRole("education")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    officerFilterRole === "education"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Education
                </button>
                <button
                  type="button"
                  onClick={() => setOfficerFilterRole("health")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    officerFilterRole === "health"
                      ? "bg-white text-emerald-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Health
                </button>
                <button
                  type="button"
                  onClick={() => setOfficerFilterRole("general")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    officerFilterRole === "general"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  General
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-xs text-slate-400">Loading registered field officers...</span>
            </div>
          ) : filteredOfficers.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              {officerSearch ? (
                <>No officers found matching &quot;{officerSearch}&quot;.</>
              ) : (
                <>No field officers registered yet in this category.</>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold">Officer Name</th>
                    <th className="py-3 px-4 font-bold">Citizen Code</th>
                    <th className="py-3 px-4 font-bold">Role &amp; Specialty</th>
                    <th className="py-3 px-4 font-bold">Jurisdiction / Residence</th>
                    <th className="py-3 px-4 font-bold">Contact</th>
                    <th className="py-3 px-4 font-bold">Assigned Schools</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {filteredOfficers.map((o) => {
                    const officerAssignedSchools = assignments.filter(
                      (a) => a.officerCode === o.citizenCode && a.active
                    );
                    const isEdu =
                      o.role === "field_officer_education" ||
                      o.specialty?.toUpperCase() === "EDUCATION";
                    const isHealth =
                      o.role === "field_officer_health" ||
                      o.specialty?.toUpperCase() === "HEALTH" ||
                      o.specialty?.toUpperCase() === "MEDICAL";

                    return (
                      <tr key={o.id || o.citizenCode} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                              {o.firstName?.[0] || ""}{o.lastName?.[0] || ""}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{o.fullName}</span>
                              <span className="text-[10px] text-slate-400 capitalize">{o.gender || "Officer"}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-bold">
                            {o.citizenCode}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                              isEdu
                                ? "bg-blue-50 text-blue-700 border-blue-100"
                                : isHealth
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : "bg-purple-50 text-purple-700 border-purple-100"
                            }`}
                          >
                            {o.specialty || o.role.replace("field_officer_", "").toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-[11px] text-slate-700">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{o.residenceLga || o.lga || "—"}, {o.stateOfResidence || o.stateOfOrigin || "Federation"}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-0.5 text-[11px]">
                            <div className="flex items-center gap-1 text-slate-600">
                              <Mail className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[150px]">{o.email}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-500 font-mono text-[10px]">
                              <Phone className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                              <span>{o.phoneNumber}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {officerAssignedSchools.length > 0 ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-mono font-bold">
                                <Lock className="w-2.5 h-2.5" />
                                {officerAssignedSchools.length} Assigned
                              </span>
                              <div className="text-[10px] text-slate-500 truncate max-w-[160px]">
                                {officerAssignedSchools.map((a) => a.schoolName).join(", ")}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono italic">
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOfficerCode(o.citizenCode);
                              setIsAssignmentModalOpen(true);
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                          >
                            Assign School
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Section 2: Federation Schools */}
      {activeSection === "schools" && (
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-mono font-bold text-slate-800 uppercase tracking-widest">
                Registered Primary Educational Facilities
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Federation-wide school directory accessible across all state jurisdictions.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsSchoolModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Register Primary School
            </button>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : schools.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No schools registered yet. Click &quot;Register Primary School&quot; to begin.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {schools.map((s) => (
                <div key={s.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
                  <div className="flex items-start justify-between">
                    <h5 className="text-xs font-bold text-slate-900">{s.name}</h5>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-blue-700">
                      ID #{s.id}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {s.lga} LGA · {s.state || "Nigeria"}
                  </p>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/50">
                    <span className="text-slate-400">Total Pupils:</span>
                    <span className="font-bold text-slate-800">{s.pupilCount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Section 3: All Student Records */}
      {activeSection === "students" && (
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-4">
          <div>
            <h4 className="text-sm font-mono font-bold text-slate-800 uppercase tracking-widest">
              Federation Student Ledger
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Super Admin un-siloed query access across all educational jurisdictions.
            </p>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : students.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No student records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold">Pupil Name</th>
                    <th className="py-3 px-4 font-bold">Citizen Code</th>
                    <th className="py-3 px-4 font-bold">School &amp; LGA</th>
                    <th className="py-3 px-4 font-bold">Attendance</th>
                    <th className="py-3 px-4 font-bold">Health / Special Needs</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/40">
                      <td className="py-3 px-4 font-semibold text-slate-800">{st.studentName || "Pupil"}</td>
                      <td className="py-3 px-4 font-mono text-[10px] text-slate-400">{st.citizenCode}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-700">{st.schoolName}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">{st.lga} LGA</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {st.attendanceRate !== null && st.attendanceRate !== undefined
                          ? `${Number(st.attendanceRate).toFixed(1)}%`
                          : "—"}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{st.healthConditionsSpecialNeeds || "None"}</td>
                      <td className="py-3 px-4 text-right">
                        {onSelectCitizen && (
                          <button
                            type="button"
                            onClick={() => onSelectCitizen(st.citizenCode)}
                            className="text-blue-600 font-bold hover:underline cursor-pointer"
                          >
                            Inspect Profile
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <OfficerJurisdictionAssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        defaultOfficerCode={selectedOfficerCode}
        onSuccess={loadAll}
      />

      <SchoolRegistryModal
        isOpen={isSchoolModalOpen}
        onClose={() => setIsSchoolModalOpen(false)}
        defaultLga="Ikeja"
        defaultState="Lagos"
        onSuccess={loadAll}
      />
    </div>
  );
}
