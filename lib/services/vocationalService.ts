/**
 * CitiEye Vocational Profile API Service
 * Handles vocational profile retrieval, creation, and updates for artisan and unemployed citizens.
 */

import { apiClient } from "@/lib/api";
import type {
  VocationalProfileRequest,
  VocationalProfileResponse,
} from "@/lib/types/vocational";

/**
 * Retrieve vocational profile for authenticated citizen (or target citizen if admin).
 */
export async function getVocationalProfile(
  citizenCode?: string
): Promise<VocationalProfileResponse> {
  const params = citizenCode ? `?citizenCode=${encodeURIComponent(citizenCode)}` : "";
  const response = await apiClient.get<VocationalProfileResponse>(
    `/api/profile/vocational${params}`
  );
  return response.data;
}

/**
 * Create vocational profile record.
 */
export async function createVocationalProfile(
  payload: VocationalProfileRequest,
  citizenCode?: string
): Promise<VocationalProfileResponse> {
  const params = citizenCode ? `?citizenCode=${encodeURIComponent(citizenCode)}` : "";
  const response = await apiClient.post<VocationalProfileResponse>(
    `/api/profile/vocational${params}`,
    payload
  );
  return response.data;
}

/**
 * Update existing vocational profile record.
 */
export async function updateVocationalProfile(
  payload: VocationalProfileRequest,
  citizenCode?: string
): Promise<VocationalProfileResponse> {
  const params = citizenCode ? `?citizenCode=${encodeURIComponent(citizenCode)}` : "";
  const response = await apiClient.put<VocationalProfileResponse>(
    `/api/profile/vocational${params}`,
    payload
  );
  return response.data;
}

/**
 * Save vocational profile (delegates to PUT if existing record, else POST).
 */
export async function saveVocationalProfile(
  payload: VocationalProfileRequest,
  isExisting: boolean,
  citizenCode?: string
): Promise<VocationalProfileResponse> {
  if (isExisting) {
    return updateVocationalProfile(payload, citizenCode);
  }
  return createVocationalProfile(payload, citizenCode);
}
