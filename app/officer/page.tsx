"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  LogOut,
  Eye,
  Stethoscope,
  GraduationCap,
  Briefcase,
  Building,
  Heart,
  User,
  ClipboardList,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Search,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore, extractUserRole } from "@/components/auth/authStore";
import { CitizenLookup } from "@/components/officer/CitizenLookup";
import { HealthOfficerForm } from "@/components/officer/forms/HealthOfficerForm";
import { EducationOfficerForm } from "@/components/officer/forms/EducationOfficerForm";
import { getHealthRecords, HealthRecord, getAllCitizens, lookupCitizenByCode } from "@/lib/services/officerService";
import type { CitizenProfileAnalyticsDto } from "@/lib/types/citieye";

// ---------------------------------------------------------------------------
// Role → specialty config map
// ---------------------------------------------------------------------------
type Specialty = "health" | "education" | "hr" | "corporate_affairs" | "pension" | "general";

interface SpecialtyConfig {
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
}

const SPECIALTY_CONFIG: Record<Specialty, SpecialtyConfig> = {
  health: {
    label: "Health & Care",
    description: "Vaccination, screening, maternal, and chronic health records",
    icon: Stethoscope,
    color: "emerald",
    accentBg: "bg-emerald-600",
    accentText: "text-emerald-600",
    accentBorder: "border-emerald-500",
  },
  education: {
    label: "Education",
    description: "School enrollment, academic records, and literacy assessments",
    icon: GraduationCap,
    color: "blue",
    accentBg: "bg-blue-600",
    accentText: "text-blue-600",
    accentBorder: "border-blue-500",
  },
  hr: {
    label: "Workforce & HR",
    description: "Employment status, skills census, and income data",
    icon: Briefcase,
    color: "purple",
    accentBg: "bg-purple-600",
    accentText: "text-purple-600",
    accentBorder: "border-purple-500",
  },
  corporate_affairs: {
    label: "Business Affairs",
    description: "SME registry, trade classifications, and business data",
    icon: Building,
    color: "amber",
    accentBg: "bg-amber-600",
    accentText: "text-amber-600",
    accentBorder: "border-amber-500",
  },
  pension: {
    label: "Pension & Elderly",
    description: "Pre-retirement planning and senior welfare records",
    icon: Heart,
    color: "rose",
    accentBg: "bg-rose-600",
    accentText: "text-rose-600",
    accentBorder: "border-rose-500",
  },
  general: {
    label: "General Officer",
    description: "General citizen data collection and field observations",
    icon: ClipboardList,
    color: "slate",
    accentBg: "bg-slate-600",
    accentText: "text-slate-600",
    accentBorder: "border-slate-500",
  },
};

function resolveSpecialty(role: string): Specialty {
  const r = role.toLowerCase();
  if (r.includes("health")) return "health";
  if (r.includes("education")) return "education";
  if (r.includes("hr") || r.includes("workforce")) return "hr";
  if (r.includes("corporate") || r.includes("business")) return "corporate_affairs";
  if (r.includes("pension")) return "pension";
  return "general";
}

