"use client";

import React, { useState } from "react";
import {
  Search,
  Sparkles,
  Plus,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Building,
} from "lucide-react";
import { cn } from "@/components/ui/utils";

interface TopBarProps {
  email: string;
  role: string;
  onLogout: () => void;
  onSearchChange?: (val: string) => void;
  searchValue?: string;
  onSyncViews?: () => void;
  isSyncing?: boolean;
  isSuperAdmin?: boolean;
}

export function TopBar({
  email,
  role,
  onLogout,
  onSearchChange,
  searchValue = "",
  onSyncViews,
  isSyncing = false,
  isSuperAdmin = false,
}: TopBarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <header className="bg-white border-b border-slate-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Search Input Area */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search anything..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 focus:border-blue-500 focus:bg-white rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Sparkles / AI Assistant Trigger */}
        <button
          onClick={() => alert("CitiEye AI Assistant is currently in beta clearance.")}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer outline-none"
          title="AI Assistant"
        >
          <Sparkles className="w-4.5 h-4.5 text-indigo-500" />
        </button>

        {/* Sync Views (moved to top bar as it represents the database update action) */}
        {isSuperAdmin && onSyncViews && (
          <button
            onClick={onSyncViews}
            disabled={isSyncing}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 border border-green-150 rounded-xl text-[11px] font-bold text-green-700 transition-all outline-none cursor-pointer disabled:opacity-50"
            )}
            title="Synchronize materialized views"
          >
            <span className={cn("w-1.5 h-1.5 rounded-full bg-green-500", isSyncing ? "animate-ping" : "")} />
            {isSyncing ? "Syncing..." : "Sync Ledger"}
          </button>
        )}

        {/* Primary Action Button */}
        <button
          onClick={() => alert("Redirecting to Citizen Enrollment Module...")}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/10 active:scale-[0.98] transition-all outline-none cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Citizen</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer outline-none">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 border border-white" />
          </button>
        </div>

        {/* Theme Toggle (Mocked) */}
        <button
          onClick={() => {
            setIsDarkMode(!isDarkMode);
            alert("DarkMode toggle is managed by local workspace user options.");
          }}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer outline-none"
        >
          {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </button>

        {/* Vertical Divider */}
        <div className="w-px h-5 bg-slate-200/80" />

        {/* User Profile Area */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 group hover:bg-slate-50 p-1.5 rounded-xl transition-all outline-none cursor-pointer"
          >
            <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 border border-slate-200/50">
              {email ? email[0].toUpperCase() : "A"}
            </div>
            <div className="hidden md:flex flex-col items-start leading-tight text-left">
              <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                Howdy, {email.split("@")[0]}
              </span>
              <span className="text-[9px] text-slate-400 font-mono font-medium tracking-wider uppercase">
                {role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-150 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 leading-tight">
                  <span className="text-xs font-bold text-slate-800 block truncate">
                    {email}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Clearance: {role}
                  </span>
                </div>
                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      alert("Opening profile security configurations...");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs text-slate-600 hover:text-slate-800 hover:bg-slate-50 font-medium transition-colors outline-none cursor-pointer"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My clearance</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      alert("Opening settings...");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs text-slate-600 hover:text-slate-800 hover:bg-slate-50 font-medium transition-colors outline-none cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs text-red-655 hover:text-red-700 hover:bg-red-50 font-medium transition-colors outline-none cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
