/**
 * CitiEye Admin — Client-side Paging Slicer
 * Produces Spring PagedResult<T> shape for component compatibility.
 */

import type { PagedResult } from "@/lib/types/domainCitizens";

export function sliceToPagedResult<T>(
  records: T[],
  page: number = 0,
  size: number = 20
): PagedResult<T> {
  const totalElements = records.length;
  const safeSize = size > 0 ? size : 20;

  if (totalElements === 0) {
    return {
      content: [],
      page: 0,
      size: safeSize,
      totalElements: 0,
      totalPages: 0,
    };
  }

  const totalPages = Math.ceil(totalElements / safeSize);
  const safePage = Math.max(0, Math.min(page, totalPages - 1));
  const startIndex = safePage * safeSize;
  const content = records.slice(startIndex, startIndex + safeSize);

  return {
    content,
    page: safePage,
    size: safeSize,
    totalElements,
    totalPages,
  };
}

