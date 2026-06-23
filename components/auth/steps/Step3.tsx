"use client";

import { FieldWrapper, Input, Select } from "../FormUI";
import { NG_STATES, NG_LGAS } from "../nigeriaData";
import { Info } from "lucide-react";

export interface Step3Data {
  hometown: string;
  hometownState: string;
  hometownAddress: string;
  currentAddress: string;
  currentState: string;
  currentLga: string;
  sameAsHometown: boolean;
}

interface Props {
  data: Step3Data;
  onChange: (data: Step3Data) => void;
  errors: Partial<Record<keyof Step3Data, string>>;
}

export function Step3({ data, onChange, errors }: Props) {
  const set = <K extends keyof Step3Data>(field: K, value: Step3Data[K]) => onChange({ ...data, [field]: value });
  const currentLgas = data.currentState ? (NG_LGAS[data.currentState] ?? []) : [];

  const handleSameAsHometown = (checked: boolean) => {
    if (checked) {
      onChange({
        ...data,
        sameAsHometown: true,
        currentAddress: data.hometownAddress,
        currentState: data.hometownState,
      });
    } else {
      set("sameAsHometown", false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hometown / State of Origin */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-3">Origin / Hometown</p>
        <div className="space-y-4">
          <FieldWrapper label="Hometown or Village" required error={errors.hometown}
            hint="The community you consider your home">
            <Input value={data.hometown} onChange={(e) => set("hometown", e.target.value)}
              placeholder="e.g. Nnewi, Aba, Ilorin"
              error={!!errors.hometown} success={!!data.hometown && !errors.hometown} />
          </FieldWrapper>

          <FieldWrapper label="State of Origin" required error={errors.hometownState}>
            <Select value={data.hometownState} onChange={(e) => set("hometownState", e.target.value)}
              placeholder="Select state of origin" error={!!errors.hometownState}>
              {NG_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </FieldWrapper>

          <FieldWrapper label="Hometown Address" optional error={errors.hometownAddress}
            hint="Street, compound, or nearest landmark">
            <Input value={data.hometownAddress} onChange={(e) => set("hometownAddress", e.target.value)}
              placeholder="e.g. 12 Market Road, Nnewi" />
          </FieldWrapper>
        </div>
      </div>

      {/* Current Residence */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">Current Residence</p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.sameAsHometown}
              onChange={(e) => handleSameAsHometown(e.target.checked)}
              className="w-3.5 h-3.5 accent-green-600"
            />
            <span className="text-[11px] text-stone-500 font-medium">Same as hometown</span>
          </label>
        </div>

        <div className="space-y-4">
          <FieldWrapper label="Current Residential Address" required error={errors.currentAddress}
            hint="Where you live right now">
            <Input value={data.currentAddress} onChange={(e) => set("currentAddress", e.target.value)}
              placeholder="e.g. 14 Adeola Odeku Street, Lagos"
              disabled={data.sameAsHometown}
              error={!!errors.currentAddress} success={data.currentAddress.length > 5 && !errors.currentAddress} />
          </FieldWrapper>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldWrapper label="Current State" required error={errors.currentState}>
              <Select value={data.currentState} onChange={(e) => { set("currentState", e.target.value); set("currentLga", ""); }}
                placeholder="Select state" error={!!errors.currentState} disabled={data.sameAsHometown}>
                {NG_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </FieldWrapper>

            <FieldWrapper label="Local Government Area" error={errors.currentLga}>
              <Select value={data.currentLga} onChange={(e) => set("currentLga", e.target.value)}
                placeholder={data.currentState ? "Select LGA" : "Select state first"}
                disabled={!data.currentState || data.sameAsHometown}>
                {currentLgas.map(l => <option key={l} value={l}>{l}</option>)}
              </Select>
            </FieldWrapper>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2.5 p-3.5 bg-stone-50 border border-stone-200 rounded-xl">
        <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-stone-500 leading-relaxed">
          Your location helps us connect you with the most relevant programmes and field officers in your area.
        </p>
      </div>
    </div>
  );
}
