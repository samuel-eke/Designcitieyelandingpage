"use client";

import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { fetchDomainCitizens } from "@/lib/services/domainCitizenService";
import { normalizeEducationKey } from "@/lib/utils/domainCitizenPredicate";
import type { DomainFilterParams, DomainCitizenRecord } from "@/lib/types/domainCitizens";

export interface EducationTierConfig {
  key: string;
  title: string;
  label: string;
}

export const EDUCATION_TIERS: readonly EducationTierConfig[] = [
  {
    key: "Nursery",
    title: "Students in Nursery Section",
    label: "Early Childhood (Ages 2-5)",
  },
  {
    key: "Primary",
    title: "Primary",
    label: "Basic Education (Grades 1-6)",
  },
  {
    key: "Secondary",
    title: "Secondary",
    label: "Junior & Senior (JSS/SSS)",
  },
  {
    key: "Undergraduate",
    title: "Undergraduate",
    label: "University, Poly & College",
  },
  {
    key: "Postgraduate",
    title: "Postgraduate",
    label: "PGD, Master's & Doctorate",
  },
  {
    key: "Not in school",
    title: "Not in School",
    label: "Out-of-School / Unenrolled",
  },
] as const;

/**
 * High-performance O(N) client-side aggregation for education tier counters.
 * Replaces 6 parallel network queries with an instantaneous in-memory loop.
 */
export function useEducationTierCountsInMemory(
  citizens: DomainCitizenRecord[],
  filters: Pick<DomainFilterParams, "state" | "lga" | "gender">
) {
  return useMemo(() => {
    const counts: Record<string, number> = {
      Nursery: 0,
      Primary: 0,
      Secondary: 0,
      Undergraduate: 0,
      Postgraduate: 0,
      "Not in school": 0,
    };

    // Pre-normalize filter keys
    const targetState = filters.state && filters.state !== "all" ? filters.state.trim().toLowerCase() : undefined;
    const targetLga = filters.lga && filters.lga !== "all" ? filters.lga.trim().toLowerCase() : undefined;
    const targetGender = filters.gender && filters.gender !== "all" ? filters.gender.trim().toLowerCase() : undefined;

    // Pre-calculate normalized keys for tiers
    const tierMap = new Map<string, string>();
    EDUCATION_TIERS.forEach((t) => {
      tierMap.set(normalizeEducationKey(t.key), t.key);
    });

    for (let i = 0; i < citizens.length; i++) {
      const citizen = citizens[i];

      // Demographic checks
      if (targetState) {
        const citizenState = (citizen.stateOfResidence || citizen.stateOfOrigin || "").trim().toLowerCase();
        if (citizenState !== targetState) continue;
      }

      if (targetLga) {
        const citizenLga = (citizen.residenceLga || citizen.lga || "").trim().toLowerCase();
        if (citizenLga !== targetLga) continue;
      }

      if (targetGender) {
        const citizenGender = (citizen.gender || "").trim().toLowerCase();
        if (citizenGender !== targetGender) continue;
      }

      // Tier matching
      const normalizedLevel = normalizeEducationKey(citizen.educationalLevel);
      const tierKey = tierMap.get(normalizedLevel);
      if (tierKey) {
        counts[tierKey] = (counts[tierKey] || 0) + 1;
      }
    }

    return {
      counts,
      isLoading: false,
    };
  }, [citizens, filters.state, filters.lga, filters.gender]);
}

/**
 * Fallback server-side counter queries (used only if dataset exceeds server threshold).
 */
export function useEducationTierCounts(
  filters: Pick<DomainFilterParams, "state" | "lga" | "gender">,
  enabled: boolean = true
) {
  const queryResults = useQueries({
    queries: EDUCATION_TIERS.map((tier) => ({
      queryKey: [
        "domainCitizensCount",
        "education",
        tier.key,
        filters.state,
        filters.lga,
        filters.gender,
      ],
      queryFn: async () => {
        const res = await fetchDomainCitizens({
          domain: "education",
          educationalLevel: tier.key,
          state: filters.state,
          lga: filters.lga,
          gender: filters.gender,
          size: 1,
        });
        return res?.totalElements ?? 0;
      },
      staleTime: 60 * 1000,
      placeholderData: (prev: number | undefined) => prev ?? 0,
      enabled,
    })),
  });

  const isLoading = queryResults.some((q) => q.isLoading);
  const counts: Record<string, number> = {};

  EDUCATION_TIERS.forEach((tier, index) => {
    counts[tier.key] = queryResults[index]?.data ?? 0;
  });

  return {
    counts,
    isLoading,
  };
}
