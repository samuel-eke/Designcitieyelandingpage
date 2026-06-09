import { FieldWrapper, Input, Select, RadioGroup } from "../FormUI";
import { INDUSTRIES, BUSINESS_SCALES, UNEMPLOYMENT_ENGAGEMENTS } from "../nigeriaData";

export type EmploymentType = "employed" | "self_employed" | "unemployed" | "";

export interface Step5Data {
  employmentType: EmploymentType;
  // Employed
  companyName: string;
  industry: string;
  jobTitle: string;
  employmentStartDate: string;
  companyAddress: string;
  // Self-employed
  businessName: string;
  cacStatus: string;
  businessSector: string;
  businessScale: string;
  employeeCount: string;
  // Unemployed
  currentEngagement: string;
  otherEngagement: string;
}

interface Props {
  data: Step5Data;
  onChange: (data: Step5Data) => void;
  errors: Partial<Record<keyof Step5Data, string>>;
}

const TYPE_OPTIONS = [
  { value: "employed", label: "Employed", description: "Working for a company or government" },
  { value: "self_employed", label: "Self-employed / Business owner", description: "Running my own business or trade" },
  { value: "unemployed", label: "Not currently working", description: "Unemployed, studying, or otherwise" },
];

const CAC_OPTIONS = [
  { value: "registered", label: "Registered with CAC" },
  { value: "unregistered", label: "Not yet registered" },
  { value: "in_progress", label: "Registration in progress" },
];

export function Step5({ data, onChange, errors }: Props) {
  const set = <K extends keyof Step5Data>(field: K, value: string) => onChange({ ...data, [field]: value });
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <FieldWrapper label="What is your current employment situation?" required error={errors.employmentType}>
        <RadioGroup
          options={TYPE_OPTIONS}
          value={data.employmentType}
          onChange={(v) => onChange({ ...data, employmentType: v as EmploymentType })}
          error={!!errors.employmentType}
        />
      </FieldWrapper>

      {/* EMPLOYED */}
      {data.employmentType === "employed" && (
        <div className="space-y-4 pt-2 border-t border-stone-100">
          <p className="text-[11px] font-bold uppercase tracking-widest text-green-700">Employment Details</p>
          <FieldWrapper label="Company / Organisation name" required error={errors.companyName}>
            <Input value={data.companyName} onChange={(e) => set("companyName", e.target.value)}
              placeholder="e.g. Dangote Group, FCMB, Lagos State Government"
              error={!!errors.companyName} success={!!data.companyName && !errors.companyName} />
          </FieldWrapper>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldWrapper label="Industry / Sector" required error={errors.industry}>
              <Select value={data.industry} onChange={(e) => set("industry", e.target.value)}
                placeholder="Select industry" error={!!errors.industry}>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </Select>
            </FieldWrapper>
            <FieldWrapper label="Job Title / Role" required error={errors.jobTitle}>
              <Input value={data.jobTitle} onChange={(e) => set("jobTitle", e.target.value)}
                placeholder="e.g. Nurse, Teacher, Software Developer"
                error={!!errors.jobTitle} success={!!data.jobTitle && !errors.jobTitle} />
            </FieldWrapper>
          </div>
          <FieldWrapper label="Employment start date" required error={errors.employmentStartDate}>
            <Input type="date" value={data.employmentStartDate}
              onChange={(e) => set("employmentStartDate", e.target.value)}
              max={today} error={!!errors.employmentStartDate} success={!!data.employmentStartDate && !errors.employmentStartDate} />
          </FieldWrapper>
          <FieldWrapper label="Company address" optional>
            <Input value={data.companyAddress} onChange={(e) => set("companyAddress", e.target.value)}
              placeholder="e.g. 1 Dangote Way, Apapa, Lagos" />
          </FieldWrapper>
        </div>
      )}

      {/* SELF-EMPLOYED */}
      {data.employmentType === "self_employed" && (
        <div className="space-y-4 pt-2 border-t border-stone-100">
          <p className="text-[11px] font-bold uppercase tracking-widest text-amber-700">Business Details</p>
          <FieldWrapper label="Business name" required error={errors.businessName}>
            <Input value={data.businessName} onChange={(e) => set("businessName", e.target.value)}
              placeholder="e.g. Ngozi Fabrics, TechBuild Nigeria"
              error={!!errors.businessName} success={!!data.businessName && !errors.businessName} />
          </FieldWrapper>
          <FieldWrapper label="CAC registration status" required error={errors.cacStatus}>
            <RadioGroup
              options={CAC_OPTIONS}
              value={data.cacStatus}
              onChange={(v) => set("cacStatus", v)}
              error={!!errors.cacStatus}
              cols={2}
            />
          </FieldWrapper>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldWrapper label="Business sector" required error={errors.businessSector}>
              <Select value={data.businessSector} onChange={(e) => set("businessSector", e.target.value)}
                placeholder="Select sector" error={!!errors.businessSector}>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </Select>
            </FieldWrapper>
            <FieldWrapper label="Business scale" required error={errors.businessScale}>
              <Select value={data.businessScale} onChange={(e) => set("businessScale", e.target.value)}
                placeholder="Select scale" error={!!errors.businessScale}>
                {BUSINESS_SCALES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </Select>
            </FieldWrapper>
          </div>
          <FieldWrapper label="Number of people you employ" optional
            hint="Include paid staff, apprentices, and family helpers">
            <Input value={data.employeeCount} onChange={(e) => set("employeeCount", e.target.value)}
              placeholder="e.g. 0, 3, 12" inputMode="numeric" />
          </FieldWrapper>
        </div>
      )}

      {/* UNEMPLOYED */}
      {data.employmentType === "unemployed" && (
        <div className="space-y-4 pt-2 border-t border-stone-100">
          <p className="text-[11px] font-bold uppercase tracking-widest text-stone-500">Current Situation</p>
          <FieldWrapper label="What are you currently doing?" required error={errors.currentEngagement}>
            <RadioGroup
              options={UNEMPLOYMENT_ENGAGEMENTS}
              value={data.currentEngagement}
              onChange={(v) => set("currentEngagement", v)}
              error={!!errors.currentEngagement}
              cols={2}
            />
          </FieldWrapper>
          {data.currentEngagement === "other" && (
            <FieldWrapper label="Please describe" required error={errors.otherEngagement}>
              <Input value={data.otherEngagement} onChange={(e) => set("otherEngagement", e.target.value)}
                placeholder="Tell us a bit more…"
                error={!!errors.otherEngagement} success={!!data.otherEngagement} />
            </FieldWrapper>
          )}
        </div>
      )}
    </div>
  );
}
