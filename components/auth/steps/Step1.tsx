"use client";

import { useState } from "react";
import { FieldWrapper, Input, Select, RadioGroup } from "../FormUI";
import { Eye, EyeOff } from "lucide-react";

export interface Step1Data {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  password: string;
  confirmPassword: string;
}

interface Props {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
  errors: Partial<Step1Data>;
}

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export function Step1({ data, onChange, errors }: Props) {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const set = (field: keyof Step1Data, value: string) => onChange({ ...data, [field]: value });

  const today = new Date().toISOString().split("T")[0];
  const maxDob = new Date(Date.now() - 10 * 365.25 * 24 * 3600 * 1000).toISOString().split("T")[0];

  const pwdStrength = Math.min(4, Math.floor(data.password.length / 3));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FieldWrapper label="First Name" required error={errors.firstName}>
          <Input value={data.firstName} onChange={(e) => set("firstName", e.target.value)}
            placeholder="Emeka" error={!!errors.firstName} success={!!data.firstName && !errors.firstName} />
        </FieldWrapper>
        <FieldWrapper label="Last Name" required error={errors.lastName}>
          <Input value={data.lastName} onChange={(e) => set("lastName", e.target.value)}
            placeholder="Okonkwo" error={!!errors.lastName} success={!!data.lastName && !errors.lastName} />
        </FieldWrapper>
      </div>

      <FieldWrapper label="Email Address" required error={errors.email} hint="We'll use this to send you updates about your registration">
        <Input type="email" value={data.email} onChange={(e) => set("email", e.target.value)}
          placeholder="emeka@example.com" error={!!errors.email} success={!!data.email && !errors.email} />
      </FieldWrapper>

      <FieldWrapper label="Phone Number" required error={errors.phone} hint="Nigerian number e.g. 08012345678">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-stone-500 font-medium pointer-events-none">+234</span>
          <Input value={data.phone} onChange={(e) => set("phone", e.target.value)}
            placeholder="8012345678" error={!!errors.phone} success={!!data.phone && !errors.phone} className="pl-14" />
        </div>
      </FieldWrapper>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FieldWrapper label="Date of Birth" required error={errors.dateOfBirth}>
          <Input type="date" value={data.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)}
            max={maxDob} error={!!errors.dateOfBirth} success={!!data.dateOfBirth && !errors.dateOfBirth} />
        </FieldWrapper>
        <FieldWrapper label="Gender" required error={errors.gender}>
          <Select value={data.gender} onChange={(e) => set("gender", e.target.value)}
            placeholder="Select gender" error={!!errors.gender}>
            {GENDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </FieldWrapper>
      </div>

      <FieldWrapper label="Create Password" required error={errors.password} hint="At least 8 characters">
        <div className="relative">
          <Input type={showPwd ? "text" : "password"} value={data.password}
            onChange={(e) => set("password", e.target.value)}
            placeholder="Create a strong password" error={!!errors.password}
            success={data.password.length >= 8 && !errors.password} className="pr-12" />
          <button type="button" onClick={() => setShowPwd(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {data.password && (
          <div className="flex gap-1 mt-1">
            {[1,2,3,4].map(i => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                i <= pwdStrength
                  ? pwdStrength <= 1 ? "bg-red-500" : pwdStrength <= 2 ? "bg-amber-500" : pwdStrength <= 3 ? "bg-yellow-400" : "bg-green-500"
                  : "bg-stone-200"
              }`} />
            ))}
          </div>
        )}
      </FieldWrapper>

      <FieldWrapper label="Confirm Password" required error={errors.confirmPassword}>
        <div className="relative">
          <Input type={showConfirm ? "text" : "password"} value={data.confirmPassword}
            onChange={(e) => set("confirmPassword", e.target.value)}
            placeholder="Repeat your password" error={!!errors.confirmPassword}
            success={!!data.confirmPassword && data.confirmPassword === data.password && !errors.confirmPassword}
            className="pr-12" />
          <button type="button" onClick={() => setShowConfirm(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </FieldWrapper>
    </div>
  );
}
