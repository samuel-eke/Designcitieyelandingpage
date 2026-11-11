"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminCitizenLifecycle } from "@/lib/services/adminService";
import type { AdminCitizenLifecycleViewDto } from "@/lib/types/adminCitizen";

/**
 * React Query hook to fetch the comprehensive consolidated lifecycle profile
 * of a citizen for administrator inspection.
 *
 * Exclusively calls backend endpoint: GET /api/admin/citizens/{citizenCode}
 *
 * @param citizenCode The citizen's unique code
 */
export function useAdminCitizenLifecycle(citizenCode: string | null) {
  return useQuery<AdminCitizenLifecycleViewDto, Error>({
    queryKey: ["admin", "citizens", "lifecycle", citizenCode],
    queryFn: async () => {
      if (!citizenCode || citizenCode.trim() === "") {
        throw new Error("Citizen code is required to inspect lifecycle record");
      }
      return await getAdminCitizenLifecycle(citizenCode);
    },
    enabled: Boolean(citizenCode && citizenCode.trim().length > 0),
    staleTime: 60 * 1000, // 1 minute fresh cache
    retry: 1,
  });
}

