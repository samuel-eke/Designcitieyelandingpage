/**
 * CitiEye — Field Officer API Service
 *
 * Typed wrappers for the two live officer modules:
 *   1. Health Records    — /api/field-officers/health/*
 *   2. Education Records — /api/field-officers/education/*
 *
 * Citizen lookup uses the admin analytics citizen detail endpoint.
 */

import { apiClient } from "@/lib/api";
import type { CitizenProfileAnalyticsDto } from "@/lib/types/citieye";

// ---------------------------------------------------------------------------
// Health Records — shared types
// ---------------------------------------------------------------------------

export type HealthRecordType =
  | "VACCINATION"
  | "SCREENING"
  | "NUTRITION"
  | "MATERNAL"
  | "CHRONIC"
  | "GENERAL";

export interface HealthRecordPayload {
  citizenCode: string;
  recordType: HealthRecordType | string;
  description: string;
  notes?: string;
  [key: string]: any; // Allow dynamic questionnaire fields
}

export interface HealthQuestionDto {
  fieldName: string;
  questionText: string;
  dataType: "BOOLEAN" | "STRING" | "NUMBER" | "JSON";
  choices?: string[];
  ndprSensitive: boolean;
  previousValue?: any;
}

export interface HealthRecord {
  id: number;
  citizenCode: string;
  recordType: HealthRecordType;
  description: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Education Records — shared types
// ---------------------------------------------------------------------------

export interface EducationQuestionDto {
  id: number;
  questionText: string;
  fieldKey: string;
  inputType: "text" | "number" | "boolean" | "select" | "date";
  options?: string[];
  required: boolean;
}

export interface EducationRecordPayload {
  citizenCode: string;
  recordType: "ENROLLMENT" | "EXAM_RESULT" | "ATTENDANCE" | string;
  institutionName: string;
  academicYear: string; // e.g. "2025/2026"
  classGrade?: string;
  attendanceRate?: number;
  // Index signature to allow flat dynamic questionnaire fields
  [key: string]: any;
}

export interface EducationRecord {
  id: number;
  citizenCode: string;
  answers: Record<string, string | number | boolean | null>;
  educationType: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Health Records API — /api/field-officers/health
// ---------------------------------------------------------------------------

/** POST /api/field-officers/health/records */
export async function submitHealthRecord(
  payload: HealthRecordPayload
): Promise<HealthRecord> {
  const response = await apiClient.post<HealthRecord>(
    "/api/field-officers/health/records",
    payload
  );
  return response.data;
}

/** GET /api/field-officers/health/records/{citizenCode} */
export async function getHealthRecords(
  citizenCode: string
): Promise<HealthRecord[]> {
  const response = await apiClient.get<HealthRecord[]>(
    `/api/field-officers/health/records/${encodeURIComponent(citizenCode)}`
  );
  return response.data;
}

/** GET /api/field-officers/health/questions?citizenCode={citizenCode} */
export async function getHealthQuestions(
  citizenCode: string
): Promise<HealthQuestionDto[]> {
  const response = await apiClient.get<HealthQuestionDto[]>(
    `/api/field-officers/health/questions?citizenCode=${encodeURIComponent(citizenCode)}`
  );
  return response.data;
}

/** PUT /api/field-officers/health/records/{recordId} */
export async function updateHealthRecord(
  recordId: number,
  payload: Partial<Omit<HealthRecordPayload, "citizenCode">>
): Promise<HealthRecord> {
  const response = await apiClient.put<HealthRecord>(
    `/api/field-officers/health/records/${recordId}`,
    payload
  );
  return response.data;
}

// ---------------------------------------------------------------------------
// Education Records API — /api/field-officers/education
// ---------------------------------------------------------------------------

/** GET /api/field-officers/education/questions?type={educationType} */
export async function getEducationQuestions(
  educationType?: string
): Promise<EducationQuestionDto[]> {
  const params = educationType
    ? `?type=${encodeURIComponent(educationType)}`
    : "";
  const response = await apiClient.get<EducationQuestionDto[]>(
    `/api/field-officers/education/questions${params}`
  );
  return response.data;
}

/** POST /api/field-officers/education/records */
export async function submitEducationRecord(
  payload: EducationRecordPayload
): Promise<EducationRecord> {
  const response = await apiClient.post<EducationRecord>(
    "/api/field-officers/education/records",
    payload
  );
  return response.data;
}

/** GET /api/field-officers/education/records/{citizenCode} */
export async function getEducationRecords(
  citizenCode: string
): Promise<EducationRecord[]> {
  const response = await apiClient.get<EducationRecord[]>(
    `/api/field-officers/education/records/${encodeURIComponent(citizenCode)}`
  );
  return response.data;
}

/** PUT /api/field-officers/education/records/{recordId} */
export async function updateEducationRecord(
  recordId: number,
  payload: Partial<EducationRecordPayload>
): Promise<EducationRecord> {
  const response = await apiClient.put<EducationRecord>(
    `/api/field-officers/education/records/${recordId}`,
    payload
  );
  return response.data;
}

// ---------------------------------------------------------------------------
// Citizen Lookup — admin analytics endpoint (fetch by citizen code)
// ---------------------------------------------------------------------------

/** Fetch a citizen's profile by their citizen code. */
export async function lookupCitizenByCode(
  citizenCode: string
): Promise<CitizenProfileAnalyticsDto> {
  const response = await apiClient.get<CitizenProfileAnalyticsDto>(
    `/api/field-officers/citizens/${encodeURIComponent(citizenCode)}`
  );
  return response.data;
}

/** Fetch all registered citizens in the system (paginated) */
export async function getAllCitizens(
  params?: {
    gender?: string;
    cohortName?: string;
    query?: string;
    lga?: string;
    page?: number;
    size?: number;
  }
): Promise<{
  content: any[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}> {
  const queryParams = new URLSearchParams();
  if (params?.gender) queryParams.set("gender", params.gender);
  if (params?.cohortName) queryParams.set("cohortName", params.cohortName);
  if (params?.query) queryParams.set("query", params.query);
  if (params?.lga) queryParams.set("lga", params.lga);
  if (params?.page !== undefined) queryParams.set("page", String(params.page));
  if (params?.size !== undefined) queryParams.set("size", String(params.size));

  const response = await apiClient.get<any>(
    `/api/field-officers/citizens?${queryParams.toString()}`
  );
  return response.data;
}

// ---------------------------------------------------------------------------
// Admin Officer Management — /api/admin/officers/*
// ---------------------------------------------------------------------------

import type { OfficerSummary, OfficerFilterParams } from "@/lib/types/officer";

/**
 * Fetch all registered field officers matching the given filters.
 * Accessible to super_admin and agency_admin roles.
 */
export async function getRegisteredOfficers(
  params?: OfficerFilterParams
): Promise<OfficerSummary[]> {
  const queryParams = new URLSearchParams();
  if (params?.role) queryParams.set("role", params.role);
  if (params?.specialty) queryParams.set("specialty", params.specialty);
  if (params?.state) queryParams.set("state", params.state);
  if (params?.lga) queryParams.set("lga", params.lga);
  if (params?.query) queryParams.set("query", params.query);

  const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const response = await apiClient.get<OfficerSummary[]>(
    `/api/admin/officers${queryStr}`
  );
  return response.data;
}

/**
 * Fetch full details for a registered field officer by their unique citizen code.
 */
export async function getOfficerByCode(
  citizenCode: string
): Promise<OfficerSummary> {
  const response = await apiClient.get<OfficerSummary>(
    `/api/admin/officers/${encodeURIComponent(citizenCode)}`
  );
  return response.data;
}

