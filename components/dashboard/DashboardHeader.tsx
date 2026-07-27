"use client";

import { Menu, Copy } from "lucide-react";

interface DashboardHeaderProps {
  activeTab: string;
  setMobileMenuOpen: (open: boolean) => void;
  citizenCode: string;
  copyCitizenCode: () => void;
}

export function DashboardHeader({
  activeTab,
  setMobileMenuOpen,
  citizenCode,
  copyCitizenCode,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 md:px-8 py-4 flex items-center justify-between z-20 shadow-sm shadow-stone-100/30">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger menu */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 hover:bg-stone-100 border border-stone-200 rounded-xl cursor-pointer"
        >
          <Menu className="w-5 h-5 text-stone-700" />
        </button>

        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Citizen Workspace</span>
          <h1 className="text-lg md:text-xl font-serif font-bold text-stone-900 capitalize">
            {activeTab === "opportunities" ? "Programs & Support Opportunities" : activeTab.replace("-", " ")}
          </h1>
        </div>
      </div>

      {/* Citizen Code / Reference Card */}
      <div className="flex items-center gap-2 bg-stone-50 border border-stone-200/80 px-3 md:px-4 py-2 rounded-2xl shadow-inner max-w-xs md:max-w-md">
        <div className="hidden md:block">
          <span className="text-[9px] uppercase font-bold tracking-widest text-stone-400 block leading-none">Citizen Ref</span>
          <code className="text-xs font-mono font-bold text-stone-700 tracking-wide">{citizenCode}</code>
        </div>
        <div className="md:hidden">
          <code className="text-[11px] font-mono font-bold text-stone-700">{citizenCode.slice(0, 11)}..</code>
        </div>
        <button
          onClick={copyCitizenCode}
          className="p-1.5 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          title="Copy Citizen Code"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
