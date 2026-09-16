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
  GraduationCap,
  Upload,
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  submitAcademicUpdateMultipart,
  submitAcademicUpdateJson,
} from "@/lib/services/educationService";
import type { AcademicLevel } from "@/lib/types/education";

interface AcademicUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  citizenCode?: string;
  onSuccess?: () => void;
}

interface SubjectGradeRow {
  id: string;
  subject: string;
  grade: string;
}

const ACADEMIC_LEVELS: { value: AcademicLevel; label: string }[] = [
  { value: "PRIMARY", label: "Primary School (Basic 1–6)" },
  { value: "SECONDARY", label: "Secondary School (JSS1–SSS3)" },
  { value: "TERTIARY", label: "Tertiary / Higher Education" },
  { value: "VOCATIONAL", label: "Vocational & Technical College" },
];

const COMMON_SUBJECTS: Record<string, string[]> = {
  PRIMARY: ["English Studies", "Mathematics", "Basic Science", "Social Studies", "Civic Education", "Agricultural Science"],
  SECONDARY: ["English Language", "Mathematics", "Biology", "Chemistry", "Physics", "Economics", "Civic Education", "Literature"],
  TERTIARY: ["Core Course 1", "Core Course 2", "Elective 1", "General Studies (GST)", "Departmental Elective"],
  VOCATIONAL: ["Workshop Practice", "Technical Drawing", "Trade Theory", "Applied Mathematics", "Safety & Maintenance"],
};

