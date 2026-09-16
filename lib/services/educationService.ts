/**
 * CitiEye Education API Service
 * Handles student annual academic result updates, historical progression, and status transitions.
 */

import { apiClient } from "@/lib/api";
import type {
  StudentAcademicUpdate,
  AcademicProgressionResponse,
  AcademicUpdateJsonRequest,
  StatusTransitionRequest,
} from "@/lib/types/education";

/**
 * Submit student annual academic update with result card file and/or dynamic subject grades.
 * Uses multipart/form-data.
 */
export async function submitAcademicUpdateMultipart(
  formData: FormData
): Promise<StudentAcademicUpdate> {
  const response = await apiClient.post<StudentAcademicUpdate>(
    "/api/education/student/academic-updates",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

/**
 * Submit student annual academic update with dynamic subject grades JSON payload.
 */
export async function submitAcademicUpdateJson(
  payload: AcademicUpdateJsonRequest
): Promise<StudentAcademicUpdate> {
  const response = await apiClient.post<StudentAcademicUpdate>(
    "/api/education/student/academic-updates/json",
    payload
  );
  return response.data;
}

/**
 * Query complete student academic progression including historical updates and audit transitions.
 */
export async function getAcademicProgression(
  citizenCode: string
): Promise<AcademicProgressionResponse> {
  const response = await apiClient.get<AcademicProgressionResponse>(
    `/api/education/student/academic-progression/${encodeURIComponent(citizenCode)}`
  );
  return response.data;
}

/**
 * Query annual academic updates for the currently authenticated student.
 */
export async function getMyAcademicUpdates(): Promise<StudentAcademicUpdate[]> {
  const response = await apiClient.get<StudentAcademicUpdate[]>(
    "/api/education/student/academic-updates"
  );
  return response.data;
}

/**
 * Transition academic result update status (e.g. SUBMITTED -> VERIFIED -> ACTIVE / REJECTED).
 * Accessible to educational officers and administrators.
 */
export async function updateAcademicStatus(
  id: number,
  payload: StatusTransitionRequest
): Promise<StudentAcademicUpdate> {
  const response = await apiClient.patch<StudentAcademicUpdate>(
    `/api/education/academic-updates/${id}/status`,
    payload
  );
  return response.data;
}