// ---------------------------------------------------------------------------
// Placeholder for unbuilt specialist forms
// ---------------------------------------------------------------------------
function ComingSoonForm({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
        <ClipboardList className="w-7 h-7 text-slate-400" />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-700">{label} Form</p>
        <p className="text-xs text-slate-400 mt-1">
          This module will be available when the server endpoint is live.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Officer Page
// ---------------------------------------------------------------------------
export default function OfficerPage() {
  const router = useRouter();
  const { user, accessToken, logout } = useAuthStore();

  const [specialty, setSpecialty] = useState<Specialty>("general");
  const [officerName, setOfficerName] = useState("Officer");
  const [officerEmail, setOfficerEmail] = useState("");
  const [officerRole, setOfficerRole] = useState("");

  const [foundCitizen, setFoundCitizen] = useState<CitizenProfileAnalyticsDto | null>(null);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  const [citizensList, setCitizensList] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listQuery, setListQuery] = useState("");
  const [listPage, setListPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchCitizensList = async (q: string, p: number) => {
    setLoadingList(true);
    try {
      const data = await getAllCitizens({ query: q, page: p, size: 5 });
      setCitizensList(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load registered citizens list.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (user || accessToken) {
      fetchCitizensList(listQuery, listPage);
    }
  }, [user, accessToken, listPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setListPage(0);
    fetchCitizensList(listQuery, 0);
  };

  const handleSelectCitizen = async (citizenCode: string) => {
    setLoadingRecords(true);
    try {
      const citizen = await lookupCitizenByCode(citizenCode);
      setFoundCitizen(citizen);
      toast.success(`Loaded profile for ${citizen.firstName} ${citizen.lastName}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load citizen profile.";
      toast.error(msg);
    } finally {
      setLoadingRecords(false);
    }
  };

  // Derive officer info from auth state
  useEffect(() => {
    if (user || accessToken) {
      const role = extractUserRole(user, accessToken);
      setOfficerRole(role);
      setSpecialty(resolveSpecialty(role));

      const name =
        user?.firstName ||
        user?.data?.firstName ||
        user?.name ||
        user?.data?.name ||
        "Officer";
      const email =
        user?.email ||
        user?.data?.email ||
        user?.identifier ||
        "";
      setOfficerName(name);
      setOfficerEmail(email);
    }
  }, [user, accessToken]);

  // When citizen found + health specialty, pre-fetch their health records
  useEffect(() => {
    if (!foundCitizen) {
      setHealthRecords([]);
      return;
    }
    if (specialty === "health") {
      setLoadingRecords(true);
      getHealthRecords(foundCitizen.citizenCode)
        .then(setHealthRecords)
        .catch(() => setHealthRecords([]))
        .finally(() => setLoadingRecords(false));
    }
  }, [foundCitizen, specialty]);

  const handleLogout = async () => {
    await logout();
    toast.success("Session ended. Goodbye, Officer.");
    router.push("/auth?mode=login&role=officer");
  };

  const config = SPECIALTY_CONFIG[specialty];
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ─────────── TOP NAVIGATION BAR ─────────── */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-700 text-yellow-400 shadow-sm">
              <Eye className="h-4 w-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-sm font-serif font-bold text-slate-900 tracking-tight block leading-tight">
                CitiEye Governance
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 block">
                Field Officer Portal
              </span>
            </div>
          </div>

          {/* Officer pill + logout */}
          <div className="flex items-center gap-3">
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.accentBorder} bg-slate-50`}>
              <Icon className={`w-3.5 h-3.5 ${config.accentText}`} />
              <span className={`text-[10px] font-bold font-mono uppercase tracking-wider ${config.accentText}`}>
                {config.label}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
              <User className="w-3.5 h-3.5" />
              <span className="font-medium">{officerName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-xl transition-all cursor-pointer uppercase tracking-wider"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─────────── MAIN TWO-PANE WORKSPACE ─────────── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ── LEFT PANEL: Citizen Lookup ── */}
          <div className="lg:col-span-4 space-y-5">
            {/* Welcome card */}
            <div className={`relative overflow-hidden rounded-2xl ${config.accentBg} p-5 text-white shadow-lg`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-8 -translate-y-8" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 opacity-80" />
                  <span className="text-[10px] font-mono uppercase tracking-widest opacity-70">
                    Authenticated
                  </span>
                </div>
                <h1 className="text-lg font-serif font-bold leading-tight">
                  Welcome, {officerName}
                </h1>
                <p className="text-xs opacity-70 mt-1">{officerEmail}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 rounded-full">
                  <Icon className="w-3 h-3" />
                  <span className="text-[10px] font-bold">{config.label} Specialist</span>
                </div>
              </div>
            </div>

            {/* Citizens Directory Widget */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <h2 className="text-xs font-bold text-slate-700 uppercase font-mono tracking-wider">
                    Citizens Directory
                  </h2>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-500 font-mono font-bold px-2 py-0.5 rounded-full">
                  Total: {totalElements}
                </span>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={listQuery}
                    onChange={(e) => setListQuery(e.target.value)}
                    placeholder="Search by name or code..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all placeholder-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1"
                >
                  Search
                </button>
              </form>

              {/* Citizens List */}
              {loadingList ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                  <span className="text-[10px] font-mono text-slate-400">Loading directory...</span>
                </div>
              ) : citizensList.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl">
                  <p className="text-xs text-slate-400 font-medium">No citizens found</p>
                  <p className="text-[10px] text-slate-300 font-mono mt-0.5">Try refining your search</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {citizensList.map((citizen) => {
                    const isSelected = foundCitizen?.citizenCode === citizen.citizenCode;
                    return (
                      <button
                        key={citizen.citizenCode}
                        onClick={() => handleSelectCitizen(citizen.citizenCode)}
                        className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? "bg-slate-950 border-slate-950 text-white shadow-md"
                            : "bg-slate-50 hover:bg-slate-100/70 border-slate-200/60 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-slate-200 text-slate-600"
                          }`}>
                            {citizen.firstName?.[0]}{citizen.lastName?.[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate leading-tight">
                              {citizen.fullName}
                            </p>
                            <p className={`text-[9px] font-mono mt-0.5 ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                              {citizen.citizenCode} · {citizen.gender} ({citizen.age} yrs)
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 flex flex-col items-end">
                          <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-blue-50 text-blue-600 border border-blue-100"
                          }`}>
                            {citizen.cohortName}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setListPage((p) => Math.max(0, p - 1))}
                    disabled={listPage === 0}
                    className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Page {listPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setListPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={listPage >= totalPages - 1}
                    className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT PANEL: Role-Scoped Form ── */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              {/* Form header */}
              <div className={`px-6 py-4 border-b border-slate-100 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${config.accentBg}/10 border ${config.accentBorder}/30`}>
                    <Icon className={`w-4 h-4 ${config.accentText}`} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">{config.label} Data Entry</h2>
                    <p className="text-[10px] text-slate-400 font-mono">{config.description}</p>
                  </div>
                </div>
                {foundCitizen && (
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                    <span>{foundCitizen.citizenCode}</span>
                    <button
                      onClick={() => setFoundCitizen(null)}
                      className="p-1 hover:bg-slate-100 hover:text-red-500 rounded-lg transition-colors cursor-pointer text-slate-400 font-bold"
                      title="Clear Selection"
                    >
                      X
                    </button>
                  </div>
                )}
              </div>

              {/* Form body */}
              <div className="p-6">
                {!foundCitizen ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                    <div className="w-16 h-16 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center">
                      <User className="w-8 h-8 text-slate-200" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-400">No citizen selected</p>
                      <p className="text-xs text-slate-300 mt-1">
                        Use the lookup panel on the left to find and select a citizen before entering data.
                      </p>
                    </div>
                  </div>
                ) : specialty === "health" ? (
                  <HealthOfficerForm
                    citizenCode={foundCitizen.citizenCode}
                    citizenName={`${foundCitizen.firstName} ${foundCitizen.lastName}`}
                    existingRecords={healthRecords}
                    onSuccess={() => {
                      // Re-fetch records after successful submit
                      getHealthRecords(foundCitizen.citizenCode)
                        .then(setHealthRecords)
                        .catch(() => {});
                    }}
                  />
                ) : specialty === "education" ? (
                  <EducationOfficerForm
                    citizenCode={foundCitizen.citizenCode}
                    citizenName={`${foundCitizen.firstName} ${foundCitizen.lastName}`}
                    onSuccess={() => {}}
                  />
                ) : (
                  <ComingSoonForm label={config.label} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─────────── FOOTER ─────────── */}
      <footer className="text-center py-4 text-[10px] text-slate-400 font-mono border-t border-slate-200/60">
        CitiEye Governance · Field Officer Network · Restricted Access
      </footer>
    </div>
  );
}
