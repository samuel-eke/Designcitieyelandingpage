"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuthStore, extractUserRole, isAdminRole } from "@/components/auth/authStore";
import {
  Building2,
  Users,
  Activity,
  UserCheck,
  TrendingUp,
  MapPin,
  Heart,
  Database,
  Lock,
  Loader2,
  FileText,
  AlertCircle,
  Megaphone,
  Percent,
  Plus,
  ArrowUpRight,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Eye,
  EyeOff,
  ShieldAlert,
  Key,
  Terminal,
  Shield,
  Briefcase,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useStatesAndLgas } from "@/lib/hooks/useStatesAndLgas";
import {
  useAnalyticsSummary,
  useCitizenRegistry,
  useRefreshAnalytics,
  usePublishContent,
  CitizenRegistryFilters,
} from "@/lib/hooks/useAnalytics";
import { SidebarNav } from "@/components/admin/dashboard/SidebarNav";
import { TopBar } from "@/components/admin/dashboard/TopBar";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { WidgetPanel } from "@/components/admin/dashboard/WidgetPanel";
import { CitizenDetailSheet } from "@/components/admin/CitizenDetailSheet";
import { cn } from "@/components/ui/utils";

// Import Recharts components
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function AdminPage() {
  const { user, accessToken, logout, adminLogin, loading, initializeAuth } = useAuthStore();
  const [role, setRole] = useState<string>("GUEST");
  const [email, setEmail] = useState<string>("admin@citieye.gov.ng");
  const [isClient, setIsClient] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  const isAgencyAdmin = useMemo(() => {
    const r = role.toUpperCase();
    return r === "AGENCY_ADMIN" || r === "AGENCYADMIN";
  }, [role]);

  const adminState = useMemo(() => {
    return user?.stateOfResidence || user?.data?.stateOfResidence || "";
  }, [user]);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "registry" | "health" | "education" | "hr" | "business" | "pension" | "officers" | "users" | "settings"
  >("overview");

  // Dynamic role-based route guard
  useEffect(() => {
    const roleLower = role.toLowerCase();
    const hasAccess = (tab: string) => {
      if (
        roleLower === "super_admin" ||
        roleLower === "superadmin" ||
        roleLower === "agency_admin" ||
        roleLower === "agencyadmin"
      ) {
        return true;
      }
      if (roleLower === "field_officer_health") return ["overview", "registry", "health"].includes(tab);
      if (roleLower === "field_officer_education") return ["overview", "registry", "education"].includes(tab);
      if (roleLower === "field_officer") return ["overview", "registry"].includes(tab);
      return tab === "overview";
    };
    if (!hasAccess(activeTab)) {
      setActiveTab("overview");
    }
  }, [activeTab, role]);

  // Sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Selected citizen for profile drawer
  const [selectedCitizenCode, setSelectedCitizenCode] = useState<string | null>(null);

  // General search term in top bar
  const [globalSearch, setGlobalSearch] = useState("");

  // Registry filter state
  const [filters, setFilters] = useState<CitizenRegistryFilters>({
    stateOfOrigin: "",
    lga: "",
    gender: "",
    cohortName: "",
    page: 0,
    size: 10,
  });

  // Login form state
  const [adminCode, setAdminCode] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{ code?: string; password?: string; general?: string }>({});

  // Quick announcement widget form state
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [contentCategory, setContentCategory] = useState("GENERAL");
  const [pictureUrl, setPictureUrl] = useState("");
  const [targetCohortId, setTargetCohortId] = useState<string>("");
  const [targetStateResidence, setTargetStateResidence] = useState("");
  const [targetStateOrigin, setTargetStateOrigin] = useState("");

  const { mutateAsync: publishContent } = usePublishContent();
  const [announcementSending, setAnnouncementSending] = useState(false);

  const { states, getLgasForState } = useStatesAndLgas();

  // Ensure client-only components render correctly
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setMounted(true);
    const verifySession = async () => {
      try {
        if (!accessToken) {
          await initializeAuth();
        }
      } catch (err) {
        console.error("Auth restoration error:", err);
      } finally {
        setIsVerifying(false);
      }
    };
    verifySession();
  }, [accessToken, initializeAuth]);

  useEffect(() => {
    const detectedRole = extractUserRole(user, accessToken);
    setRole(detectedRole || "GUEST");

    const userEmail =
      user?.email ||
      user?.data?.email ||
      user?.user?.email ||
      user?.identifier ||
      "";
    if (userEmail) setEmail(userEmail);
  }, [user, accessToken]);

  // Hook queries
  const { data: summary, isLoading: summaryLoading, refetch: refetchSummary } = useAnalyticsSummary();
  
  // Connect the global search to the registry filters (e.g. LGA filter)
  const registryFilters = useMemo(() => {
    return {
      ...filters,
      lga: globalSearch || filters.lga,
    };
  }, [filters, globalSearch]);

  const { data: registry, isLoading: registryLoading } = useCitizenRegistry(registryFilters);
  const { mutate: refreshViews, isPending: refreshPending } = useRefreshAnalytics();

  const handleSignOut = () => {
    logout();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { code?: string; password?: string } = {};
    if (!adminCode.trim()) {
      errors.code = "Security code is required";
    }
    if (!adminPassword) {
      errors.password = "Authentication password is required";
    }
    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    setLoginErrors({});
    const success = await adminLogin(adminCode, adminPassword);
    if (!success) {
      const errMsg = useAuthStore.getState().error || "Access denied. Invalid credentials.";
      setLoginErrors({ general: errMsg });
    }
  };

  // Synchronize analytics views (Super Admin only)
  const handleSyncViews = () => {
    refreshViews(undefined, {
      onSuccess: (data) => {
        toast.success(data?.message || "Analytics views refreshed successfully.");
        refetchSummary();
      },
      onError: (err) => {
        toast.error(err.message || "Failed to synchronize views.");
      },
    });
  };

  // Quick announcement submission
  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementContent.trim()) {
      toast.error("Announcement title and body are required.");
      return;
    }
    setAnnouncementSending(true);
    try {
      const payload = {
        title: announcementTitle.trim(),
        cmsContent: announcementContent.trim(),
        contentCategory: contentCategory,
        pictureUrl: pictureUrl.trim() || undefined,
        targetCohortId: targetCohortId ? Number(targetCohortId) : null,
        targetStateResidence: isAgencyAdmin ? adminState : (targetStateResidence || null),
        targetStateOrigin: targetStateOrigin || null,
      };

      await publishContent(payload);
      toast.success("Broadcast announcement successfully published and pushed to targeted cohorts.");
      
      setAnnouncementTitle("");
      setAnnouncementContent("");
      setPictureUrl("");
      setTargetCohortId("");
      setTargetStateResidence("");
      setTargetStateOrigin("");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to publish content.";
      toast.error(msg);
    } finally {
      setAnnouncementSending(false);
    }
  };

  // Dynamic greeting based on hour
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 17) return "Good afternoon";
    return "Good evening";
  };

  // Helper lists derived from data for filters
  const stateList = useMemo(() => {
    if (!summary?.byStateAndLga) return [];
    const states = summary.byStateAndLga.map((item) => item.stateOfOrigin);
    return Array.from(new Set(states)).sort();
  }, [summary]);

  const cohortList = useMemo(() => {
    if (!summary?.byCohort) return [];
    const cohorts = summary.byCohort.map((item) => item.cohortName);
    return Array.from(new Set(cohorts)).sort();
  }, [summary]);

  // Handle filter edits
  const handleFilterChange = (field: keyof CitizenRegistryFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: 0,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      stateOfOrigin: "",
      lga: "",
      gender: "",
      cohortName: "",
      page: 0,
      size: 10,
    });
    setGlobalSearch("");
  };

  if (!isClient || isVerifying) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-10 h-10 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-xs font-mono tracking-widest text-stone-500 uppercase">Securing Connection...</span>
        </div>
      </div>
    );
  }

  const authenticated = !!accessToken && isAdminRole(role);
  const isSuperAdmin = role.toLowerCase() === "super_admin" || role.toLowerCase() === "superadmin";

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between relative overflow-hidden font-sans">
        {/* Abstract Ambient Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-900/10 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-950/15 blur-[130px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/4" />

        {/* Header */}
        <header className="relative z-10 w-full px-6 py-6 sm:px-10 border-b border-stone-900/80 bg-stone-950/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-700 to-emerald-900 flex items-center justify-center text-white shadow-lg shadow-green-900/20">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-serif font-bold text-stone-100 tracking-tight block">
                  CitiEye Registry
                </span>
                <span className="text-[10px] text-stone-500 font-mono tracking-wider uppercase block">
                  Internal Network
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                Node: Active
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area: Split View Layout */}
        <main className="relative z-10 flex-1 flex items-center justify-center py-10 px-6 sm:px-10">
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-stone-900/35 border border-stone-850/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm p-4 sm:p-8">
            
            {/* Left Info Panel (Hidden on Mobile) */}
            <div className="hidden md:flex md:col-span-6 flex-col justify-between h-full min-h-[420px] p-6 border-r border-stone-850/60 pr-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10px] font-mono text-stone-300 font-bold uppercase tracking-wider">
                    Secured Gatekeeper
                  </span>
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-serif font-bold text-stone-100 tracking-tight leading-tight">
                    Government Agency Administration Portal
                  </h2>
                  <p className="text-stone-400 text-sm leading-relaxed font-light">
                    Authorized access only. Use the cryptographic credentials provided by the Federal Ministry of Communications & Digital Economy.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-stone-900/60 border border-stone-850 rounded-2xl flex items-start gap-3">
                  <Terminal className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-stone-300 uppercase block">Audit Logging Active</span>
                    <span className="text-[11px] text-stone-500 leading-relaxed block">
                      All system authorization attempts, IP addresses, and actions are logged and auditable under FME cybersecurity provisions.
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-stone-600 font-mono">
                  CLASSIFICATION: Restricted System // FME-CE-REG
                </p>
              </div>
            </div>

            {/* Right Login Form */}
            <div className="col-span-1 md:col-span-6 p-2 sm:p-6 space-y-6">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-xl font-serif font-bold text-stone-100">
                  Authenticate Clearance
                </h3>
                <p className="text-xs text-stone-400">
                  Provide credentials to provision a secure administrative session.
                </p>
              </div>

              {loginErrors.general && (
                <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-xl text-xs text-red-200 leading-relaxed flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">Authorization Failure</span>
                    {loginErrors.general}
                  </div>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-300 tracking-wide uppercase">Admin Code</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      placeholder="e.g. ADM-9021-00"
                      className={`w-full px-4 py-3 bg-stone-900 border ${loginErrors.code ? 'border-red-900/80 focus:border-red-700' : 'border-stone-800 focus:border-green-700'} focus:ring-1 focus:ring-green-900/30 rounded-xl text-stone-100 placeholder-stone-700 outline-none transition-all text-xs font-mono`}
                    />
                  </div>
                  {loginErrors.code && <span className="text-[10px] text-red-400 font-semibold">{loginErrors.code}</span>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-300 tracking-wide uppercase">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full px-4 py-3 bg-stone-900 border ${loginErrors.password ? 'border-red-900/80 focus:border-red-700' : 'border-stone-800 focus:border-green-700'} focus:ring-1 focus:ring-green-900/30 rounded-xl text-stone-100 placeholder-stone-750 outline-none transition-all text-xs pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {loginErrors.password && <span className="text-[10px] text-red-400 font-semibold">{loginErrors.password}</span>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-green-700 text-white rounded-xl font-semibold text-xs uppercase tracking-wider hover:bg-green-600 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer shadow-lg shadow-green-900/20 mt-6"
                >
                  {loading ? (
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : (
                    <Key className="w-3.5 h-3.5" />
                  )}
                  {loading ? "Verifying clearance..." : "Request Access"}
                </button>
              </form>

              <div className="pt-2 text-center md:text-left">
                <Link href="/" className="text-[10px] text-stone-500 hover:text-stone-300 transition-colors inline-flex items-center gap-1 font-mono uppercase tracking-wider">
                  ← Back to Main Portal
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 w-full text-center py-6 border-t border-stone-900/60 text-[10px] text-stone-500 font-mono px-6">
          Federal Republic of Nigeria • CitiEye Agency Command Network • Restricted Domain
        </footer>
      </div>
    );
  }

  // Group employment data by status
  const employmentChartData = mounted && summary?.byEmploymentStatus
    ? Object.entries(
        summary.byEmploymentStatus.reduce((acc, curr) => {
          const status = curr.employmentStatus || "unspecified";
          acc[status] = (acc[status] || 0) + curr.citizenCount;
          return acc;
        }, {} as Record<string, number>)
      ).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
        Count: count,
      }))
    : [];

  // Group cohort data
  const cohortChartData = mounted && summary?.byCohort
    ? summary.byCohort.map((c) => ({
        name: c.cohortName,
        Citizens: c.totalCitizens,
        MilestonesCompleted: c.citizensWithAnyMilestoneCompleted,
      }))
    : [];

  // Group state summaries
  const stateSummary = summary?.byStateAndLga
    ? Object.values(
        summary.byStateAndLga.reduce((acc, curr) => {
          const state = curr.stateOfOrigin || "Other";
          if (!acc[state]) {
            acc[state] = { state, count: 0, male: 0, female: 0 };
          }
          acc[state].count += curr.totalCitizens;
          acc[state].male += curr.maleCount;
          acc[state].female += curr.femaleCount;
          return acc;
        }, {} as Record<string, { state: string; count: number; male: number; female: number }>)
      ).sort((a, b) => b.count - a.count)
    : [];

  // State registrations chart data
  const stateChartData = mounted && stateSummary
    ? stateSummary.slice(0, 8).map((item) => ({
        name: item.state,
        Registrations: item.count,
      }))
    : [];

  const maxStateCount = stateSummary[0]?.count || 1;

  // Profiling completeness percent calculation (Vaccinated vs Total Profiled)
  const totalProfiledCount = summary?.healthIndicators.totalCitizensProfiled || 1;
  const vaccinationRatePercent = Math.round(
    ((summary?.healthIndicators.vaccinationComplete || 0) / totalProfiledCount) * 100
  );

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex relative font-sans">
      {/* 1. Left Collapsible Sidebar Navigation */}
      <SidebarNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        role={role}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* 2. Top Header Bar */}
        <TopBar
          email={email}
          role={role}
          onLogout={handleSignOut}
          searchValue={globalSearch}
          onSearchChange={(val) => {
            setGlobalSearch(val);
            if (activeTab !== "registry") {
              setActiveTab("registry"); // Route user to search explorer
            }
          }}
          onSyncViews={handleSyncViews}
          isSyncing={refreshPending}
          isSuperAdmin={isSuperAdmin}
        />

        {/* 3. Workspace Scrollable Area */}
        <div className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto flex-1">
          {/* Greeting Header */}
          <div className="leading-tight select-none">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block">
              Good morning, {email.split("@")[0]} 👋
            </span>
            <h2 className="text-2xl font-serif font-bold text-slate-800 tracking-tight">
              Command Dashboard {isAgencyAdmin && adminState ? `(${adminState} State)` : ""}
            </h2>
            <p className="text-xs text-slate-400 font-light mt-0.5">
              Here is what is happening with the citizen registry database today.
            </p>
          </div>

          {summaryLoading && activeTab !== "registry" ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white border border-slate-200/60 rounded-3xl p-8 shadow-xs">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                Reconciling citizen ledger database...
              </span>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* ==================== TAB 1: DASHBOARD OVERVIEW ==================== */}
              {activeTab === "overview" && summary && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  
                  {/* Stat Cards 4-Column Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Stat Card 1: circular progress indicator for Welfare completeness */}
                    <StatCard
                      title="Welfare Completion"
                      value={`${summary.healthIndicators.totalCitizensProfiled.toLocaleString()} profiled`}
                      icon={Activity}
                      type="progress"
                      progressValue={vaccinationRatePercent || 98}
                      accentColor="green"
                      footerLabel="View welfare indices"
                      onFooterClick={() => setActiveTab("health")}
                    />

                    {/* Stat Card 2: Total Registered Citizens */}
                    <StatCard
                      title="Total Citizens"
                      value={summary.totalCitizens.toLocaleString()}
                      icon={Users}
                      trend={{
                        value: `+${Math.round((summary.totalCitizensLast30Days / (summary.totalCitizens || 1)) * 100)}%`,
                        isPositive: true,
                        label: "vs last month",
                      }}
                      accentColor="blue"
                      footerLabel="Browse database"
                      onFooterClick={() => setActiveTab("registry")}
                    />

                    {/* Stat Card 3: Male Registry */}
                    <StatCard
                      title="Male Registry"
                      value={summary.maleCitizens.toLocaleString()}
                      icon={UserCheck}
                      trend={{
                        value: `+${summary.totalCitizensLast7Days}`,
                        isPositive: true,
                        label: "added last 7d",
                      }}
                      accentColor="purple"
                      footerLabel="View male roster"
                      onFooterClick={() => {
                        handleFilterChange("gender", "male");
                        setActiveTab("registry");
                      }}
                    />

                    {/* Stat Card 4: Female Registry */}
                    <StatCard
                      title="Female Registry"
                      value={summary.femaleCitizens.toLocaleString()}
                      icon={UserCheck}
                      trend={{
                        value: "12.7%",
                        isPositive: true,
                        label: "registry ratio shift",
                      }}
                      accentColor="pink"
                      footerLabel="View female roster"
                      onFooterClick={() => {
                        handleFilterChange("gender", "female");
                        setActiveTab("registry");
                      }}
                    />
                  </div>

                  {/* Widget panels Secondary Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Widget 1: Cohort Breakdown (horizontal bar chart - 7 cols) */}
                    <WidgetPanel
                      title="Cohort Distribution Overview"
                      icon={Database}
                      badgeText="Age Categories"
                      badgeColor="blue"
                      className="lg:col-span-7 h-[360px]"
                    >
                      {mounted && cohortChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={cohortChartData} layout="vertical" margin={{ left: 5, right: 5, top: 5, bottom: 5 }}>
                            <defs>
                              <linearGradient id="widgetCohortGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#60a5fa" />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={true} vertical={false} />
                            <XAxis type="number" stroke="#94a3b8" fontSize={9} />
                            <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} width={120} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#fff",
                                borderColor: "#e2e8f0",
                                color: "#334155",
                                borderRadius: 12,
                                fontSize: 10,
                              }}
                            />
                            <Bar name="Registered" dataKey="Citizens" fill="url(#widgetCohortGrad)" radius={[0, 4, 4, 0]} barSize={12} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-mono">
                          Formatting data...
                        </div>
                      )}
                    </WidgetPanel>

                    {/* Widget 2: Quick Announcement (Draft widgets - 5 cols) */}
                    <WidgetPanel
                      title="Announcements Broadcast"
                      icon={Megaphone}
                      badgeText="CMS Dispatch"
                      badgeColor="amber"
                      className="lg:col-span-5 h-[450px]"
                    >
                      <form onSubmit={handlePublishAnnouncement} className="h-full flex flex-col justify-between overflow-hidden">
                        <div className="space-y-3.5 overflow-y-auto pr-1 flex-1 py-1">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
                              Draft Title
                            </label>
                            <input
                              type="text"
                              value={announcementTitle}
                              onChange={(e) => setAnnouncementTitle(e.target.value)}
                              placeholder="e.g. Health Center Outpost Notice"
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 focus:border-blue-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none transition-all font-medium"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
                              Content Category
                            </label>
                            <select
                              value={contentCategory}
                              onChange={(e) => setContentCategory(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 focus:border-blue-500 rounded-xl text-xs text-slate-800 outline-none transition-all cursor-pointer font-medium"
                            >
                              <option value="GENERAL">General Notice</option>
                              <option value="HEALTH_NOTICE">Health Notice</option>
                              <option value="EDUCATION_NOTICE">Education Notice</option>
                              <option value="COHORT_UPDATE">Cohort Update</option>
                              <option value="GRANT_OPPORTUNITY">Grant Opportunity</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
                              Content Body
                            </label>
                            <textarea
                              value={announcementContent}
                              onChange={(e) => setAnnouncementContent(e.target.value)}
                              placeholder="Write announcement dispatch payload here..."
                              rows={3}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 focus:border-blue-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none transition-all resize-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
                              Picture URL (Optional)
                            </label>
                            <input
                              type="text"
                              value={pictureUrl}
                              onChange={(e) => setPictureUrl(e.target.value)}
                              placeholder="e.g. https://example.com/image.jpg"
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 focus:border-blue-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none transition-all font-mono"
                            />
                          </div>

                          <div className="border-t border-slate-100 pt-3 mt-3">
                            <span className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider block mb-2 select-none">
                              Audience Targeting (Optional)
                            </span>
                            
                            <div className="grid grid-cols-2 gap-3">
                              {/* Cohort Targeting */}
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
                                  Target Cohort
                                </label>
                                <select
                                  value={targetCohortId}
                                  onChange={(e) => setTargetCohortId(e.target.value)}
                                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 focus:border-blue-500 rounded-xl text-[11px] text-slate-800 outline-none transition-all cursor-pointer font-medium"
                                >
                                  <option value="">Broadcast to All Cohorts</option>
                                  {summary?.byCohort?.map((c) => (
                                    <option key={c.cohortId} value={c.cohortId}>
                                      {c.cohortName}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* State of Residence Targeting */}
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
                                  Target State (Res.)
                                </label>
                                <select
                                  value={isAgencyAdmin ? adminState : targetStateResidence}
                                  onChange={(e) => setTargetStateResidence(e.target.value)}
                                  disabled={isAgencyAdmin}
                                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 focus:border-blue-500 rounded-xl text-[11px] text-slate-800 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500 cursor-pointer disabled:cursor-not-allowed font-medium"
                                >
                                  {isAgencyAdmin ? (
                                    <option value={adminState}>{adminState} (Locked)</option>
                                  ) : (
                                    <>
                                      <option value="">Broadcast to All States</option>
                                      {states.map((st) => (
                                        <option key={st} value={st}>
                                          {st}
                                        </option>
                                      ))}
                                    </>
                                  )}
                                </select>
                              </div>

                              {/* State of Origin Targeting */}
                              <div className="space-y-1 col-span-2">
                                <label className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
                                  Target State (Origin)
                                </label>
                                <select
                                  value={targetStateOrigin}
                                  onChange={(e) => setTargetStateOrigin(e.target.value)}
                                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 focus:border-blue-500 rounded-xl text-[11px] text-slate-800 outline-none transition-all cursor-pointer font-medium"
                                >
                                  <option value="">Broadcast to All Origins</option>
                                  {states.map((st) => (
                                    <option key={st} value={st}>
                                      {st}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={announcementSending}
                          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider active:scale-[0.98] transition-all cursor-pointer outline-none flex items-center justify-center gap-2 mt-3"
                        >
                          {announcementSending ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Megaphone className="w-3.5 h-3.5" />
                          )}
                          <span>{announcementSending ? "Broadcasting..." : "Publish Broadcast"}</span>
                        </button>
                      </form>
                    </WidgetPanel>
                  </div>

                  {/* Redesign: Third Row (State registrations chart & Economic indicators) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Widget 3: State Registrations Bar Chart (7 cols - per user request!) */}
                    <WidgetPanel
                      title="Registrations by State of Origin"
                      icon={MapPin}
                      badgeText="Regional Ledger"
                      badgeColor="green"
                      className="lg:col-span-7 h-[360px]"
                    >
                      {mounted && stateChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stateChartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                            <defs>
                              <linearGradient id="widgetStateGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#34d399" />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={true} vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} dy={10} />
                            <YAxis stroke="#94a3b8" fontSize={9} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#fff",
                                borderColor: "#e2e8f0",
                                color: "#334155",
                                borderRadius: 12,
                                fontSize: 10,
                              }}
                            />
                            <Bar name="Registrations" dataKey="Registrations" fill="url(#widgetStateGrad)" radius={[4, 4, 0, 0]} barSize={20} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-mono">
                          Compiling regional records...
                        </div>
                      )}
                    </WidgetPanel>

                    {/* Widget 4: Employment & Economic Status (5 cols) */}
                    <WidgetPanel
                      title="Workforce & Employment"
                      icon={Briefcase}
                      badgeText="Economy Index"
                      badgeColor="gray"
                      className="lg:col-span-5 h-[360px]"
                    >
                      {mounted && employmentChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={employmentChartData} margin={{ top: 10, right: 5, left: 5, bottom: 15 }}>
                            <defs>
                              <linearGradient id="widgetEmployGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#a78bfa" />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={true} vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} dy={10} />
                            <YAxis stroke="#94a3b8" fontSize={9} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#fff",
                                borderColor: "#e2e8f0",
                                color: "#334155",
                                borderRadius: 12,
                                fontSize: 10,
                              }}
                            />
                            <Bar name="Count" dataKey="Count" fill="url(#widgetEmployGrad)" radius={[4, 4, 0, 0]} barSize={24} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-mono">
                          Querying employment states...
                        </div>
                      )}
                    </WidgetPanel>
                  </div>

                  {/* Widget 5: Recent registrations table list widget (WordPress styled log feed) */}
                  <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 select-none">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <h4 className="text-xs font-mono font-bold text-slate-750 uppercase tracking-widest">
                          Recent Citizen Registrations log
                        </h4>
                      </div>
                      <button
                        onClick={() => setActiveTab("registry")}
                        className="text-[10px] font-mono font-bold text-blue-600 hover:text-blue-500 uppercase tracking-widest outline-none cursor-pointer"
                      >
                        Launch Registry Explorer →
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/50 text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                            <th className="py-2.5 px-4 font-bold">Name</th>
                            <th className="py-2.5 px-4 font-bold">Code</th>
                            <th className="py-2.5 px-4 font-bold">Age</th>
                            <th className="py-2.5 px-4 font-bold">Cohort</th>
                            <th className="py-2.5 px-4 font-bold">State</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600">
                          {registry?.content.slice(0, 4).map((citizen) => (
                            <tr
                              key={citizen.citizenCode}
                              onClick={() => setSelectedCitizenCode(citizen.citizenCode)}
                              className="hover:bg-slate-50/40 cursor-pointer transition-colors"
                            >
                              <td className="py-2.5 px-4 font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                                {citizen.fullName}
                              </td>
                              <td className="py-2.5 px-4 font-mono text-[10px] text-slate-400">
                                {citizen.citizenCode}
                              </td>
                              <td className="py-2.5 px-4 font-mono">{citizen.age ?? "—"}</td>
                              <td className="py-2.5 px-4 font-medium">{citizen.cohortName}</td>
                              <td className="py-2.5 px-4 text-slate-400">{citizen.stateOfOrigin}</td>
                            </tr>
                          ))}
                          {!registry?.content.length && (
                            <tr>
                              <td colSpan={5} className="py-4 text-center text-slate-400 italic">
                                No recent logs available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== TAB 2: CITIZEN REGISTRY (Light Redesign) ==================== */}
              {activeTab === "registry" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Database filter panel */}
                  <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-xs space-y-4">
                    <div className="flex items-center gap-2 select-none">
                      <Filter className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                        Database Filtering
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {/* State filter */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
                          State of Origin
                        </label>
                        <select
                          value={filters.stateOfOrigin}
                          onChange={(e) => {
                            const selectedState = e.target.value;
                            handleFilterChange("stateOfOrigin", selectedState);
                            handleFilterChange("lga", "");
                          }}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 focus:border-blue-500 rounded-xl text-xs text-slate-700 outline-none transition-all cursor-pointer font-medium"
                        >
                          <option value="">All States ({states.length})</option>
                          {states.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* LGA Search / Select */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
                          Local Govt Area (LGA)
                        </label>
                        {isAgencyAdmin ? (
                          <select
                            value={filters.lga}
                            onChange={(e) => handleFilterChange("lga", e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 focus:border-blue-500 rounded-xl text-xs text-slate-700 outline-none transition-all cursor-pointer font-medium"
                          >
                            <option value="">All LGAs in {adminState}</option>
                            {getLgasForState(adminState).map((lgaItem) => (
                              <option key={lgaItem} value={lgaItem}>
                                {lgaItem}
                              </option>
                            ))}
                          </select>
                        ) : filters.stateOfOrigin ? (
                          <select
                            value={filters.lga}
                            onChange={(e) => handleFilterChange("lga", e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 focus:border-blue-500 rounded-xl text-xs text-slate-700 outline-none transition-all cursor-pointer font-medium"
                          >
                            <option value="">All LGAs in {filters.stateOfOrigin}</option>
                            {getLgasForState(filters.stateOfOrigin).map((lgaItem) => (
                              <option key={lgaItem} value={lgaItem}>
                                {lgaItem}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input
                              type="text"
                              value={filters.lga}
                              onChange={(e) => handleFilterChange("lga", e.target.value)}
                              placeholder="e.g. Alimosho (Select State first)"
                              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/80 focus:border-blue-500 rounded-xl text-xs text-slate-700 outline-none transition-all placeholder-slate-300 font-mono"
                            />
                          </div>
                        )}
                      </div>

                      {/* Gender filter */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
                          Gender
                        </label>
                        <select
                          value={filters.gender}
                          onChange={(e) => handleFilterChange("gender", e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 focus:border-blue-500 rounded-xl text-xs text-slate-700 outline-none transition-all cursor-pointer"
                        >
                          <option value="">All Genders</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>

                      {/* Cohort filter */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
                          Cohort Placement
                        </label>
                        <select
                          value={filters.cohortName}
                          onChange={(e) => handleFilterChange("cohortName", e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 focus:border-blue-500 rounded-xl text-xs text-slate-700 outline-none transition-all cursor-pointer"
                        >
                          <option value="">All Cohorts</option>
                          {cohortList.map((cohort) => (
                            <option key={cohort} value={cohort}>
                              {cohort}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={handleClearFilters}
                        className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl outline-none transition-all cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>

                  {/* Citizen log registry table */}
                  <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-xs flex flex-col">
                    {registryLoading ? (
                      <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                          Reconciling records...
                        </span>
                      </div>
                    ) : registry && registry.content.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                              <th className="py-4 px-6 font-bold">Citizen Name</th>
                              <th className="py-4 px-4 font-bold">Code</th>
                              <th className="py-4 px-4 font-bold">Age</th>
                              <th className="py-4 px-4 font-bold">Gender</th>
                              <th className="py-4 px-4 font-bold">Cohort</th>
                              <th className="py-4 px-4 font-bold">Location</th>
                              <th className="py-4 px-6 font-bold text-right">Registered</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-600">
                            {registry.content.map((citizen) => (
                              <tr
                                key={citizen.citizenCode}
                                onClick={() => setSelectedCitizenCode(citizen.citizenCode)}
                                className="hover:bg-slate-50/30 active:bg-slate-50/60 transition-all cursor-pointer group"
                              >
                                <td className="py-3.5 px-6 font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                                  {citizen.fullName}
                                </td>
                                <td className="py-3.5 px-4 font-mono text-[10px] text-slate-450 select-all">
                                  {citizen.citizenCode}
                                </td>
                                <td className="py-3.5 px-4 font-mono">
                                  {citizen.age !== null ? citizen.age : "—"}
                                </td>
                                <td className="py-3.5 px-4">
                                  <span
                                    className={cn(
                                      "px-2 py-0.5 rounded-md font-mono font-bold text-[9px] tracking-wider uppercase",
                                      citizen.gender.toLowerCase() === "male"
                                        ? "text-blue-600 bg-blue-50 border border-blue-100"
                                        : "text-pink-650 bg-pink-50 border border-pink-100"
                                    )}
                                  >
                                    {citizen.gender}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 font-medium text-slate-700">
                                  {citizen.cohortName}
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="flex flex-col leading-none">
                                    <span className="text-slate-850 font-bold">{citizen.lga}</span>
                                    <span className="text-[9px] text-slate-400 font-mono mt-1">
                                      {citizen.stateOfOrigin} State
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3.5 px-6 text-right font-mono text-[10px] text-slate-400">
                                  {new Date(citizen.registeredAt).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-slate-400 italic text-xs gap-3">
                        <Database className="w-8 h-8 text-slate-200" />
                        <span>No citizen records matched the active filters.</span>
                      </div>
                    )}

                    {/* Pagination Footer */}
                    {registry && registry.totalPages > 1 && (
                      <div className="border-t border-slate-100 p-4 flex items-center justify-between bg-slate-50/20 select-none">
                        <span className="text-xs text-slate-400 font-mono">
                          Showing page {registry.page + 1} of {registry.totalPages} // {registry.totalElements.toLocaleString()} entries
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleFilterChange("page", filters.page! - 1)}
                            disabled={filters.page === 0}
                            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all cursor-pointer outline-none"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleFilterChange("page", filters.page! + 1)}
                            disabled={filters.page! + 1 >= registry.totalPages}
                            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all cursor-pointer outline-none"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ==================== TAB 3: WELFARE & HEALTH INDICATORS ==================== */}
              {activeTab === "health" && summary && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Indicators Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Insurance Coverage */}
                    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 flex flex-col justify-between shadow-xs h-[200px]">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center select-none">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                            NHIS Enrollment
                          </span>
                          <span className="px-2 py-0.5 rounded border bg-emerald-50 text-emerald-600 border-emerald-100 text-[9px] font-mono font-bold uppercase">
                            Insurance
                          </span>
                        </div>
                        <h3 className="text-3xl font-serif font-bold text-slate-800">
                          {summary.healthIndicators.nhisEnrolledCount.toLocaleString()}
                        </h3>
                        <p className="text-xs text-slate-500 font-light">
                          Verified enrollment under the National Health Insurance Scheme, including{" "}
                          <span className="text-amber-500 font-bold font-mono">
                            {summary.healthIndicators.nhisSeniorPlanCount}
                          </span>{" "}
                          elderly citizens on the Senior Medical Welfare Plan.
                        </p>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/40">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{
                            width: `${Math.round(
                              (summary.healthIndicators.nhisEnrolledCount / summary.healthIndicators.totalCitizensProfiled) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Maternal Care */}
                    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 flex flex-col justify-between shadow-xs h-[200px]">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center select-none">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                            Maternal & Child Health
                          </span>
                          <span className="px-2 py-0.5 rounded border bg-blue-50 text-blue-600 border-blue-100 text-[9px] font-mono font-bold uppercase">
                            Clinical
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[9px] text-slate-400 font-mono block">PREGNANT COUNT</span>
                            <span className="text-2xl font-bold text-pink-500">
                              {summary.healthIndicators.pregnantCount}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-mono block">EXPECTANT PARENTS</span>
                            <span className="text-2xl font-bold text-blue-500">
                              {summary.healthIndicators.expectantParents}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 font-light">
                          Childhood immunizations fully completed for{" "}
                          <span className="text-emerald-500 font-bold font-mono">
                            {summary.healthIndicators.vaccinationComplete}
                          </span>{" "}
                          registered infants.
                        </p>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/40">
                        <div
                          className="bg-blue-500 h-full rounded-full"
                          style={{
                            width: `${Math.round(
                              (summary.healthIndicators.vaccinationComplete / summary.healthIndicators.totalCitizensProfiled) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Chronic Registers */}
                    <div className="bg-white border border-slate-200/60 rounded-3xl p-6 flex flex-col justify-between shadow-xs h-[200px]">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center select-none">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                            Special Care Registry
                          </span>
                          <span className="px-2 py-0.5 rounded border bg-red-50 text-red-655 border-red-100 text-[9px] font-mono font-bold uppercase">
                            Special Needs
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[9px] text-slate-400 font-mono block">CARDIAC REGISTRY</span>
                            <span className="text-2xl font-bold text-rose-500">
                              {summary.healthIndicators.hypertensionDiabetesCount}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-mono block">GENOTYPE LOGS</span>
                            <span className="text-2xl font-bold text-amber-500">
                              {summary.healthIndicators.bloodGroupRecorded}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 font-light">
                          Active special care logs created for{" "}
                          <span className="text-rose-500 font-bold font-mono">
                            {summary.healthIndicators.chronicIllnessCount}
                          </span>{" "}
                          citizens on chronic disease monitoring.
                        </p>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/40">
                        <div
                          className="bg-rose-500 h-full rounded-full"
                          style={{
                            width: `${Math.round(
                              (summary.healthIndicators.chronicIllnessCount / summary.healthIndicators.totalCitizensProfiled) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quality Report panel */}
                  <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-xs space-y-4">
                    <div className="flex items-center gap-2 select-none">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <h4 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-widest">
                        Welfare Profiling Quality Report
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                      Welfare metrics are reconciled against primary healthcare records, local government clinics, and field-officer logs.
                      Reconcile active senior welfare accounts during regular audits.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono border-t border-slate-100 pt-4">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-bold">TOTAL PROFILED:</span>
                        <span className="font-bold text-slate-800">
                          {summary.healthIndicators.totalCitizensProfiled}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-bold">IMMUNIZATION RATE:</span>
                        <span className="font-bold text-emerald-600">{vaccinationRatePercent}%</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-bold">CHRONIC WATCH:</span>
                        <span className="font-bold text-rose-500">
                          {summary.healthIndicators.chronicIllnessCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== TAB 4: EDUCATION LIFECYCLE ==================== */}
              {activeTab === "education" && summary && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[140px]">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block">Foundational Education</span>
                        <h3 className="text-2xl font-serif font-bold text-slate-800 mt-2">
                          {(summary.byCohort.find((c) => c.cohortName.toLowerCase().includes("foundational"))?.totalCitizens || 0).toLocaleString()}
                        </h3>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">Ages 6 - 11 Cohort</span>
                    </div>

                    <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[140px]">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block">Secondary Education</span>
                        <h3 className="text-2xl font-serif font-bold text-slate-800 mt-2">
                          {(summary.byCohort.find((c) => c.cohortName.toLowerCase().includes("secondary"))?.totalCitizens || 0).toLocaleString()}
                        </h3>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">Ages 12 - 18 Cohort</span>
                    </div>

                    <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[140px]">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block">Higher Education</span>
                        <h3 className="text-2xl font-serif font-bold text-slate-800 mt-2">
                          {(summary.byCohort.find((c) => c.cohortName.toLowerCase().includes("higher"))?.totalCitizens || 0).toLocaleString()}
                        </h3>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">Ages 19 - 26 Cohort</span>
                    </div>
                  </div>

                  <WidgetPanel title="Education Milestones & Enrollment Rates" icon={Database} className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            name: "Foundational",
                            Total: summary.byCohort.find((c) => c.cohortName.toLowerCase().includes("foundational"))?.totalCitizens || 0,
                            Completed: summary.byCohort.find((c) => c.cohortName.toLowerCase().includes("foundational"))?.citizensWithAnyMilestoneCompleted || 0,
                          },
                          {
                            name: "Secondary",
                            Total: summary.byCohort.find((c) => c.cohortName.toLowerCase().includes("secondary"))?.totalCitizens || 0,
                            Completed: summary.byCohort.find((c) => c.cohortName.toLowerCase().includes("secondary"))?.citizensWithAnyMilestoneCompleted || 0,
                          },
                          {
                            name: "Higher Ed",
                            Total: summary.byCohort.find((c) => c.cohortName.toLowerCase().includes("higher"))?.totalCitizens || 0,
                            Completed: summary.byCohort.find((c) => c.cohortName.toLowerCase().includes("higher"))?.citizensWithAnyMilestoneCompleted || 0,
                          },
                        ]}
                        margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                        <YAxis stroke="#94a3b8" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: "white", borderColor: "#e2e8f0", borderRadius: 12, fontSize: 10 }} />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Bar name="Total Enrolled" dataKey="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar name="Milestones Met" dataKey="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </WidgetPanel>
                </div>
              )}

              {/* ==================== TAB 5: HR & JOBS ==================== */}
              {activeTab === "hr" && summary && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[140px]">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block">Employed Citizens</span>
                        <h3 className="text-2xl font-serif font-bold text-slate-800 mt-2">
                          {summary.byEmploymentStatus
                            .filter((e) => e.employmentStatus === "employed")
                            .reduce((acc, curr) => acc + curr.citizenCount, 0)
                            .toLocaleString()}
                        </h3>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">Formal & Contract employment</span>
                    </div>

                    <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[140px]">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block">Business Owners</span>
                        <h3 className="text-2xl font-serif font-bold text-slate-800 mt-2">
                          {summary.byEmploymentStatus
                            .filter((e) => e.employmentStatus === "business_owner")
                            .reduce((acc, curr) => acc + curr.citizenCount, 0)
                            .toLocaleString()}
                        </h3>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">Self-employed & SMEs</span>
                    </div>

                    <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[140px]">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block">Unemployed</span>
                        <h3 className="text-2xl font-serif font-bold text-slate-800 mt-2">
                          {summary.byEmploymentStatus
                            .filter((e) => e.employmentStatus === "unemployed")
                            .reduce((acc, curr) => acc + curr.citizenCount, 0)
                            .toLocaleString()}
                        </h3>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">Actively seeking opportunities</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <WidgetPanel title="Employment Sector Distribution" icon={Briefcase} className="h-[320px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={Object.entries(
                            summary.byEmploymentStatus.reduce((acc, curr) => {
                              const sector = curr.industrySector || "unspecified";
                              acc[sector] = (acc[sector] || 0) + curr.citizenCount;
                              return acc;
                            }, {} as Record<string, number>)
                          ).map(([sector, count]) => ({
                            sector: sector.charAt(0).toUpperCase() + sector.slice(1).replace("_", " "),
                            Count: count,
                          }))}
                          margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="sector" stroke="#94a3b8" fontSize={9} dy={10} />
                          <YAxis stroke="#94a3b8" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#e2e8f0", borderRadius: 12, fontSize: 10 }} />
                          <Bar name="Citizens" dataKey="Count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </WidgetPanel>

                    <WidgetPanel title="Monthly Income Range" icon={Database} className="h-[320px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={Object.entries(
                            summary.byEmploymentStatus.reduce((acc, curr) => {
                              const income = curr.monthlyIncomeRange || "Unspecified";
                              acc[income] = (acc[income] || 0) + curr.citizenCount;
                              return acc;
                            }, {} as Record<string, number>)
                          ).map(([income, count]) => ({
                            income: income.replace("_", " "),
                            Count: count,
                          }))}
                          margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="income" stroke="#94a3b8" fontSize={9} dy={10} />
                          <YAxis stroke="#94a3b8" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#e2e8f0", borderRadius: 12, fontSize: 10 }} />
                          <Bar name="Citizens" dataKey="Count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </WidgetPanel>
                  </div>
                </div>
              )}

              {/* ==================== TAB 6: BUSINESS AFFAIRS ==================== */}
              {activeTab === "business" && summary && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 select-none">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <h4 className="text-sm font-mono font-bold text-slate-800 uppercase tracking-widest">
                        Business & Corporate Affairs Domain
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                      Welfare allocations and SME grants are calculated based on registered business counts and industry classifications.
                    </p>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                            <th className="py-3 px-4 font-bold">Industry Sector</th>
                            <th className="py-3 px-4 font-bold">Monthly Income Range</th>
                            <th className="py-3 px-4 font-bold">Employment Status</th>
                            <th className="py-3 px-4 font-bold text-right">Profiled SMEs</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600">
                          {summary.byEmploymentStatus
                            .filter((e) => e.employmentStatus === "business_owner")
                            .map((item, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/40">
                                <td className="py-2.5 px-4 font-semibold text-slate-800">
                                  {item.industrySector ? item.industrySector.replace("_", " ").toUpperCase() : "GENERAL RETAIL"}
                                </td>
                                <td className="py-2.5 px-4 font-mono">{item.monthlyIncomeRange || "N/A"}</td>
                                <td className="py-2.5 px-4 uppercase font-mono text-[9px] text-slate-400">
                                  {item.employmentStatus}
                                </td>
                                <td className="py-2.5 px-4 text-right font-mono font-bold text-blue-600">
                                  {item.citizenCount.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== TAB 7: PENSION ==================== */}
              {activeTab === "pension" && summary && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[140px]">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block">Pre-Retirement</span>
                        <h3 className="text-2xl font-serif font-bold text-slate-800 mt-2">
                          {(summary.byCohort.find((c) => c.cohortName.toLowerCase().includes("pre-retirement"))?.totalCitizens || 0).toLocaleString()}
                        </h3>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">Ages 49 - 54 Cohort</span>
                    </div>

                    <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[140px]">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block">Active Aging</span>
                        <h3 className="text-2xl font-serif font-bold text-slate-800 mt-2">
                          {(summary.byCohort.find((c) => c.cohortName.toLowerCase().includes("active aging"))?.totalCitizens || 0).toLocaleString()}
                        </h3>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">Ages 55 - 60 Cohort</span>
                    </div>

                    <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-xs flex flex-col justify-between h-[140px]">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block">Elderly Care</span>
                        <h3 className="text-2xl font-serif font-bold text-slate-800 mt-2">
                          {(summary.byCohort.find((c) => c.cohortName.toLowerCase().includes("elderly care"))?.totalCitizens || 0).toLocaleString()}
                        </h3>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">Ages 61+ Cohort</span>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-xs space-y-4">
                    <div className="flex items-center gap-2 select-none">
                      <Heart className="w-5 h-5 text-red-500" />
                      <h4 className="text-sm font-mono font-bold text-slate-800 uppercase tracking-widest">
                        Elderly Medical Senior Plan Enrolment
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono">
                      <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex justify-between items-center">
                        <span className="text-slate-400">NHIS SENIOR PLAN ACTIVE:</span>
                        <span className="text-xl font-bold text-emerald-600">
                          {summary.healthIndicators.nhisSeniorPlanCount.toLocaleString()}
                        </span>
                      </div>
                      <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex justify-between items-center">
                        <span className="text-slate-400">ELDERLY VACCINATIONS RECORDED:</span>
                        <span className="text-xl font-bold text-blue-600">
                          {summary.healthIndicators.vaccinationComplete.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== TAB 8: FIELD OFFICERS ==================== */}
              {activeTab === "officers" && (
                <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-xs space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 select-none">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                    <h4 className="text-sm font-mono font-bold text-slate-800 uppercase tracking-widest">
                      Active Field Officer Nodes
                    </h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                          <th className="py-3 px-4 font-bold">Officer Name</th>
                          <th className="py-3 px-4 font-bold">Officer Code</th>
                          <th className="py-3 px-4 font-bold">Assigned Domain</th>
                          <th className="py-3 px-4 font-bold text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        <tr className="hover:bg-slate-50/40">
                          <td className="py-2.5 px-4 font-semibold text-slate-800">Oluwaseun Adebayo</td>
                          <td className="py-2.5 px-4 font-mono text-[10px] text-slate-400">cit-fo-hl-009101</td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-mono font-bold uppercase">
                              Health Specialization
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-green-600">ACTIVE</td>
                        </tr>
                        <tr className="hover:bg-slate-50/40">
                          <td className="py-2.5 px-4 font-semibold text-slate-800">Chidi Benson</td>
                          <td className="py-2.5 px-4 font-mono text-[10px] text-slate-400">cit-fo-ed-009102</td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-mono font-bold uppercase">
                              Education Specialization
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-green-600">ACTIVE</td>
                        </tr>
                        <tr className="hover:bg-slate-50/40">
                          <td className="py-2.5 px-4 font-semibold text-slate-800">Fatima Yusuf</td>
                          <td className="py-2.5 px-4 font-mono text-[10px] text-slate-400">cit-fo-ge-009103</td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200/50 text-[9px] font-mono font-bold uppercase">
                              General Registry
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-400">OFFLINE</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ==================== TAB 9: USERS & SECURITY ROLES ==================== */}
              {activeTab === "users" && (
                <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-xs space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 select-none">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h4 className="text-sm font-mono font-bold text-slate-800 uppercase tracking-widest">
                      User Accounts & Security Clearance Roles
                    </h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                          <th className="py-3 px-4 font-bold">User Email</th>
                          <th className="py-3 px-4 font-bold">Security Role</th>
                          <th className="py-3 px-4 font-bold">Granted Authorities</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        <tr className="hover:bg-slate-50/40">
                          <td className="py-2.5 px-4 font-semibold text-slate-800">admin@citieye.gov.ng</td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-100 text-[9px] font-mono font-bold uppercase">
                              super_admin
                            </span>
                          </td>
                          <td className="py-2.5 px-4 font-mono text-slate-400">ALL_SYSTEM_PRIVILEGES, REFRESH_VIEWS, DECRYPT_KEYS</td>
                        </tr>
                        <tr className="hover:bg-slate-50/40">
                          <td className="py-2.5 px-4 font-semibold text-slate-800">agency-lead@citieye.gov.ng</td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-mono font-bold uppercase">
                              agency_admin
                            </span>
                          </td>
                          <td className="py-2.5 px-4 font-mono text-slate-400">PUBLISH_CMS, READ_CITIZENS, VIEW_ANALYTICS</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ==================== TAB 10: SETTINGS ==================== */}
              {activeTab === "settings" && (
                <div className="bg-white border border-slate-200/60 p-6 rounded-3xl shadow-xs space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 select-none border-b border-slate-100 pb-3">
                    <Settings className="w-5 h-5 text-blue-600" />
                    <h4 className="text-sm font-mono font-bold text-slate-800 uppercase tracking-widest leading-none">
                      System Settings
                    </h4>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div>
                        <h5 className="text-xs font-bold text-slate-800">Materialized Views Sync Interval</h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">Define cron sync period for analytics database indices.</p>
                      </div>
                      <select className="px-3 py-1.5 bg-white border border-slate-250 rounded-xl text-xs outline-none">
                        <option>Every 1 hour</option>
                        <option>Every 6 hours</option>
                        <option>Every 24 hours (Daily)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div>
                        <h5 className="text-xs font-bold text-slate-800">Strict Cryptographic Audit Log</h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">Enforce audit logs under FME cybersecurity regulations.</p>
                      </div>
                      <button className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none bg-blue-600">
                        <span className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out translate-x-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Footer Brand */}
        <footer className="w-full text-center py-6 border-t border-slate-100 text-[10px] text-slate-400 font-mono px-6 shrink-0 bg-white select-none">
          Federal Republic of Nigeria • CitiEye Community Governance Admin Panel • Restricted Administrative Workspace
        </footer>
      </div>

      {/* 5. Sheet drawer details inspector */}
      <CitizenDetailSheet
        citizenCode={selectedCitizenCode}
        isOpen={selectedCitizenCode !== null}
        onClose={() => setSelectedCitizenCode(null)}
      />
    </div>
  );
}
