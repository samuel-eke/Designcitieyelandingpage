/**
 * CitiEye Admin — Dual-Mode Hook for Domain Citizens
 * Performs sub-millisecond in-memory filtering and slicing for <= 5,000 records,
 * and dynamically falls back to server-side query parameters for massive datasets.
 */

import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDomainCitizens } from "@/lib/services/domainCitizenService";
import { useDomainCitizenDataset } from "./useDomainCitizenDataset";
import { matchCitizenFilter, normalizeDomainCitizen } from "@/lib/utils/domainCitizenPredicate";
import { sliceToPagedResult } from "@/lib/utils/paginateRecords";
import { domainCitizensKeys } from "./domainQueryKeys";
import type { DomainFilterParams, PagedResult, DomainCitizenRecord } from "@/lib/types/domainCitizens";

export const CLIENT_FILTERING_THRESHOLD = 5000;

export interface UseDomainCitizensResult {
  data: PagedResult<DomainCitizenRecord> | undefined;
  rawRecords: DomainCitizenRecord[];
  filteredCount: number;
  isLoading: boolean;
  isServerMode: boolean;
  error: Error | null;
  refetch: () => Promise<any>;
}

export function useDomainCitizens(params: DomainFilterParams): UseDomainCitizensResult {
  const domain = (params.domain || "education") as string;
  const [forceServerMode, setForceServerMode] = useState(false);

  // 1. Bulk dataset query for in-memory processing
  const datasetQuery = useDomainCitizenDataset({
    domain,
    stateScope: params.state,
    enabled: !forceServerMode,
  });

  // Evaluate dataset size against threshold
  const totalServerCount = datasetQuery.data?.totalServerElements ?? 0;
  const isServerMode = forceServerMode || totalServerCount > CLIENT_FILTERING_THRESHOLD;

  useEffect(() => {
    if (totalServerCount > CLIENT_FILTERING_THRESHOLD && !forceServerMode) {
      setForceServerMode(true);
    }
  }, [totalServerCount, forceServerMode]);

  // 2. Server fallback query when dataset exceeds threshold
  const serverQuery = useQuery<PagedResult<DomainCitizenRecord>, Error>({
    queryKey: domainCitizensKeys.server(params),
    queryFn: async () => {
      const res = await fetchDomainCitizens(params);
      return {
        ...res,
        content: (res?.content ?? []).map(normalizeDomainCitizen),
      };
    },
    enabled: isServerMode,
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
  });

  // 3. Client-side derived state when in memory mode
  const { clientPagedResult, filteredCount } = useMemo(() => {
    if (isServerMode || !datasetQuery.data?.records) {
      return {
        clientPagedResult: undefined,
        filteredCount: 0,
      };
    }

    const records = datasetQuery.data.records;
    const filtered = records.filter((citizen) => matchCitizenFilter(citizen, params));
    const paged = sliceToPagedResult(filtered, params.page ?? 0, params.size ?? 20);

    return {
      clientPagedResult: paged,
      filteredCount: filtered.length,
    };
  }, [isServerMode, datasetQuery.data?.records, params]);

  if (isServerMode) {
    return {
      data: serverQuery.data,
      rawRecords: serverQuery.data?.content ?? [],
      filteredCount: serverQuery.data?.totalElements ?? 0,
      isLoading: serverQuery.isLoading,
      isServerMode: true,
      error: serverQuery.error,
      refetch: serverQuery.refetch,
    };
  }

  return {
    data: clientPagedResult,
    rawRecords: datasetQuery.data?.records ?? [],
    filteredCount,
    isLoading: datasetQuery.isLoading,
    isServerMode: false,
    error: datasetQuery.error,
    refetch: datasetQuery.refetch,
  };
}
