/**
 * useDashboardFeed — Personalized post feed hook
 *
 * Manages fetching, filtering, and real-time updates for the citizen's
 * targeted post feed. Wires together getDashboardFeed() and usePostStream().
 *
 * Usage:
 *   const { posts, isLoading, error, filteredPosts, activeFilter, setFilter, refetch } = useDashboardFeed();
 */

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getDashboardFeed } from "@/lib/services/citizenService";
import { usePostStream } from "@/lib/hooks/usePostStream";
import type { PostDto } from "@/lib/types/citieye";

// ---------------------------------------------------------------------------
// Filter type — matches the four targeting fields on AdminCMSContentEntity
// ---------------------------------------------------------------------------

export type PostFilter =
  | "all"
  | "cohort"
  | "state_residence"
  | "state_origin"
  | "support_group"
  | "everyone";

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

interface UseDashboardFeedResult {
  /** All posts returned by the server (unfiltered) */
  posts: PostDto[];
  /** Posts after applying the activeFilter */
  filteredPosts: PostDto[];
  isLoading: boolean;
  error: string | null;
  activeFilter: PostFilter;
  setFilter: (filter: PostFilter) => void;
  /** SSE connection status — shows a live indicator in the UI */
  isStreamConnected: boolean;
  /** Manually re-fetch from the REST endpoint */
  refetch: () => void;
}

export function useDashboardFeed(): UseDashboardFeedResult {
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<PostFilter>("all");

  // ---------------------------------------------------------------------------
  // REST fetch
  // ---------------------------------------------------------------------------

  const fetchFeed = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDashboardFeed();
      setPosts(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load your feed.";
      setError(message);
      console.error("[useDashboardFeed] fetch error:", message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  // ---------------------------------------------------------------------------
  // SSE real-time updates
  //
  // When the server pushes a new-post event we prepend it to the list so the
  // citizen sees it instantly without a page refresh.
  // ---------------------------------------------------------------------------

  const handleNewPost = useCallback((incomingPost: PostDto) => {
    setPosts((prev) => {
      // Guard against duplicates (e.g. reconnect race)
      if (prev.some((p) => p.id === incomingPost.id)) return prev;
      return [incomingPost, ...prev];
    });
  }, []);

  const { isConnected: isStreamConnected } = usePostStream({
    onNewPost: handleNewPost,
  });

  // ---------------------------------------------------------------------------
  // Client-side filtering
  //
  // The server already filters posts to only include those targeting this
  // citizen. The client-side filter lets the citizen further narrow the feed
  // by which targeting criterion the post was published on.
  //
  // We derive the targeting type from which target field is non-null on PostDto.
  // ---------------------------------------------------------------------------

  const filteredPosts = useMemo(() => {
    if (activeFilter === "all") return posts;

    return posts.filter((post) => {
      switch (activeFilter) {
        case "cohort":
          return post.targetCohortId != null;
        case "state_residence":
          return post.targetStateResidence != null;
        case "state_origin":
          return post.targetStateOrigin != null;
        case "support_group":
          return post.targetDesiredSupport != null;
        case "everyone":
          // Broadcast posts: all target fields are null
          return (
            post.targetCohortId == null &&
            post.targetStateResidence == null &&
            post.targetStateOrigin == null &&
            post.targetDesiredSupport == null
          );
        default:
          return true;
      }
    });
  }, [posts, activeFilter]);

  return {
    posts,
    filteredPosts,
    isLoading,
    error,
    activeFilter,
    setFilter: setActiveFilter,
    isStreamConnected,
    refetch: fetchFeed,
  };
}
