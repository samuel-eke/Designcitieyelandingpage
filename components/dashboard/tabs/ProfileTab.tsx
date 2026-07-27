"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/components/auth/authStore";
import { toast } from "sonner";
import {
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Lock,
  ShieldCheck,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PendingQuestion {
  category: string;
  dataType: "SELECT" | "TEXT" | "BOOLEAN";
  fieldName: string;
  label: string;
  options: string[] | null;
  piiSensitive: boolean;
}

interface ProfileTabProps {
  avatarImage: string | null;
  avatarInitials: string;
  citizenName: string;
  fileInputRef: React.RefObject<HTMLInputElement | null> | any;
  address?: string;
  age?: number;
  dateOfBirth?: string;
  gender?: string;
  nin?: string;
  phoneNumber?: string;
  stateOfOrigin?: string;
  stateOfResidence?: string;
  citizenCode?: string;
  email?: string;
}

// ─── Category meta ────────────────────────────────────────────────────────────

const CATEGORY_META: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  Career: {
    label: "Career & Employment",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  Education: {
    label: "Education",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  Financial: {
    label: "Financial",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  Health: {
    label: "Health",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
};

const getCategoryMeta = (cat: string) =>
  CATEGORY_META[cat] ?? {
    label: cat,
    color: "text-stone-700",
    bg: "bg-stone-50",
    border: "border-stone-200",
  };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatOptionLabel(opt: string) {
  return opt
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/^\s/, "")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

// ─── Field Input ──────────────────────────────────────────────────────────────

function FieldInput({
  question,
  value,
  onChange,
}: {
  question: PendingQuestion;
  value: any;
  onChange: (fieldName: string, val: any) => void;
}) {
  if (question.dataType === "BOOLEAN") {
    return (
      <div className="flex gap-3" role="group" aria-label={question.label}>
        {[
          { label: "Yes", val: true },
          { label: "No", val: false },
        ].map(({ label, val }) => (
          <button
            key={label}
            type="button"
            onClick={() => onChange(question.fieldName, val)}
            aria-pressed={value === val}
            className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:outline-none ${
              value === val
                ? "bg-green-700 text-white border-green-700 shadow-sm"
                : "bg-white text-stone-600 border-stone-200 hover:border-green-400 hover:text-green-700"
            }`}
          >
            {value === val && (
              <CheckCircle2 className="inline w-3.5 h-3.5 mr-1.5 -mt-0.5" />
            )}
            {label}
          </button>
        ))}
      </div>
    );
  }

  if (question.dataType === "SELECT" && question.options) {
    return (
      <select
        value={value ?? ""}
        onChange={(e) => onChange(question.fieldName, e.target.value)}
        className="w-full bg-white border border-stone-200 focus:border-green-600 focus:ring-2 focus:ring-green-100 rounded-xl px-4 py-3 text-sm text-stone-800 outline-none cursor-pointer appearance-none transition-all"
        aria-label={question.label}
      >
        <option value="" disabled>
          — Select an option —
        </option>
        {question.options.map((opt) => (
          <option key={opt} value={opt}>
            {formatOptionLabel(opt)}
          </option>
        ))}
      </select>
    );
  }

  // TEXT
  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={(e) => onChange(question.fieldName, e.target.value)}
      placeholder="Enter your answer"
      className="w-full bg-white border border-stone-200 focus:border-green-600 focus:ring-2 focus:ring-green-100 rounded-xl px-4 py-3 text-sm text-stone-800 outline-none transition-all placeholder:text-stone-400"
      aria-label={question.label}
    />
  );
}

// ─── Question Card ─────────────────────────────────────────────────────────────

function QuestionCard({
  question,
  index,
  value,
  onChange,
  touched,
}: {
  question: PendingQuestion;
  index: number;
  value: any;
  onChange: (fieldName: string, val: any) => void;
  touched: boolean;
}) {
  const meta = getCategoryMeta(question.category);
  const isUnanswered = touched && (value === undefined || value === null || value === "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-white border rounded-2xl p-5 space-y-3.5 transition-colors ${
        isUnanswered ? "border-red-300" : "border-stone-200/80"
      }`}
    >
      {/* Category badge + PII warning */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${meta.bg} ${meta.color} ${meta.border}`}
        >
          {meta.label}
        </span>
        {question.piiSensitive && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            <Lock className="w-2.5 h-2.5" />
            PII — Handle with care
          </span>
        )}
      </div>

      {/* Label */}
      <label
        htmlFor={question.fieldName}
        className="block text-sm font-semibold text-stone-800 leading-snug"
      >
        {question.label}
        {question.piiSensitive && (
          <span className="ml-1.5 text-amber-600 text-xs font-normal">
            (encrypted at rest)
          </span>
        )}
      </label>

      {/* Input */}
      <div id={question.fieldName}>
        <FieldInput question={question} value={value} onChange={onChange} />
      </div>

      {/* Inline validation */}
      {isUnanswered && (
        <p className="flex items-center gap-1 text-xs text-red-600" role="alert">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          This field is required to continue
        </p>
      )}
    </motion.div>
  );
}

// ─── Progress Stepper ─────────────────────────────────────────────────────────

function CategoryStepper({
  categories,
  currentIndex,
}: {
  categories: string[];
  currentIndex: number;
}) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
      {categories.map((cat, i) => {
        const meta = getCategoryMeta(cat);
        const isDone = i < currentIndex;
        const isActive = i === currentIndex;
        return (
          <div key={cat} className="flex items-center gap-1 shrink-0">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                isDone
                  ? "bg-green-700 text-white border-green-700"
                  : isActive
                  ? `${meta.bg} ${meta.color} ${meta.border}`
                  : "bg-stone-50 text-stone-400 border-stone-200"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <span className="w-4 h-4 flex items-center justify-center rounded-full border-2 border-current text-[9px]">
                  {i + 1}
                </span>
              )}
              <span>{getCategoryMeta(cat).label}</span>
            </div>
            {i < categories.length - 1 && (
              <div className={`w-4 h-px ${isDone ? "bg-green-400" : "bg-stone-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main ProfileTab ──────────────────────────────────────────────────────────

export function ProfileTab({
  avatarImage,
  avatarInitials,
  citizenName,
  fileInputRef,
  address,
  age,
  dateOfBirth,
  gender,
  nin,
  phoneNumber,
  stateOfOrigin,
  stateOfResidence,
  citizenCode,
  email,
}: ProfileTabProps) {
  // Read pending questions from the Zustand store — populated during login
  // from the `pendingQuestions` field of the /api/auth/citizen/login response.
  const storePendingQuestions = useAuthStore((s) => s.progressiveQuestions);
  const pendingQuestions: PendingQuestion[] = (storePendingQuestions as PendingQuestion[] | null) ?? [];
  const loadingQuestions = false;

  const [responses, setResponses] = useState<Record<string, any>>({});
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  // Group questions by category
  const categories = Array.from(new Set(pendingQuestions.map((q) => q.category)));
  const currentCategory = categories[currentCategoryIndex];
  const questionsForCategory = pendingQuestions.filter(
    (q) => q.category === currentCategory
  );

  const handleChange = (fieldName: string, val: any) => {
    setResponses((prev) => ({ ...prev, [fieldName]: val }));
  };

  const validateCurrentCategory = () => {
    for (const q of questionsForCategory) {
      const val = responses[q.fieldName];
      if (val === undefined || val === null || val === "") return false;
    }
    return true;
  };

  const handleNext = () => {
    setTouched(true);
    if (!validateCurrentCategory()) {
      toast.error("Please answer all questions before proceeding.");
      return;
    }
    setTouched(false);
    setCurrentCategoryIndex((i) => i + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setCurrentCategoryIndex((i) => Math.max(0, i - 1));
    setTouched(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setTouched(true);
    // Validate all questions
    for (const q of pendingQuestions) {
      const val = responses[q.fieldName];
      if (val === undefined || val === null || val === "") {
        toast.error(`Please answer: "${q.label}"`);
        return;
      }
    }

    setSubmitting(true);
    try {
      await apiClient.post("/api/profile/progressive-update", { responses });
      setSubmitted(true);
      toast.success("Profile data submitted successfully!");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Submission failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isLastCategory = currentCategoryIndex === categories.length - 1;
  const answeredCount = Object.keys(responses).length;
  const totalCount = pendingQuestions.length;
  const progressPct = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-3xl space-y-6">
      {/* ── Official Identity Card (read-only) ───────────────────────────── */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3 mb-4">
          <span className="p-1.5 bg-green-50 rounded-lg text-green-700">
            <ShieldCheck className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Official Registered Identity
            </h4>
            <p className="text-[10px] text-stone-400">Verified by NIMC & State Registries</p>
          </div>
          <span className="ml-auto text-[10px] font-bold px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full">
            VERIFIED
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          {[
            { label: "Full Name", value: citizenName },
            { label: "Citizen Code", value: citizenCode, mono: true },
            { label: "Email", value: email },
            { label: "Phone", value: phoneNumber },
            {
              label: "NIN",
              value: nin ? `${nin.slice(0, 3)}•••••••${nin.slice(-2)}` : "N/A",
              mono: true,
            },
            { label: "Gender / Age", value: gender ? `${gender}, ${age} yrs` : "—" },
            { label: "State of Origin", value: stateOfOrigin },
            { label: "State of Residence", value: stateOfResidence },
            { label: "Address", value: address, span: true },
          ].map(({ label, value, mono, span }) => (
            <div key={label} className={span ? "col-span-2 md:col-span-3" : ""}>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">
                {label}
              </span>
              <span
                className={`font-semibold text-stone-800 ${mono ? "font-mono" : ""}`}
              >
                {value || "—"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Progressive Questionnaire ─────────────────────────────────────── */}
      <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm overflow-hidden">
        {/* Section header */}
        <div className="px-6 pt-6 pb-4 border-b border-stone-100">
          <h3 className="text-base font-bold font-serif text-stone-900 tracking-tight">
            Supplementary Profile Data
          </h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            Answer the questions below to improve your welfare match score.
            Your data is encrypted and protected under the Nigeria Data Protection Regulation (NDPR).
          </p>
        </div>



        {/* No questions (all done or none returned from login) */}
        {pendingQuestions.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 px-6 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center border border-green-200">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <h4 className="text-sm font-bold text-stone-900">Profile Complete</h4>
            <p className="text-xs text-stone-500 max-w-xs">
              All supplementary data has been collected. No pending questions remain for your current age cohort.
            </p>
          </div>
        )}

        {/* Submitted success */}
        {submitted && (
          <div className="flex flex-col items-center gap-3 py-16 px-6 text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center border border-green-200">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <h4 className="text-sm font-bold text-stone-900">Submitted Successfully</h4>
            <p className="text-xs text-stone-500 max-w-xs">
              Your answers have been recorded. Your welfare eligibility match is being recalculated.
            </p>
          </div>
        )}

        {/* Active questionnaire */}
        {pendingQuestions.length > 0 && !submitted && (
          <div className="p-6 space-y-6">
            {/* Overall progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold">{answeredCount} of {totalCount} answered</span>
                <span className="font-bold text-green-700">{progressPct}%</span>
              </div>
              <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-green-700 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Category stepper */}
            {categories.length > 1 && (
              <CategoryStepper
                categories={categories}
                currentIndex={currentCategoryIndex}
              />
            )}

            {/* Category heading */}
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Section {currentCategoryIndex + 1} of {categories.length}
              </p>
              <h4 className="text-lg font-bold font-serif text-stone-900">
                {getCategoryMeta(currentCategory).label}
              </h4>
            </div>

            {/* Question cards */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                {questionsForCategory.map((q, i) => (
                  <QuestionCard
                    key={q.fieldName}
                    question={q}
                    index={i}
                    value={responses[q.fieldName]}
                    onChange={handleChange}
                    touched={touched}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* PII notice if any question in category is sensitive */}
            {questionsForCategory.some((q) => q.piiSensitive) && (
              <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                <span>
                  <strong>NDPR Notice:</strong> Some fields in this section contain personally
                  identifiable information (PII). All data is encrypted in transit and at rest, and
                  processed under the authority of the Nigeria Data Protection Act 2023.
                </span>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentCategoryIndex === 0}
                className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-stone-600 border border-stone-200 rounded-xl hover:bg-stone-50 transition-all disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              {isLastCategory ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-7 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-bold rounded-xl shadow-sm shadow-green-700/20 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {submitting ? "Submitting…" : "Submit Profile Data"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-7 py-2.5 bg-stone-900 hover:bg-black text-white text-sm font-bold rounded-xl active:scale-[0.98] transition-all cursor-pointer"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
