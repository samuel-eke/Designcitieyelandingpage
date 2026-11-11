/**
 * CitiEye Admin — Domain Citizen Record & Filter Types
 * Aligns with com.goldbyte.citieye_server.fieldofficer.internal.dto.AdminDomainCitizenListItemDto
 */

export interface DomainCitizenRecord {
  // Identity & Demographics
  citizenCode: string;
  fullName: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  phoneNumber?: string | null;
  email?: string | null;
  dateOfBirth?: string | null;
  age: number;
  gender: string;
  stateOfOrigin: string;
  stateOfResidence: string;
  lga: string;
  residenceLga?: string | null;
  nin?: string | null;
  registeredAt?: string | null;
  cohortName: string;

  // Education Domain
  educationalLevel?: string | null;
  institutionName?: string | null;
  currentClassGrade?: string | null;
  highestAcademicQualification?: string | null;

  // Health Domain
  isPregnant?: boolean;
  hasStartedAntenatal?: boolean;
  hasHmo?: boolean;
  hmoProviderName?: string | null;
  hmoPolicyNumber?: string | null;
  bloodGroup?: string | null;
  bloodGenotype?: string | null;
  chronicCondition?: boolean;
  emergencyRiskFlag?: boolean;

  // HR & Jobs / Business Affairs Domain
  employmentTrack?: "employed" | "business" | "vocational" | "unemployed" | string;
  isEmployed?: boolean;
  employerName?: string | null;
  natureOfEmployment?: string | null;
  hasBusiness?: boolean;
  businessName?: string | null;
  businessNature?: string | null;
  isCacRegistered?: boolean;
  cacRegistrationNumber?: string | null;
  isUndergoingVocationalTraining?: boolean;
  tradeSkillKind?: string | null;
  trainingCenterName?: string | null;
  isUnemployed?: boolean;
  desiredNextStep?: string | null;
  monthlyIncomeRange?: string | null;
  industrySector?: string | null;

  // Pension Domain
  isRetired?: boolean;
  pensionProviderName?: string | null;
  cpsPensionPin?: string | null;
  pfaPensionBalanceRange?: string | null;
  yearsOfService?: number | null;
  disbursementStatus?: "ACTIVE" | "PENDING" | "NOT_ENROLLED" | string;
  interestedInAdultCareHome?: boolean;
}

export interface PagedResult<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface DomainFilterParams {
  domain?: "education" | "health" | "hr" | "pension" | string;
  query?: string;
  state?: string;
  lga?: string;
  gender?: string;
  // Education
  educationalLevel?: string;
  // Health
  isPregnant?: boolean;
  hasHmo?: boolean;
  bloodGroup?: string;
  bloodGenotype?: string;
  chronicCondition?: boolean;
  // HR & Jobs
  employmentTrack?: string;
  cacStatus?: "registered" | "unregistered" | string;
  unemployedDesiredNextStep?: string;
  // Pension
  pensionStatus?: "under_pension" | "not_under_pension" | string;
  isRetired?: boolean;
  interestedInAdultCareHome?: boolean;
  // Pagination
  page?: number;
  size?: number;
}

