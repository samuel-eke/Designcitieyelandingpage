/**
 * CitiEye Education Field Officer Module — School & Student Registry Types
 * Mirrors EducationalOfficerController, School, StudentRecord, and OfficerSchoolAssignment.
 */

export interface School {
  id: number;
  name: string;
  lga: string;
  state?: string | null;
  pupilCount: number;
  schoolType?: string | null;
  address?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolRequest {
  name: string;
  lga: string;
  state?: string;
  pupilCount: number;
  schoolType?: string;
  address?: string;
}

export interface StudentRecord {
  id: number;
  citizenCode: string;
  schoolId: number;
  schoolName?: string | null;
  lga: string;
  studentName?: string | null;
  stateOfOrigin?: string | null;
  healthConditionsSpecialNeeds?: string | null;
  attendanceRate?: number | null;
  familyGuardianBackground?: string | null;
  academicYear?: string | null;
  classGrade?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentRecordRequest {
  citizenCode: string;
  schoolId: number;
  schoolName?: string;
  lga: string;
  studentName?: string;
  stateOfOrigin?: string;
  healthConditionsSpecialNeeds?: string;
  attendanceRate?: number;
  familyGuardianBackground?: string;
  academicYear?: string;
  classGrade?: string;
}

export interface StudentRecordUpdateRequest {
  studentName?: string;
  stateOfOrigin?: string;
  healthConditionsSpecialNeeds?: string;
  attendanceRate?: number;
  familyGuardianBackground?: string;
  academicYear?: string;
  classGrade?: string;
}

export interface OfficerSchoolAssignment {
  id: number;
  officerCode: string;
  schoolId: number;
  schoolName: string;
  lga: string;
  state?: string | null;
  active: boolean;
  assignedAt?: string;
}

export interface OfficerAssignmentRequest {
  officerCode: string;
  schoolId: number;
  schoolName?: string;
  lga: string;
  state?: string;
}
