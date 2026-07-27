"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { cn } from "@/components/ui/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
    label?: string;
  };
  footerLabel?: string;
  onFooterClick?: () => void;
  accentColor?: "blue" | "green" | "purple" | "orange" | "cyan" | "pink";
  type?: "default" | "progress";
  progressValue?: number;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  footerLabel = "View report",
  onFooterClick,
  accentColor = "blue",
  type = "default",
  progressValue = 0,
}: StatCardProps) {
  // Styles based on accent colors
  const accentClasses = {
    blue: {
      badge: "bg-blue-50 text-blue-500",
      trend: "text-blue-500",
      sparkline: "#3b82f6",
    },
    green: {
      badge: "bg-emerald-50 text-emerald-500",
      trend: "text-emerald-500",
      sparkline: "#10b981",
    },
    purple: {
      badge: "bg-purple-50 text-purple-500",
      trend: "text-purple-500",
      sparkline: "#8b5cf6",
    },
    orange: {
      badge: "bg-amber-50 text-amber-500",
      trend: "text-amber-500",
      sparkline: "#f59e0b",
    },
    cyan: {
      badge: "bg-cyan-50 text-cyan-500",
      trend: "text-cyan-500",
      sparkline: "#06b6d4",
    },
    pink: {
      badge: "bg-pink-50 text-pink-500",
      trend: "text-pink-500",
      sparkline: "#ec4899",
    },
  };

  const style = accentClasses[accentColor];

  // Circular progress ring calculation
  const radius = 34;
  const strokeWidth = 6.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressValue / 100) * circumference;

  return (
    <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs hover:shadow-sm hover:border-slate-300/60 transition-all flex flex-col justify-between h-[180px] group relative overflow-hidden">
      {/* Top Row: Title & Icon */}
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold leading-none">
          {title}
        </span>
        <div className={cn("p-2.5 rounded-2xl shrink-0 transition-transform group-hover:scale-105 duration-300", style.badge)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Center Row: Value & Graphic */}
      <div className="flex items-end justify-between my-2">
        {type === "progress" ? (
          /* Circular Progress Ring Mode */
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="stroke-slate-100 fill-none"
                  strokeWidth={strokeWidth}
                />
                {/* Progress Ring */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className={cn(
                    "fill-none transition-all duration-1000",
                    accentColor === "green" ? "stroke-emerald-500" : "stroke-blue-500"
                  )}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-[14px] font-mono font-bold text-slate-800">
                  {progressValue}%
                </span>
              </div>
            </div>
            <div className="leading-tight">
              <h3 className="text-2xl font-serif font-bold text-slate-800">{value}</h3>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-medium">
                Excellent Status
              </span>
            </div>
          </div>
        ) : (
          /* Standard Sparkline Mode */
          <>
            <div className="space-y-1">
              <h3 className="text-3xl font-serif font-bold text-slate-800 tracking-tight">
                {value}
              </h3>
              {trend && (
                <div className="flex items-center gap-1">
                  {trend.isPositive ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  )}
                  <span
                    className={cn(
                      "text-[10px] font-mono font-bold uppercase",
                      trend.isPositive ? "text-emerald-500" : "text-rose-500"
                    )}
                  >
                    {trend.value}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">
                    {trend.label || "vs last 30d"}
                  </span>
                </div>
              )}
            </div>

            {/* Sparkline Graphic (SVG) */}
            <div className="w-24 h-12 shrink-0">
              <svg className="w-full h-full" viewBox="0 0 100 30">
                <path
                  d="M0,25 Q15,10 30,22 T60,5 T90,20 L100,15"
                  fill="none"
                  stroke={style.sparkline}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </>
        )}
      </div>

      {/* Bottom Row: Footer Action */}
      <div className="border-t border-slate-100 pt-2 shrink-0 flex items-center justify-between">
        <button
          onClick={onFooterClick}
          className="text-[10px] font-mono font-bold text-blue-600 hover:text-blue-500 transition-colors uppercase tracking-widest flex items-center gap-1.5 outline-none cursor-pointer"
        >
          <span>{footerLabel}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