export function AcademicUpdateModal({
  isOpen,
  onClose,
  citizenCode,
  onSuccess,
}: AcademicUpdateModalProps) {
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>("SECONDARY");
  const [academicYear, setAcademicYear] = useState<string>("2024/2025");
  const [classGrade, setClassGrade] = useState<string>("");
  const [institutionName, setInstitutionName] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Input method mode: "form" (dynamic grades), "file" (upload result document), or "both"
  const [inputMode, setInputMode] = useState<"both" | "form" | "file">("both");

  // Dynamic Subject Grades
  const [subjectRows, setSubjectRows] = useState<SubjectGradeRow[]>([
    { id: "1", subject: "Mathematics", grade: "A1" },
    { id: "2", subject: "English Language", grade: "B2" },
  ]);

  // Uploaded File
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  // File handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File exceeds maximum allowed size of 10MB");
      return;
    }

    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => setFilePreview(event.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  // Dynamic subject row handling
  const addSubjectRow = (subjectName = "", defaultGrade = "") => {
    setSubjectRows((prev) => [
      ...prev,
      { id: String(Date.now() + Math.random()), subject: subjectName, grade: defaultGrade },
    ]);
  };

  const removeSubjectRow = (id: string) => {
    setSubjectRows((prev) => prev.filter((row) => row.id !== id));
  };

  const updateSubjectRow = (id: string, field: "subject" | "grade", value: string) => {
    setSubjectRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const loadPresetSubjects = () => {
    const preset = COMMON_SUBJECTS[academicLevel] || COMMON_SUBJECTS.SECONDARY;
    setSubjectRows(
      preset.map((subj, idx) => ({
        id: String(idx),
        subject: subj,
        grade: "",
      }))
    );
    toast.info(`Loaded standard subject template for ${academicLevel}`);
  };

  // Submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!academicYear.trim()) {
      toast.error("Academic Year is required (e.g., 2024/2025)");
      return;
    }

    // Filter valid subjects
    const validGrades: Record<string, string> = {};
    subjectRows.forEach((row) => {
      const s = row.subject.trim();
      const g = row.grade.trim();
      if (s && g) {
        validGrades[s] = g.toUpperCase();
      }
    });

    const hasSubjectGrades = Object.keys(validGrades).length > 0;
    const hasFile = selectedFile !== null;

    // Compulsory submission requirement: must provide either result card file or dynamic subject grades
    if (!hasSubjectGrades && !hasFile) {
      toast.error(
        "Compulsory submission requirement: Please provide either a result card upload or enter at least one subject and grade."
      );
      return;
    }

    setSubmitting(true);
    try {
      if (hasFile) {
        // Use multipart form data
        const formData = new FormData();
        formData.append("academicLevel", academicLevel);
        formData.append("academicYear", academicYear.trim());
        if (citizenCode) formData.append("citizenCode", citizenCode.trim());
        if (classGrade.trim()) formData.append("classGrade", classGrade.trim());
        if (institutionName.trim()) formData.append("institutionName", institutionName.trim());
        if (notes.trim()) formData.append("notes", notes.trim());
        if (selectedFile) formData.append("file", selectedFile);
        if (hasSubjectGrades) {
          formData.append("subjectGrades", JSON.stringify(validGrades));
        }

        await submitAcademicUpdateMultipart(formData);
      } else {
        // Use JSON endpoint
        await submitAcademicUpdateJson({
          citizenCode: citizenCode || undefined,
          academicLevel,
          academicYear: academicYear.trim(),
          classGrade: classGrade.trim() || undefined,
          institutionName: institutionName.trim() || undefined,
          subjectGrades: validGrades,
          notes: notes.trim() || undefined,
        });
      }

      toast.success("Annual academic update submitted successfully! Status: SUBMITTED");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Academic update submission error:", err);
      const msg =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response?.data : null) ||
        err.message ||
        "Failed to submit academic update.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl bg-white border border-stone-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold font-serif text-white">
                Submit Annual Academic Update
              </DialogTitle>
              <DialogDescription className="text-xs text-blue-100 mt-0.5">
                Log your annual results card or dynamic grade entries to advance your academic progression record.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: Academic Context */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Academic Level <span className="text-red-500">*</span>
              </label>
              <select
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value as AcademicLevel)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 font-medium"
              >
                {ACADEMIC_LEVELS.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>
                    {lvl.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="e.g. 2024/2025"
                required
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 font-medium placeholder:text-stone-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Class / Grade Level
              </label>
              <input
                type="text"
                value={classGrade}
                onChange={(e) => setClassGrade(e.target.value)}
                placeholder="e.g. Primary 5, SSS 3, 300 Level"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 font-medium placeholder:text-stone-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Institution Name
              </label>
              <input
                type="text"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="e.g. Government Secondary School, Abuja"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 font-medium placeholder:text-stone-400"
              />
            </div>
          </div>

          {/* Mode Selector */}
          <div className="bg-stone-50 p-1.5 rounded-xl border border-stone-200 flex gap-1">
            <button
              type="button"
              onClick={() => setInputMode("both")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                inputMode === "both"
                  ? "bg-white text-blue-700 shadow-sm border border-stone-200"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              Grades & Result Upload
            </button>
            <button
              type="button"
              onClick={() => setInputMode("form")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                inputMode === "form"
                  ? "bg-white text-blue-700 shadow-sm border border-stone-200"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              Grade Entries Only
            </button>
            <button
              type="button"
              onClick={() => setInputMode("file")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                inputMode === "file"
                  ? "bg-white text-blue-700 shadow-sm border border-stone-200"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              Document Upload Only
            </button>
          </div>

          {/* Section 2: Dynamic Subject-Grade Form */}
          {(inputMode === "both" || inputMode === "form") && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    Subject & Grade Entries
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Add individual course results (e.g., Mathematics: A1, Physics: B3).
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={loadPresetSubjects}
                    className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Load Preset
                  </button>
                  <button
                    type="button"
                    onClick={() => addSubjectRow()}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add Row
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {subjectRows.length === 0 ? (
                  <div className="text-center py-6 bg-stone-50 rounded-xl border border-dashed border-stone-200 text-stone-400 text-xs">
                    No subjects added yet. Click &quot;Load Preset&quot; or &quot;Add Row&quot; above.
                  </div>
                ) : (
                  subjectRows.map((row) => (
                    <div key={row.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={row.subject}
                        onChange={(e) => updateSubjectRow(row.id, "subject", e.target.value)}
                        placeholder="Subject Name (e.g. English Language)"
                        className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 outline-none focus:border-blue-500 font-medium"
                      />
                      <input
                        type="text"
                        value={row.grade}
                        onChange={(e) => updateSubjectRow(row.id, "grade", e.target.value)}
                        placeholder="Grade (e.g. A1, 85%, Distinction)"
                        className="w-32 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 outline-none focus:border-blue-500 font-mono font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => removeSubjectRow(row.id)}
                        className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove Subject"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Section 3: File / Certificate Upload */}
          {(inputMode === "both" || inputMode === "file") && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Official Result Card / Transcript Upload
              </h4>
              {!selectedFile ? (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-stone-300 hover:border-blue-500 rounded-2xl cursor-pointer bg-stone-50/70 hover:bg-blue-50/20 transition-all">
                  <Upload className="w-8 h-8 text-stone-400 mb-2" />
                  <span className="text-xs font-bold text-stone-700">
                    Click to browse or drop result file here
                  </span>
                  <span className="text-[11px] text-stone-400 mt-0.5">
                    Supports PNG, JPG, WEBP, or PDF (Max 10MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="Result Preview"
                        className="w-12 h-12 object-cover rounded-lg border border-blue-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                        <FileText className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-stone-800 truncate max-w-xs">
                        {selectedFile.name}
                      </p>
                      <p className="text-[10px] text-stone-500 font-mono">
                        {(selectedFile.size / 1024).toFixed(1)} KB · {selectedFile.type || "Document"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Section 4: Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Additional Notes / Remarks <span className="text-stone-400 font-normal">(Optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide any additional context regarding honors, remarks, or examination center..."
              rows={2}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-stone-400"
            />
          </div>

          {/* Compulsory Requirement Banner */}
          <div className="flex items-start gap-2 p-3 bg-stone-100 border border-stone-200 rounded-xl text-[11px] text-stone-600">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong>Submission Requirement:</strong> At least one verifiable data source (dynamic subject grades or uploaded result card/transcript) must be provided. Updates transition directly to <strong>SUBMITTED</strong> and are queued for Educational Officer audit.
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-700/20 transition-all disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              {submitting ? "Submitting..." : "Submit Academic Update"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
