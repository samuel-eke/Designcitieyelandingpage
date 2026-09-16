"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Building2,
  CheckCircle2,
  Loader2,
  Users,
  MapPin,
  School as SchoolIcon,
} from "lucide-react";
import { toast } from "sonner";
import { createSchool } from "@/lib/services/educationalOfficerService";
import type { SchoolRequest } from "@/lib/types/educationOfficer";

interface SchoolRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLga?: string;
  defaultState?: string;
  onSuccess?: () => void;
}

export function SchoolRegistryModal({
  isOpen,
  onClose,
  defaultLga = "",
  defaultState = "Lagos",
  onSuccess,
}: SchoolRegistryModalProps) {
  const [name, setName] = useState("");
  const [lga, setLga] = useState(defaultLga);
  const [state, setState] = useState(defaultState);
  const [pupilCount, setPupilCount] = useState<number | "">("");
  const [schoolType, setSchoolType] = useState("Public Primary School");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("School name is required");
      return;
    }
    if (!lga.trim()) {
      toast.error("LGA is required");
      return;
    }
    if (pupilCount === "" || Number(pupilCount) <= 0) {
      toast.error("Total pupil count must be greater than zero");
      return;
    }

    setSubmitting(true);
    try {
      const payload: SchoolRequest = {
        name: name.trim(),
        lga: lga.trim(),
        state: state.trim() || undefined,
        pupilCount: Number(pupilCount),
        schoolType: schoolType.trim() || undefined,
        address: address.trim() || undefined,
      };

      await createSchool(payload);
      toast.success("School successfully registered in jurisdiction!");
      setName("");
      setPupilCount("");
      setAddress("");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("School creation error:", err);
      const msg =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response?.data : null) ||
        err.message ||
        "Failed to register school.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 rounded-2xl bg-white border border-stone-200">
        <div className="p-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <SchoolIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold font-serif text-white">
                Register Primary School
              </DialogTitle>
              <DialogDescription className="text-xs text-blue-100 mt-0.5">
                Log a primary educational facility in your assigned LGA jurisdiction.
              </DialogDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Primary School Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. St. Paul Primary School"
              required
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                LGA <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lga}
                onChange={(e) => setLga(e.target.value)}
                placeholder="e.g. Ikeja"
                required
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Lagos"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Total Pupil Count <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={pupilCount}
                onChange={(e) => setPupilCount(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="e.g. 450"
                required
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                School Type
              </label>
              <select
                value={schoolType}
                onChange={(e) => setSchoolType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-blue-600"
              >
                <option value="Public Primary School">Public Primary</option>
                <option value="Model Primary School">Model Primary</option>
                <option value="Community Primary School">Community School</option>
                <option value="Nomadic Primary School">Nomadic School</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Physical Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 14 Oba Akinjobi Way, GRA"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              {submitting ? "Registering..." : "Register School"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
