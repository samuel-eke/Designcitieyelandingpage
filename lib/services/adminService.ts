/**
 * CitiEye — Admin API Service
 *
 * Provides typed async client wrappers for administrative endpoints on citieye_server.
 * All functions use apiClient (configured with authorization token and auto-refresh).
 *
 * Restricted to agency_admin and super_admin roles.
 */

import { apiClient } from "@/lib/api";
import type { AdminCitizenLifecycleViewDto } from "@/lib/types/adminCitizen";

/**
 * Fetches the consolidated lifecycle profile for a citizen by citizen code.
 *
 * Maps to backend: GET /api/admin/citizens/{citizenCode}
 * Handled by: AdminCitizenLifecycleController.java
 *
 * Aggregates core identity, dynamic milestone transition banners (Age 16 grace period,
 * Age 18 hard NIN enforcement gate), household demography (wives count for married males),
 * decoupled maternal antenatal tracking, economic/enterprise metrics, and senior citizen
 * adult care home placement preferences.
 *
 * @param citizenCode Unique citizen identification code (e.g. CTZ-2015-8839)
 * @returns Complete AdminCitizenLifecycleViewDto
 */
export async function getAdminCitizenLifecycle(
  citizenCode: string
): Promise<AdminCitizenLifecycleViewDto> {
  const cleanCode = citizenCode.trim();
  const response = await apiClient.get<AdminCitizenLifecycleViewDto>(
    `/api/admin/citizens/${encodeURIComponent(cleanCode)}`
  );
  return response.data;
}

