/**
 * CitiEye Field Officer Management Types
 * Represents registered field officers returned to administrators.
 */

export interface OfficerSummary {
  id: number;
  citizenCode: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: "field_officer" | "field_officer_health" | "field_officer_education" | string;
  specialty?: string | null;
  gender?: string | null;
  stateOfResidence?: string | null;
  residenceLga?: string | null;
  stateOfOrigin?: string | null;
  lga?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface OfficerFilterParams {
  role?: string;
  specialty?: string;
  state?: string;
  lga?: string;
  query?: string;
}
