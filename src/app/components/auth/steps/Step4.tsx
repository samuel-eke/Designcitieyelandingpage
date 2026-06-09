import { FieldWrapper, Select, RadioGroup, Input } from "../FormUI";
import { QUALIFICATIONS, LITERACY_LEVELS } from "../nigeriaData";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export interface Step4Data {
  qualification: string;
  literacyLevel: string;
  nyscCompleted: string;
  fieldOfStudy: string;
  institution: string;
  graduationYear: string;
}

interface Props {
  data: Step4Data;
  onChange: (data: Step4Data) => void;
  errors: Partial<Record<keyof Step4Data, string>>;
}

export function Step4({ data, onChange, errors }: Props) {
  const [showOptional, setShowOptional] = useState(false);
  const set = <K extends keyof Step4Data>(field: K, value: string) => onChange({ ...data, [field]: value });
  const isPostgrad = data.qualification === "postgraduate";

  const NYSC_OPTIONS = [
    { value: "yes", label: "Yes, I have completed NYSC" },
    { value: "no", label: "No, I have not" },
    { value: "exempted", label: "I was exempted from NYSC" },
    { value: "na", label: "Not applicable to me" },
  ];

  return (
    <div className="space-y-6">
      <FieldWrapper label="Highest qualification achieved" required error={errors.qualification}>
        <Select value={data.qualification} onChange={(e) => set("qualification", e.target.value)}
          placeholder="Select your qualification" error={!!errors.qualification}>
          {QUALIFICATIONS.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
        </Select>
      </FieldWrapper>

      <FieldWrapper label="Literacy level" required error={errors.literacyLevel}
        hint="Be honest — this helps us communicate with you in the best way">
        <RadioGroup
          options={LITERACY_LEVELS.map(l => ({ value: l.value, label: l.label }))}
          value={data.literacyLevel}
          onChange={(v) => set("literacyLevel", v)}
          error={!!errors.literacyLevel}
          cols={2}
        />
      </FieldWrapper>

      {/* Conditional: NYSC for postgrad */}
      {isPostgrad && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl space-y-3">
          <p className="text-[12px] font-semibold text-green-800 uppercase tracking-wider">NYSC Service</p>
          <FieldWrapper label="Have you completed NYSC service?" required error={errors.nyscCompleted}>
            <RadioGroup
              options={NYSC_OPTIONS}
              value={data.nyscCompleted}
              onChange={(v) => set("nyscCompleted", v)}
              error={!!errors.nyscCompleted}
              cols={2}
            />
          </FieldWrapper>
        </div>
      )}

      {/* Optional fields toggle */}
      <button
        type="button"
        onClick={() => setShowOptional(v => !v)}
        className="flex items-center gap-2 text-[12px] font-semibold text-stone-500 hover:text-green-700 transition-colors"
      >
        <ChevronDown className={`w-4 h-4 transition-transform ${showOptional ? "rotate-180" : ""}`} />
        {showOptional ? "Hide" : "Add"} additional education details (optional)
      </button>

      {showOptional && (
        <div className="space-y-4 p-4 bg-stone-50 rounded-xl border border-stone-100">
          <FieldWrapper label="Field of Study" optional>
            <Input value={data.fieldOfStudy} onChange={(e) => set("fieldOfStudy", e.target.value)}
              placeholder="e.g. Computer Science, Nursing, Accounting" />
          </FieldWrapper>
          <FieldWrapper label="Institution Name" optional>
            <Input value={data.institution} onChange={(e) => set("institution", e.target.value)}
              placeholder="e.g. University of Lagos" />
          </FieldWrapper>
          <FieldWrapper label="Graduation Year" optional>
            <Input value={data.graduationYear} onChange={(e) => set("graduationYear", e.target.value)}
              placeholder="e.g. 2019" maxLength={4} inputMode="numeric" />
          </FieldWrapper>
        </div>
      )}
    </div>
  );
}
