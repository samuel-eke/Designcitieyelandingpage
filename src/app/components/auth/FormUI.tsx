import { forwardRef, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode, useRef } from "react";
import { AlertCircle, CheckCircle2, Upload, X } from "lucide-react";

interface FieldWrapperProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  children: ReactNode;
}

export function FieldWrapper({ label, error, hint, required, optional, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-stone-700 tracking-wide flex items-center gap-1.5">
        {label}
        {required && <span className="text-green-700">*</span>}
        {optional && <span className="text-[11px] text-stone-400 font-normal">(optional)</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[11px] text-stone-400 leading-relaxed">{hint}</p>}
      {error && (
        <p className="flex items-center gap-1 text-[11px] text-red-600">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, success, className = "", ...props }, ref) => {
    const borderClass = error
      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
      : success
      ? "border-green-500 focus:border-green-600 focus:ring-green-100"
      : "border-stone-300 focus:border-green-600 focus:ring-green-100";

    return (
      <div className="relative">
        <input
          ref={ref}
          className={`w-full px-4 py-3 text-sm text-stone-900 bg-white border ${borderClass} rounded-xl outline-none focus:ring-2 transition-all placeholder:text-stone-400 ${className}`}
          {...props}
        />
        {success && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500 pointer-events-none" />
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ error, className = "", ...props }, ref) => {
    const borderClass = error
      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
      : "border-stone-300 focus:border-green-600 focus:ring-green-100";

    return (
      <textarea
        ref={ref}
        rows={3}
        className={`w-full px-4 py-3 text-sm text-stone-900 bg-white border ${borderClass} rounded-xl outline-none focus:ring-2 transition-all placeholder:text-stone-400 resize-none ${className}`}
        {...props}
      />
    );
  }
);
TextArea.displayName = "TextArea";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, placeholder, className = "", children, ...props }, ref) => {
    const borderClass = error
      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
      : "border-stone-300 focus:border-green-600 focus:ring-green-100";

    return (
      <select
        ref={ref}
        className={`w-full px-4 py-3 text-sm text-stone-900 bg-white border ${borderClass} rounded-xl outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

interface RadioOption { value: string; label: string; description?: string }
interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (val: string) => void;
  error?: boolean;
  cols?: 1 | 2;
}

export function RadioGroup({ options, value, onChange, error, cols = 1 }: RadioGroupProps) {
  return (
    <div className={`grid gap-2 ${cols === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
      {options.map((opt) => {
        const checked = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
              checked
                ? "border-green-500 bg-green-50 text-green-800"
                : error
                ? "border-red-300 bg-white text-stone-700 hover:border-stone-400"
                : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
            }`}
          >
            <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
              checked ? "border-green-500 bg-green-500" : "border-stone-400"
            }`}>
              {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
            <div>
              <p className="text-sm font-medium leading-snug">{opt.label}</p>
              {opt.description && <p className="text-[11px] text-stone-500 mt-0.5">{opt.description}</p>}
            </div>
          </button>
        );
      })}
    </div>
  );
}

interface CheckboxGroupProps {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  max?: number;
}

export function CheckboxGroup({ options, selected, onChange, max }: CheckboxGroupProps) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else if (!max || selected.length < max) {
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((opt) => {
        const checked = selected.includes(opt);
        const disabled = !checked && !!max && selected.length >= max;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => !disabled && toggle(opt)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all ${
              checked
                ? "border-green-500 bg-green-50 text-green-800"
                : disabled
                ? "border-stone-200 bg-stone-50 text-stone-400 cursor-not-allowed"
                : "border-stone-200 bg-white text-stone-700 hover:border-stone-400"
            }`}
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center border-2 shrink-0 transition-all ${
              checked ? "border-green-500 bg-green-500" : "border-stone-300"
            }`}>
              {checked && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

interface FileUploadProps {
  label: string;
  fileName?: string;
  onFile: (name: string) => void;
  onClear: () => void;
  accept?: string;
  hint?: string;
  error?: boolean;
}

export function FileUpload({ fileName, onFile, onClear, accept = "image/*,.pdf", hint, error }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      {fileName ? (
        <div className="flex items-center justify-between px-4 py-3 bg-green-50 border border-green-300 rounded-xl">
          <div className="flex items-center gap-2 text-sm text-green-800 font-medium truncate">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="truncate">{fileName}</span>
          </div>
          <button type="button" onClick={onClear} className="ml-2 text-stone-400 hover:text-red-500 transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`w-full flex flex-col items-center gap-2 px-4 py-6 border-2 border-dashed rounded-xl transition-all ${
            error ? "border-red-300 hover:border-red-400" : "border-stone-200 hover:border-green-400"
          }`}
        >
          <Upload className="w-5 h-5 text-stone-400" />
          <span className="text-sm text-stone-500 font-medium">Click to upload document</span>
          {hint && <span className="text-[11px] text-stone-400">{hint}</span>}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f.name); }}
      />
    </div>
  );
}

export function ProgressBar({ current, total, labels }: { current: number; total: number; labels: string[] }) {
  return (
    <div className="w-full">
      <div className="flex items-center mb-3">
        {labels.map((label, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < current;
          const isActive = stepNum === current;
          const isLast = i === labels.length - 1;
          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 shrink-0 ${
                  isDone ? "bg-green-500 text-white" : isActive ? "bg-green-700 text-white ring-4 ring-green-100" : "bg-stone-200 text-stone-400"
                }`}>
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : stepNum}
                </div>
                <span className={`text-[9px] font-semibold uppercase tracking-wide whitespace-nowrap transition-colors ${
                  isActive ? "text-green-700" : isDone ? "text-stone-400" : "text-stone-300"
                }`}>
                  {label}
                </span>
              </div>
              {!isLast && (
                <div className={`h-[2px] flex-1 mx-1 mb-3.5 rounded transition-all duration-500 ${isDone ? "bg-green-500" : "bg-stone-200"}`} />
              )}
            </div>
          );
        })}
      </div>
      <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((current - 1) / (total - 1)) * 100}%` }}
        />
      </div>
      <p className="text-right text-[11px] text-stone-400 mt-1.5">Step {current} of {total}</p>
    </div>
  );
}

export function NavButtons({
  onBack, onNext, isFirst, isLast, nextLabel = "Continue", loading = false, showSaveDraft, onSaveDraft
}: {
  onBack: () => void; onNext: () => void; isFirst?: boolean; isLast?: boolean;
  nextLabel?: string; loading?: boolean; showSaveDraft?: boolean; onSaveDraft?: () => void;
}) {
  return (
    <div className="flex items-center justify-between pt-2 gap-3">
      <button
        type="button" onClick={onBack} disabled={isFirst}
        className="px-5 py-2.5 text-sm font-semibold text-stone-600 border border-stone-300 rounded-xl hover:bg-stone-50 transition-all disabled:opacity-0 disabled:pointer-events-none"
      >
        ← Back
      </button>
      <div className="flex items-center gap-2">
        {showSaveDraft && onSaveDraft && (
          <button
            type="button" onClick={onSaveDraft}
            className="px-4 py-2.5 text-xs font-semibold text-stone-500 border border-stone-200 rounded-xl hover:bg-stone-50 transition-all"
          >
            Save draft
          </button>
        )}
        <button
          type="button" onClick={onNext} disabled={loading}
          className="px-7 py-2.5 text-sm font-semibold text-white bg-green-700 rounded-xl hover:bg-green-800 active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2"
        >
          {loading && (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          )}
          {isLast ? "Submit" : `${nextLabel} →`}
        </button>
      </div>
    </div>
  );
}
