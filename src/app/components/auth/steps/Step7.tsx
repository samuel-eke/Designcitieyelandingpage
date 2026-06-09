import { FieldWrapper, CheckboxGroup, Input } from "../FormUI";
import { WELFARE_INTERESTS } from "../nigeriaData";
import { Sparkles } from "lucide-react";

export interface Step7Data {
  interests: string[];
  otherInterest: string;
}

interface Props {
  data: Step7Data;
  onChange: (data: Step7Data) => void;
  errors: Partial<Record<keyof Step7Data, string>>;
}

export function Step7({ data, onChange, errors }: Props) {
  const set = <K extends keyof Step7Data>(field: K, value: Step7Data[K]) => onChange({ ...data, [field]: value });
  const hasOther = data.interests.includes("Other (please specify)");

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 p-4 bg-[#008751]/8 border border-[#008751]/20 rounded-xl">
        <Sparkles className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
        <p className="text-[11px] text-green-800 leading-relaxed">
          Your answers help us route you to the right programmes, grants, and field officers. You can update your interests at any time after registration.
          <span className="block mt-1 font-semibold">Select all that apply — there is no wrong answer.</span>
        </p>
      </div>

      <FieldWrapper
        label="Which areas would CitiEye help you with?"
        required
        error={errors.interests}
        hint="Choose as many as are relevant to you"
      >
        <CheckboxGroup
          options={WELFARE_INTERESTS}
          selected={data.interests}
          onChange={(val) => set("interests", val)}
        />
      </FieldWrapper>

      {hasOther && (
        <FieldWrapper label="Please describe your other interest" required error={errors.otherInterest}>
          <Input
            value={data.otherInterest}
            onChange={(e) => set("otherInterest", e.target.value)}
            placeholder="Tell us a bit more about what you need help with…"
            error={!!errors.otherInterest}
            success={data.otherInterest.length > 3 && !errors.otherInterest}
          />
        </FieldWrapper>
      )}

      <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl">
        <p className="text-[11px] text-stone-500 leading-relaxed">
          CitiEye is in its early stages, and your registration directly shapes the programmes we prioritise.
          By completing this form, you are helping build a welfare system that works for every Nigerian.
        </p>
      </div>
    </div>
  );
}
