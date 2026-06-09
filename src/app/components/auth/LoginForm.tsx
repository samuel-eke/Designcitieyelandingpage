import { useState } from "react";
import { FieldWrapper, Input } from "./FormUI";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Link } from "react-router";

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
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const e: LoginErrors = {};
    if (!data.identifier.trim()) e.identifier = "Email or phone number is required";
    if (!data.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setErrors({ general: "Demo mode: Login is not connected to a backend yet." });
  };

  return (
    <div className="space-y-6 w-full max-w-sm mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-stone-900">Welcome back</h2>
        <p className="text-sm text-stone-500 mt-1">Sign in to your CitiEye account</p>
      </div>

      {errors.general && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          {errors.general}
        </div>
      )}

      <div className="space-y-4">
        <FieldWrapper label="Email or Phone Number" required error={errors.identifier}>
          <Input
            value={data.identifier}
            onChange={(e) => setData({ ...data, identifier: e.target.value })}
            placeholder="emeka@example.com or 08012345678"
            error={!!errors.identifier}
            success={!!data.identifier && !errors.identifier}
          />
        </FieldWrapper>

        <FieldWrapper label="Password" required error={errors.password}>
          <div className="relative">
            <Input
              type={showPwd ? "text" : "password"}
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              placeholder="Your password"
              error={!!errors.password}
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </FieldWrapper>
      </div>

      <div className="flex justify-end">
        <button className="text-[13px] text-green-700 font-semibold hover:underline">
          Forgot password?
        </button>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-700 text-white rounded-xl font-semibold text-sm hover:bg-green-800 active:scale-95 transition-all disabled:opacity-60"
      >
        {loading ? (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : (
          <LogIn className="w-4 h-4" />
        )}
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <div className="relative flex items-center">
        <div className="flex-1 border-t border-stone-200" />
        <span className="px-3 text-[11px] text-stone-400 font-medium uppercase tracking-wider">or</span>
        <div className="flex-1 border-t border-stone-200" />
      </div>

      <p className="text-center text-sm text-stone-500">
        Don't have an account?{" "}
        <button onClick={onSwitchToSignup} className="font-semibold text-green-700 hover:underline">
          Register now
        </button>
      </p>

      <p className="text-center">
        <Link to="/" className="text-[12px] text-stone-400 hover:text-stone-600">
          ← Back to CitiEye.ng
        </Link>
      </p>
    </div>
  );
}
