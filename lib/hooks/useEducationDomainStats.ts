"use client";

import { useQueries } from "@tanstack/react-query";
import { fetchDomainCitizens } from "@/lib/services/domainCitizenService";
import type { DomainFilterParams } from "@/lib/types/domainCitizens";

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

export function useEducationTierCounts(
  filters: Pick<DomainFilterParams, "state" | "lga" | "gender">
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

