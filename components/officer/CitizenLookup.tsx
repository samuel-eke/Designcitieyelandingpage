"use client";

import React, { useState } from "react";
import {
  Search,
  Loader2,
  User,
  MapPin,
  Calendar,
  Hash,
  AlertCircle,
  X,
} from "lucide-react";
import { lookupCitizenByCode } from "@/lib/services/officerService";
import type { CitizenProfileAnalyticsDto } from "@/lib/types/citieye";

interface CitizenLookupProps {
  onFound: (citizen: CitizenProfileAnalyticsDto) => void;
  onClear: () => void;
  foundCitizen: CitizenProfileAnalyticsDto | null;
}

export function CitizenLookup({ onFound, onClear, foundCitizen }: CitizenLookupProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = query.trim();
    if (!code) return;

    setLoading(true);
    setError(null);
    try {
      const citizen = await lookupCitizenByCode(code);
      onFound(citizen);
    } catch (err: any) {
      const msg =
        err?.response?.status === 404
          ? "No citizen found with that code. Please verify and try again."
          : err?.response?.data?.message || err?.message || "Lookup failed. Check the server connection.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setError(null);
    onClear();
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
          Citizen Code Lookup
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setError(null);
              }}
              placeholder="e.g. CIT-LAG-000001"
              className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 border ${
                error ? "border-red-300" : "border-slate-200"
              } rounded-xl text-xs text-slate-800 font-mono outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all placeholder-slate-300`}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? "..." : "Find"}
          </button>
        </div>
        {error && (
          <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-red-600">{error}</p>
          </div>
        )}
      </form>

      {/* Citizen Card */}
      {foundCitizen && (
        <div className="relative p-4 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl text-white overflow-hidden">
          {/* Accent glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full translate-x-8 -translate-y-8 blur-xl" />

          <button
            onClick={handleClear}
            className="absolute top-3 right-3 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
            title="Clear selection"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="relative space-y-3">
            {/* Avatar + Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center font-bold text-sm text-blue-300 shrink-0">
                {foundCitizen.firstName?.[0]}{foundCitizen.lastName?.[0]}
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">
                  {foundCitizen.firstName} {foundCitizen.middleName ? foundCitizen.middleName + " " : ""}{foundCitizen.lastName}
                </p>
                <p className="text-[10px] text-blue-300 font-mono">{foundCitizen.gender} · Age {foundCitizen.age ?? "—"}</p>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="flex items-start gap-1.5">
                <Hash className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider">Code</p>
                  <p className="text-[10px] font-mono font-bold text-slate-200">{foundCitizen.citizenCode}</p>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <Calendar className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider">Date of Birth</p>
                  <p className="text-[10px] font-mono text-slate-200">{foundCitizen.dateOfBirth}</p>
                </div>
              </div>
              <div className="flex items-start gap-1.5 col-span-2">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider">Location</p>
                  <p className="text-[10px] text-slate-200">
                    {foundCitizen.lga}, {foundCitizen.stateOfOrigin} State
                  </p>
                </div>
              </div>
            </div>

            {/* Cohort badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full">
              <User className="w-3 h-3 text-blue-300" />
              <span className="text-[10px] font-bold text-blue-200">{foundCitizen.cohortName}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
