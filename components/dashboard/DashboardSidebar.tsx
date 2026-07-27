"use client";

import { motion, AnimatePresence } from "motion/react";
import { Download, LogOut, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { SidebarItem } from "./types";

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  citizenName: string;
  citizenEmail: string;
  cohortName: string;
  avatarInitials: string;
  avatarImage: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null> | React.RefObject<HTMLInputElement> | any;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogout: () => void;
  sidebarItems: SidebarItem[];
}

export function DashboardSidebar({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  citizenName,
  citizenEmail,
  cohortName,
  avatarInitials,
  avatarImage,
  fileInputRef,
  handleAvatarChange,
  handleLogout,
  sidebarItems,
}: DashboardSidebarProps) {
  return (
    <>
      {/* Hidden input for picture uploading */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        className="hidden"
      />

      {/* --- SIDEBAR - Desktop --- */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 left-0 bg-white border-r border-stone-200/80 p-6 z-25 overflow-y-auto">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-700 text-[#FFD100] shadow-sm">
            <span className="font-bold font-serif text-base text-yellow-400">CE</span>
          </div>
          <span className="text-lg font-serif font-bold text-stone-900 tracking-tight">
            CitiEye Governance
          </span>
        </div>

        {/* Profile Card in Sidebar */}
        <div className="flex flex-col items-center text-center p-4 bg-stone-50 border border-stone-200/60 rounded-3xl mb-6 relative group">
          <div className="relative mb-3">
            <div className="w-18 h-18 rounded-full bg-green-800 text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md overflow-hidden border-2 border-white">
              {avatarImage ? (
                <img src={avatarImage} alt={citizenName} className="w-full h-full object-cover" />
              ) : (
                avatarInitials
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 bg-green-700 hover:bg-green-800 text-white rounded-full p-1.5 shadow-sm border border-white cursor-pointer transition-transform group-hover:scale-110"
              title="Upload profile picture"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <h4 className="text-sm font-semibold text-stone-900 leading-tight mb-1">{citizenName}</h4>
          <p className="text-[10px] text-stone-400 font-mono tracking-wider mb-2">{citizenEmail}</p>
          <div className="px-3 py-1 bg-green-700 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
            {cohortName}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? "bg-green-700 text-white shadow-sm shadow-green-750/10"
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-stone-400 group-hover:text-green-700"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* App Download Promo */}
        <div className="mt-auto pt-6 border-t border-stone-100 space-y-4">
          <div className="p-3.5 bg-gradient-to-br from-green-50 to-stone-50 border border-green-200/80 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-700 opacity-5 rounded-full translate-x-4 -translate-y-4"></div>
            <div className="flex gap-2">
              <div className="p-1.5 bg-green-100 rounded-lg text-green-700 shrink-0 self-start">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-[11px] font-bold text-green-900 uppercase tracking-wide">Download Mobile App</h5>
                <p className="text-[10px] text-stone-500 mt-0.5 leading-normal">
                  Access notifications, scanning, and offline logs instantly.
                </p>
                <a
                  href="#download-app"
                  onClick={() => toast.info("CitiEye Mobile app binary download started (Mock).")}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 hover:text-green-800 mt-2 transition-colors"
                >
                  Download (.apk) →
                </a>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 border border-stone-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 rounded-2xl font-semibold text-xs text-stone-600 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out Workspace
          </button>
        </div>
      </aside>

      {/* --- SIDEBAR - Mobile Slider --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 bg-white p-6 z-50 overflow-y-auto flex flex-col lg:hidden border-r border-stone-200"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-700 text-yellow-500">
                    <span className="font-bold font-serif text-base text-yellow-400">CE</span>
                  </div>
                  <span className="text-lg font-serif font-bold text-stone-900">
                    CitiEye Governance
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Card */}
              <div className="flex flex-col items-center text-center p-4 bg-stone-50 border border-stone-200/60 rounded-3xl mb-6">
                <div className="w-16 h-16 rounded-full bg-green-800 text-white flex items-center justify-center font-serif text-xl font-bold shadow-md mb-2 overflow-hidden border border-white">
                  {avatarImage ? (
                    <img src={avatarImage} alt={citizenName} className="w-full h-full object-cover" />
                  ) : (
                    avatarInitials
                  )}
                </div>
                <h4 className="text-sm font-semibold text-stone-900 mb-0.5">{citizenName}</h4>
                <p className="text-[10px] text-stone-400 font-mono mb-2">{citizenEmail}</p>
                <div className="px-3 py-1 bg-green-700 text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
                  {cohortName}
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="flex-1 space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        isActive ? "bg-green-700 text-white shadow-sm" : "text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                            isActive ? "bg-white/20 text-white" : "bg-stone-100 text-stone-650"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Footer Actions */}
              <div className="mt-auto pt-6 border-t border-stone-100 space-y-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    toast.info("Artisan mobile app download scheduled.");
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-stone-50 border border-stone-200 text-stone-700 text-xs font-semibold rounded-2xl cursor-pointer"
                >
                  <Download className="w-4 h-4 text-green-700" />
                  Download Mobile App
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-red-150 hover:bg-red-50 hover:text-red-650 rounded-2xl font-semibold text-xs text-stone-500 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  Sign Out Workspace
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
