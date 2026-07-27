"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Key,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore, extractUserRole } from "@/components/auth/authStore";

interface OfficerLoginFormProps {
  onSwitchToSignup: () => void;
}

export function OfficerLoginForm({ onSwitchToSignup }: OfficerLoginFormProps) {
  const router = useRouter();
  const adminLogin = useAuthStore((state) => state.adminLogin);
  const loading = useAuthStore((state) => state.loading);
  const authError = useAuthStore((state) => state.error);

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!code.trim()) {
      errs.code = "Officer Security Code or Official Email is required";
    }
    if (!password) {
      errs.password = "Password is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await adminLogin(code, password);
    if (success) {
      toast.success("Field Officer authorization granted!");
      // Detect role from the freshly-set store state
      const { user, accessToken } = useAuthStore.getState();
      const rawRole = extractUserRole(user, accessToken).toLowerCase();
      // Strip Spring Boot's "ROLE_" prefix if present (e.g. ROLE_FIELD_OFFICER_HEALTH)
      const normalizedRole = rawRole.replace(/^role_/, "");
      const isFieldOfficer = normalizedRole.startsWith("field_officer");
      router.push(isFieldOfficer ? "/officer" : "/admin");
    } else {
      toast.error(authError || "Invalid Officer Security Code or password.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          Field Officer Access Portal
        </div>
        <h3 className="text-2xl font-serif font-bold text-slate-800 tracking-tight">
          Field Officer Login
        </h3>
        <p className="text-xs text-slate-400 font-light">
          Authenticate using your assigned Officer Security Code (e.g. <span className="font-mono text-slate-600">CIT-OFR-...</span>) or official email address.
        </p>
      </div>

      {authError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div>{authError}</div>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase font-mono">
            Officer Code or Official Email *
          </label>
          <div className="relative">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. CIT-OFR-ED-ORE-000001 or officer@citieye.gov.ng"
              className={`w-full px-3.5 py-3 bg-slate-50 border ${errors.code ? 'border-red-400' : 'border-slate-200'} rounded-xl text-xs text-slate-800 font-mono outline-none focus:border-blue-500 transition-all`}
            />
          </div>
          {errors.code && <span className="text-[9px] text-red-500">{errors.code}</span>}
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase font-mono">
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-3.5 py-3 bg-slate-50 border ${errors.password ? 'border-red-400' : 'border-slate-200'} rounded-xl text-xs text-slate-800 pr-10 outline-none focus:border-blue-500 transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <span className="text-[9px] text-red-500">{errors.password}</span>}
        </div>
      </div>

      <div className="pt-2 space-y-3">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Key className="w-4 h-4 text-blue-400" />
          )}
          <span>{loading ? "Authenticating Clearance..." : "Authorize Officer Session"}</span>
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium cursor-pointer"
          >
            Need to register a new Officer Node? <span className="text-blue-600 font-bold">Register here</span>
          </button>
        </div>
      </div>
    </form>
  );
}
