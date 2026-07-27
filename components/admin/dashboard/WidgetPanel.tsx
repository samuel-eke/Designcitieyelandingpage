"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/components/ui/utils";

interface WidgetPanelProps {
  title: string;
  icon?: LucideIcon;
  badgeText?: string;
  badgeColor?: "blue" | "green" | "gray" | "amber";
  children: React.ReactNode;
  footerLabel?: string;
  onFooterClick?: () => void;
  className?: string;
}

export function WidgetPanel({
  title,
  icon: Icon,
  badgeText,
  badgeColor = "blue",
  children,
  footerLabel,
  onFooterClick,
  className = "",
}: WidgetPanelProps) {
  const badgeClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    gray: "bg-slate-50 text-slate-600 border-slate-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div
      className={cn(
        "bg-white border border-slate-200/60 rounded-3xl shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-sm transition-all",
        className
      )}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 select-none bg-slate-50/20">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-slate-400" />}
          <h4 className="text-xs font-mono font-bold text-slate-750 uppercase tracking-widest leading-none">
            {title}
          </h4>
        </div>
        {badgeText && (
          <span
            className={cn(
              "text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-md border uppercase shrink-0 leading-none",
              badgeClasses[badgeColor]
            )}
          >
            {badgeText}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-5 overflow-y-auto text-slate-600">
        {children}
      </div>

      {/* Footer */}
      {footerLabel && (
        <div className="px-5 py-3.5 border-t border-slate-100 shrink-0 flex items-center justify-between bg-slate-50/10">
          <button
            onClick={onFooterClick}
            className="text-[10px] font-mono font-bold text-blue-600 hover:text-blue-500 transition-colors uppercase tracking-widest flex items-center gap-1.5 outline-none cursor-pointer"
          >
            <span>{footerLabel}</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
}
