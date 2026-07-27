"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Activity,
  Briefcase,
  Building,
  Heart,
  Shield,
  UserCheck,
  Key,
  Settings,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { cn } from "@/components/ui/utils";

interface SidebarNavProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  role: string;
}

export function SidebarNav({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  role,
}: SidebarNavProps) {
  const hasAccess = (itemId: string, userRole: string): boolean => {
    const roleLower = userRole.toLowerCase();
    // Admins have access to everything
    if (
      roleLower === "super_admin" ||
      roleLower === "superadmin" ||
      roleLower === "agency_admin" ||
      roleLower === "agencyadmin"
    ) {
      return true;
    }
    // Domain specific clearance for field officers
    if (roleLower === "field_officer_health") {
      return ["overview", "registry", "health_domain"].includes(itemId);
    }
    if (roleLower === "field_officer_education") {
      return ["overview", "registry", "education"].includes(itemId);
    }
    if (roleLower === "field_officer") {
      return ["overview", "registry"].includes(itemId);
    }
    return ["overview"].includes(itemId); // Default fallback
  };

  const sections = [
    {
      title: "CORE",
      items: [
        { id: "overview", label: "Dashboard", icon: LayoutDashboard },
        { id: "registry", label: "Citizens", icon: Users },
      ],
    },
    {
      title: "DOMAINS",
      items: [
        { id: "education", label: "Education", icon: GraduationCap },
        { id: "health_domain", label: "Health", icon: Activity },
        { id: "hr", label: "HR & Jobs", icon: Briefcase },
        { id: "business", label: "Business Affairs", icon: Building },
        { id: "pension", label: "Pension", icon: Heart },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { id: "officers", label: "Field Officers", icon: UserCheck },
        { id: "users", label: "Users & Roles", icon: Key },
        { id: "settings", label: "Settings", icon: Settings },
      ],
    },
  ].map(section => ({
    ...section,
    items: section.items.filter(item => hasAccess(item.id, role))
  })).filter(section => section.items.length > 0);

  return (
    <aside
      className={cn(
        "bg-white border-r border-slate-100 flex flex-col justify-between transition-all duration-300 h-full select-none",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Top Section */}
      <div className="flex-1 overflow-y-auto py-5 scrollbar-none">
        {/* Logo / Header */}
        <div className={cn("px-4 mb-6 flex items-center gap-3")}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <Eye className="w-5 h-5 stroke-[2.5]" />
          </div>
          {!isCollapsed && (
            <div className="leading-tight">
              <span className="text-xs font-bold text-slate-800 tracking-tight block">
                CitiEye
              </span>
              <span className="text-[9px] text-slate-400 font-mono font-medium tracking-wider uppercase block">
                Admin Panel
              </span>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 space-y-5">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1.5">
              {/* Section Header */}
              {!isCollapsed && (
                <span className="text-[9px] font-bold text-slate-400 font-mono tracking-widest uppercase block px-3">
                  {section.title}
                </span>
              )}

              {/* Section Items */}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  // Map custom state tabs to our main tab triggers
                  const isActive =
                    activeTab === item.id ||
                    (item.id === "health_domain" && activeTab === "health");

                  const handleClick = () => {
                    if (item.id === "health_domain") {
                      setActiveTab("health");
                    } else {
                      setActiveTab(item.id);
                    }
                  };

                  return (
                    <button
                      key={item.id}
                      onClick={handleClick}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 outline-none cursor-pointer border border-transparent",
                        isActive
                          ? "bg-blue-50 text-blue-600 font-bold"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                      )}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-colors",
                          isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                        )}
                      />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Collapse Trigger at bottom */}
      <div className="p-3 border-t border-slate-100 shrink-0">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors text-xs font-mono outline-none cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
