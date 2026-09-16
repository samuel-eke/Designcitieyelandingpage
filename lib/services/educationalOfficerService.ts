/**
 * CitiEye Education Field Officer API Service
 * Handles jurisdictional assignments, scoped school registration, and student records data entry.
 */

import { apiClient } from "@/lib/api";
import type {
  School,
  SchoolRequest,
  StudentRecord,
  StudentRecordRequest,
  StudentRecordUpdateRequest,
  OfficerSchoolAssignment,
  OfficerAssignmentRequest,
} from "@/lib/types/educationOfficer";

/**
 * Retrieve current educational officer's assigned school & LGA jurisdictions.
 */
export async function getMyAssignments(): Promise<OfficerSchoolAssignment[]> {
  const response = await apiClient.get<OfficerSchoolAssignment[]>(
    "/api/field-officers/education/assignments/my"
  );
  return response.data;
}

/**
 * Register a primary school in the officer's jurisdiction.
 */
export async function createSchool(data: SchoolRequest): Promise<School> {
  const response = await apiClient.post<School>(
    "/api/field-officers/education/schools",
    data
  );
  return response.data;
}

/**
 * Fetch schools scoped to officer's jurisdiction (optional LGA filter).
 */
export async function getSchools(lga?: string): Promise<School[]> {
  const params = lga ? `?lga=${encodeURIComponent(lga)}` : "";
  const response = await apiClient.get<School[]>(
    `/api/field-officers/education/schools${params}`
  );
  return response.data;
}

/**
 * Fetch single school by ID (verified against officer jurisdiction).
 */
export async function getSchoolById(id: number): Promise<School> {
  const response = await apiClient.get<School>(
    `/api/field-officers/education/schools/${id}`
  );
  return response.data;
}

/**
 * Register/log a student record scoped to officer's assigned school and LGA.
 */
export async function createStudentRecord(
  data: StudentRecordRequest
): Promise<StudentRecord> {
  const response = await apiClient.post<StudentRecord>(
    "/api/field-officers/education/students",
    data
  );
  return response.data;
}

/**
 * Fetch student records scoped to officer's jurisdiction.
 */
export async function getStudentRecords(
  schoolId?: number,
  lga?: string
): Promise<StudentRecord[]> {
  const queryParams = new URLSearchParams();
  if (schoolId) queryParams.set("schoolId", String(schoolId));
  if (lga) queryParams.set("lga", lga);
  const query = queryParams.toString() ? `?${queryParams.toString()}` : "";

  const response = await apiClient.get<StudentRecord[]>(
    `/api/field-officers/education/students${query}`
  );
  return response.data;
}

/**
 * Fetch single student record by ID.
 */
export async function getStudentRecordById(id: number): Promise<StudentRecord> {
  const response = await apiClient.get<StudentRecord>(
    `/api/field-officers/education/students/${id}`
  );
  return response.data;
}

/**
 * Update an existing student record.
 */
export async function updateStudentRecord(
  id: number,
  data: StudentRecordUpdateRequest
): Promise<{ message: string; record: StudentRecord }> {
  const response = await apiClient.put<{ message: string; record: StudentRecord }>(
    `/api/field-officers/education/students/${id}`,
    data
  );
  return response.data;
}

/**
 * Assign an educational officer to a school and LGA jurisdiction.
 * Accessible strictly to Super Administrators.
 */
export async function assignOfficerToSchool(
  data: OfficerAssignmentRequest
): Promise<OfficerSchoolAssignment> {
  const response = await apiClient.post<OfficerSchoolAssignment>(
    "/api/field-officers/education/assignments",
    data
  );
  return response.data;
}

/**
 * Super Admin: Retrieve school assignments across all officers or for a specific officer.
 */
export async function getSchoolAssignments(
  officerCode?: string
): Promise<OfficerSchoolAssignment[]> {
  const params = officerCode ? `?officerCode=${encodeURIComponent(officerCode)}` : "";
  const response = await apiClient.get<OfficerSchoolAssignment[]>(
    `/api/field-officers/education/assignments${params}`
  );
  return response.data;
}


