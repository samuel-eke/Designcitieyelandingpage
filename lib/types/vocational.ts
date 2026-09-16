/**
 * CitiEye Citizen Profile Module — Vocational Profile Types
 * Mirrors VocationalProfileController, VocationalProfileRequest, and VocationalProfileResponse.
 */

export type VocationalProficiencyLevel =
  | "APPRENTICE"
  | "INTERMEDIATE"
  | "ADVANCED"
  | "MASTER_CRAFTSMAN";

export interface VocationalProfile {
  id: number;
  citizenCode: string;
  tradeSpecialization: string;
  acquiredSkills: string[] | string | any;
  proficiencyLevel: string;
  careerTrajectories?: string | null;
  plannedApprenticeships?: string | null;
  vocationalDevelopmentGoals?: string | null;
  certifications?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface VocationalProfileRequest {
  tradeSpecialization?: string;
  acquiredSkills?: string[] | string;
  proficiencyLevel?: string;
  careerTrajectories?: string;
  plannedApprenticeships?: string;
  vocationalDevelopmentGoals?: string;
  certifications?: string;
}

export interface VocationalProfileResponse {
  id: number;
  citizenCode: string;
  tradeSpecialization: string;
  acquiredSkills: string[] | string | any;
  proficiencyLevel: string;
  careerTrajectories?: string | null;
  plannedApprenticeships?: string | null;
  vocationalDevelopmentGoals?: string | null;
  certifications?: string | null;
  createdAt: string;
  updatedAt: string;
}
