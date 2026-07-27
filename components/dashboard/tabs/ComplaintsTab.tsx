"use client";

import { ComplaintItem } from "../types";

interface ComplaintsTabProps {
  complaints: ComplaintItem[];
  newComplaint: {
    title: string;
    category: string;
    description: string;
  };
  setNewComplaint: React.Dispatch<
    React.SetStateAction<{
      title: string;
      category: string;
      description: string;
    }>
  >;
  isSubmittingComplaint: boolean;
  handleLodgeComplaint: (e: React.FormEvent) => void;
}

export function ComplaintsTab({
  complaints,
  newComplaint,
  setNewComplaint,
  isSubmittingComplaint,
  handleLodgeComplaint,
}: ComplaintsTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Form panel */}
      <div className="lg:col-span-7 bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="border-b border-stone-100 pb-4">
          <h3 className="text-base font-bold text-stone-900">Lodge Civic Redress Ticket</h3>
          <p className="text-xs text-stone-500 mt-1">
            Report community grievances, public corruption, or infrastructural failures. Checked by local officer.
          </p>
        </div>

        <form onSubmit={handleLodgeComplaint} className="space-y-4">
          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-600 block">Grievance Category</label>
            <select
              value={newComplaint.category}
              onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 focus:border-green-600 rounded-2xl px-4 py-3 text-xs text-stone-800 outline-none cursor-pointer"
            >
              <option value="Infrastructure">Infrastructure (Roads, Water, Bridges)</option>
              <option value="Power Infrastructure">Power Infrastructure (Transformers, Grid)</option>
              <option value="Sanitation & Environment">Sanitation & Waste Management</option>
              <option value="Security / Policing">Public Security & Neighborhood Policing</option>
              <option value="Welfare Disbursements">Welfare & Grant Disbursements Issues</option>
              <option value="Official Misconduct">Official Misconduct & Corruption Reporting</option>
            </select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-600 block">Subject Summary</label>
            <input
              type="text"
              value={newComplaint.title}
              onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
              className="w-full bg-stone-50 border border-stone-200 focus:border-green-600 rounded-2xl px-4 py-3 text-xs text-stone-800 outline-none"
              placeholder="e.g. Defective transformer on Ahmadu Bello road"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-600 block">Detailed Statement of Grievance</label>
            <textarea
              value={newComplaint.description}
              onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
              rows={5}
              className="w-full bg-stone-50 border border-stone-200 focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded-2xl p-4 text-xs text-stone-850 outline-none resize-none"
              placeholder="Please state dates, precise locations, safety impact, and details to speed up dispatch..."
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmittingComplaint}
              className="px-6 py-3 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              {isSubmittingComplaint ? "Registering ticket..." : "File Complaint Ticket"}
            </button>
          </div>
        </form>
      </div>

      {/* History panel */}
      <div className="lg:col-span-5 bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-stone-900">Your Tickets History</h3>
          <p className="text-xs text-stone-500 mt-1">
            Track the live updates of your filed reports.
          </p>
        </div>

        <div className="space-y-4">
          {complaints.map((c) => (
            <div key={c.id} className="p-4 bg-stone-50/50 border border-stone-200 rounded-2xl space-y-2">
              <div className="flex justify-between items-start gap-2">
                <span className="px-2 py-0.5 bg-stone-200/60 text-stone-600 text-[9px] font-bold rounded uppercase tracking-wide">
                  {c.category}
                </span>
                <span
                  className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wide flex items-center gap-1 ${
                    c.status === "Resolved"
                      ? "bg-green-100 text-green-700"
                      : c.status === "In Review"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${c.status === "Resolved" ? "bg-green-500" : c.status === "In Review" ? "bg-yellow-500" : "bg-amber-500"}`}></span>
                  {c.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-stone-850">{c.title}</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed">{c.description}</p>
              <div className="flex justify-between items-center text-[10px] text-stone-400 pt-2 border-t border-stone-150">
                <span>LODGED: {c.date}</span>
                <span>OFFICER IN CHARGE: AISHA B.</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
