/**
 * CitiEye Admin — React Query Hook for Domain Citizens
 */

import { useQuery } from "@tanstack/react-query";
import { fetchDomainCitizens } from "@/lib/services/domainCitizenService";
import type { DomainFilterParams, PagedResult, DomainCitizenRecord } from "@/lib/types/domainCitizens";

export function useDomainCitizens(params: DomainFilterParams) {
  return useQuery<PagedResult<DomainCitizenRecord>, Error>({
    queryKey: ["domainCitizens", params],
    queryFn: () => fetchDomainCitizens(params),
    placeholderData: (previousData) => previousData,
    staleTime: 30 * 1000, // 30 seconds
  });
}

