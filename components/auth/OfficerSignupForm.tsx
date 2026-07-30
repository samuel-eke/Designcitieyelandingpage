"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserCheck,
  Shield,
  Stethoscope,
  GraduationCap,
  Briefcase,
  Building,
  Heart,
  Eye,
  EyeOff,
  CheckCircle2,
  Copy,
  Check,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore, OfficerRegisterFormData } from "@/components/auth/authStore";
import { useStatesAndLgas } from "@/lib/hooks/useStatesAndLgas";

interface OfficerSignupFormProps {
  onSwitchToLogin: () => void;
}

export function OfficerSignupForm({ onSwitchToLogin }: OfficerSignupFormProps) {
  const router = useRouter();
  const registerOfficer = useAuthStore((state) => state.registerOfficer);
  const loading = useAuthStore((state) => state.loading);
  const authError = useAuthStore((state) => state.error);

  const { states, getLgasForState } = useStatesAndLgas();

  const [showPassword, setShowPassword] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<{
    citizenCode: string;
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState<OfficerRegisterFormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    nin: "",
    gender: "male",
    dateOfBirth: "",
    specialty: "medical",
    stateOfResidence: "Lagos",
    residenceLga: "",
    stateOfOrigin: "Lagos",
    lga: "",
    address: "",
  });

  const availableLgas = getLgasForState(formData.stateOfOrigin);
  const availableResidenceLgas = getLgasForState(formData.stateOfResidence);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof OfficerRegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim()) errs.firstName = "First name is required";
    if (!formData.lastName.trim()) errs.lastName = "Last name is required";
    if (!formData.email.trim()) {
      errs.email = "Official email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!formData.phoneNumber.trim()) errs.phoneNumber = "Phone number is required";
    if (!formData.password) {
      errs.password = "Password is required";
    } else if (formData.password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }
    if (!formData.nin.trim()) {
      errs.nin = "NIN is required";
    } else if (formData.nin.trim().length !== 11) {
      errs.nin = "NIN must be exactly 11 digits";
    }
    if (!formData.dateOfBirth) errs.dateOfBirth = "Date of birth is required";
    if (!formData.stateOfResidence) errs.stateOfResidence = "State of residence is required";
    if (!formData.residenceLga.trim()) errs.residenceLga = "LGA of residence is required";
    if (!formData.stateOfOrigin) errs.stateOfOrigin = "State of origin is required";
    if (!formData.lga.trim()) errs.lga = "LGA of origin is required";
    if (!formData.address.trim()) errs.address = "Station / Address is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields accurately.");
      return;
    }

    const result = await registerOfficer(formData);
    if (result) {
      const code = result.citizenCode || result.code || "CIT-OFR-REG-SUCCESS";
      setRegistrationSuccess({
        citizenCode: code,
        message: result.message || "Field Officer registered successfully.",
      });
      toast.success("Field Officer account created successfully!");
    } else {
      toast.error(authError || "Officer registration failed. Please try again.");
    }
  };

  const copyOfficerCode = () => {
    if (registrationSuccess?.citizenCode) {
      navigator.clipboard.writeText(registrationSuccess.citizenCode);
      setCopiedCode(true);
      toast.success("Officer security code copied to clipboard!");
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const specialties = [
    { id: "medical", label: "Health & Care", icon: Stethoscope, color: "emerald", desc: "Immunization, maternal & clinical logs" },
    { id: "education", label: "Education", icon: GraduationCap, color: "blue", desc: "Schools, academic grades & attendance" },
    { id: "hr", label: "Workforce & HR", icon: Briefcase, color: "purple", desc: "Employment status & skill census" },
    { id: "corporate_affairs", label: "Business Affairs", icon: Building, color: "amber", desc: "SME registry & trade classifications" },
    { id: "pension", label: "Pension & Elderly", icon: Heart, color: "rose", desc: "Pre-retirement & senior welfare" },
  ];

  if (registrationSuccess) {
    return (
      <div className="space-y-6 py-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-slate-800">
            Field Officer Provisioned!
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {registrationSuccess.message} Save your official Security Code below for administrative clearance.
          </p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 text-center">
          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest block">
            Generated Officer Security Code
          </span>
          <div className="flex items-center justify-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-850">
            <span className="text-lg font-mono font-bold text-white tracking-widest select-all">
              {registrationSuccess.citizenCode}
            </span>
            <button
              onClick={copyOfficerCode}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
              title="Copy Security Code"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            Use this Security Code along with your password to access the Field Officer portal.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <button
            onClick={onSwitchToLogin}
            className="w-full py-3.5 bg-green-700 hover:bg-green-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Officer Login</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3 h-3" />
          Field Officer Self-Registration
        </div>
        <h3 className="text-2xl font-serif font-bold text-slate-800 tracking-tight">
          Register Field Officer Node
        </h3>
        <p className="text-xs text-slate-400 font-light">
          Register your field officer profile to log socio-economic, health, and educational census data.
        </p>
      </div>

      {authError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
          {authError}
        </div>
      )}

      {/* Specialty Selector Cards */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
          Domain Specialization *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {specialties.map((spec) => {
            const Icon = spec.icon;
            const isSelected = formData.specialty === spec.id;
            return (
              <button
                type="button"
                key={spec.id}
                onClick={() => handleChange("specialty", spec.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-[85px] ${
                  isSelected
                    ? "bg-blue-50/60 border-blue-500 ring-2 ring-blue-500/20"
                    : "bg-slate-50/50 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                  {isSelected && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                </div>
                <div>
                  <span className={`text-xs font-bold block ${isSelected ? "text-blue-900" : "text-slate-700"}`}>
                    {spec.label}
                  </span>
                  <span className="text-[9px] text-slate-400 line-clamp-1">{spec.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Personal Info Section */}
      <div className="space-y-4 pt-2">
        <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-1">
          1. Identity & Name
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase font-mono">First Name *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="Chidi"
              className={`w-full px-3 py-2.5 bg-slate-50 border ${errors.firstName ? 'border-red-400' : 'border-slate-200'} rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 transition-all`}
            />
            {errors.firstName && <span className="text-[9px] text-red-500">{errors.firstName}</span>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase font-mono">Middle Name</label>
            <input
              type="text"
              value={formData.middleName}
              onChange={(e) => handleChange("middleName", e.target.value)}
              placeholder="Obinna"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase font-mono">Last Name *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="Eze"
              className={`w-full px-3 py-2.5 bg-slate-50 border ${errors.lastName ? 'border-red-400' : 'border-slate-200'} rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 transition-all`}
            />
            {errors.lastName && <span className="text-[9px] text-red-500">{errors.lastName}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase font-mono">NIN (11 Digits) *</label>
            <input
              type="text"
              maxLength={11}
              value={formData.nin}
              onChange={(e) => handleChange("nin", e.target.value.replace(/\D/g, ""))}
              placeholder="98765432109"
              className={`w-full px-3 py-2.5 bg-slate-50 border ${errors.nin ? 'border-red-400' : 'border-slate-200'} rounded-xl text-xs text-slate-800 font-mono outline-none focus:border-blue-500 transition-all`}
            />
            {errors.nin && <span className="text-[9px] text-red-500">{errors.nin}</span>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase font-mono">Gender *</label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase font-mono">Date of Birth *</label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
              className={`w-full px-3 py-2.5 bg-slate-50 border ${errors.dateOfBirth ? 'border-red-400' : 'border-slate-200'} rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 transition-all`}
            />
            {errors.dateOfBirth && <span className="text-[9px] text-red-500">{errors.dateOfBirth}</span>}
          </div>
        </div>
      </div>

      {/* Account Credentials */}
      <div className="space-y-4 pt-2">
        <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-1">
          2. Official Contact & Security
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase font-mono">Official Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="officer@citieye.gov.ng"
              className={`w-full px-3 py-2.5 bg-slate-50 border ${errors.email ? 'border-red-400' : 'border-slate-200'} rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 transition-all`}
            />
            {errors.email && <span className="text-[9px] text-red-500">{errors.email}</span>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase font-mono">Phone Number *</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              placeholder="08011223344"
              className={`w-full px-3 py-2.5 bg-slate-50 border ${errors.phoneNumber ? 'border-red-400' : 'border-slate-200'} rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 transition-all`}
            />
            {errors.phoneNumber && <span className="text-[9px] text-red-500">{errors.phoneNumber}</span>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase font-mono">Account Password *</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="••••••••"
              className={`w-full px-3 py-2.5 bg-slate-50 border ${errors.password ? 'border-red-400' : 'border-slate-200'} rounded-xl text-xs text-slate-800 pr-10 outline-none focus:border-blue-500 transition-all`}
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

      {/* Demographics & Station */}
      <div className="space-y-4 pt-2">
        <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-1">
          3. Station & Location
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase font-mono">State of Residence *</label>
            <select
              value={formData.stateOfResidence}
              onChange={(e) => {
                const newState = e.target.value;
                const newLgas = getLgasForState(newState);
                setFormData((prev) => ({
                  ...prev,
                  stateOfResidence: newState,
                  residenceLga: newLgas[0] || "",
                }));
                if (errors.stateOfResidence) {
                  setErrors((prev) => ({ ...prev, stateOfResidence: "" }));
                }
              }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 transition-all cursor-pointer font-medium"
            >
              <option value="">Select State of Residence</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            {errors.stateOfResidence && <span className="text-[9px] text-red-500">{errors.stateOfResidence}</span>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase font-mono">LGA of Residence *</label>
            <select
              value={formData.residenceLga}
              onChange={(e) => handleChange("residenceLga", e.target.value)}
              disabled={!formData.stateOfResidence}
              className={`w-full px-3 py-2.5 bg-slate-50 border ${errors.residenceLga ? 'border-red-400' : 'border-slate-200'} rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 transition-all cursor-pointer font-medium disabled:opacity-50`}
            >
              <option value="">{formData.stateOfResidence ? "Select LGA of Residence" : "Select State of Residence First"}</option>
              {availableResidenceLgas.map((lgaItem) => (
                <option key={lgaItem} value={lgaItem}>
                  {lgaItem}
                </option>
              ))}
            </select>
            {errors.residenceLga && <span className="text-[9px] text-red-500">{errors.residenceLga}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase font-mono">State of Origin *</label>
            <select
              value={formData.stateOfOrigin}
              onChange={(e) => {
                const newState = e.target.value;
                const newLgas = getLgasForState(newState);
                setFormData((prev) => ({
                  ...prev,
                  stateOfOrigin: newState,
                  lga: newLgas[0] || "",
                }));
                if (errors.stateOfOrigin) {
                  setErrors((prev) => ({ ...prev, stateOfOrigin: "" }));
                }
              }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 transition-all cursor-pointer font-medium"
            >
              <option value="">Select State of Origin</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            {errors.stateOfOrigin && <span className="text-[9px] text-red-500">{errors.stateOfOrigin}</span>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase font-mono">LGA of Origin *</label>
            <select
              value={formData.lga}
              onChange={(e) => handleChange("lga", e.target.value)}
              disabled={!formData.stateOfOrigin}
              className={`w-full px-3 py-2.5 bg-slate-50 border ${errors.lga ? 'border-red-400' : 'border-slate-200'} rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 transition-all cursor-pointer font-medium disabled:opacity-50`}
            >
              <option value="">{formData.stateOfOrigin ? "Select LGA" : "Select State of Origin First"}</option>
              {availableLgas.map((lgaItem) => (
                <option key={lgaItem} value={lgaItem}>
                  {lgaItem}
                </option>
              ))}
            </select>
            {errors.lga && <span className="text-[9px] text-red-500">{errors.lga}</span>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase font-mono">Station Address *</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="12 Hospital Road, Benin"
            className={`w-full px-3 py-2.5 bg-slate-50 border ${errors.address ? 'border-red-400' : 'border-slate-200'} rounded-xl text-xs text-slate-800 outline-none focus:border-blue-500 transition-all`}
          />
          {errors.address && <span className="text-[9px] text-red-500">{errors.address}</span>}
        </div>
      </div>

      <div className="pt-2 space-y-3">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <UserCheck className="w-4 h-4" />
          )}
          <span>{loading ? "Registering Officer Node..." : "Complete Field Officer Registration"}</span>
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium cursor-pointer"
          >
            Already have an Officer Security Code? <span className="text-blue-600 font-bold">Log in here</span>
          </button>
        </div>
      </div>
    </form>
  );
}
