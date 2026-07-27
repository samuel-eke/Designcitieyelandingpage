"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type {
  AnalyticsSummaryDto,
  PagedResult,
  CitizenListItemDto,
  CitizenProfileAnalyticsDto,
} from "@/lib/types/citieye";

// ---------------------------------------------------------------------------
// 1. Analytics Summary Metrics Hook
// ---------------------------------------------------------------------------

export function useAnalyticsSummary() {
  return useQuery<AnalyticsSummaryDto, Error>({
    queryKey: ["analytics", "summary"],
    queryFn: async () => {
      const response = await apiClient.get<AnalyticsSummaryDto>("/api/analytics/summary");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache stale time
  });
}

// ---------------------------------------------------------------------------
// 2. Paginated Citizen List with Filters Hook
// ---------------------------------------------------------------------------

export interface CitizenRegistryFilters {
  stateOfOrigin?: string;
  lga?: string;
  gender?: string;
  cohortName?: string;
  page?: number;
  size?: number;
}

export function useCitizenRegistry(filters: CitizenRegistryFilters) {
  return useQuery<PagedResult<CitizenListItemDto>, Error>({
    queryKey: ["analytics", "citizens", filters],
    queryFn: async () => {
      // Map filters to query params, filtering out undefined/empty values
      const params = new URLSearchParams();
      if (filters.stateOfOrigin) params.append("stateOfOrigin", filters.stateOfOrigin);
      if (filters.lga) params.append("lga", filters.lga);
      if (filters.gender) params.append("gender", filters.gender);
      if (filters.cohortName) params.append("cohortName", filters.cohortName);
      if (filters.page !== undefined) params.append("page", String(filters.page));
      if (filters.size !== undefined) params.append("size", String(filters.size));

      const response = await apiClient.get<PagedResult<CitizenListItemDto>>(
        `/api/analytics/citizens?${params.toString()}`
      );
      return response.data;
    },
  });
}

// ---------------------------------------------------------------------------
// 3. Detailed Citizen Profile Inspection Hook
// ---------------------------------------------------------------------------

export function useCitizenDetail(citizenCode: string | null) {
  return useQuery<CitizenProfileAnalyticsDto, Error>({
    queryKey: ["analytics", "citizens", "detail", citizenCode],
    queryFn: async () => {
      if (!citizenCode) throw new Error("Citizen code is required");
      const response = await apiClient.get<CitizenProfileAnalyticsDto>(
        `/api/analytics/citizens/${citizenCode}`
      );
      return response.data;
    },
    enabled: !!citizenCode, // Only run if a code is provided
  });
}

// ---------------------------------------------------------------------------
// 4. Manual View Refresh Hook (Super Admin)
// ---------------------------------------------------------------------------

export function useRefreshAnalytics() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error>({
    mutationKey: ["refreshAnalytics"],
    mutationFn: async () => {
      const response = await apiClient.post<{ message: string }>("/api/analytics/refresh");
      return response.data;
    },
    onSuccess: () => {
      // Invalidate active React Query caches so dashboard updates immediately
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

// ---------------------------------------------------------------------------
// 5. Health & Education Records Hooks
// ---------------------------------------------------------------------------

export interface HealthRecord {
  id: number;
  citizenCode: string;
  officerCode: string;
  recordType: string;
  description: string;
  notes: string | null;
  loggedAt: string;
}

export interface EducationRecord {
  id: number;
  citizenCode: string;
  officerCode: string;
  recordType: string;
  institutionName: string;
  academicYear: string;
  classGrade: string | null;
  attendanceRate: number | null;
  loggedAt: string;
  subjectGrades: Record<string, string> | null;
}

export function useHealthRecords(citizenCode: string | null) {
  return useQuery<HealthRecord[], Error>({
    queryKey: ["health", "records", citizenCode],
    queryFn: async () => {
      if (!citizenCode) return [];
      const response = await apiClient.get<HealthRecord[]>(
        `/api/field-officers/health/records/${citizenCode}`
      );
      return response.data;
    },
    enabled: !!citizenCode,
  });
}

export function useEducationRecords(citizenCode: string | null) {
  return useQuery<EducationRecord[], Error>({
    queryKey: ["education", "records", citizenCode],
    queryFn: async () => {
      if (!citizenCode) return [];
      const response = await apiClient.get<EducationRecord[]>(
        `/api/field-officers/education/records/${citizenCode}`
      );
      return response.data;
    },
    enabled: !!citizenCode,
  });
}

export function useDeleteHealthRecord() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationKey: ["deleteHealthRecord"],
    mutationFn: async (recordId) => {
      await apiClient.delete(`/api/field-officers/health/records/${recordId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health", "records"] });
    },
  });
}

export function useDeleteEducationRecord() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationKey: ["deleteEducationRecord"],
    mutationFn: async (recordId) => {
      await apiClient.delete(`/api/field-officers/education/records/${recordId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education", "records"] });
    },
  });
}

export function useUpdateHealthRecord() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: number; data: Partial<HealthRecord> }>({
    mutationKey: ["updateHealthRecord"],
    mutationFn: async ({ id, data }) => {
      await apiClient.put(`/api/field-officers/health/records/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health", "records"] });
    },
  });
}

export function useUpdateEducationRecord() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: number; data: Partial<EducationRecord> }>({
    mutationKey: ["updateEducationRecord"],
    mutationFn: async ({ id, data }) => {
      await apiClient.put(`/api/field-officers/education/records/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education", "records"] });
    },
  });
}
