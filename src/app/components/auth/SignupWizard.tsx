import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ProgressBar, NavButtons } from "./FormUI";
import { Step1, Step1Data } from "./steps/Step1";
import { Step2, Step2Data } from "./steps/Step2";
import { Step3, Step3Data } from "./steps/Step3";
import { Step4, Step4Data } from "./steps/Step4";
import { Step5, Step5Data, EmploymentType } from "./steps/Step5";
import { Step6, Step6Data } from "./steps/Step6";
import { Step7, Step7Data } from "./steps/Step7";
import { SuccessScreen } from "./SuccessScreen";

const STORAGE_KEY = "citieye_signup_draft_v2";

const STEP_LABELS = ["Identity", "Legal ID", "Location", "Education", "Employment", "Health", "Welfare"];

const STEP_TITLES = [
  "Tell us about you",
  "Verify your identity",
  "Where are you based?",
  "Your education",
  "Work & livelihood",
  "Health information",
  "How can CitiEye help you?",
];

const STEP_SUBTITLES = [
  "Your name, contact details, and a secure password",
  "Your NIN and a supporting document — kept safe and encrypted",
  "Hometown and current residential address",
  "Helps us understand what kind of support will be useful to you",
  "Your current employment situation",
  "Stored securely, used only to connect you with the right programmes",
  "Select the areas where you'd like support — this shapes your CitiEye profile",
];

const INITIAL: {
  s1: Step1Data;
  s2: Step2Data;
  s3: Step3Data;
  s4: Step4Data;
  s5: Step5Data;
  s6: Step6Data;
  s7: Step7Data;
} = {
  s1: { firstName: "", lastName: "", email: "", phone: "", dateOfBirth: "", gender: "", password: "", confirmPassword: "" },
  s2: { idType: "", nin: "", idNumber: "", documentFileName: undefined },
  s3: { hometown: "", hometownState: "", hometownAddress: "", currentAddress: "", currentState: "", currentLga: "", sameAsHometown: false },
  s4: { qualification: "", literacyLevel: "", nyscCompleted: "", fieldOfStudy: "", institution: "", graduationYear: "" },
  s5: { employmentType: "" as EmploymentType, companyName: "", industry: "", jobTitle: "", employmentStartDate: "", companyAddress: "", businessName: "", cacStatus: "", businessSector: "", businessScale: "", employeeCount: "", currentEngagement: "", otherEngagement: "" },
  s6: { bloodGroup: "", medicalConditions: [], medicalOther: "", isPregnant: "", firstPregnancy: "", dueDate: "", pregnancyConcerns: "" },
  s7: { interests: [], otherInterest: "" },
};

type Errors<T> = Partial<Record<keyof T, string>>;

