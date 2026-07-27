"use client";

import { motion } from "motion/react";
import { Calendar, User2, Tag, ChevronDown, ChevronUp, Megaphone } from "lucide-react";
import type { PostDto, DesiredSupport } from "@/lib/types/citieye";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Humanise a desiredSupport enum value */
const SUPPORT_LABELS: Record<DesiredSupport, string> = {
  scholarship: "Scholarship",
  medical_aid_treatment: "Medical Aid",
  business_capital: "Business Capital",
  investor_funding: "Investor Funding",
  job_opportunity: "Job Opportunity",
  visa_sponsorship: "Visa Sponsorship",
  skill_acquisition: "Skill Acquisition",
};

/** Derive the targeting badge from whichever target field is non-null */
function getTargetBadge(post: PostDto): { label: string; color: string } {
  if (post.targetCohortId != null)
    return { label: `Cohort #${post.targetCohortId}`, color: "bg-blue-100 text-blue-700" };
  if (post.targetStateResidence)
    return { label: `${post.targetStateResidence} (Residence)`, color: "bg-purple-100 text-purple-700" };
  if (post.targetStateOrigin)
    return { label: `${post.targetStateOrigin} (Origin)`, color: "bg-indigo-100 text-indigo-700" };
  if (post.targetDesiredSupport)
    return {
      label: SUPPORT_LABELS[post.targetDesiredSupport] || post.targetDesiredSupport,
      color: "bg-amber-100 text-amber-700",
    };
  return { label: "All Citizens", color: "bg-emerald-100 text-emerald-700" };
}

/** Format ISO-8601 to "3 Jul 2026" style */
function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

/** Format ISO-8601 to relative "2 days ago" style */
function relativeTime(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60_000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(iso);
  } catch {
    return iso;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface AnnouncementCardProps {
  post: PostDto;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function AnnouncementCard({ post, isExpanded, onToggleExpand }: AnnouncementCardProps) {
  const badge = getTargetBadge(post);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 group"
    >
      {/* Optional banner image */}
      {post.pictureUrl && (
        <div className="w-full h-40 overflow-hidden">
          <img
            src={post.pictureUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-5 space-y-3">
        {/* Top row: category pill + targeting badge */}
        <div className="flex items-center gap-2 flex-wrap">
          {post.contentCategory && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
              <Tag className="w-3 h-3" />
              {post.contentCategory}
            </span>
          )}
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${badge.color}`}>
            <Megaphone className="w-3 h-3" />
            {badge.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-stone-900 leading-snug font-serif">
          {post.title}
        </h3>

        {/* Content preview — 3 lines truncated, or full if expanded */}
        <div className="relative">
          <p className={`text-sm text-stone-600 leading-relaxed ${isExpanded ? "" : "line-clamp-3"}`}>
            {post.content}
          </p>
          {post.content && post.content.length > 200 && (
            <button
              onClick={onToggleExpand}
              className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-green-700 hover:text-green-800 transition-colors cursor-pointer"
            >
              {isExpanded ? (
                <>Show less <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>Read more <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          )}
        </div>

        {/* Footer: author + date */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <User2 className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-medium">{post.author}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <Calendar className="w-3.5 h-3.5" />
            <time dateTime={post.datePublished} title={formatDate(post.datePublished)}>
              {relativeTime(post.datePublished)}
            </time>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
