import { FieldWrapper, Select, CheckboxGroup, RadioGroup, Input, TextArea } from "../FormUI";
import { BLOOD_GROUPS, MEDICAL_CONDITIONS } from "../nigeriaData";
import { Info } from "lucide-react";

export interface Step6Data {
  bloodGroup: string;
  medicalConditions: string[];
  medicalOther: string;
  isPregnant: string;
  firstPregnancy: string;
  dueDate: string;
  pregnancyConcerns: string;
}

interface Props {
  data: Step6Data;
  onChange: (data: Step6Data) => void;
  errors: Partial<Record<keyof Step6Data, string>>;
  gender: string;
}

const PREGNANCY_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const FIRST_PREGNANCY_OPTIONS = [
  { value: "yes", label: "Yes, first pregnancy" },
  { value: "no", label: "No, I've been pregnant before" },
];

export function Step6({ data, onChange, errors, gender }: Props) {
  const set = <K extends keyof Step6Data>(field: K, value: Step6Data[K]) => onChange({ ...data, [field]: value });
  const isFemale = gender === "female";
  const isPregnant = data.isPregnant === "yes";
  const showsMedicalOther = data.medicalConditions.includes("Prefer not to say") === false && data.medicalConditions.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 p-4 bg-stone-50 border border-stone-200 rounded-xl">
        <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-stone-500 leading-relaxed">
          This information helps us connect you to the right health programmes. All health data is stored securely and only seen by your assigned CitiEye officer.
          You can choose "I don't know" or "Prefer not to say" for any field.
        </p>
      </div>

      <FieldWrapper label="Blood group / Blood type" required error={errors.bloodGroup}>
        <Select value={data.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)}
          placeholder="Select blood group" error={!!errors.bloodGroup}>
          {BLOOD_GROUPS.map(b => <option key={b} value={b}>{b}</option>)}
        </Select>
      </FieldWrapper>

      <FieldWrapper label="Known medical conditions" optional
        hint="Select all that apply. Choose 'None' or 'Prefer not to say' if appropriate.">
        <CheckboxGroup
          options={MEDICAL_CONDITIONS}
          selected={data.medicalConditions}
          onChange={(val) => set("medicalConditions", val)}
        />
      </FieldWrapper>

      {/* Female-specific */}
      {isFemale && (
        <div className="space-y-4 p-4 bg-pink-50/50 border border-pink-100 rounded-xl">
          <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-1">Maternal Health</p>

          <FieldWrapper label="Are you currently pregnant?" required error={errors.isPregnant}>
            <RadioGroup
              options={PREGNANCY_OPTIONS}
              value={data.isPregnant}
              onChange={(v) => set("isPregnant", v)}
              error={!!errors.isPregnant}
              cols={2}
            />
          </FieldWrapper>

          {isPregnant && (
            <>
              <FieldWrapper label="Is this your first pregnancy?" optional error={errors.firstPregnancy}>
                <RadioGroup
                  options={FIRST_PREGNANCY_OPTIONS}
                  value={data.firstPregnancy}
                  onChange={(v) => set("firstPregnancy", v)}
                  cols={2}
                />
              </FieldWrapper>

              <FieldWrapper label="Estimated due date" optional error={errors.dueDate}>
                <Input type="date" value={data.dueDate}
                  onChange={(e) => set("dueDate", e.target.value)}
                  min={new Date().toISOString().split("T")[0]} />
              </FieldWrapper>

              <FieldWrapper label="Any pregnancy-related concerns?" optional
                hint="Share anything you'd like your CitiEye officer to know">
                <TextArea value={data.pregnancyConcerns}
                  onChange={(e) => set("pregnancyConcerns", e.target.value)}
                  placeholder="e.g. high blood pressure, access to a clinic, transport issues…" />
              </FieldWrapper>
            </>
          )}
        </div>
      )}
    </div>
  );
}