function validateStep1(d: Step1Data): Errors<Step1Data> {
  const e: Errors<Step1Data> = {};
  if (!d.firstName.trim()) e.firstName = "First name is required";
  if (!d.lastName.trim()) e.lastName = "Last name is required";
  if (!d.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = "Enter a valid email address";
  if (!d.phone.match(/^[0-9]{10,11}$/)) e.phone = "Enter your phone number (10–11 digits)";
  if (!d.dateOfBirth) e.dateOfBirth = "Date of birth is required";
  if (!d.gender) e.gender = "Please select your gender";
  if (d.password.length < 8) e.password = "Minimum 8 characters";
  if (d.confirmPassword !== d.password) e.confirmPassword = "Passwords do not match";
  return e;
}

function validateStep2(d: Step2Data): Errors<Step2Data> {
  const e: Errors<Step2Data> = {};
  if (!d.nin.match(/^[0-9]{11}$/)) e.nin = "NIN must be exactly 11 digits";
  if (!d.idType) e.idType = "Select a supporting ID type";
  if (!d.idNumber.trim()) e.idNumber = "Enter your ID number";
  return e;
}

function validateStep3(d: Step3Data): Errors<Step3Data> {
  const e: Errors<Step3Data> = {};
  if (!d.hometown.trim()) e.hometown = "Hometown is required";
  if (!d.hometownState) e.hometownState = "State of origin is required";
  if (d.currentAddress.trim().length < 5) e.currentAddress = "Enter your current residential address";
  if (!d.currentState) e.currentState = "Current state is required";
  return e;
}

function validateStep4(d: Step4Data): Errors<Step4Data> {
  const e: Errors<Step4Data> = {};
  if (!d.qualification) e.qualification = "Please select your highest qualification";
  if (!d.literacyLevel) e.literacyLevel = "Please select your literacy level";
  if (d.qualification === "postgraduate" && !d.nyscCompleted) e.nyscCompleted = "Please indicate your NYSC status";
  return e;
}

function validateStep5(d: Step5Data): Errors<Step5Data> {
  const e: Errors<Step5Data> = {};
  if (!d.employmentType) { e.employmentType = "Please select your employment situation"; return e; }
  if (d.employmentType === "employed") {
    if (!d.companyName.trim()) e.companyName = "Company name is required";
    if (!d.industry) e.industry = "Industry is required";
    if (!d.jobTitle.trim()) e.jobTitle = "Job title is required";
    if (!d.employmentStartDate) e.employmentStartDate = "Start date is required";
  }
  if (d.employmentType === "self_employed") {
    if (!d.businessName.trim()) e.businessName = "Business name is required";
    if (!d.cacStatus) e.cacStatus = "CAC status is required";
    if (!d.businessSector) e.businessSector = "Business sector is required";
    if (!d.businessScale) e.businessScale = "Business scale is required";
  }
  if (d.employmentType === "unemployed") {
    if (!d.currentEngagement) e.currentEngagement = "Please select what you are currently doing";
    if (d.currentEngagement === "other" && !d.otherEngagement.trim()) e.otherEngagement = "Please describe your current situation";
  }
  return e;
}

function validateStep6(d: Step6Data, gender: string): Errors<Step6Data> {
  const e: Errors<Step6Data> = {};
  if (!d.bloodGroup) e.bloodGroup = "Please select your blood group";
  if (gender === "female" && !d.isPregnant) e.isPregnant = "Please answer this question";
  return e;
}

function validateStep7(d: Step7Data): Errors<Step7Data> {
  const e: Errors<Step7Data> = {};
  if (d.interests.length === 0) e.interests = "Please select at least one area";
  if (d.interests.includes("Other (please specify)") && !d.otherInterest.trim()) {
    e.otherInterest = "Please describe your other interest";
  }
  return e;
}

interface Props {
  onSwitchToLogin: () => void;
}

export function SignupWizard({ onSwitchToLogin }: Props) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [consentError, setConsentError] = useState("");

  const [s1, setS1] = useState<Step1Data>(INITIAL.s1);
  const [s2, setS2] = useState<Step2Data>(INITIAL.s2);
  const [s3, setS3] = useState<Step3Data>(INITIAL.s3);
  const [s4, setS4] = useState<Step4Data>(INITIAL.s4);
  const [s5, setS5] = useState<Step5Data>(INITIAL.s5);
  const [s6, setS6] = useState<Step6Data>(INITIAL.s6);
  const [s7, setS7] = useState<Step7Data>(INITIAL.s7);

  const [e1, setE1] = useState<Errors<Step1Data>>({});
  const [e2, setE2] = useState<Errors<Step2Data>>({});
  const [e3, setE3] = useState<Errors<Step3Data>>({});
  const [e4, setE4] = useState<Errors<Step4Data>>({});
  const [e5, setE5] = useState<Errors<Step5Data>>({});
  const [e6, setE6] = useState<Errors<Step6Data>>({});
  const [e7, setE7] = useState<Errors<Step7Data>>({});

  // Load draft
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.s1) setS1((prev) => ({ ...prev, ...parsed.s1 }));
        if (parsed.s2) setS2((prev) => ({ ...prev, ...parsed.s2 }));
        if (parsed.s3) setS3((prev) => ({ ...prev, ...parsed.s3 }));
        if (parsed.s4) setS4((prev) => ({ ...prev, ...parsed.s4 }));
        if (parsed.s5) setS5((prev) => ({ ...prev, ...parsed.s5 }));
        if (parsed.s6) setS6((prev) => ({ ...prev, ...parsed.s6 }));
        if (parsed.s7) setS7((prev) => ({ ...prev, ...parsed.s7 }));
        if (parsed.step && parsed.step > 1) setStep(parsed.step);
      }
    } catch (_) {}
  }, []);

  const saveDraft = () => {
    try {
      const { password, confirmPassword, ...safeS1 } = s1;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ s1: safeS1, s2, s3, s4, s5, s6, s7, step }));
    } catch (_) {}
  };

  // Auto-save on change from step 3 onwards
  useEffect(() => {
    if (step >= 3) saveDraft();
  }, [s3, s4, s5, s6, s7, step]);

  const goNext = async () => {
    let hasErrors = false;

    if (step === 1) {
      const errs = validateStep1(s1);
      setE1(errs);
      hasErrors = Object.keys(errs).length > 0;
    } else if (step === 2) {
      const errs = validateStep2(s2);
      setE2(errs);
      hasErrors = Object.keys(errs).length > 0;
    } else if (step === 3) {
      const errs = validateStep3(s3);
      setE3(errs);
      hasErrors = Object.keys(errs).length > 0;
    } else if (step === 4) {
      const errs = validateStep4(s4);
      setE4(errs);
      hasErrors = Object.keys(errs).length > 0;
    } else if (step === 5) {
      const errs = validateStep5(s5);
      setE5(errs);
      hasErrors = Object.keys(errs).length > 0;
    } else if (step === 6) {
      const errs = validateStep6(s6, s1.gender);
      setE6(errs);
      hasErrors = Object.keys(errs).length > 0;
    } else if (step === 7) {
      const errs = validateStep7(s7);
      setE7(errs);
      hasErrors = Object.keys(errs).length > 0;
      if (!hasErrors) {
        if (!agreed) {
          setConsentError("Please agree to the terms to complete your registration.");
          return;
        }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 2000));
        setLoading(false);
        localStorage.removeItem(STORAGE_KEY);
        setSubmitted(true);
        return;
      }
    }

    if (hasErrors) return;
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step === 1) { onSwitchToLogin(); return; }
    setDirection(-1);
    setStep((s) => s - 1);
  };

  if (submitted) {
    return <SuccessScreen name={`${s1.firstName} ${s1.lastName}`} email={s1.email} />;
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <ProgressBar current={step} total={7} labels={STEP_LABELS} />

      <div>
        <h2 className="text-xl font-serif font-bold text-stone-900">{STEP_TITLES[step - 1]}</h2>
        <p className="text-[13px] text-stone-500 mt-0.5">{STEP_SUBTITLES[step - 1]}</p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: direction * 36 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -36 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
        >
          {step === 1 && <Step1 data={s1} onChange={setS1} errors={e1} />}
          {step === 2 && <Step2 data={s2} onChange={setS2} errors={e2} />}
          {step === 3 && <Step3 data={s3} onChange={setS3} errors={e3} />}
          {step === 4 && <Step4 data={s4} onChange={setS4} errors={e4} />}
          {step === 5 && <Step5 data={s5} onChange={setS5} errors={e5} />}
          {step === 6 && <Step6 data={s6} onChange={setS6} errors={e6} gender={s1.gender} />}
          {step === 7 && (
            <div className="space-y-6">
              <Step7 data={s7} onChange={setS7} errors={e7} />

              {/* Consent */}
              <div className={`p-4 rounded-xl border transition-colors ${consentError ? "border-red-300 bg-red-50" : "border-stone-200 bg-stone-50"}`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => { setAgreed(e.target.checked); if (e.target.checked) setConsentError(""); }}
                    className="w-4 h-4 mt-0.5 accent-green-700 shrink-0"
                  />
                  <span className="text-[12px] text-stone-600 leading-relaxed">
                    I confirm that the information I have provided is accurate and complete. I consent to CitiEye processing my data for the purpose of welfare programme eligibility and field officer coordination.
                    I understand I can request correction or deletion of my data at any time.
                  </span>
                </label>
                {consentError && <p className="mt-2 text-[11px] text-red-600">{consentError}</p>}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <NavButtons
        onBack={goBack}
        onNext={goNext}
        isFirst={step === 1}
        isLast={step === 7}
        loading={loading}
        showSaveDraft={step >= 3}
        onSaveDraft={saveDraft}
      />

      {step === 1 && (
        <p className="text-center text-sm text-stone-500">
          Already registered?{" "}
          <button onClick={onSwitchToLogin} className="font-semibold text-green-700 hover:underline">
            Sign in
          </button>
        </p>
      )}

      {step >= 3 && (
        <p className="text-center text-[11px] text-stone-400">
          ✓ Progress saved automatically
        </p>
      )}
    </div>
  );
}
