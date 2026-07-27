"use client";

import { CheckCircle2, AlertCircle, ArrowRight, UserCheck } from "lucide-react";
import { ProfileData } from "./types";

interface ProfileCompletionCardProps {
  profileData: ProfileData;
  onNavigateToProfile: () => void;
}

export function ProfileCompletionCard({
  profileData,
  onNavigateToProfile,
}: ProfileCompletionCardProps) {
  // Calculate completion percentage based on filled fields
  const fields = [
    { key: "bio", label: "Bio / Personal Statement", filled: !!profileData.bio },
    { key: "ninVerified", label: "NIN Verification", filled: profileData.ninVerified },
    { key: "educationalLevel", label: "Education Level", filled: !!profileData.educationalLevel },
    { key: "occupation", label: "Employment / Occupation", filled: !!profileData.occupation },
  ];

  const completedCount = fields.filter((f) => f.filled).length;
  const percentage = Math.round((completedCount / fields.length) * 100);

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-50 rounded-xl text-green-700">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-serif text-stone-900">
              Profile Completeness
            </h3>
            <p className="text-[11px] text-stone-500">Unlocks tier-2 welfare matching</p>
          </div>
        </div>
        <span className="text-lg font-bold font-serif text-green-700">
          {percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-green-700 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Checklist items */}
      <div className="space-y-2 pt-1">
        {fields.map((field) => (
          <div
            key={field.key}
            className="flex items-center justify-between text-xs py-1 px-2.5 rounded-xl bg-stone-50/80"
          >
            <span className="text-stone-600 font-medium">{field.label}</span>
            {field.filled ? (
              <span className="flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-600 font-semibold text-[11px]">
                <AlertCircle className="w-3.5 h-3.5" /> Pending
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Action CTA */}
      <button
        onClick={onNavigateToProfile}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer group"
      >
        <span>Update Profile Details</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
