"use client";

import React, { useState, useEffect } from "react";
import {
  Wrench,
  Hammer,
  Award,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { getVocationalProfile } from "@/lib/services/vocationalService";
import type { VocationalProfile } from "@/lib/types/vocational";
import { VocationalProfileDialog } from "./VocationalProfileDialog";

interface VocationalPortalCardProps {
  citizenCode: string;
  employmentStatus?: string;
  onNavigateTab?: (tab: string) => void;
}

export function VocationalPortalCard({
  citizenCode,
  employmentStatus,
  onNavigateTab,
}: VocationalPortalCardProps) {
  const [profile, setProfile] = useState<VocationalProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const isEligible =
    employmentStatus?.toLowerCase() === "artisan" ||
    employmentStatus?.toLowerCase() === "unemployed" ||
    true; // By default allow checking or building if citizen code exists

  const loadProfile = async () => {
    if (!citizenCode) return;
    try {
      const data = await getVocationalProfile(citizenCode);
      setProfile(data);
    } catch (err) {
      // 404 or 422 if not created yet
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [citizenCode]);

  // Calculate profile completeness
  const calculateCompleteness = () => {
    if (!profile) return 0;
    let score = 0;
    if (profile.tradeSpecialization) score += 25;
    if (profile.acquiredSkills && (Array.isArray(profile.acquiredSkills) ? profile.acquiredSkills.length > 0 : String(profile.acquiredSkills).length > 0)) score += 25;
    if (profile.proficiencyLevel) score += 20;
    if (profile.vocationalDevelopmentGoals || profile.plannedApprenticeships) score += 15;
    if (profile.certifications) score += 15;
    return score;
  };

  const completeness = calculateCompleteness();

  const skillsList = React.useMemo(() => {
    if (!profile?.acquiredSkills) return [];
    if (Array.isArray(profile.acquiredSkills)) return profile.acquiredSkills.map(String);
    if (typeof profile.acquiredSkills === "string") {
      return profile.acquiredSkills.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [];
  }, [profile?.acquiredSkills]);

  return (
    <>
      <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm space-y-4 hover:border-amber-200 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Artisan & Vocational Portal
              </h4>
              <p className="text-[10px] text-stone-400 font-mono">
                Skills Census & Technical Development
              </p>
            </div>
          </div>
          {profile && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
              {completeness}% Profile Done
            </span>
          )}
        </div>

        {/* Content */}
        {profile ? (
          <div className="space-y-3">
            {/* Trade & Level */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">
                  {profile.tradeSpecialization}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                  {profile.proficiencyLevel?.replace("_", " ")}
                </span>
              </div>
              {profile.careerTrajectories && (
                <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                  Goal: {profile.careerTrajectories}
                </p>
              )}
            </div>

            {/* Skills Pills */}
            {skillsList.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Verified Skills:
                </span>
                <div className="flex flex-wrap gap-1">
                  {skillsList.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {skillsList.length > 4 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-500 font-bold">
                      +{skillsList.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-100 text-center space-y-1.5">
            <Hammer className="w-5 h-5 text-amber-600 mx-auto" />
            <p className="text-xs font-bold text-stone-800">Vocational Profile Inactive</p>
            <p className="text-[11px] text-stone-500">
              Log your artisan trade, technical competencies, and apprenticeship targets to unlock federal tooling grants.
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-amber-600/20 cursor-pointer"
        >
          <span>{profile ? "Manage Vocational Profile" : "Activate Vocational Profile"}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <VocationalProfileDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        citizenCode={citizenCode}
        onSuccess={loadProfile}
      />
    </>
  );
}
