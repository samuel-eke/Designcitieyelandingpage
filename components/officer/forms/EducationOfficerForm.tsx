"use client";

import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  BookOpen,
  Loader2,
  Plus,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  submitEducationRecord,
  getEducationQuestions,
  getEducationRecords,
  EducationQuestionDto,
  EducationRecord,
} from "@/lib/services/officerService";

interface EducationOfficerFormProps {
  citizenCode: string;
  citizenName: string;
  onSuccess?: () => void;
}

const EDUCATION_TYPES = [
  { value: "EARLY_CHILDHOOD", label: "Early Childhood (0–5)" },
  { value: "PRIMARY", label: "Primary (6–11)" },
  { value: "SECONDARY", label: "Secondary (12–18)" },
  { value: "TERTIARY", label: "Higher Education (19–26)" },
  { value: "GENERAL", label: "General" },
];

export function EducationOfficerForm({
  citizenCode,
  citizenName,
  onSuccess,
}: EducationOfficerFormProps) {
  const [educationType, setEducationType] = useState("PRIMARY");
  const [questions, setQuestions] = useState<EducationQuestionDto[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | number | boolean | null>>({});
  const [existingRecords, setExistingRecords] = useState<EducationRecord[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [questionsError, setQuestionsError] = useState<string | null>(null);

  // Load questions when education type changes
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      setQuestionsError(null);
      setAnswers({});
      try {
        const data = await getEducationQuestions(educationType);
        setQuestions(data);
      } catch (err: any) {
        const msg = err?.response?.data?.message || "Could not load form questions.";
        setQuestionsError(msg);
        setQuestions([]);
      } finally {
        setLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, [educationType]);

  // Load existing records for this citizen
  useEffect(() => {
    const fetchRecords = async () => {
      setLoadingRecords(true);
      try {
        const data = await getEducationRecords(citizenCode);
        setExistingRecords(data);
      } catch {
        // Non-fatal — no records yet
        setExistingRecords([]);
      } finally {
        setLoadingRecords(false);
      }
    };
    fetchRecords();
  }, [citizenCode]);

  const handleAnswer = (fieldKey: string, value: string | number | boolean | null) => {
    setAnswers((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const validate = () => {
    const requiredMissing = questions
      .filter((q) => q.required && (answers[q.fieldKey] === undefined || answers[q.fieldKey] === "" || answers[q.fieldKey] === null))
      .map((q) => q.questionText);
    if (requiredMissing.length > 0) {
      toast.error(`Please fill in: ${requiredMissing[0]}${requiredMissing.length > 1 ? ` (+${requiredMissing.length - 1} more)` : ""}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await submitEducationRecord({ citizenCode, answers, educationType });
      toast.success("Education record submitted successfully!");
      setAnswers({});
      const updated = await getEducationRecords(citizenCode);
      setExistingRecords(updated);
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to submit education record.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const renderInput = (q: EducationQuestionDto) => {
    const val = answers[q.fieldKey];
    const base = "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all";

    if (q.inputType === "boolean") {
      return (
        <div className="flex gap-3">
          {[{ label: "Yes", val: true }, { label: "No", val: false }].map((opt) => (
            <button
              key={String(opt.val)}
              type="button"
              onClick={() => handleAnswer(q.fieldKey, opt.val)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${val === opt.val
                ? "bg-blue-50 border-blue-500 text-blue-700"
                : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      );
    }

    if (q.inputType === "select" && q.options) {
      return (
        <select
          value={String(val ?? "")}
          onChange={(e) => handleAnswer(q.fieldKey, e.target.value)}
          className={`${base} cursor-pointer`}
        >
          <option value="">Select...</option>
          {q.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    if (q.inputType === "number") {
      return (
        <input
          type="number"
          value={val === null || val === undefined ? "" : String(val)}
          onChange={(e) => handleAnswer(q.fieldKey, e.target.value === "" ? null : Number(e.target.value))}
          placeholder="Enter value..."
          className={base}
        />
      );
    }

    if (q.inputType === "date") {
      return (
        <input
          type="date"
          value={String(val ?? "")}
          onChange={(e) => handleAnswer(q.fieldKey, e.target.value)}
          className={base}
        />
      );
    }

    return (
      <input
        type="text"
        value={String(val ?? "")}
        onChange={(e) => handleAnswer(q.fieldKey, e.target.value)}
        placeholder="Enter answer..."
        className={base}
      />
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-600">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Education Record</h3>
          <p className="text-[10px] text-slate-400 font-mono">
            Submitting for: <span className="text-slate-600 font-bold">{citizenName}</span> · {citizenCode}
          </p>
        </div>
      </div>

      {/* Education Type Selector */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
          Education Level / Type *
        </label>
        <div className="flex flex-wrap gap-2">
          {EDUCATION_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setEducationType(t.value)}
              className={`px-3.5 py-2 rounded-xl text-[11px] font-bold border-2 transition-all cursor-pointer ${educationType === t.value
                ? "bg-blue-50 border-blue-500 text-blue-700"
                : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Questions */}
      {loadingQuestions ? (
        <div className="flex items-center gap-2 py-6 justify-center text-xs text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          Loading form questions...
        </div>
      ) : questionsError ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-amber-800">Could not load questions</p>
            <p className="text-[10px] text-amber-600 mt-0.5">{questionsError}</p>
          </div>
        </div>
      ) : questions.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-400 font-mono">
          No questions available for this education type.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {questions.map((q) => (
            <div key={q.fieldKey} className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider block">
                {q.questionText} {q.required && <span className="text-red-400">*</span>}
              </label>
              {renderInput(q)}
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {submitting ? "Submitting Record..." : "Submit Education Record"}
          </button>
        </form>
      )}

      {/* Existing Records */}
      {existingRecords.length > 0 && (
        <div className="border border-slate-100 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              Past Education Records ({existingRecords.length})
            </span>
            {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showHistory && (
            <div className="divide-y divide-slate-100">
              {existingRecords.map((rec) => (
                <div key={rec.id} className="px-4 py-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">
                      {rec.educationType ?? "General"}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {new Date(rec.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {Object.entries(rec.answers).slice(0, 3).map(([k, v]) => (
                    <p key={k} className="text-[10px] text-slate-600">
                      <span className="font-mono text-slate-400">{k}:</span> {String(v)}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
