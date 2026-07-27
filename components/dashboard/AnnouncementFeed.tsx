"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Wifi, WifiOff, RefreshCw, Inbox, Loader2 } from "lucide-react";
import { useDashboardFeed, PostFilter } from "@/lib/hooks/useDashboardFeed";
import { AnnouncementCard } from "./AnnouncementCard";

// ---------------------------------------------------------------------------
// Filter chip labels
// ---------------------------------------------------------------------------

const FILTER_OPTIONS: { value: PostFilter; label: string }[] = [
  { value: "all", label: "All Posts" },
  { value: "cohort", label: "Cohort" },
  { value: "state_residence", label: "State (Residence)" },
  { value: "state_origin", label: "State (Origin)" },
  { value: "support_group", label: "Support Group" },
  { value: "everyone", label: "All Citizens" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AnnouncementFeed() {
  const {
    filteredPosts,
    isLoading,
    error,
    activeFilter,
    setFilter,
    isStreamConnected,
    refetch,
  } = useDashboardFeed();

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="space-y-5">
      {/* Header row: title + SSE indicator + refresh */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900">
            Announcements & Updates
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Personalised posts from your admin and field officers
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Live connection indicator */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isStreamConnected
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-stone-100 text-stone-500 border border-stone-200"
            }`}
          >
            {isStreamConnected ? (
              <>
                <Wifi className="w-3 h-3" />
                Live
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" />
                Offline
              </>
            )}
          </div>

          {/* Refresh button */}
          <button
            onClick={refetch}
            disabled={isLoading}
            className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-500 hover:text-stone-700 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh feed"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === option.value
                ? "bg-green-700 text-white shadow-sm"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Post list */}
      <div className="space-y-4">
        {/* Loading skeleton */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-green-700" />
            <p className="text-sm text-stone-500">Loading your personalised feed...</p>
          </div>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
            <p className="text-sm text-red-700 font-medium">{error}</p>
            <button
              onClick={refetch}
              className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && filteredPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="p-4 bg-stone-100 rounded-full">
              <Inbox className="w-8 h-8 text-stone-400" />
            </div>
            <h4 className="text-sm font-semibold text-stone-700">
              {activeFilter === "all"
                ? "No announcements yet"
                : `No posts matching "${FILTER_OPTIONS.find((o) => o.value === activeFilter)?.label}" filter`}
            </h4>
            <p className="text-xs text-stone-500 max-w-sm">
              New posts published by your admin will appear here in real-time.
              {isStreamConnected
                ? " You're connected and will see updates instantly."
                : " Reconnecting..."}
            </p>
          </div>
        )}

        {/* Post cards */}
        {!isLoading && !error && (
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
              <AnnouncementCard
                key={post.id}
                post={post}
                isExpanded={expandedId === post.id}
                onToggleExpand={() => toggleExpand(post.id)}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
