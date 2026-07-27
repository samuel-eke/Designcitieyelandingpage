"use client";

import { LucideIcon } from "lucide-react";

interface KpiStatCardProps {
  title: string;
  value: string;
  sublabel: string;
  badgeText?: string;
  badgeType?: "success" | "warning" | "info" | "neutral";
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
}

export function KpiStatCard({
  title,
  value,
  sublabel,
  badgeText,
  badgeType = "success",
  icon: Icon,
  iconBg = "bg-green-50",
  iconColor = "text-green-700",
}: KpiStatCardProps) {
  const badgeStyles = {
    success: "bg-emerald-100 text-emerald-800 border-emerald-200",
    warning: "bg-amber-100 text-amber-800 border-amber-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    neutral: "bg-stone-100 text-stone-700 border-stone-200",
  };

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between relative overflow-hidden group">
      {/* Top Header: Title & Icon */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
            {title}
          </span>
          <h3 className="text-xl md:text-2xl font-bold font-serif text-stone-900 leading-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-2xl ${iconBg} ${iconColor} shrink-0 group-hover:scale-105 transition-transform duration-200`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Footer: Sublabel & Badge */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
        <span className="text-stone-500 font-medium truncate">{sublabel}</span>
        {badgeText && (
          <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border shrink-0 ${badgeStyles[badgeType]}`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
