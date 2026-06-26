"use client";

import { useState } from "react";
import { useAuthStore, RegisterFormData } from "./authStore";
import { FieldWrapper, Input, Select } from "./FormUI";
import { ShieldCheck, Eye, EyeOff, User, Mail, Phone, Lock, Calendar, FileText, MapPin, Heart } from "lucide-react";
import { NG_STATES } from "./nigeriaData";
import { SuccessScreen } from "./SuccessScreen";

interface Props {
  onSwitchToLogin: () => void;
}

const SUPPORT_OPTIONS = [
  { value: "scholarship", label: "Scholarship Track" },
  { value: "medical_aid_treatment", label: "Medical Aid & Treatment" },
  { value: "business_capital", label: "Business Capital Grant" },
  { value: "investor_funding", label: "Investor Funding & Prototype Lab" },
  { value: "job_opportunity", label: "Job & Internship Opportunity" },
  { value: "visa_sponsorship", label: "Visa Sponsorship" },
  { value: "skill_acquisition", label: "Digital Skills & Skill Acquisition" },
];

export function SignupForm({ onSwitchToLogin }: Props) {
  const { registerData, setRegisterData, registerCitizen, loading, error, success, successData } = useAuthStore();
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData | "consent" | "general", string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [consent, setConsent] = useState(false);

  const validate = (): boolean => {
    const e: Partial<Record<keyof RegisterFormData | "consent", string>> = {};

    // First Name
    if (!registerData.firstName.trim()) {
      e.firstName = "First name is required";
    } else if (!/^[A-Za-z]+$/.test(registerData.firstName.trim())) {
      e.firstName = "First name can only contain letters";
    }

    // Middle Name (Optional)
    if (registerData.middleName.trim() && !/^[A-Za-z]+$/.test(registerData.middleName.trim())) {
      e.middleName = "Middle name can only contain letters";
    }

    // Last Name
    if (!registerData.lastName.trim()) {
      e.lastName = "Last name is required";
    } else if (!/^[A-Za-z]+$/.test(registerData.lastName.trim())) {
      e.lastName = "Last name can only contain letters";
    }

    // Email
    if (!registerData.email.trim()) {
      e.email = "Email address is required";
    } else if (!/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(registerData.email.trim())) {
      e.email = "Please enter a valid email address";
    }

    // Phone Number (exactly 11 digits starting with 0)
    if (!registerData.phoneNumber.trim()) {
      e.phoneNumber = "Phone number is required";
    } else if (!/^0[0-9]{10}$/.test(registerData.phoneNumber.trim())) {
      e.phoneNumber = "Phone number must be exactly 11 digits and start with 0 (e.g. 08012345678)";
    }

    // Password (min 8 chars)
    if (!registerData.password) {
      e.password = "Password is required";
    } else if (registerData.password.length < 8) {
      e.password = "Password must be at least 8 characters long";
    }

    // NIN (exactly 10 digits)
    if (!registerData.nin.trim()) {
      e.nin = "NIN is required";
    } else if (!/^[0-9]{10}$/.test(registerData.nin.trim())) {
      e.nin = "NIN must be exactly 10 digits (e.g. 5874123657)";
    }

    // Gender
    if (!registerData.gender) {
      e.gender = "Gender is required";
    }

    // Address
    if (!registerData.address.trim()) {
      e.address = "Residential address is required";
    } else if (registerData.address.trim().length < 5) {
      e.address = "Please enter a complete residential address";
    }

    // State of Residence
    if (!registerData.stateOfResidence) {
      e.stateOfResidence = "State of residence is required";
    }

    // Date of Birth
    if (!registerData.dateOfBirth) {
      e.dateOfBirth = "Date of birth is required";
    } else {
      const dob = new Date(registerData.dateOfBirth);
      const today = new Date();
      if (dob >= today) {
        e.dateOfBirth = "Date of birth must be in the past";
      }
    }

    // Desired Support
    if (!registerData.desiredSupport) {
      e.desiredSupport = "Please select your desired support program";
    }

    // Consent
    if (!consent) {
      e.consent = "You must agree to the data verification terms";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Sanitize stateOfResidence (e.g., FCT - Abuja to FCT)
    const sanitizedState = registerData.stateOfResidence === "FCT - Abuja" ? "FCT" : registerData.stateOfResidence;

    const payload = {
      ...registerData,
      stateOfResidence: sanitizedState,
    };

    await registerCitizen(payload);
  };

  if (success && successData) {
    return (
      <SuccessScreen
        name={`${registerData.firstName} ${registerData.lastName}`}
        email={registerData.email}
        citizenCode={successData.citizenCode}
        cohortName={successData.cohortPlacement}
      />
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">
          Create citizen profile
        </h2>
        <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
          Join the federal lifecycle registry. Enter your details to generate your unique citizen identity.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 leading-relaxed flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Registration Failed</span>
            {error}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details Section */}
        <div className="bg-stone-50/50 border border-stone-200/60 rounded-2xl p-5 md:p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3 mb-2">
            <User className="w-4.5 h-4.5 text-green-700" />
            <h3 className="text-sm font-semibold text-stone-850 uppercase tracking-wider">
              1. Personal Identity
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FieldWrapper label="First Name" required error={errors.firstName}>
              <Input
                value={registerData.firstName}
                onChange={(e) => setRegisterData({ firstName: e.target.value })}
                placeholder="Saul"
                error={!!errors.firstName}
              />
            </FieldWrapper>

            <FieldWrapper label="Middle Name" optional error={errors.middleName}>
              <Input
                value={registerData.middleName}
                onChange={(e) => setRegisterData({ middleName: e.target.value })}
                placeholder="Braun"
                error={!!errors.middleName}
              />
            </FieldWrapper>

            <FieldWrapper label="Last Name" required error={errors.lastName}>
              <Input
                value={registerData.lastName}
                onChange={(e) => setRegisterData({ lastName: e.target.value })}
                placeholder="Dean"
                error={!!errors.lastName}
              />
            </FieldWrapper>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldWrapper label="Date of Birth" required error={errors.dateOfBirth}>
              <div className="relative">
                <Input
                  type="date"
                  value={registerData.dateOfBirth}
                  onChange={(e) => setRegisterData({ dateOfBirth: e.target.value })}
                  error={!!errors.dateOfBirth}
                  className="w-full"
                />
              </div>
            </FieldWrapper>

            <FieldWrapper label="Gender" required error={errors.gender}>
              <Select
                value={registerData.gender}
                onChange={(e) => setRegisterData({ gender: e.target.value })}
                placeholder="Select Gender"
                error={!!errors.gender}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </FieldWrapper>
          </div>
        </div>

        {/* Contact and Security Section */}
        <div className="bg-stone-50/50 border border-stone-200/60 rounded-2xl p-5 md:p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3 mb-2">
            <Phone className="w-4.5 h-4.5 text-green-700" />
            <h3 className="text-sm font-semibold text-stone-850 uppercase tracking-wider">
              2. Credentials & ID
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldWrapper label="Email Address" required error={errors.email}>
              <Input
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ email: e.target.value })}
                placeholder="ekeeke@themail.com"
                error={!!errors.email}
              />
            </FieldWrapper>

            <FieldWrapper label="Phone Number" required error={errors.phoneNumber}>
              <Input
                type="tel"
                value={registerData.phoneNumber}
                onChange={(e) => setRegisterData({ phoneNumber: e.target.value })}
                placeholder="07558536985"
                error={!!errors.phoneNumber}
              />
            </FieldWrapper>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldWrapper label="National Identification Number (NIN)" required error={errors.nin}>
              <Input
                type="text"
                maxLength={10}
                value={registerData.nin}
                onChange={(e) => setRegisterData({ nin: e.target.value })}
                placeholder="5874123657"
                error={!!errors.nin}
              />
            </FieldWrapper>

            <FieldWrapper label="Access Password" required error={errors.password}>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ password: e.target.value })}
                  placeholder="Minimum 8 characters"
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
          </div>
        </div>

        {/* Location & Welfare Support Section */}
        <div className="bg-stone-50/50 border border-stone-200/60 rounded-2xl p-5 md:p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3 mb-2">
            <MapPin className="w-4.5 h-4.5 text-green-700" />
            <h3 className="text-sm font-semibold text-stone-850 uppercase tracking-wider">
              3. Location & Assistance
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldWrapper label="State of Residence" required error={errors.stateOfResidence}>
              <Select
                value={registerData.stateOfResidence}
                onChange={(e) => setRegisterData({ stateOfResidence: e.target.value })}
                placeholder="Select State"
                error={!!errors.stateOfResidence}
              >
                {NG_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Select>
            </FieldWrapper>

            <FieldWrapper label="Desired Support Program" required error={errors.desiredSupport}>
              <Select
                value={registerData.desiredSupport}
                onChange={(e) => setRegisterData({ desiredSupport: e.target.value })}
                placeholder="Select Support Area"
                error={!!errors.desiredSupport}
              >
                {SUPPORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </FieldWrapper>
          </div>

          <FieldWrapper label="Residential Address" required error={errors.address}>
            <Input
              value={registerData.address}
              onChange={(e) => setRegisterData({ address: e.target.value })}
              placeholder="123 Main Street, Ikeja"
              error={!!errors.address}
            />
          </FieldWrapper>
        </div>

        {/* Verification Consent */}
        <div
          className={`p-4 rounded-2xl border transition-colors ${
            errors.consent ? "border-red-300 bg-red-50/50" : "border-stone-200 bg-stone-55"
          }`}
        >
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                if (e.target.checked) setErrors((prev) => ({ ...prev, consent: "" }));
              }}
              className="w-4 h-4 mt-0.5 accent-green-700 shrink-0"
            />
            <span className="text-[12px] text-stone-600 leading-relaxed select-none">
              I certify that all details submitted are correct. I authorize the agency to verify my Identity Number (NIN) through NIMC resources to finalize my registry enrollment.
            </span>
          </label>
          {errors.consent && <p className="mt-1.5 text-[11px] text-red-650 font-medium">{errors.consent}</p>}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:flex-1 py-4 bg-green-700 text-white rounded-2xl font-semibold text-sm hover:bg-green-800 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-green-750/10"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Creating Account...
              </>
            ) : (
              "Submit Registration"
            )}
          </button>
        </div>
      </form>

      <p className="text-center text-sm text-stone-500 pt-2">
        Already registered?{" "}
        <button onClick={onSwitchToLogin} className="font-semibold text-green-700 hover:underline cursor-pointer">
          Sign in to your account
        </button>
      </p>
    </div>
  );
}
