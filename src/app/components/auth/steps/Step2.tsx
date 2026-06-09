import { FieldWrapper, Input, Select, FileUpload } from "../FormUI";
import { IDENTITY_TYPES } from "../nigeriaData";
import { ShieldCheck, Info } from "lucide-react";

export interface Step2Data {
  idType: string;
  nin: string;
  idNumber: string;
  documentFileName?: string;
}

interface Props {
  data: Step2Data;
  onChange: (data: Step2Data) => void;
  errors: Partial<Record<keyof Step2Data, string>>;
}

function formatNIN(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 11);
}

export function Step2({ data, onChange, errors }: Props) {
  const set = <K extends keyof Step2Data>(field: K, value: Step2Data[K]) => onChange({ ...data, [field]: value });
  const selectedId = IDENTITY_TYPES.find(t => t.value === data.idType);
  const needsDoc = ["voters_card", "international_passport", "drivers_licence"].includes(data.idType);

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
        <ShieldCheck className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-green-800">Your data is protected</p>
          <p className="text-[11px] text-green-700 mt-0.5">
            Identity data is verified via NIMC and encrypted at rest. We will never sell or share your information.
          </p>
        </div>
      </div>

      <FieldWrapper label="National Identification Number (NIN)" required error={errors.nin}
        hint="Your 11-digit NIN issued by NIMC. If you don't have one, visit any NIMC centre.">
        <Input value={data.nin} onChange={(e) => set("nin", formatNIN(e.target.value))}
          placeholder="12345678901" maxLength={11} inputMode="numeric"
          error={!!errors.nin} success={data.nin.length === 11 && !errors.nin} />
        {data.nin.length > 0 && data.nin.length < 11 && (
          <div className="flex gap-0.5 mt-1">
            {Array.from({ length: 11 }, (_, i) => (
              <div key={i} className={`h-1 w-full rounded-full ${i < data.nin.length ? "bg-green-500" : "bg-stone-200"}`} />
            ))}
          </div>
        )}
      </FieldWrapper>

      <FieldWrapper label="Supporting ID Type" required error={errors.idType}>
        <Select value={data.idType} onChange={(e) => set("idType", e.target.value)}
          placeholder="Choose an ID type" error={!!errors.idType}>
          {IDENTITY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </Select>
      </FieldWrapper>

      {data.idType && (
        <FieldWrapper label={`${selectedId?.label ?? "ID"} Number`} required error={errors.idNumber}
          hint="Enter exactly as it appears on the document">
          <Input value={data.idNumber} onChange={(e) => set("idNumber", e.target.value.toUpperCase())}
            placeholder={
              data.idType === "bvn" ? "12345678901"
              : data.idType === "international_passport" ? "A12345678"
              : "Enter ID number"
            }
            error={!!errors.idNumber} success={data.idNumber.length >= 6 && !errors.idNumber} />
        </FieldWrapper>
      )}

      {needsDoc && (
        <FieldWrapper label="Upload Document Image" error={errors.documentFileName}
          hint="Clear photo or scan of the ID — JPG, PNG, or PDF (max 5 MB)">
          <FileUpload
            label="Upload document"
            fileName={data.documentFileName}
            onFile={(name) => set("documentFileName", name)}
            onClear={() => set("documentFileName", undefined)}
            hint="JPG, PNG or PDF"
            error={!!errors.documentFileName}
          />
        </FieldWrapper>
      )}

      <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-700 leading-relaxed">
          The name on your ID should match what you entered in Step 1. Mismatches may delay your verification.
        </p>
      </div>
    </div>
  );
}
