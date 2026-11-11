"use client";

import { useQuery } from "@tanstack/react-query";
import { getOfficerByCode, getRegisteredOfficers } from "@/lib/services/officerService";
import type { OfficerSummary, OfficerFilterParams } from "@/lib/types/officer";

/**
 * Hook to retrieve the list of registered field officers with optional filters.
 * Consumes: GET /api/admin/officers
 */
export function useOfficers(params?: OfficerFilterParams) {
  return useQuery<OfficerSummary[], Error>({
    queryKey: ["admin", "officers", "list", params],
    queryFn: async () => {
      return await getRegisteredOfficers(params);
    },
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to fetch detailed profile and current employment data for a specific field officer.
 * Consumes: GET /api/admin/officers/{citizenCode}
 */
export function useOfficerDetail(citizenCode: string | null | undefined) {
  return useQuery<OfficerSummary, Error>({
    queryKey: ["admin", "officers", "detail", citizenCode],
    queryFn: async () => {
      if (!citizenCode) throw new Error("Officer citizen code is required");
      return await getOfficerByCode(citizenCode);
    },
    enabled: Boolean(citizenCode),
    staleTime: 60 * 1000,
  });
}

