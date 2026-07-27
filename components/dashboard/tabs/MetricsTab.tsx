"use client";

import { MetricsFeedback } from "../types";

interface MetricsTabProps {
  metricsFeedback: MetricsFeedback;
  setMetricsFeedback: React.Dispatch<React.SetStateAction<MetricsFeedback>>;
  isSubmittingMetrics: boolean;
  handleSubmitMetrics: (e: React.FormEvent) => void;
}

export function MetricsTab({
  metricsFeedback,
  setMetricsFeedback,
  isSubmittingMetrics,
  handleSubmitMetrics,
}: MetricsTabProps) {
  return (
    <div className="max-w-2xl bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
      <div className="border-b border-stone-100 pb-4">
        <h3 className="text-base font-bold text-stone-900">Community Governance Surveys</h3>
        <p className="text-xs text-stone-500 mt-1">
          Report on the status of public infrastructure in your local government area (LGA) to assist planning.
        </p>
      </div>

      <form onSubmit={handleSubmitMetrics} className="space-y-5">
        {/* 1. Security */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 block">
            How would you rate the neighborhood security presence in your LGA?
          </label>
          <div className="grid grid-cols-5 gap-2">
            {["1", "2", "3", "4", "5"].map((num) => (
              <button
                type="button"
                key={num}
                onClick={() => setMetricsFeedback({ ...metricsFeedback, securityRating: num })}
                className={`py-3.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  metricsFeedback.securityRating === num
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                }`}
              >
                {num === "1" ? "Poor (1)" : num === "5" ? "Excellent (5)" : num}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Power */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 block">
            Average grid power supply availability per day:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { val: "1", label: "< 4 Hrs" },
              { val: "2", label: "4 - 8 Hrs" },
              { val: "3", label: "8 - 16 Hrs" },
              { val: "4", label: "16+ Hrs" },
            ].map((opt) => (
              <button
                type="button"
                key={opt.val}
                onClick={() => setMetricsFeedback({ ...metricsFeedback, powerRating: opt.val })}
                className={`py-3.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  metricsFeedback.powerRating === opt.val
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Roads */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 block">
            Status of road networks and drainage in your immediate community:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: "1", label: "Deplorable" },
              { val: "2", label: "Manageable" },
              { val: "3", label: "Excellent" },
            ].map((opt) => (
              <button
                type="button"
                key={opt.val}
                onClick={() => setMetricsFeedback({ ...metricsFeedback, roadRating: opt.val })}
                className={`py-3.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  metricsFeedback.roadRating === opt.val
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text comment */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 block">
            What is the single most urgent infrastructure issue that needs attention in your LGA?
          </label>
          <textarea
            value={metricsFeedback.satisfactionText}
            onChange={(e) => setMetricsFeedback({ ...metricsFeedback, satisfactionText: e.target.value })}
            rows={4}
            className="w-full bg-stone-50 border border-stone-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded-2xl p-4 text-xs text-stone-850 outline-none resize-none"
            placeholder="Please specify roads, health clinics, schools, public safety, or local market centers..."
          />
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            disabled={isSubmittingMetrics}
            className="px-6 py-3 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            {isSubmittingMetrics ? "Submitting feedback..." : "Submit Local Metrics Questionnaire"}
          </button>
        </div>
      </form>
    </div>
  );
}
