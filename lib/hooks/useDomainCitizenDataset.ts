/**
 * CitiEye Admin — Bulk Domain Citizen Dataset Query
 * Fetches the complete domain dataset by paginating through the server's max page size,
 * then caches and normalizes all records for client-side in-memory operations.
 */

import { useQuery } from "@tanstack/react-query";
import { fetchDomainCitizens } from "@/lib/services/domainCitizenService";
import { normalizeDomainCitizen } from "@/lib/utils/domainCitizenPredicate";
import { domainCitizensKeys } from "./domainQueryKeys";
import type { DomainCitizenRecord, PagedResult } from "@/lib/types/domainCitizens";

/**
 * Maximum page size accepted by the Spring Boot backend.
 * The server clamps any `size` above this to 100, so we must paginate in batches.
 */
const SERVER_MAX_PAGE_SIZE = 100;

interface UseDomainCitizenDatasetOptions {
  domain: "education" | "health" | "hr" | "pension" | string;
  stateScope?: string;
  enabled?: boolean;
}

export interface DomainCitizenDatasetResult {
  records: DomainCitizenRecord[];
  totalServerElements: number;
}

/**
 * Fetches all pages of domain citizens from the backend until the complete dataset is collected.
 * Uses sequential pagination with the server's max page size (100).
 */
async function fetchAllDomainCitizens(
  domain: string,
  stateScope?: string
): Promise<DomainCitizenDatasetResult> {
  const allRecords: DomainCitizenRecord[] = [];

  // Fetch the first page to learn totalElements and totalPages
  const firstPage: PagedResult<DomainCitizenRecord> = await fetchDomainCitizens({
    domain,
    state: stateScope && stateScope !== "all" ? stateScope : undefined,
    page: 0,
    size: SERVER_MAX_PAGE_SIZE,
  });

  const totalServerElements = firstPage.totalElements ?? 0;
  const totalPages = firstPage.totalPages ?? 1;

  // Add first page records
  if (firstPage.content) {
    allRecords.push(...firstPage.content);
  }

  // Fetch remaining pages in parallel (pages 1 through totalPages-1)
  if (totalPages > 1) {
    const remainingPageNumbers = Array.from(
      { length: totalPages - 1 },
      (_, i) => i + 1
    );

    // Batch parallel requests in groups of 5 to avoid overwhelming the server
    const BATCH_SIZE = 5;
    for (let i = 0; i < remainingPageNumbers.length; i += BATCH_SIZE) {
      const batch = remainingPageNumbers.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map((pageNum) =>
          fetchDomainCitizens({
            domain,
            state: stateScope && stateScope !== "all" ? stateScope : undefined,
            page: pageNum,
            size: SERVER_MAX_PAGE_SIZE,
          })
        )
      );

      for (const result of batchResults) {
        if (result.content) {
          allRecords.push(...result.content);
        }
      }
    }
  }

  // Normalize all records (synthesize fullName, etc.)
  const normalized = allRecords.map(normalizeDomainCitizen);

  return {
    records: normalized,
    totalServerElements,
  };
}

export function useDomainCitizenDataset({
  domain,
  stateScope,
  enabled = true,
}: UseDomainCitizenDatasetOptions) {
  return useQuery<DomainCitizenDatasetResult, Error>({
    queryKey: domainCitizensKeys.scoped(domain, stateScope),
    queryFn: () => fetchAllDomainCitizens(domain, stateScope),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,   // 30 minutes
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
    enabled,
  });
}
