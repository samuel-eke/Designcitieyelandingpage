/**
 * CitiEye Education Module — Student Academic Result & Progression Types
 * Mirrors StudentAcademicController & StudentAcademicService entities and DTOs.
 */

export type AcademicLevel = "PRIMARY" | "SECONDARY" | "TERTIARY" | "VOCATIONAL";

export type AcademicStatus = "SUBMITTED" | "VERIFIED" | "ACTIVE" | "REJECTED";

export interface StudentAcademicUpdate {
  id: number;
  citizenCode: string;
  academicLevel: AcademicLevel | string;
  academicYear: string;
  classGrade?: string | null;
  institutionName?: string | null;
  resultDocumentUrl?: string | null;
  subjectGrades?: Record<string, string> | null;
  status: AcademicStatus | string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicStatusTransition {
  id: number;
  citizenCode: string;
  updateId: number;
  fromStatus: AcademicStatus | string;
  toStatus: AcademicStatus | string;
  transitionTimestamp: string;
  remarks?: string | null;
  actorCode?: string | null;
}

export interface AcademicProgressionResponse {
  citizenCode: string;
  updates: StudentAcademicUpdate[];
  transitions: AcademicStatusTransition[];
}

export interface AcademicUpdateJsonRequest {
  citizenCode?: string;
  academicLevel: AcademicLevel | string;
  academicYear: string;
  classGrade?: string;
  institutionName?: string;
  subjectGrades: Record<string, string>;
  notes?: string;
}

export interface StatusTransitionRequest {
  status: AcademicStatus | string;
  remarks?: string;
}
