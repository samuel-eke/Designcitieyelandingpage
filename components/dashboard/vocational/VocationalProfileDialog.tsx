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
  Wrench,
  Sparkles,
  Plus,
  X,
  CheckCircle2,
  Loader2,
  Award,
  Compass,
  Hammer,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  getVocationalProfile,
  saveVocationalProfile,
} from "@/lib/services/vocationalService";
import type {
  VocationalProfile,
  VocationalProfileRequest,
  VocationalProficiencyLevel,
} from "@/lib/types/vocational";

interface VocationalProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  citizenCode?: string;
  onSuccess?: () => void;
}

const COMMON_TRADES = [
  "Solar PV Installation & Maintenance",
  "Electrical Installation & Wiring",
  "Welding & Metal Fabrication",
  "Tailoring & Fashion Design",
  "Carpentry & Furniture Making",
  "Automotive Mechatronics & Repair",
  "Plumbing & Pipefitting",
  "Masonry, Tiling & Plastering",
  "Leatherworks & Shoemaking",
  "Hairdressing & Cosmetology",
  "Refrigeration & Air Conditioning",
  "Catering & Culinary Arts",
  "Computer Hardware & Phone Repair",
  "Graphic Design & Printing Press",
];

const SUGGESTED_SKILLS: Record<string, string[]> = {
  "Solar PV Installation & Maintenance": [
    "Inverter Sizing",
    "Solar Panel Mounting",
    "Battery Bank Wiring",
    "System Troubleshooting",
    "Safety Protocol",
  ],
  "Electrical Installation & Wiring": [
    "Conduit Wiring",
    "Distribution Board Setup",
    "Fault Tracing",
    "Earthing Systems",
    "Load Calculation",
  ],
  "Welding & Metal Fabrication": [
    "Arc Welding",
    "TIG / MIG Welding",
    "Metal Cutting & Grinding",
    "Blueprint Reading",
    "Gate & Railing Construction",
  ],
  "Tailoring & Fashion Design": [
    "Pattern Drafting",
    "Industrial Machine Operation",
    "Garment Fitting",
    "Embroidery & Finishing",
    "Fabric Selection",
  ],
  "Automotive Mechatronics & Repair": [
    "OBD2 Diagnostics",
    "Brake System Servicing",
    "Engine Overhaul",
    "Auto-Electrical Wiring",
    "Suspension Tuning",
  ],
};

const PROFICIENCY_LEVELS: {
  value: VocationalProficiencyLevel;
  label: string;
  desc: string;
}[] = [
  {
    value: "APPRENTICE",
    label: "Apprentice / Trainee",
    desc: "Currently undergoing training or learning fundamentals under a master artisan.",
  },
  {
    value: "INTERMEDIATE",
    label: "Journeyman / Intermediate",
    desc: "Can work independently on routine jobs and standard trade projects.",
  },
  {
    value: "ADVANCED",
    label: "Advanced Craftsman",
    desc: "Highly skilled with multi-year practical experience in complex assignments.",
  },
  {
    value: "MASTER_CRAFTSMAN",
    label: "Master Artisan",
    desc: "Expert licensed practitioner eligible to mentor apprentices and head workshops.",
  },
];

