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
  UserPlus,
  School as SchoolIcon,
  HeartPulse,
  Percent,
  Users,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  createStudentRecord,
  updateStudentRecord,
  getSchools,
} from "@/lib/services/educationalOfficerService";
import type {
  School,
  StudentRecord,
  StudentRecordRequest,
  StudentRecordUpdateRequest,
} from "@/lib/types/educationOfficer";

interface StudentEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  citizenCode?: string;
  citizenName?: string;
  editingRecord?: StudentRecord | null;
  onSuccess?: () => void;
}

export function StudentEnrollmentModal({
  isOpen,
  onClose,
  citizenCode: initialCitizenCode = "",
  citizenName: initialStudentName = "",
  editingRecord = null,
  onSuccess,
}: StudentEnrollmentModalProps) {
  const [citizenCode, setCitizenCode] = useState(initialCitizenCode);
  const [studentName, setStudentName] = useState(initialStudentName);
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | "">("");
  const [schools, setSchools] = useState<School[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(false);

  const [stateOfOrigin, setStateOfOrigin] = useState("");
  const [healthConditionsSpecialNeeds, setHealthConditionsSpecialNeeds] = useState("");
  const [attendanceRate, setAttendanceRate] = useState<string>("");
  const [familyGuardianBackground, setFamilyGuardianBackground] = useState("");
  const [academicYear, setAcademicYear] = useState("2024/2025");
  const [classGrade, setClassGrade] = useState("Primary 4");

  const [submitting, setSubmitting] = useState(false);

  // Load available schools in officer's jurisdiction
  useEffect(() => {
    if (!isOpen) return;

    setLoadingSchools(true);
    getSchools()
      .then((data) => {
        setSchools(data || []);
        if (data && data.length > 0 && !selectedSchoolId && !editingRecord) {
          setSelectedSchoolId(data[0].id);
        }
      })
      .catch((err) => {
        console.error("Failed to load schools in jurisdiction:", err);
        toast.error("Could not load schools in your assigned jurisdiction.");
      })
      .finally(() => setLoadingSchools(false));
  }, [isOpen]);

  // Pre-fill if editing or if props change
  useEffect(() => {
    if (editingRecord) {
      setCitizenCode(editingRecord.citizenCode);
      setStudentName(editingRecord.studentName || "");
      setSelectedSchoolId(editingRecord.schoolId);
      setStateOfOrigin(editingRecord.stateOfOrigin || "");
      setHealthConditionsSpecialNeeds(editingRecord.healthConditionsSpecialNeeds || "");
      setAttendanceRate(editingRecord.attendanceRate !== null && editingRecord.attendanceRate !== undefined ? String(editingRecord.attendanceRate) : "");
      setFamilyGuardianBackground(editingRecord.familyGuardianBackground || "");
      setAcademicYear(editingRecord.academicYear || "2024/2025");
      setClassGrade(editingRecord.classGrade || "");
    } else {
      setCitizenCode(initialCitizenCode);
      setStudentName(initialStudentName);
      setHealthConditionsSpecialNeeds("");
      setAttendanceRate("");
      setFamilyGuardianBackground("");
    }
  }, [editingRecord, initialCitizenCode, initialStudentName, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!citizenCode.trim()) {
      toast.error("Citizen code is required");
      return;
    }

    if (!editingRecord && !selectedSchoolId) {
      toast.error("Please select an assigned school in your jurisdiction.");
      return;
    }

    const selectedSchool = schools.find((s) => s.id === Number(selectedSchoolId));

    if (!editingRecord && !selectedSchool) {
      toast.error("Selected school is invalid or outside your jurisdiction.");
      return;
    }

    let parsedAttendance: number | undefined = undefined;
    if (attendanceRate.trim()) {
      const num = parseFloat(attendanceRate);
      if (isNaN(num) || num < 0 || num > 100) {
        toast.error("Attendance rate must be between 0.00% and 100.00%");
        return;
      }
      parsedAttendance = num;
    }

    setSubmitting(true);
    try {
      if (editingRecord) {
        // PUT update
        const updatePayload: StudentRecordUpdateRequest = {
          studentName: studentName.trim() || undefined,
          stateOfOrigin: stateOfOrigin.trim() || undefined,
          healthConditionsSpecialNeeds: healthConditionsSpecialNeeds.trim() || undefined,
          attendanceRate: parsedAttendance,
          familyGuardianBackground: familyGuardianBackground.trim() || undefined,
          academicYear: academicYear.trim() || undefined,
          classGrade: classGrade.trim() || undefined,
        };

        await updateStudentRecord(editingRecord.id, updatePayload);
        toast.success("Student record updated successfully!");
      } else {
        // POST create
        const createPayload: StudentRecordRequest = {
          citizenCode: citizenCode.trim(),
          schoolId: Number(selectedSchoolId),
          schoolName: selectedSchool?.name,
          lga: selectedSchool?.lga || "LGA",
          studentName: studentName.trim() || undefined,
          stateOfOrigin: stateOfOrigin.trim() || undefined,
          healthConditionsSpecialNeeds: healthConditionsSpecialNeeds.trim() || undefined,
          attendanceRate: parsedAttendance,
          familyGuardianBackground: familyGuardianBackground.trim() || undefined,
          academicYear: academicYear.trim() || undefined,
          classGrade: classGrade.trim() || undefined,
        };

        await createStudentRecord(createPayload);
        toast.success("Student enrolled in jurisdiction registry successfully!");
      }

      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Student record submission error:", err);
      const status = err.response?.status;
      if (status === 403) {
        toast.error("Forbidden: School is outside your assigned jurisdictional scope.");
      } else {
        const msg =
          err.response?.data?.message ||
          (typeof err.response?.data === "string" ? err.response?.data : null) ||
          err.message ||
          "Failed to save student record.";
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl bg-white border border-stone-200">
        <div className="p-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold font-serif text-white">
                {editingRecord ? "Edit Student Jurisdiction Record" : "Enroll Student in Jurisdiction"}
              </DialogTitle>
              <DialogDescription className="text-xs text-blue-100 mt-0.5">
                Log health needs, attendance records, and family background scoped to your assigned school.
              </DialogDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Identification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Citizen Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={citizenCode}
                onChange={(e) => setCitizenCode(e.target.value)}
                disabled={!!editingRecord}
                placeholder="e.g. CIT-LAG-IKJ-0012"
                required
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-blue-600 font-mono disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Pupil / Student Full Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Chinedu Eze"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* School Selection */}
          {!editingRecord && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Assigned Primary School <span className="text-red-500">*</span>
              </label>
              {loadingSchools ? (
                <div className="flex items-center gap-2 py-2 text-xs text-stone-400">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  Loading assigned schools...
                </div>
              ) : schools.length === 0 ? (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  No schools registered in your jurisdiction yet. Please register a school first.
                </div>
              ) : (
                <select
                  value={selectedSchoolId}
                  onChange={(e) => setSelectedSchoolId(Number(e.target.value))}
                  required
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-blue-600 font-medium"
                >
                  {schools.map((sch) => (
                    <option key={sch.id} value={sch.id}>
                      {sch.name} ({sch.lga}) — Pupils: {sch.pupilCount}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Academic Session & Class */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Academic Session
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="e.g. 2024/2025"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-blue-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Class Grade
              </label>
              <input
                type="text"
                value={classGrade}
                onChange={(e) => setClassGrade(e.target.value)}
                placeholder="e.g. Primary 3"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-blue-600 font-medium"
              />
            </div>
          </div>

          {/* State of Origin & Attendance Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                State of Origin
              </label>
              <input
                type="text"
                value={stateOfOrigin}
                onChange={(e) => setStateOfOrigin(e.target.value)}
                placeholder="e.g. Imo, Ogun, Kano"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1 flex items-center justify-between">
                <span>Attendance Rate %</span>
                <span className="text-stone-400 font-normal">0.00 – 100.00</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={attendanceRate}
                  onChange={(e) => setAttendanceRate(e.target.value)}
                  placeholder="e.g. 94.5"
                  className="w-full pl-3.5 pr-8 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-blue-600 font-mono"
                />
                <Percent className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Health Conditions & Special Needs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
              Diagnosed Health Conditions & Special Needs
            </label>
            <input
              type="text"
              value={healthConditionsSpecialNeeds}
              onChange={(e) => setHealthConditionsSpecialNeeds(e.target.value)}
              placeholder="e.g. Severe Asthma, Visual Impairment, Sickle Cell, None"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-blue-600"
            />
          </div>

          {/* Family & Guardian Background */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-stone-500" />
              Family & Guardian Background
            </label>
            <textarea
              value={familyGuardianBackground}
              onChange={(e) => setFamilyGuardianBackground(e.target.value)}
              placeholder="e.g. Lives with maternal grandmother; 4 siblings; primary caregiver is petty trader..."
              rows={2}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              {submitting ? "Saving Record..." : editingRecord ? "Update Record" : "Enroll Student"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
