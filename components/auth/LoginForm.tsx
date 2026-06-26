"use client";

import { useState } from "react";
import { FieldWrapper, Input } from "./FormUI";
import { Eye, EyeOff, LogIn, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface Props {
  onSwitchToSignup: () => void;
}

interface LoginData {
  identifier: string;
  password: string;
}

interface LoginErrors {
  identifier?: string;
  password?: string;
  general?: string;
}

export function LoginForm({ onSwitchToSignup }: Props) {
  const [data, setData] = useState<LoginData>({ identifier: "", password: "" });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const e: LoginErrors = {};
    if (!data.identifier.trim()) {
      e.identifier = "Email or phone number is required";
    }
    if (!data.password) {
      e.password = "Password is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setErrors({ general: "Demo mode: Login is not connected to a backend yet." });
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">
          Welcome back
        </h2>
        <p className="text-sm text-stone-500 max-w-xs mx-auto leading-relaxed">
          Sign in to access your secure citizen workspace and track your program benefits.
        </p>
      </div>

      {errors.general && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 leading-relaxed flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Authentication Note</span>
            {errors.general}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FieldWrapper label="Email or Phone Number" required error={errors.identifier}>
          <Input
            value={data.identifier}
            onChange={(e) => setData({ ...data, identifier: e.target.value })}
            placeholder="emeka@example.com or 08012345678"
            error={!!errors.identifier}
          />
        </FieldWrapper>

        <FieldWrapper label="Password" required error={errors.password}>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              placeholder="Enter password"
              error={!!errors.password}
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </FieldWrapper>

        <div className="flex justify-end pt-1">
          <button type="button" className="text-xs text-green-700 font-semibold hover:underline cursor-pointer">
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 bg-green-700 text-white rounded-2xl font-semibold text-sm hover:bg-green-800 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer shadow-md shadow-green-750/10"
        >
          {loading ? (
            <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <LogIn className="w-4 h-4" />
          )}
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="relative flex items-center py-2">
        <div className="flex-1 border-t border-stone-200" />
        <span className="px-3 text-[10px] text-stone-400 font-bold uppercase tracking-widest">or</span>
        <div className="flex-1 border-t border-stone-200" />
      </div>

      <p className="text-center text-sm text-stone-500">
        Don't have an account?{" "}
        <button onClick={onSwitchToSignup} className="font-semibold text-green-700 hover:underline cursor-pointer">
          Register now
        </button>
      </p>

      <p className="text-center pt-2">
        <Link href="/" className="text-[12px] text-stone-400 hover:text-stone-600 transition-colors inline-flex items-center gap-1.5">
          ← Back to CitiEye.ng
        </Link>
      </p>
    </div>
  );
}