export function VocationalProfileDialog({
  isOpen,
  onClose,
  citizenCode,
  onSuccess,
}: VocationalProfileDialogProps) {
  const [tradeSpecialization, setTradeSpecialization] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState<VocationalProficiencyLevel>("INTERMEDIATE");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [careerTrajectories, setCareerTrajectories] = useState("");
  const [plannedApprenticeships, setPlannedApprenticeships] = useState("");
  const [vocationalDevelopmentGoals, setVocationalDevelopmentGoals] = useState("");
  const [certifications, setCertifications] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isExisting, setIsExisting] = useState(false);

  // Load existing profile on open
  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    getVocationalProfile(citizenCode)
      .then((data) => {
        setIsExisting(true);
        setTradeSpecialization(data.tradeSpecialization || "");
        setProficiencyLevel((data.proficiencyLevel as VocationalProficiencyLevel) || "INTERMEDIATE");

        // Parse skills
        if (Array.isArray(data.acquiredSkills)) {
          setSkills(data.acquiredSkills.map(String));
        } else if (typeof data.acquiredSkills === "string") {
          setSkills(
            data.acquiredSkills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          );
        } else {
          setSkills([]);
        }

        setCareerTrajectories(data.careerTrajectories || "");
        setPlannedApprenticeships(data.plannedApprenticeships || "");
        setVocationalDevelopmentGoals(data.vocationalDevelopmentGoals || "");
        setCertifications(data.certifications || "");
      })
      .catch((err) => {
        // If 404 or 422 (no profile yet)
        setIsExisting(false);
        setTradeSpecialization("");
        setSkills([]);
        setCareerTrajectories("");
        setPlannedApprenticeships("");
        setVocationalDevelopmentGoals("");
        setCertifications("");
      })
      .finally(() => setLoading(false));
  }, [isOpen, citizenCode]);

  const addSkill = (skillToAdd?: string) => {
    const s = (skillToAdd || newSkillInput).trim();
    if (!s) return;
    if (skills.some((existing) => existing.toLowerCase() === s.toLowerCase())) {
      toast.info("Skill already added");
      setNewSkillInput("");
      return;
    }
    setSkills((prev) => [...prev, s]);
    setNewSkillInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tradeSpecialization.trim()) {
      toast.error("Please specify your trade specialization.");
      return;
    }

    setSaving(true);
    try {
      const payload: VocationalProfileRequest = {
        tradeSpecialization: tradeSpecialization.trim(),
        acquiredSkills: skills,
        proficiencyLevel,
        careerTrajectories: careerTrajectories.trim() || undefined,
        plannedApprenticeships: plannedApprenticeships.trim() || undefined,
        vocationalDevelopmentGoals: vocationalDevelopmentGoals.trim() || undefined,
        certifications: certifications.trim() || undefined,
      };

      await saveVocationalProfile(payload, isExisting, citizenCode);
      toast.success("Vocational profile updated successfully!");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Vocational profile save error:", err);
      const status = err.response?.status;
      if (status === 422) {
        toast.error(
          "Access Restricted: Only citizens with economic status 'artisan' or 'unemployed' are eligible for vocational profiling."
        );
      } else {
        const msg =
          err.response?.data?.message ||
          (typeof err.response?.data === "string" ? err.response?.data : null) ||
          "Failed to save vocational profile.";
        toast.error(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  // Recommended skills based on chosen trade
  const tradeSuggestions = SUGGESTED_SKILLS[tradeSpecialization] || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl bg-white border border-stone-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold font-serif text-white">
                Artisan & Vocational Profile Builder
              </DialogTitle>
              <DialogDescription className="text-xs text-amber-100 mt-0.5">
                Record your trade specialization, practical skills, and apprenticeship goals to qualify for equipment grants and state vocational cohorts.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Loading overlay */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-7 h-7 text-amber-600 animate-spin" />
            <p className="text-xs text-stone-500 font-mono">
              Loading vocational profile records...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Section 1: Trade Specialization */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Primary Trade Specialization <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tradeSpecialization}
                  onChange={(e) => setTradeSpecialization(e.target.value)}
                  placeholder="e.g. Solar PV Installation & Maintenance"
                  required
                  list="trades-list"
                  className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-100 font-medium"
                />
                <datalist id="trades-list">
                  {COMMON_TRADES.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
              </div>

              {/* Trade Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {COMMON_TRADES.slice(0, 5).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTradeSpecialization(t)}
                    className={`text-[10px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                      tradeSpecialization === t
                        ? "bg-amber-100 text-amber-900 border-amber-300 font-bold"
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 2: Proficiency Level */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Craftsmanship & Proficiency Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PROFICIENCY_LEVELS.map((lvl) => (
                  <button
                    key={lvl.value}
                    type="button"
                    onClick={() => setProficiencyLevel(lvl.value)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      proficiencyLevel === lvl.value
                        ? "bg-amber-50/70 border-amber-500 ring-1 ring-amber-400 text-stone-900"
                        : "bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">{lvl.label}</span>
                      {proficiencyLevel === lvl.value && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                      )}
                    </div>
                    <p className="text-[10px] text-stone-500 mt-1 leading-snug">{lvl.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 3: Acquired Skills Tags */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Acquired Technical Skills & Competencies
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Type a skill (e.g. Blueprint Reading) and press Add..."
                  className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-amber-600 font-medium"
                />
                <button
                  type="button"
                  onClick={() => addSkill()}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>

              {/* Selected Skills Chips */}
              <div className="min-h-[44px] p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex flex-wrap gap-1.5 items-center">
                {skills.length === 0 ? (
                  <span className="text-[11px] text-stone-400 italic">
                    No specific skills logged yet. Add from suggestions below or type your own.
                  </span>
                ) : (
                  skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="p-0.5 hover:bg-amber-200 rounded text-amber-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Suggestions */}
              {tradeSuggestions.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Suggested:
                  </span>
                  {tradeSuggestions.map((sug) => {
                    const alreadyAdded = skills.includes(sug);
                    return (
                      <button
                        key={sug}
                        type="button"
                        disabled={alreadyAdded}
                        onClick={() => addSkill(sug)}
                        className={`text-[10px] px-2 py-0.5 rounded-md border transition-all ${
                          alreadyAdded
                            ? "bg-stone-100 text-stone-400 border-stone-200 cursor-default"
                            : "bg-white text-stone-600 border-stone-200 hover:border-amber-400 hover:text-amber-800 cursor-pointer"
                        }`}
                      >
                        + {sug}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Section 4: Planned Apprenticeships & Career Trajectories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Hammer className="w-3.5 h-3.5 text-stone-500" />
                  Planned Apprenticeships
                </label>
                <textarea
                  value={plannedApprenticeships}
                  onChange={(e) => setPlannedApprenticeships(e.target.value)}
                  placeholder="Master mentor workshops, industrial attachments, or training institutes..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-amber-600 placeholder:text-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-stone-500" />
                  Career Trajectories
                </label>
                <textarea
                  value={careerTrajectories}
                  onChange={(e) => setCareerTrajectories(e.target.value)}
                  placeholder="Target milestones: establishing registered workshop, joining craft cooperative..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-amber-600 placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* Section 5: Vocational Development Goals & Certifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Vocational Development Goals
                </label>
                <textarea
                  value={vocationalDevelopmentGoals}
                  onChange={(e) => setVocationalDevelopmentGoals(e.target.value)}
                  placeholder="Tools needed (e.g. Inverter welder, solar multimeter), startup capital targets..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-amber-600 placeholder:text-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-stone-500" />
                  Certifications & Trade Tests
                </label>
                <textarea
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  placeholder="e.g. Federal Ministry of Labour Trade Test Grade I/II, NABTEB Modular Cert..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-amber-600 placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* Eligibility notice */}
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>NDPR & Policy Compliance:</strong> Vocational profiling is linked to your citizen identity. The CitiEye system uses your skills and goals to match you directly with federal equipment grants and SME apprenticeships.
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-5 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-md shadow-amber-600/20 transition-all disabled:opacity-60 cursor-pointer"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                {saving ? "Saving Profile..." : "Save Vocational Profile"}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
