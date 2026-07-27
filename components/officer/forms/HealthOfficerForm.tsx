"use client";

import React, { useState } from "react";
import {
  Stethoscope,
  Baby,
  Heart,
  Activity,
  Loader2,
  CheckCircle2,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  submitHealthRecord,
  getHealthRecords,
  HealthRecordPayload,
  HealthRecordType,
  HealthRecord,
} from "@/lib/services/officerService";

interface HealthOfficerFormProps {
  citizenCode: string;
  citizenName: string;
  existingRecords?: HealthRecord[];
  onSuccess?: () => void;
}

const RECORD_TYPES: { value: HealthRecordType; label: string; icon: React.ElementType; color: string }[] = [
  { value: "VACCINATION", label: "Vaccination", icon: Baby, color: "emerald" },
  { value: "SCREENING", label: "Screening", icon: Activity, color: "blue" },
  { value: "NUTRITION", label: "Nutrition", icon: Heart, color: "rose" },
  { value: "MATERNAL", label: "Maternal Care", icon: Heart, color: "pink" },
  { value: "CHRONIC", label: "Chronic Condition", icon: Stethoscope, color: "amber" },
  { value: "GENERAL", label: "General Health", icon: Stethoscope, color: "slate" },
];

const colorMap: Record<string, string> = {
  emerald: "bg-emerald-50 border-emerald-400 ring-emerald-200 text-emerald-700",
  blue: "bg-blue-50 border-blue-400 ring-blue-200 text-blue-700",
  rose: "bg-rose-50 border-rose-400 ring-rose-200 text-rose-700",
  pink: "bg-pink-50 border-pink-400 ring-pink-200 text-pink-700",
  amber: "bg-amber-50 border-amber-400 ring-amber-200 text-amber-700",
  slate: "bg-slate-50 border-slate-300 ring-slate-200 text-slate-700",
};

export function HealthOfficerForm({
  citizenCode,
  citizenName,
  existingRecords = [],
  onSuccess,
}: HealthOfficerFormProps) {
  const [recordType, setRecordType] = useState<HealthRecordType>("VACCINATION");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!description.trim()) errs.description = "Description is required";
    if (description.trim().length < 10) errs.description = "Please provide a more detailed description (min 10 chars)";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload: HealthRecordPayload = {
        citizenCode,
        recordType,
        description: description.trim(),
        notes: notes.trim() || undefined,
      };
      await submitHealthRecord(payload);
      toast.success(`Health record (${recordType}) submitted successfully!`);
      setDescription("");
      setNotes("");
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to submit health record.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const selectedType = RECORD_TYPES.find((t) => t.value === recordType)!;
  const colorClass = colorMap[selectedType.color];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600">
          <Stethoscope className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Health &amp; Care Record</h3>
          <p className="text-[10px] text-slate-400 font-mono">
            Submitting for: <span className="text-slate-600 font-bold">{citizenName}</span> · {citizenCode}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Record Type Selector */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
            Record Type *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {RECORD_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = recordType === type.value;
              return (
                <button
                  type="button"
                  key={type.value}
                  onClick={() => setRecordType(type.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    isSelected
                      ? `${colorMap[type.color]} ring-2`
                      : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1.5" />
                  <span className="text-[11px] font-bold block">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
            Clinical Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors((p) => ({ ...p, description: "" }));
            }}
            rows={4}
            placeholder={
              recordType === "VACCINATION"
                ? "e.g. Administered OPV dose 2. Child present with parent. No adverse reactions noted."
                : recordType === "MATERNAL"
                ? "e.g. Antenatal visit 3. Blood pressure: 120/80. Fundal height: 28cm. Baby heartbeat normal."
                : "Describe the health observation or intervention in detail..."
            }
            className={`w-full px-4 py-3 bg-slate-50 border ${
              errors.description ? "border-red-400" : "border-slate-200"
            } rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all resize-none placeholder-slate-300`}
          />
          {errors.description && (
            <span className="text-[10px] text-red-500">{errors.description}</span>
          )}
        </div>

        {/* Notes (optional) */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
            Officer Notes (Optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Follow-up scheduled in 2 weeks. Refer to PHC if fever persists."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all placeholder-slate-300"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {loading ? "Submitting Record..." : "Submit Health Record"}
        </button>
      </form>

      {/* Existing Records History */}
      {existingRecords.length > 0 && (
        <div className="border border-slate-100 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <span>Past Records ({existingRecords.length})</span>
            {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showHistory && (
            <div className="divide-y divide-slate-100">
              {existingRecords.map((rec) => (
                <div key={rec.id} className="px-4 py-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase">
                      {rec.recordType}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {new Date(rec.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">{rec.description}</p>
                  {rec.notes && (
                    <p className="text-[10px] text-slate-400 italic">{rec.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
